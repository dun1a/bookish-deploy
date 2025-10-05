// Full-details card with add button (no images).
const clamp = (s = "", n = 240) => {
  const str = String(s || "");
  return str.length > n ? str.slice(0, n).trim() + "…" : str;
};

const safeHex = (hex) => {
  if (!hex) return "#8b8b8b";
  const v = String(hex).trim();
  return v.startsWith("#") ? v : `#${v}`;
};

const RecommendationBox = ({
  title,
  author,
  genre,
  description,
  booktheme,
  published,
  onAdd,
  adding,
  added,
}) => {
  const chipColor = safeHex(booktheme);
  return (
    <div className="book-card details-only">
      <div className="book-info">
        <div className="book-top">
          <h3 className="title">{title}</h3>
          <span
            className="theme-chip"
            title={`Theme: ${chipColor}`}
            style={{ background: chipColor }}
          />
        </div>
        {author && <p className="author">{author}</p>}
        <div className="meta-row">
          {genre && <span className="meta-pill">{genre}</span>}
          {published != null && (
            <span className="meta-pill">Published: {published}</span>
          )}
        </div>
        {description && <p className="desc">{clamp(description, 260)}</p>}

        <button
          type="button"
          className="rec-add-btn"
          onClick={onAdd}
          disabled={adding || added}
          aria-label={added ? "Added" : "Add to Shelf"}
          title={added ? "Already in your shelf" : "Add to Shelf"}
          style={{ marginTop: ".5rem" }}
        >
          {added ? "✅ Added" : (adding ? "Adding…" : "➕ Add to Shelf")}
        </button>
      </div>
    </div>
  );
};

export default RecommendationBox;
