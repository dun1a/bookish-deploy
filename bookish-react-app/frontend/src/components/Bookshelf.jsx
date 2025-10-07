
import { useContext, useEffect, useMemo, useState } from "react";
import { BookContext } from "../components/BookContext";
import BookCard from "./BookCard";
import Review from "./Review";
import "../styles/mainPage.css";

export default function Bookshelf() {
  const { books, setBooks } = useContext(BookContext);

  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("ALL");

  
  const [openForm, setOpenForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;


  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    booktheme: "",
    published: "",
    genre: "",
  });

  
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const slotsPerPage = 12;

  
  const refreshShelf = async () => {
    try {
        const res = await fetch("/api/bookshelf", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.message || "Load failed");
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshShelf();
    
  }, [token]);

  
  const normStatus = (s = "") => {
    const up = String(s).trim().toUpperCase();
    if (up === "TO BE READ") return "TBR";
    if (up === "IN PROGRESS") return "READING";
    return up;
  };

  const filtered = useMemo(() => {
    if (filter === "ALL") return books;
    if (filter === "TBR") return books.filter((b) => normStatus(b.status) === "TBR");
    if (filter === "Reading") return books.filter((b) => normStatus(b.status) === "READING");
    if (filter === "Read") return books.filter((b) => normStatus(b.status) === "READ");
    if (filter === "Notes") return books.filter((b) => Array.isArray(b.notes) && b.notes.length > 0);
    return books;
  }, [books, filter]);

  // Keep page in range
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filtered.length / slotsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filter, filtered.length]); 

  const start = page * slotsPerPage;
  const current = filtered.slice(start, start + slotsPerPage);
  const slots = [...current];
  while (slots.length < slotsPerPage) slots.push(null);
  const totalPages = Math.ceil(filtered.length / slotsPerPage) || 1;

  const openReviewFor = (book) => {
    if (!book?._id) {
      alert("Add to shelf first.");
      return;
    }
    setSelectedBook(book);
    setReviewOpen(true);
  };

  
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      title: "",
      author: "",
      description: "",
      booktheme: "",
      published: "",
      genre: "",
    });
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    if (busy) return;

    const title = form.title.trim();
    const author = form.author.trim() || "Unknown";
    const description = form.description.trim() || "No description provided.";
    const booktheme = form.booktheme.trim() || "General";
    const genre = form.genre.trim() || "General";
    const publishedNum = Number.isFinite(Number(form.published))
      ? Number(form.published)
      : 0;

    if (!title) {
      setMsg("Title is required.");
      return;
    }

    try {
      setBusy(true);
      setMsg("");

      const payload = {
        title,
        author,
        description,
        booktheme,
        genre,
        published: publishedNum,
        status: "TBR",
        notes: [],
        images: [],
        rating: { stars: 0, review: "" },
      };

      const res = await fetch("/api/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`,
         },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        setMsg("Already in your shelf ✓");
        await refreshShelf();
        
        setTimeout(() => {
          setOpenForm(false);
          clearForm();
          setMsg("");
        }, 800);
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to add");
      }

      const created = await res.json();
      setBooks((prev) => [created, ...prev]);
      setMsg("Added ✓");
      // close + reset
      setTimeout(() => {
        setOpenForm(false);
        clearForm();
        setMsg("");
        setPage(0);
      }, 800);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Failed to add.");
      alert(err.message || "Failed to add.");
    } finally {
      setBusy(false);
    }
  };

  const closeForm = () => {
    if (busy) return;
    setOpenForm(false);
    setMsg("");
  };

  const closeReview = () => {
    setReviewOpen(false);
    setSelectedBook(null);
  };

  return (
    <div>
      
      <div className="mainpage-filters">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>📚 All</button>
        <button className={filter === "TBR" ? "active" : ""} onClick={() => setFilter("TBR")}>🖊️ TBR</button>
        <button className={filter === "Reading" ? "active" : ""} onClick={() => setFilter("Reading")}>👓 Reading</button>
        <button className={filter === "Read" ? "active" : ""} onClick={() => setFilter("Read")}>✔️ Read</button>
        <button className={filter === "Notes" ? "active" : ""} onClick={() => setFilter("Notes")}>📝 Notes</button>
      </div>

    
      <div className="bookshelf">
        <h2 className="shelf-title">Bookshelf</h2>
        <div className="shelf-container">
          {slots.map((book, i) => (
            <div key={book?._id || book?.id || i} className="book-slot">
              {book ? (
                <div className="book-sideways-fixed">
                  <BookCard book={book} onMarkAsRead={() => openReviewFor(book)} />
                </div>
              ) : (
                <div className="empty-slot" />
              )}
            </div>
          ))}
        </div>

        <div className="shelf-nav">
          <button className="nav-btn" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>◀</button>
          <span className="page-indicator">{filtered.length ? page + 1 : 0}/{Math.ceil(filtered.length / slotsPerPage) || 1}</span>
          <button className="nav-btn" onClick={() => setPage((p) => Math.min((Math.ceil(filtered.length / slotsPerPage) || 1) - 1, p + 1))} disabled={page >= (Math.ceil(filtered.length / slotsPerPage) || 1) - 1}>▶</button>
        </div>
      </div>

      
      <button
        onClick={() => setOpenForm(true)}
        disabled={busy}
        style={{
        position: "absolute",
          right: "10%",
          top: "35%",
          transform: "translateY(-50%)",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#f5f5f5",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          zIndex: 20,
          fontWeight: 600,
        }}
        title="Add a new book"
      >
        ➕ Add Book
      </button>

      
      {openForm && (
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: 0,
            width: 380,
            background: "#ffffff",
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "-8px 0 24px rgba(0,0,0,0.12)",
            backgroundColor: "#fefefe",
            borderRadius: "10px",
            padding: "18px 16px",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div >
            <h3 style={{ margin: 0 }}>Add Book</h3>
            <button
              onClick={closeForm}
              disabled={busy}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer",
                padding: 6,
              }}
              aria-label="Close"
            >
              ✖
            </button>
          </div>

          <form onSubmit={submitAdd} style={{ display: "grid", gap: 10, overflowY: "auto" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Title *</span>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={onChange}
                required
                placeholder="e.g., Atomic Habits"
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Author</span>
              <input
                name="author"
                type="text"
                value={form.author}
                onChange={onChange}
                placeholder="e.g., James Clear"
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Description</span>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={onChange}
                placeholder="Short description..."
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", resize: "vertical" }}
              />
            </label>

            {/* <label style={{ display: "grid", gap: 6 }}>
              <span>Theme</span>
              <input
                name="booktheme"
                type="text"
                value={form.booktheme}
                onChange={onChange}
                placeholder="e.g., Self-help"
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              />
            </label> */}

            <label style={{ display: "grid", gap: 6 }}>
              <span>Published (Year/Number)</span>
              <input
                name="published"
                type="number"
                value={form.published}
                onChange={onChange}
                placeholder="e.g., 2018"
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Genre</span>
              <input
                name="genre"
                type="text"
                value={form.genre}
                onChange={onChange}
                placeholder="e.g., Productivity"
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
              />
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                type="button"
                onClick={closeForm}
                disabled={busy}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#f3f3f3",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !form.title.trim()}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #1a7f37",
                  background: busy ? "#b7e0c3" : "#22c55e",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: busy ? "default" : "pointer",
                }}
              >
                {busy ? "Saving..." : "Add Book"}
              </button>
            </div>

            {msg && (
              <p style={{ margin: 0, marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                {msg}
              </p>
            )}
          </form>
        </div>
      )}

      
      {reviewOpen && (
        <div className="popup-overlay" onClick={closeReview}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <Review
              open={reviewOpen}
              bookTitle={selectedBook?.title}
              initialStars={selectedBook?.rating?.stars ?? 0}
              initialReview={selectedBook?.rating?.review ?? ""}
              onClose={closeReview}
              onSave={() => { }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
