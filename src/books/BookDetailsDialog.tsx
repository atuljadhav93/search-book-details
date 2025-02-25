import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewBook, fetchPlaybook, updateBookData } from "../slice/booksSlice";
import { AppDispatch, RootState } from "../store/store";
import "./BookDetailsDialog.css";

interface Book {
  id: number;
  title: string;
  author: string;
  year: string;
  language: string;
  country: string;
  pages: string;
  link: string;
}

interface ModalProps {
  book: Book | null;
  onClose: () => void;
  onSave: (updatedBook: Book) => void;
  isNew?: boolean;
}

const BookDetailsDialog: React.FC<ModalProps> = ({
  book,
  onClose,
  onSave,
  isNew,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { setSearchTerm } = useSelector((state: RootState) => state.books);

  const [editedBook, setEditedBook] = useState<Book>(
    book || {
      id: Date.now(),
      title: "",
      author: "",
      year: "",
      language: "",
      country: "",
      pages: "",
      link: "",
    }
  );

  useEffect(() => {
    setEditedBook((prevBook) => book || prevBook);
  }, [book]);

  // storing book details
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editedBook) return;

    // check condition like adding or edition
    if (isNew) {
      // if user click add bood then hit post API
      dispatch(addNewBook(editedBook));
    } else {
      // if user click edit book details then hit put API
      dispatch(updateBookData(editedBook));
    }

    // after send book details then fetch lated book detils
    if (setSearchTerm?.trim()) {
      setTimeout(() => {
        dispatch(fetchPlaybook(setSearchTerm));
      }, 500);
    }

    onSave(editedBook);
    onClose();
  };

  // check first if all required fields are filled or not
  const isFormValid = Object.values(editedBook).every(
    (value) => typeof value === "string" && value.trim() !== ""
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">
          {isNew ? "Add New Book" : "Edit Book Details"}
        </h2>

        <div className="input-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={editedBook.title}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={editedBook.author}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={editedBook.year}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Language:</label>
          <input
            type="text"
            name="language"
            value={editedBook.language}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={editedBook.country}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Pages:</label>
          <input
            type="text"
            name="pages"
            value={editedBook.pages}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Link:</label>
          <input
            type="text"
            name="link"
            value={editedBook.link}
            onChange={handleChange}
          />
        </div>

        {/* showing only for add book details time */}
        {isNew && (
          <div className="input-group">
            <label>ID:</label>
            <input
              type="text"
              name="id"
              value={editedBook.id === 0 ? "" : editedBook.id}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
          {/* based on condition showing btn title */}
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isNew && !isFormValid}
          >
            {isNew ? "Add Book" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsDialog;
