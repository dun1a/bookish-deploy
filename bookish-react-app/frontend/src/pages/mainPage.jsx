// src/pages/MainPage.jsx
import { useContext, useEffect, useState } from "react";
import { BookContext } from "../components/BookContext";
import Bookshelf from "../components/Bookshelf";
import SearchBar from "../components/SearchBar";
import BookModal from "../components/BookModal";
import useSearchBar from "../hooks/useSearchBar";

export default function MainPage() {
  const { books, setBooks } = useContext(BookContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBook, setModalBook] = useState(null);
  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;


  // 🔹 Always pull the latest shelf on page open
  const refreshShelf = async () => {
    try {
      const res = await fetch("/api/bookshelf", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }); if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to refresh shelf:", e);
    }
  };
  useEffect(() => { refreshShelf(); }, []);

  const openModal = (b) => { setModalBook(b); setModalOpen(true); };
  const closeModal = () => { setModalBook(null); setModalOpen(false); };

  const {
    search, setSearch,
    filters, setFilters,
    applyFilters, clearFilters,
    loading, error, results,
    addToShelf, addingId,
  } = useSearchBar({
    onBookAdded: (created) => setBooks((prev) => [created, ...prev]),
    onShelfRefresh: refreshShelf,
  });

  return (
    <main className="mainpage_mainlayout">
    <div className="mainpage_page-layout">

        <SearchBar
          search={search} setSearch={setSearch}
          filters={filters} setFilters={setFilters}
          applyFilters={applyFilters} clearFilters={clearFilters}
          loading={loading} error={error} results={results}
          onAddToShelf={addToShelf} addingId={addingId}
          onOpenBook={openModal}
          shelfBooks={books}
        />
        <Bookshelf />

        {modalOpen && <BookModal book={modalBook} onClose={closeModal} onShelfRefresh={refreshShelf} />}
      </div>
      </main>
      );
}

