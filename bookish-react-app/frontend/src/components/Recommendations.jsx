import React, { useEffect, useMemo, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import RecommendationBox from "./RecommendationBox";
import "../styles/recommendation.css";
import { BookContext } from "../components/BookContext";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const SEARCH_ENDPOINT = `${API_BASE}/api/search/generate`;
const PAGE_SIZE = 10;

const makeKey = (t = "", a = "Unknown") =>
  `${String(t).trim().toLowerCase()}|${String(a).trim().toLowerCase()}`;

export default function Recommendation() {
  const { state } = useLocation();
  const { books, setBooks } = useContext(BookContext);

  const genre = state?.genre || "Fantasy";
  const pageAmount = Number(state?.pageAmount ?? 300);
  const yearPublished = Number(state?.yearPublished ?? 2015);

  const [allRecs, setAllRecs] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [addingId, setAddingId] = useState("");

  // Auth decleration
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  // track which recs are already added (or get added)
  const [addedKeys, setAddedKeys] = useState(() => {
    const s = new Set();
    (books || []).forEach(b => s.add(makeKey(b.title, b.author)));
    return s;
  });

  // keep addedKeys in sync with shelf
  useEffect(() => {
    const s = new Set();
    (books || []).forEach(b => s.add(makeKey(b.title, b.author)));
    setAddedKeys(s);
  }, [books]);

  const pageRecs = useMemo(() => {
    if (!allRecs.length) return [];
    const end = cursor + PAGE_SIZE;
    if (end <= allRecs.length) return allRecs.slice(cursor, end);
    return [...allRecs.slice(cursor), ...allRecs.slice(0, end - allRecs.length)];
  }, [allRecs, cursor]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(SEARCH_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`, 
           },
          body: JSON.stringify({ genre, pageAmount, yearPublished }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!alive) return;
        setAllRecs(Array.isArray(data) ? data : []);
        setCursor(0);
      } catch (e) {
        console.error("Recommendations fetch failed:", e);
        if (!alive) return;
        setErr("Failed to load recommendations.");
        setAllRecs([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [genre, pageAmount, yearPublished, token]);

  const handleRefresh = () => {
    if (!allRecs.length) return;
    setCursor((c) => (c + PAGE_SIZE) % allRecs.length);
  };

  // --- Add to Shelf (POST /api/bookshelf); no alert, just flip button to "Added" ---
  const addToShelf = async (rec) => {
    const key = makeKey(rec.title, rec.author || "Unknown");
    if (addingId || addedKeys.has(key)) return;

    try {
      setAddingId(key);

      const payload = {
        title: (rec.title || "").trim(),
        author: (rec.author || "Unknown").trim(),
        description: rec.description || "",
        booktheme: rec.booktheme || "",
        genre: rec.genre || "",
        published:
          rec.published != null && !Number.isNaN(Number(rec.published))
            ? Number(rec.published)
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
          // already on shelf → mark as added (no popup)
          setAddedKeys(prev => new Set(prev).add(key));
          return;
        }
        throw new Error(await res.text());
      }

      const created = await res.json();
      setBooks(prev => [created, ...prev]);
      setAddedKeys(prev => new Set(prev).add(key));
    } catch (e) {
      console.error("Add to shelf failed:", e);
      // optional: could show a small inline error, but no alert as requested
    } finally {
      setAddingId("");
    }
  };

  return (
    <section>
      <div className="recommendation-page">
        <div className="recommendation-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".75rem" }}>
          <h1 style={{ margin: 0 }}>Bookish Suggestions</h1>
          <button
            type="button"
            onClick={handleRefresh}
            className="rec-refresh-btn"
            aria-label="Show next 10"
            title="Show next 10"
          >
            Refresh
          </button>
        </div>

        <div className="book-container">
          {loading && <p style={{ padding: "1rem", opacity: 0.7 }}>Loading…</p>}

          {!loading && !!pageRecs.length && pageRecs.map((item, index) => {
            const key = makeKey(item.title, item.author || "Unknown");
            const added = addedKeys.has(key);
            return (
              <RecommendationBox
                key={`${item.title}-${item.author || "na"}-${cursor + index}`}
                title={item.title}
                author={item.author}
                genre={item.genre}
                description={item.description}
                booktheme={item.booktheme}
                published={item.published}
                onAdd={() => addToShelf(item)}
                adding={addingId === key}
                added={added}
              />
            );
          })}

          {!loading && !pageRecs.length && (
            <p style={{ padding: "1rem", opacity: 0.7 }}>
              {err || "No recommendations returned by the service."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
