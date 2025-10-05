// src/pages/Notes.jsx
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/note.css";

const NOTES_BASE = "/api/bookshelfs/notes";
const IMAGES_BASE = "/api/bookshelfs/images";
const MAX_UPLOAD_BYTES = 10000 * 1024;

async function http(method, url, body) {
  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;


  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `${res.status} ${res.statusText}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const api = {
  notes: {
    get: (bookId) =>
      http(
        "GET", `${NOTES_BASE}/${bookId}`
      ),

    create: (bookId, data) =>
      http(
        "POST", `${NOTES_BASE}/${bookId}`, data
      ),


    update: (bookId, id, data) => http("PUT", `${NOTES_BASE}/${bookId}/${id}`, data),
    remove: (bookId, id) => http("DELETE", `${NOTES_BASE}/${bookId}/${id}`),
  },
  images: {
    get: (bookId) => http("GET", `${IMAGES_BASE}/${bookId}`),
    create: (bookId, data) => http("POST", `${IMAGES_BASE}/${bookId}`, data),
    update: (bookId, id, data) => http("PUT", `${IMAGES_BASE}/${bookId}/${id}`, data),
    remove: (bookId, id) => http("DELETE", `${IMAGES_BASE}/${bookId}/${id}`),
  },
};

export default function Notes() {
  const { bookId } = useParams();
  const [book, setBook] = useState({ _id: bookId, title: "This Book" });
  const [notes, setNotes] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [noteSearch, setNoteSearch] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState("");
  const [editNames, setEditNames] = useState({});
  const [renameBusy, setRenameBusy] = useState(new Set());
  const [viewImage, setViewImage] = useState(null);

  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  useEffect(() => {
    (async () => {
      for (const p of [`/api/bookshelfs/${bookId}`, `/api/bookshelf/${bookId}`, `/api/book/${bookId}`]) {
        try {
        const r = await fetch(p, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
          if (r.ok) { 
            const b = await r.json();
            if (b?.title) {
              setBook(b);
              break;
            }
          }
        } catch { }
      }
    })();
  }, [token, bookId]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingNotes(true);
        setNotes(await api.notes.get(bookId));
      } catch {
        setNotes([]);
      } finally {
        setLoadingNotes(false);
      }

      try {
        setLoadingImages(true);
        const imgs = await api.images.get(bookId);
        setImages(imgs);
        initEditNames(imgs);
      } catch {
        setImages([]);
        setEditNames({});
      } finally {
        setLoadingImages(false);
      }
    })();
  }, [bookId]);

  const initEditNames = (imgs) => {
    const m = {};
    imgs?.forEach((i) => (m[i._id || i.id] = i.name || ""));
    setEditNames(m);
  };

  const openNewNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setDate("");
    setPage("");
    setShowNoteModal(true);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title || "");
    setNoteContent(note.text ?? note.preview ?? "");
    setDate(note.date ? String(note.date).slice(0, 10) : "");
    setPage(note.page || "");
    setShowNoteModal(true);
  };

  const saveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const payload = {
      title: noteTitle,
      text: noteContent,
      date: date || new Date().toISOString().slice(0, 10),
      ...(page ? { page: Number(page) } : {}),
    };

    try {
      if (editingNote?._id) {
        const updated = await api.notes.update(bookId, editingNote._id, payload);
        setNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? { ...n, ...updated } : n))
        );
      } else {
        const updatedArr = await api.notes.create(bookId, payload);
        setNotes(Array.isArray(updatedArr) ? updatedArr : []);
      }
      setShowNoteModal(false);
    } catch (e) {
      alert(e.message || "Note action failed");
    }
  };

  const removeNote = async (id) => {
    try {
      await api.notes.remove(bookId, id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      alert(e.message || "Failed to delete note");
    }
  };

  const readFile = (f) =>
    new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(f);
    });

  const postImage = async (f) => {
    if (f.size > MAX_UPLOAD_BYTES) {
      alert(`Image too large (${Math.round(f.size / 1024)} KB).`);
      return null;
    }
    const src = await readFile(f);
    const payload = { src, name: f.name, date: new Date().toISOString() };
    return api.images.create(bookId, payload);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await postImage(file);
      if (updated) refreshImages(updated);
    } catch (err) {
      alert(err.message || "Upload failed");
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      const updated = await postImage(file);
      if (updated) refreshImages(updated);
    } catch (err) {
      alert(err.message || "Upload failed");
    }
  };

  const refreshImages = (imgs) => {
    setImages(Array.isArray(imgs) ? imgs : []);
    initEditNames(Array.isArray(imgs) ? imgs : []);
    setShowImageModal(false);
  };

  const commitRename = async (imageId) => {
    const id = String(imageId);
    const img = images.find((i) => String(i._id || i.id) === id);
    if (!img) return;

    const newName = (editNames[id] ?? "").trim();
    if (newName === (img.name || "").trim()) return;

    setImages((prev) =>
      prev.map((i) => (String(i._id || i.id) === id ? { ...i, name: newName } : i))
    );
    setEditNames((prev) => ({ ...prev, [id]: newName }));
    setRenameBusy((prev) => new Set(prev).add(id));

    try {
      const payload = { ...img, name: newName, date: new Date().toISOString() };
      const res = await api.images.update(bookId, imageId, payload);

      if (res && res.name) {
        setImages((prev) =>
          prev.map((i) => (String(i._id || i.id) === id ? { ...i, name: res.name } : i))
        );
        setEditNames((prev) => ({ ...prev, [id]: res.name }));
      }
    } catch (e) {
      try {
        await api.images.create(bookId, { src: img.src, name: newName });
        await api.images.remove(bookId, imageId);
        const fresh = await api.images.get(bookId);
        setImages(fresh);
        initEditNames(fresh);
      } catch (err) {
        alert(err.message || "Failed to rename image");
        setImages((prev) =>
          prev.map((i) => (String(i._id || i.id) === id ? { ...i, name: img.name } : i))
        );
        setEditNames((prev) => ({ ...prev, [id]: img.name || "" }));
      }
    } finally {
      setRenameBusy((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const deleteImage = async (id) => {
    try {
      await api.images.remove(bookId, id);
      const fresh = await api.images.get(bookId);
      setImages(fresh);
      initEditNames(fresh);
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  const filteredNotes = useMemo(() => {
    const q = noteSearch.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.text || n.preview || "").toLowerCase().includes(q)
    );
  }, [notes, noteSearch]);

  return (
    <div className="notes-page">
      <div className="notes-left">
        <h2>Notes for {book?.title || "This Book"}</h2>
        <input
          className="note-search"
          placeholder="Search notes..."
          value={noteSearch}
          onChange={(e) => setNoteSearch(e.target.value)}
        />

        {loadingNotes ? (
          <p>Loading notes…</p>
        ) : filteredNotes.length ? (
          filteredNotes.map((n) => (
            <div key={n._id} className="note-card">
              <h4>{n.title}</h4>
              <p>{(n.text ?? n.preview ?? "").slice(0, 240)}</p>
              <div className="note-actions">
                <button onClick={() => openEditNote(n)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => removeNote(n._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No matching notes found</p>
        )}

        <button className="add-btn" onClick={openNewNote}>
          ➕ Add Note
        </button>
      </div>

      <div className="notes-right">
        <h2>Pictures</h2>
        <div className="images">
          {images.map((img) => {
            const id = img._id || img.id;
            const value = editNames[id] ?? img.name ?? "";
            const busy = renameBusy.has(id);
            return (
              <div key={id} className="image-card">
                <img src={img.src} alt={img.name || "image"} />
                <input
                  className="image-name"
                  value={value}
                  disabled={busy}
                  onChange={(e) => setEditNames((p) => ({ ...p, [id]: e.target.value }))}
                  onBlur={() => commitRename(id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") {
                      setEditNames((p) => ({ ...p, [id]: img.name || "" }));
                      e.currentTarget.blur();
                    }
                  }}
                />
                <div className="image-actions">
                  <button onClick={() => setViewImage(img)}> View</button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteImage(id)}
                    disabled={busy}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="upload-btn" onClick={() => setShowImageModal(true)}>
          Add picture
        </button>
      </div>


      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal note-editor" onClick={(e) => e.stopPropagation()}>
            <input
              placeholder="Note title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              placeholder="Write your note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input
              type="number"
              min="1"
              placeholder="Page (optional)"
              value={page}
              onChange={(e) => setPage(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button onClick={saveNote}>{editingNote ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal image-upload-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowImageModal(false)}>
              ✖
            </button>
            <h3>Choose from the device</h3>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <label htmlFor="fileInput" className="choose-btn">
              ＋
            </label>
            <div
              className="drag-drop"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              Or drag and drop a file here
            </div>
          </div>
        </div>
      )}


      {viewImage && (
        <div className="modal-overlay" onClick={() => setViewImage(null)}>
          <div className="modal image-viewer" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setViewImage(null)}>
              ✖
            </button>
            <h3>{viewImage.name || "Image"}</h3>
            <img
              src={viewImage.src}
              alt={viewImage.name || "image"}
              className="view-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
