import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import AddTaskModal from "@/components/AddTaskModal";
import TaskItem from "@/components/TaskItem";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
};

const COLORS = {
  background: "#fff",
  border: "#eee",
  title: "#1F2A44",
  muted: "#5A6472",
  successGreen: "#22C55E",
  successGreenLight: "#EAF7EF",
};

function showSuccessToast(message: string) {
  Toast.show({
    type: "success",
    text1: message,
  });
}

function showErrorToast(title: string, message?: string) {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
  });
}

async function fetchTasksFromDatabase() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function createTaskInDatabase(title: string) {
  const { error } = await supabase
    .from("tasks")
    .insert([{ title, completed: false }]);

  if (error) {
    throw error;
  }
}

async function updateTaskCompletion(item: Task) {
  const { error } = await supabase
    .from("tasks")
    .update({ completed: !item.completed })
    .eq("id", item.id);

  if (error) {
    throw error;
  }
}

async function removeTaskFromDatabase(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

function AddIconButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      accessibilityLabel="Add Task"
    >
      <MaterialIcons name="add" size={30} color={COLORS.successGreen} />
    </TouchableOpacity>
  );
}

function Header({ onAddPress }: { onAddPress: () => void }) {
  return (
    <View style={headerStyles.header}>
      <Text style={headerStyles.title}>TaskFlow</Text>
      <AddIconButton onPress={onAddPress} />
    </View>
  );
}

function EmptyTaskList() {
  return (
    <Text style={styles.emptyText}>
      No tasks yet. Tap the plus icon to add one.
    </Text>
  );
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const latestTasks = await fetchTasksFromDatabase();
      setTasks(latestTasks);
    } catch (error: any) {
      showErrorToast("Could not load tasks", error.message);
      console.log("Error loading tasks:", error.message);
    }
  }, []);

  function openAddModal() {
    setModalVisible(true);
  }

  function closeAddModal() {
    setModalVisible(false);
  }

  async function handleSubmitTask(title: string) {
    try {
      await createTaskInDatabase(title);

      closeAddModal();
      await loadTasks();

      showSuccessToast("Task added");
    } catch (error: any) {
      showErrorToast("Could not add task", error.message);
      console.log("Error adding task:", error.message);
    }
  }

  async function handleToggleTask(item: Task) {
    try {
      await updateTaskCompletion(item);
      await loadTasks();

      showSuccessToast(
        item.completed ? "Task marked incomplete" : "Task completed",
      );
    } catch (error: any) {
      showErrorToast("Could not update task", error.message);
      console.log("Error updating task:", error.message);
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      await removeTaskFromDatabase(id);
      await loadTasks();

      showSuccessToast("Task deleted");
    } catch (error: any) {
      showErrorToast("Could not delete task", error.message);
      console.log("Error deleting task:", error.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <View style={styles.container}>
      <Header onAddPress={openAddModal} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}
        ListEmptyComponent={<EmptyTaskList />}
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={closeAddModal}
        onSubmit={handleSubmitTask}
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.title,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.successGreenLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.successGreen,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 30,
  },
});
