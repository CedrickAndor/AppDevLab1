import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not load tasks",
        text2: error.message,
      });

      console.log("Error loading tasks:", error.message);
      return;
    }

    setTasks(data ?? []);
  }

  async function handleSubmitTask(title: string) {
    const { error } = await supabase
      .from("tasks")
      .insert([{ title, completed: false }]);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not add task",
        text2: error.message,
      });

      console.log("Error adding task:", error.message);
      return;
    }

    setModalVisible(false);
    loadTasks();

    Toast.show({
      type: "success",
      text1: "Task added",
    });
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not update task",
        text2: error.message,
      });

      console.log("Error updating task:", error.message);
      return;
    }

    loadTasks();

    Toast.show({
      type: "success",
      text1: item.completed ? "Task marked incomplete" : "Task completed",
    });
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not delete task",
        text2: error.message,
      });

      console.log("Error deleting task:", error.message);
      return;
    }

    loadTasks();

    Toast.show({
      type: "success",
      text1: "Task deleted",
    });
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Add Task"
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks yet. Tap the plus icon to add one.
          </Text>
        }
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2E5BBA",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#5A6472",
    marginTop: 30,
  },
});
