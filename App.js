import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";

export default function App() {
  const [enteredNoteText, setEnteredNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  function noteInputHandler(text) {
    setEnteredNoteText(text);
  }

  function addNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) => [
      ...currentNotes,
      { id: Math.random().toString(), text: enteredNoteText },
    ]);

    setEnteredNoteText("");
  }

  function deleteNoteHandler(id) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setEnteredNoteText("");
    }
  }

  function confirmDeleteHandler(id) {
    Alert.alert(
      "Delete this note?",
      "Are you sure you want to delete it?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: () => deleteNoteHandler(id) },
      ]
    );
  }

  function openNoteHandler(id) {
    const noteToEdit = notes.find((note) => note.id === id);
    if (!noteToEdit) return;

    setSelectedNoteId(id);
    setEnteredNoteText(noteToEdit.text);
  }

  function updateNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, text: enteredNoteText }
          : note
      )
    );

    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  function cancelEditHandler() {
    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes App</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a note..."
          placeholderTextColor="#9ca3af"
          onChangeText={noteInputHandler}
          value={enteredNoteText}
        />

        {selectedNoteId ? (
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, { backgroundColor: "#10b981" }]} onPress={updateNoteHandler}>
              <Text style={styles.buttonText}>Update</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: "#ef4444" }]} onPress={cancelEditHandler}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.button} onPress={addNoteHandler}>
            <Text style={styles.buttonText}>Add Note</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.goalsContainer}>
        <Text style={styles.listTitle}>
          {selectedNoteId ? "Editing Note:" : "List of Notes:"}
        </Text>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openNoteHandler(item.id)}
              onLongPress={() => confirmDeleteHandler(item.id)}
              delayLongPress={300}
              style={({ pressed }) => [
                styles.noteItem,
                selectedNoteId === item.id && styles.selectedItem,
                pressed && styles.pressedItem,
              ]}
            >
              <Text style={styles.noteText}>{item.text}</Text>
            </Pressable>
          )}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1e3a8a",
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },

  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#111827",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },

  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },

  goalsContainer: {
    flex: 1,
  },

  listTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },

  noteItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  selectedItem: {
    backgroundColor: "#bfdbfe",
  },

  pressedItem: {
    opacity: 0.6,
  },

  noteText: {
    fontSize: 16,
    color: "#111827",
  },
});