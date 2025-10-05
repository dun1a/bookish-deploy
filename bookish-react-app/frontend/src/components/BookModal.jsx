// src/components/BookModal.jsx
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { BookContext } from "../components/BookContext";
import { useNavigate } from "react-router-dom";
import "../styles/mainPage.css";

export default function BookModal({ book, onClose, onShelfRefresh }) {
  const { setBooks } = useContext(BookContext);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const id = book?._id;
  const saved = Boolean(id);
  const mustBeSaved = () => alert("Add this book to your shelf first.");
  
  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;


  // --- review state ---
  const [reviewMode, setReviewMode] = useState(false);
  const [stars, setStars] = useState(book?.rating?.stars ?? 0);
  const [reviewText, setReviewText] = useState(book?.rating?.review ?? "");

  // ---------- helpers for display ----------
  const clean = (v) => (String(v || "").trim() ? String(v).trim() : null);
  const showAuthor = clean(book?.author) || "Unknown";
  const showGenre = clean(book?.genre) || "—";
  const showTheme = clean(book?.booktheme) || "—";
  const showPublished =
    book?.published != null && !Number.isNaN(Number(book?.published))
      ? Number(book.published)
      : "—";
  const showDescription = clean(book?.description) || "No description available.";

  const addToShelf = async () => {
    if (busy) return;
    try {
      setBusy(true);
      const payload = {
        title: (book.title || "").trim(),
        author: (book.author || "Unknown").trim(),
        description: book.description || "",
        booktheme: book.booktheme || "",
        genre: book.genre || "",
        published:
          book.published != null && !Number.isNaN(Number(book.published))
            ? Number(book.published)
            : undefined,
        status: "TBR",
        notes: [],
        images: [],
      };

      const res = await fetch("/api/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
          Authorization: `bearer ${token}`
         },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 409) {
          alert("Book already exists in your shelf");
          onShelfRefresh?.();
          return;
        }
        throw new Error(await res.text());
      }

      const created = await res.json();
      setBooks((prev) => [created, ...prev]);
      onClose?.();
    } catch (e) {
      console.error("Add to shelf failed:", e);
      alert(e.message || "Failed to add to shelf.");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (status) => {
    if (!id) return mustBeSaved();
    if (busy) return;
    try {
      setBusy(true);
      const res = await fetch(`/api/bookshelf/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      onClose?.();
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  const deleteBook = async () => {
    if (!id) return mustBeSaved();
    if (busy) return;
    try {
      setBusy(true);
      const res = await fetch(`/api/bookshelf/${id}`, {
           method: "DELETE", 
           headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`
           }
          });      if (!res.ok) throw new Error(await res.text());
      setBooks((prev) => prev.filter((b) => b._id !== id));
      onClose?.();
    } catch (e) {
      console.error("Failed to delete book:", e);
      alert("Failed to delete book.");
    } finally {
      setBusy(false);
    }
  };

  // === Review flow ===
  const startReview = () => {
    if (!saved) return mustBeSaved();
    setStars(book?.rating?.stars ?? 0);
    setReviewText(book?.rating?.review ?? "");
    setReviewMode(true);
  };

  const saveReviewAndMarkRead = async (e) => {
    e?.preventDefault?.();
    if (!id) return mustBeSaved();
    if (busy) return;

    try {
      setBusy(true);
      const res = await fetch(`/api/bookshelf/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({
          status: "Read",
          rating: { stars: Number(stars) || 0, review: reviewText || "" },
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setBooks((prev) =>
        prev.map((b) => (b._id === (updated?._id ?? id) ? updated : b))
      );

      setReviewMode(false);

      navigate("/recommendations", {
        state: {
          from: "review",
          bookId: updated?._id ?? id,
          title: updated?.title ?? book?.title,
          stars: Number(stars) || 0,
        },
      });
    } catch (e) {
      console.error("Failed to save review:", e);
      alert(e.message || "Failed to save review.");
    } finally {
      setBusy(false);
    }
  };

  const Star = ({ value }) => (
    <button
      type="button"
      className={`star-btn ${value <= (Number(stars) || 0) ? "filled" : ""}`}
      onClick={() => setStars(value)}
      disabled={busy}
      aria-label={`${value} star${value === 1 ? "" : "s"}`}
      style={{
        fontSize: "1.4rem",
        lineHeight: 1,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      {value <= (Number(stars) || 0) ? "★" : "☆"}
    </button>
  );

  // -------- inline details styles (to avoid touching your CSS) --------
  const detailsWrap = {
    display: "grid",
    gap: "0.6rem",
    marginBottom: "1rem",
  };
  const titleRow = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "0.75rem",
  };
  const h3Style = { margin: 0, fontWeight: 600 };
  const pillRow = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "0.5rem",
  };
  const pill = {
    fontSize: "0.86rem",
    padding: "0.35rem 0.6rem",
    borderRadius: "999px",
    border: "1px solid rgba(0,0,0,0.1)",
    background: "rgba(0,0,0,0.03)",
    display: "flex",
    gap: "0.35rem",
    alignItems: "center",
    minHeight: "32px",
  };
  const descBox = {
    maxHeight: 160,
    overflowY: "auto",
    background: "rgba(0,0,0,0.03)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 8,
    padding: "0.6rem 0.75rem",
    lineHeight: 1.45,
  };

  return createPortal(
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup fancy-popup" onClick={(e) => e.stopPropagation()}>
        {!reviewMode ? (
          <>
            {/* ====== DETAILS SECTION ====== */}
            <div style={detailsWrap}>
              <div style={titleRow}>
                <h3 style={h3Style}>{book?.title || "Untitled"}</h3>
                {saved ? (
                  <span style={{ opacity: 0.7, fontSize: "0.9rem" }}>Saved on shelf</span>
                ) : (
                  <span style={{ opacity: 0.7, fontSize: "0.9rem" }}>Search result</span>
                )}
              </div>

              <div style={pillRow}>
                <div style={pill}>👤 <strong style={{ fontWeight: 600 }}>{showAuthor}</strong></div>
                <div style={pill}>🏷️ <span>Genre:</span> <strong style={{ fontWeight: 600 }}>{showGenre}</strong></div>
                <div style={pill}>🎨 <span>Theme:</span> <strong style={{ fontWeight: 600 }}>{showTheme}</strong></div>
                <div style={pill}>📅 <span>Published:</span> <strong style={{ fontWeight: 600 }}>{showPublished}</strong></div>
              </div>

              <div style={descBox}>
                {showDescription}
              </div>
            </div>

            {/* ====== ACTIONS SECTION (unchanged behavior) ====== */}
            <p className="popup-subtext" style={{ marginTop: "-0.5rem" }}>
              {saved
                ? "Choose a status, add notes, or delete 📖"
                : "This is a search result. Add it to your shelf first."}
            </p>

            <div className="popup-actions">
              {!saved ? (
                <button className="status-btn read" onClick={addToShelf} disabled={busy}>
                  ➕ Add to Shelf
                </button>
              ) : (
                <>
                  <button className="status-btn tbr" onClick={() => updateStatus("TBR")} disabled={busy}>
                    🖊️ TBR
                  </button>
                  <button className="status-btn reading" onClick={() => updateStatus("Reading")} disabled={busy}>
                    👓 Reading
                  </button>
                  <button
                    className="status-btn read"
                    onClick={startReview}
                    disabled={busy}
                    title="Mark as Read with a review"
                  >
                    ✔️ Read
                  </button>
                  <button className="status-btn notes" onClick={() => navigate(`/notes/${id}`)} disabled={busy}>
                    📝 Notes
                  </button>
                  <button className="status-btn delete" onClick={deleteBook} disabled={busy}>
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>

            <button className="close-btn" onClick={onClose} disabled={busy}>✖</button>
          </>
        ) : (
          <form onSubmit={saveReviewAndMarkRead}>
            <h3>Review: {book?.title}</h3>
            <p className="popup-subtext">Rate 0–5 stars and add a short review.</p>

            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", margin: "0.5rem 0 1rem" }}>
              {[1, 2, 3, 4, 5].map((v) => (
                <Star key={v} value={v} />
              ))}
              <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>{Number(stars) || 0}/5</span>
            </div>

            <textarea
              rows={4}
              placeholder="Write a quick thought…"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={busy}
              style={{ width: "100%", resize: "vertical", padding: "0.6rem" }}
            />

            <div className="popup-actions" style={{ marginTop: "0.8rem" }}>
              <button type="button" className="status-btn tbr" onClick={() => setReviewMode(false)} disabled={busy}>
                ← Back
              </button>
              <button
                type="button"
                className="status-btn reading"
                onClick={() => updateStatus("Read")}
                disabled={busy}
                title="Mark as Read without review"
              >
                Skip review
              </button>
              <button type="submit" className="status-btn read" disabled={busy}>
                {busy ? "Saving…" : "Save & Mark Read"}
              </button>
            </div>

            <button className="close-btn" onClick={onClose} disabled={busy}>✖</button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
