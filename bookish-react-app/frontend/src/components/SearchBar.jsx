// src/components/SearchBar.jsx
import { useState, useMemo } from "react";
import "../styles/mainPage.css";

const norm = (s) => String(s || "").trim().toLowerCase();

function SearchBar({
  search, setSearch,
  filters, setFilters,
  applyFilters, clearFilters,
  loading, error, results,
  onAddToShelf, addingId,
  onOpenBook,
  shelfBooks = [],
}) {
  const [open, setOpen] = useState(false);

  const canApply = useMemo(() => {
    const { genre, yearPublished, pageAmount } = filters || {};
    return Boolean(genre && yearPublished && pageAmount);
  }, [filters]);

  const isInShelf = (book) => {
    const t = norm(book.title);
    const a = norm(book.author);
    return shelfBooks.some((s) => norm(s.title) === t && norm(s.author) === a);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async () => { await applyFilters(); setOpen(false); };
  const handleClear = async () => { await clearFilters(); setOpen(false); };

  return (
    <div
      className="search-bar"
      style={{ position: "center", display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search books"
      />

      <button
        type="button"
        className="filter-button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-controls="search-filter-panel"
      >
        Filters
      </button>

      <style>
        {`
          @keyframes spinBorder {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          #search-filter-panel {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
          }

          /* rotating conic-gradient border */
          #search-filter-panel::before {
            content: "";
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            border-radius: 8px;
            background: conic-gradient(#ff0057, #6f8386ff, #ff0057);
            animation: spinBorder 3s linear infinite;
            z-index: 0;
            pointer-events: none; /* don't block clicks */
          }

          /* inner fill card */
          #search-filter-panel::after {
            content: "";
            position: absolute;
            top: 2px; left: 2px; right: 2px; bottom: 2px;
            border-radius: 6px;
            background: #c4b1b1ff;
            z-index: 1;
            pointer-events: none;
          }

          /* actual content above the frame */
          #search-filter-panel > * {
            position: relative;
            z-index: 2;
          }
        `}
      </style>

      {open && (
        <div
          id="search-filter-panel"
          className="filter-panell"
          role="region"
          aria-label="Search filters"
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 0px 18px rgba(0,0,0,.1)",
            zIndex: 1000,
            display: "grid",
            gap: 8,
            minWidth: 300,
            background: "transparent", // the ::after provides the card bg
          }}
        >
          <label className="filter-fieldss" style={{ display: "grid", gap: 4 }}>
            <span>Genre</span>
            <input
              name="genre"
              value={filters.genre}
              onChange={handleChange}
              placeholder="e.g., Fantasy"
            />
          </label>

          <label className="filter-fieldsssss" style={{ display: "grid", gap: 4 }}>
            <span>Published Year</span>
            <input
              name="yearPublished"
              value={filters.yearPublished}
              onChange={handleChange}
              placeholder="e.g., 2020"
              inputMode="numeric"
            />
          </label>

          <label className="filter-fieldwsssss" style={{ display: "grid", gap: 4 }}>
            <span>Page Amount</span>
            <input
              name="pageAmount"
              value={filters.pageAmount}
              onChange={handleChange}
              placeholder="e.g., 300"
              inputMode="numeric"
            />
          </label>

          <div className="filter-actionsw" style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={handleApply} disabled={!canApply || loading}>
              {loading ? "Loading..." : "Apply"}
            </button>
            <button type="button" onClick={handleClear} disabled={loading}>
              Clear
            </button>
          </div>

          {error && (
            <div className="filter-errorrrs" role="alert" style={{ color: "#b00020" }}>
              {error}
            </div>
          )}
        </div>
      )}

      {Array.isArray(results) && results.length > 0 && (
        <div
          className="search-resultsss"
          role="listbox"
          aria-label="Search results"
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            maxHeight: 350,
            maxWidth: 900,
            overflow: "auto",
            border: "1px solid #000000ff",
            background: "#ebd7d7ff",
            borderRadius: 8,
            zIndex: 999,
            boxShadow: "0 6px 18px rgba(0,0,0,.1)",
            minWidth: 320,
          }}
        >
          {results.map((book, i) => {
            const key =
              book._id ||
              book.id ||
              book.isbn ||
              `${(book.title || "untitled").trim()}-${(book.author || "na").trim()}-${book.published ?? book.year ?? "y"}-${i}`;

            const inShelf = isInShelf(book);

            return (
              <div
                key={key}
                className="search-result-itemss"
                role="option"
                style={{
                  padding: "8px 10px",
                  borderBottom: "1px solid #111111ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div
                  onClick={() => onOpenBook?.(book)}
                  style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
                  title="Open details"
                >
                  <div
                    style={{
                      fontVariant: "small-caps",
                      fontSize: 14,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {book.title}
                  </div>
                  {book.author && (
                    <div
                      style={{
                        fontSize: 12,
                        opacity: 0.8,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {book.author}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="result-add-btns"
                  onClick={() => onAddToShelf(book)}
                  disabled={inShelf || addingId === key}
                  title={inShelf ? "Already in your shelf" : "Add to shelf"}
                >
                  {inShelf ? "In shelf" : addingId === key ? "Adding..." : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
