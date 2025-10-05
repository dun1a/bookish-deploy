// src/hooks/useSearchBar.jsx
import { useState, useCallback } from "react";

const SEARCH_RECS_URL = "/api/generateSearchRecs"; // or /api/search/generate

const useSearchBar = ({ onBookAdded, onShelfRefresh } = {}) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ genre: "", yearPublished: "", pageAmount: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  
  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const applyFilters = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const payload = {
        genre: (filters.genre || "").trim(),
        yearPublished: Number(filters.yearPublished),
        pageAmount: Number(filters.pageAmount),
      };
      const res = await fetch(SEARCH_RECS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  const clearFilters = useCallback(() => {
    setFilters({ genre: "", yearPublished: "", pageAmount: "" });
    setSearch(""); setResults([]); setError("");
  }, []);

  // ---- addToShelf returns "created" | "exists" | "error"
  const addToShelf = useCallback(async (book) => {
    const key = book._id || book.id || `${book.title}-${book.author}-${book.published}`;
    setAddingId(key);
    try {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 409) {
          // duplicate → pull latest so UI marks it "In shelf"
          onShelfRefresh?.();
          return "exists";
        }
        throw new Error((await res.text()) || `HTTP ${res.status}`);
      }

      const created = await res.json();
      onBookAdded?.(created);
      return "created";
    } catch (e) {
      console.error("Add to shelf failed:", e);
      alert(e?.message || "Failed to add to shelf.");
      return "error";
    } finally {
      setAddingId(null);
    }
  }, [token, onBookAdded, onShelfRefresh]);

  const visibleResults = results.filter((b) =>
    (b.title || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  return {
    search, setSearch,
    filters, setFilters,
    applyFilters, clearFilters,
    loading, error,
    results: visibleResults,
    addToShelf, addingId,
  };
};

export default useSearchBar;
