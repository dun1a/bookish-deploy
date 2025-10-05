import { createContext, useContext, useEffect, useState, useCallback } from "react";

export const BookContext = createContext({
  books: [],
  setBooks: () => { },
  loading: false,
  error: null,
  refreshBooks: async () => { },
});

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const refreshBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookshelfs", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }); if (!res.ok) throw new Error("Failed to fetch bookshelf");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  return (
    <BookContext.Provider value={{ books, setBooks, loading, error, refreshBooks }}>
      {children}
    </BookContext.Provider>
  );
}

export const useBooks = () => useContext(BookContext);
