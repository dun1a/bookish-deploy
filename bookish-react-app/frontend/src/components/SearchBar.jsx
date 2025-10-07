// src/components/SearchBar.jsx
import { useState, useMemo, useEffect } from "react";
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
 const [open, setOpen] = useState(false);       // filters panel
 const [listOpen, setListOpen] = useState(true); // search results dropdown

 const canApply = useMemo(() => {
  const { genre, yearPublished, pageAmount } = filters || {};
  return Boolean(genre && yearPublished && pageAmount);
 }, [filters]);

 const isInShelf = (book) => {
  const t = norm(book.title);
  const a = norm(book.author);
  return shelfBooks.some((s) => norm(s.title) === t && norm(s.author) === a);
 };

 // 🔍 Shelf matches (live)
 const shelfMatches = useMemo(() => {
  const q = norm(search);
  if (!q) return [];
  return (shelfBooks || []).filter((b) => {
   const t = norm(b.title);
   const a = norm(b.author);
   const g = norm(b.genre);
   return t.includes(q) || a.includes(q) || g.includes(q);
  });
 }, [search, shelfBooks]);

 // 🔍 External results filtered by the same query
 const filteredResults = useMemo(() => {
  const list = Array.isArray(results) ? results : [];
  const q = norm(search);
  if (!q) return list;
  return list.filter((b) => {
   const t = norm(b.title);
   const a = norm(b.author);
   const g = norm(b.genre);
   const d = norm(b.description);
   return t.includes(q) || a.includes(q) || g.includes(q) || d.includes(q);
  });
 }, [results, search]);

 const hasAnyResults = useMemo(() => {
  return Boolean(search) || (Array.isArray(results) && results.length > 0);
 }, [search, results]);

 // Re-open the dropdown when new search/results appear
 useEffect(() => {
  if (hasAnyResults) setListOpen(true);
 }, [hasAnyResults]);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFilters((prev) => ({ ...prev, [name]: value }));
 };

 const handleApply = async () => { await applyFilters(); setOpen(false); };
 const handleClear = async () => { await clearFilters(); setOpen(false); };

 return (
  <div
   className="search-bar"
   style={{ position: "fixed", display: "flex", gap: 8, alignItems: "center" }}
  >
   <input
    type="text"
    placeholder="Search books..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onFocus={() => setListOpen(true)}
    aria-label="Search books"
   />
   {search && (
    <button type="button" onClick={() => setSearch("")} aria-label="Clear search" title="Clear">
     ✕
    </button>
   )}

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
          #search-filter-panel::before {
            content: "";
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            border-radius: 8px;
            background: conic-gradient(#ff0057, #6f8386ff, #ff0057);
            animation: spinBorder 3s linear infinite;
            z-index: 0;
            pointer-events: none;
          }
          #search-filter-panel::after {
            content: "";
            position: absolute;
            top: 2px; left: 2px; right: 2px; bottom: 2px;
            border-radius: 6px;
            background: #c4b1b1ff;
            z-index: 1;
            pointer-events: none;
          }
          #search-filter-panel > * {
            position: relative;
            z-index: 2;
          }
          .dropdown-box {
            position: absolute;
            top: 110%;
            right: 0;
            max-height: 380px;
            max-width: 900px;
            overflow: auto;
            border: 1px solid #000000ff;
            background: #ebd7d7ff;
            border-radius: 8px;
            z-index: 999;
            box-shadow: 0 6px 18px rgba(0,0,0,.1);
            min-width: 340px;
          }
          .section-header {
            position: sticky;
            top: 0;
            background: #f3e6e6;
            padding: 6px 10px;
            font-weight: 700;
            border-bottom: 1px solid #11111133;
          }
          .search-result-itemss {
            padding: 8px 10px;
            border-bottom: 1px solid #11111155;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          /* Close button (filters) — class 'clo' */
          #search-filter-panel .clo {
            all: unset;
            position: absolute;
            top: 6px;
            right: 6px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: transparent;
            color: #222;
            font-size: 18px;
            line-height: 1;
            border-radius: 50%;
            z-index: 3;
          }
          #search-filter-panel .clo:hover { background: rgba(0,0,0,0.06); }
          #search-filter-panel .clo:focus-visible {
            outline: 2px solid #333;
            outline-offset: 2px;
          }

          /* Close button (results dropdown) — class 'dropdown-close' */
          .dropdown-close {

            position: absolute;
            top: 32px;
            right: 6px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: transparent;
            color: #222;
            font-size: 18px;
            line-height: 1;
            border-radius: 50%;
          }
          .dropdown-close:hover { background: rgba(0,0,0,0.06); }
          .dropdown-close:focus-visible {
            outline: 2px solid #333;
            outline-offset: 2px;
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
      paddingTop: "2.25rem", // space for the close button
      borderRadius: "8px",
      boxShadow: "0 0px 18px rgba(0,0,0,.1)",
      zIndex: 1000,
      display: "grid",
      gap: 8,
      minWidth: 300,
      background: "transparent",
     }}
     tabIndex={-1}
     onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >


     <button
      type="button"
      className="clo"
      aria-label="Close filters"
      title="Close"
      onClick={() => setOpen(false)}
     >
      ×
     </button>

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

   {/* 🔽 Unified dropdown shows BOTH sections at once */}
   {hasAnyResults && listOpen && (
    <div
     className="dropdown-box"
     role="listbox"
     aria-label="Search results"
     onKeyDown={(e) => e.key === "Escape" && setListOpen(false)}
    >
     {/* Close button for the results list */}


     {/* --- Your shelf section --- */}
     <div className="section-header">
      Your shelf • {shelfMatches.length} match{(shelfMatches.length === 1) ? "" : "es"}
     </div>
     {shelfMatches.length > 0 ? (
      shelfMatches.map((book, i) => {
       const key = book._id || book.id || `${book.title}-${book.author}-${i}`;
       return (
        <div key={`shelf-${key}`} className="search-result-itemss" role="option">
         <div
          onClick={() => onOpenBook?.(book)}
          style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
          title="Open from your shelf"
         >
          <div style={{
           fontVariant: "small-caps",
           fontSize: 14,
           fontWeight: 700,
           overflow: "hidden",
           textOverflow: "ellipsis",
           whiteSpace: "nowrap",
          }}>
           {book.title}
          </div>
          {(book.author || book.genre) && (
           <div style={{
            fontSize: 12,
            opacity: 0.8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
           }}>
            {book.author ?? "Unknown"}{book.genre ? ` • ${book.genre}` : ""}
           </div>
          )}
         </div>
         <span
          style={{
           fontSize: 12,
           fontWeight: 700,
           padding: "4px 8px",
           borderRadius: 6,
           background: "#d7f5d7",
           border: "1px solid #0a8a0a55",
           whiteSpace: "nowrap",
          }}
          title="Already in your shelf"
         >
          In shelf ✓
         </span>
        </div>
       );
      })
     ) : (
      <div className="search-result-itemss" role="option" aria-disabled="true">
       <em>No matches in your shelf</em>
      </div>
     )}

     {/* --- External results --- */}
     <div className="section-header">Discover</div>
     {filteredResults.length > 0 ? (
      filteredResults.map((book, i) => {
       const key =
        book._id ||
        book.id ||
        book.isbn ||
        `${(book.title || "untitled").trim()}-${(book.author || "na").trim()}-${book.published ?? book.year ?? "y"}-${i}`;

       const inShelf = isInShelf(book);

       return (
        <div key={`res-${key}`} className="search-result-itemss" role="option">
         <div
          onClick={() => onOpenBook?.(book)}
          style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
          title="Open details"
         >
          <div style={{
           fontVariant: "small-caps",
           fontSize: 14,
           fontWeight: 600,
           overflow: "hidden",
           textOverflow: "ellipsis",
           whiteSpace: "nowrap",
          }}>
           {book.title}
          </div>
          {book.author && (
           <div style={{
            fontSize: 12,
            opacity: 0.8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
           }}>
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
      })
     ) : (
      <div className="search-result-itemss" role="option" aria-disabled="true">
       <em>No external results</em>
      </div>
     )}
    </div>
   )}
  </div>
 );
}

export default SearchBar;
