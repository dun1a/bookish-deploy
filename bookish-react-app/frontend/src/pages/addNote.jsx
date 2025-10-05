import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNoteModal = ({ bookId, setShowNoteModal, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState("");

  const navigate = useNavigate();

  const token = (() => {
    try { return JSON.parse(localStorage.getItem("user"))?.token || null; } catch { return null; }
  })();

  const addNote = async (bookId, newNote) => {
    const res = await fetch(`/api/bookshelfs/notes/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newNote),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || "Failed to add note");
    }
    // Your controller returns the FULL notes array
    const updatedNotes = await res.json();
    return updatedNotes;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!title || !text || !date) {
      alert("Fill the required fields 🧐");
      return;
    }

    const newNote = { title, text, date, page: page || undefined };

    try {
      const updatedNotes = await addNote(bookId, newNote);

      // Let parent update its state instantly
      onSuccess?.(updatedNotes);

      // close modal + stay on the notes page
      setShowNoteModal(false);
      navigate(`/notes/${bookId}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add note");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
      <div className="modal note-editor" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Note title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          min="1"
          placeholder="Page (optional)"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={() => setShowNoteModal(false)}>Cancel</button>
          <button onClick={submitForm}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
