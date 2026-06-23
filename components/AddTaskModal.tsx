import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AddTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void | Promise<void>;
};

export default function AddTaskModal({
  visible,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const [text, setText] = useState("");

  async function handleSubmit() {
    if (text.trim() === "") return;

    await onSubmit(text.trim());
    setText("");
  }

  function handleClose() {
    setText("");
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Add New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Task"
            value={text}
            onChangeText={setText}
            autoFocus
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2A44",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancelText: {
    color: "#5A6472",
    fontWeight: "bold",
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: "#22C55E",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
});
