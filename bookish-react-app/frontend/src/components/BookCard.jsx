import { useState } from "react";
import BookModal from "./BookModal";
import "../styles/mainPage.css";

export default function BookCard({ book }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="book-card">
      <div className="book-shape" onClick={() => setOpen(true)} title="Open book actions">
        {/* Placeholder cover block; backend can replace with real image */}
        <div className="cover-placeholder">
          {book.title?.slice(0, 20)?.toUpperCase() || "BK"}
        </div>
      </div>

      {/* Status badge under the book */}
      {book.status && (
        <div
          className={`book-status-badge ${
            book.status === "TBR"
              ? "tbr"
              : book.status === "Reading"
              ? "reading"
              : book.status === "Read"
              ? "read"
              : ""
          }`}
        >
          {book.status}
        </div>
      )}

      {open && <BookModal book={book} onClose={() => setOpen(false)} />}
    </div>
  );
}
