// src/components/AddBookButton.jsx
import "../styles/mainPage.css";

function AddBookButton({ inline, onClick }) {
  return inline ? (
    <button className="inline-add-btn" onClick={onClick}>
      ➕
    </button>
  ) : (
    <button className="floating-add-btn" onClick={onClick}>
      ➕
    </button>
  );
}

export default AddBookButton;
