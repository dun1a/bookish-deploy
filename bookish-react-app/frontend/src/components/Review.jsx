import { useEffect, useRef, useState } from "react";
import "../styles/review.css";

export default function Review({
  isOpen,
  onClose,
  onSubmit, 
  initialValue = { stars: 0, review: "default" },
  title = "Leave a Review",
}) {
  const [stars, setStars] = useState(Number(initialValue?.stars || 0));
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState(String(initialValue?.review ?? "default"));
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setStars(Number(initialValue?.stars || 0));
    setReview(String(initialValue?.review ?? "default"));
    setHover(null);

    // focus first control on open
    setTimeout(() => firstFocusRef.current?.focus(), 0);

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      // arrow keys adjust rating when focus is in the star row
      if (e.target?.dataset?.starRow === "true") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setStars((s) => Math.min(5, (s || 0) + 1));
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setStars((s) => Math.max(0, (s || 0) - 1));
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, initialValue, onClose]);

  if (!isOpen) return null;

  const current = hover ?? stars;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      stars: Number(stars) || 0,
      review: review?.trim() || "default",
    };
    await onSubmit?.(payload);
    onClose?.();
  };

  return (
    <div
      className="rv-backdrop"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rv-title"
      ref={dialogRef}
    >
      <div className="rv-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="rv-header">
          <h2 id="rv-title">{title}</h2>
          <button
            type="button"
            className="rv-close"
            aria-label="Close"
            onClick={onClose}
            ref={firstFocusRef}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rv-body">
          <label className="rv-label">Your rating</label>

          <div
            className="rv-stars"
            role="radiogroup"
            aria-label="Star rating"
            data-star-row="true"
            tabIndex={0}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`rv-star ${current >= value ? "rv-on" : "rv-off"}`}
                aria-checked={stars === value}
                role="radio"
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(value)}
                onBlur={() => setHover(null)}
                onClick={() => setStars(value)}
              >
                ★
              </button>
            ))}
            <button
              type="button"
              className={`rv-clear ${stars === 0 ? "rv-clear-active" : ""}`}
              onClick={() => setStars(0)}
              aria-label="Clear rating"
              title="Clear rating"
            >
              0
            </button>
          </div>

          <label htmlFor="rv-text" className="rv-label">
            Your review
          </label>
          <textarea
            id="rv-text"
            className="rv-textarea"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write a few words about your experience…"
          />

          <div className="rv-footer">
            <button type="button" className="rv-btn rv-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rv-btn rv-btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
