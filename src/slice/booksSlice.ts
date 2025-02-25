import { createSlice } from "@reduxjs/toolkit";

interface IBookPagination {
  totalPages: number;
  pageSize: number;
  currentPage: number;
  totalElements: number;
}

interface IBookData {
  author: string;
  country: string;
  language: string;
  link: string;
  pages: string;
  title: string;
  year: string;
  id: number;
}

interface IBookState {
  booksData: IBookData[];
  paginatedBooks: IBookData[];
  bookPagination: IBookPagination;
  isLoading: boolean;
  sortOrder: "ASC" | "DESC";
  currentPage: number;
  pageSize: number;
  setSearchTerm: string;
}

const initialState: IBookState = {
  booksData: [],
  paginatedBooks: [],
  bookPagination: {
    totalPages: 0,
    pageSize: 5,
    currentPage: 1,
    totalElements: 0,
  },
  isLoading: false,
  sortOrder: "ASC",
  currentPage: 1,
  pageSize: 5,
  setSearchTerm: "",
};

const slice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.setSearchTerm = action.payload;
    },
    fetchBooks: (state, action) => {
      state.booksData = action.payload.booksData;
      state.bookPagination = action.payload.bookPagination;
      state.currentPage = 1;
      state.paginatedBooks = action.payload.booksData.slice(0, state.pageSize);
    },
    clearBooks: (state) => {
      state.booksData = [];
      state.paginatedBooks = [];
      state.bookPagination = initialState.bookPagination;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;

      const startIdx = (state.currentPage - 1) * state.pageSize;
      const endIdx = startIdx + state.pageSize;
      const currentPageData = state.booksData.slice(startIdx, endIdx);

      currentPageData.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return state.sortOrder === "ASC"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      });

      state.paginatedBooks = currentPageData;
    },
    // storing current page details
    setPage: (state, action) => {
      state.currentPage = action.payload;
      const startIdx = (state.currentPage - 1) * state.pageSize;
      state.paginatedBooks = state.booksData.slice(
        startIdx,
        startIdx + state.pageSize
      );
    },
    // update paginated books details for the current page only
    updateBook: (state, action) => {
      const updatedBook = action.payload;
      state.booksData = state.booksData.map((book) =>
        book.id === updatedBook.id ? updatedBook : book
      );
      const startIdx = (state.currentPage - 1) * state.pageSize;
      state.paginatedBooks = state.booksData.slice(
        startIdx,
        startIdx + state.pageSize
      );
    },
  },
});

// storing search book keyword
export const setSearchBookWord = (data: string) => async (dispatch: any) => {
  dispatch(slice.actions.setSearchTerm(data));
};

// fetching all the book details data
export const fetchPlaybook = (title: string) => async (dispatch: any) => {
  try {
    const response = await fetch(
      `http://64.227.142.191:8080/application-test-v1.1/books?title=${encodeURIComponent(
        title
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playbook details!");
    }

    const data = await response.json();
    if (data?.data) {
      dispatch(
        slice.actions.fetchBooks({
          booksData: data.data,
          bookPagination: {
            totalPages: Math.ceil(data.data.length / initialState.pageSize),
            pageSize: initialState.pageSize,
            currentPage: 1,
            totalElements: data.data.length,
          },
        })
      );
    }
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch playbook details!"
    );
  }
};

// newly adding book details data
export const addNewBook =
  (book: IBookData) => async (dispatch: any, getState: any) => {
    try {
      const response = await fetch(
        "http://64.227.142.191:8080/application-test-v1.1/books",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(book),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

// updating book details data
export const updateBookData =
  (book: IBookData) => async (dispatch: any, getState: any) => {
    try {
      const response = await fetch(
        `http://64.227.142.191:8080/application-test-v1.1/books/${book.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(book),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();
      dispatch(slice.actions.updateBook(updatedBook));
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

export const { fetchBooks, clearBooks, setSortOrder, setPage, updateBook } =
  slice.actions;
export default slice.reducer;
