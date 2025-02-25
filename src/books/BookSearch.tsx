import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBooks,
  fetchPlaybook,
  setSortOrder,
  setPage,
  setSearchBookWord,
} from "../slice/booksSlice";
import { AppDispatch, RootState } from "../store/store";
import BookDetailsDialog from "./BookDetailsDialog";
import "./BookSearch.css";

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

const BookSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    setSearchTerm,
    paginatedBooks,
    bookPagination,
    sortOrder,
    currentPage,
    booksData,
  } = useSelector((state: RootState) => state.books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  // store book details
  const [books, setBooks] = useState<Book[]>(paginatedBooks);

  // fetch book details
  useEffect(() => {
    if (setSearchTerm.trim() !== "") {
      dispatch(fetchPlaybook(setSearchTerm));
    }
  }, [setSearchTerm, dispatch]);

  useEffect(() => {
    setBooks(paginatedBooks);
  }, [paginatedBooks]);

  // function for search book details
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchBookWord(value));

    if (value.trim() === "") {
      dispatch(clearBooks());
    }
  };

  // baed on data perfrom ASC or DESC order
  const toggleSortOrder = () => {
    dispatch(setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC"));
  };

  // handle pagination part
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= bookPagination.totalPages) {
      dispatch(setPage(page));
    }
  };

  // open add or edit book details dialog
  const handleOpenModal = (book: Book | null) => {
    if (book === null) {
      setSelectedBook({
        id: 0,
        title: "",
        author: "",
        year: "",
        language: "",
        country: "",
        pages: "",
        link: "",
      });
    } else {
      setSelectedBook(book);
    }
  };

  // close add or edit book details dialog
  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  // save edited book details
  const handleSaveBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );
    setSelectedBook(null);
  };

  return (
    <div className="container">
      <h1 className="title">Search for Book</h1>
      <input
        type="text"
        value={setSearchTerm}
        onChange={handleSearch}
        placeholder="Search for books..."
        className="search-input"
      />

      <div className="button-container">
        {/* if book data is not there then hiding sort btn */}
        {booksData.length > 0 && (
          <button onClick={toggleSortOrder} className="sort-btn">
            Sort: {sortOrder}
          </button>
        )}
        <button className="add-btn" onClick={() => handleOpenModal(null)}>
          Add to Book List
        </button>
      </div>

      {books.length > 0 ? (
        <div>
          {/* shwoing complete book details information */}
          <p className="pagination-info">
            Page {currentPage} of {bookPagination.totalPages} | Total Books:{" "}
            {bookPagination.totalElements}
          </p>
          <table className="book-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Language</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td>{book.language}</td>
                  <td>{book.country}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal(book)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination container */}
          {bookPagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              {[...Array(bookPagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`pagination-btn ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === bookPagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : setSearchTerm ? (
        <p>No results found. Please try searching for something else.</p>
      ) : null}

      {/* add or edit book details component */}
      {selectedBook !== null && selectedBook !== undefined && (
        <BookDetailsDialog
          book={selectedBook}
          onClose={handleCloseModal}
          onSave={handleSaveBook}
          isNew={selectedBook?.id === 0}
        />
      )}
    </div>
  );
};

export default BookSearch;
