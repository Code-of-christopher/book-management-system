import {
  renderRegisterPage,
  renderLoginPage,
  renderDashboard,
  renderBookForm,
  renderUserForm,
  renderSearchResults,
} from "./auth.js";
import {
  addBook,
  searchBooksByTitle,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  renewBook,
} from "./books.js";
import { addUser, getUserByUsername, updateUser, deleteUser } from "./users.js";
import { apiCall } from "./api.js";
import "../css/styles.css";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    renderDashboard();
  } else {
    renderLoginPage();
  }

  document.getElementById("app").addEventListener("click", async (e) => {
    if (e.target.id === "show-register-form") {
      renderRegisterPage();
    } else if (e.target.id === "show-login-form") {
      renderLoginPage();
    } else if (e.target.id === "show-dashboard") {
      renderDashboard();
    } else if (e.target.id === "search-button") {
      const searchTerm = document.getElementById("search-input").value;
      try {
        const results = await searchBooksByTitle(searchTerm);
        renderSearchResults(results);
      } catch (error) {
        alert(error.message);
      }
    } else if (e.target.id === "add-book") {
      renderBookForm();
    } else if (e.target.id === "add-user") {
      renderUserForm();
    } else if (e.target.id === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      renderLoginPage();
    } else if (e.target.classList.contains("borrow-book")) {
      const bookId = e.target.dataset.id;
      borrowBook(bookId);
    } else if (e.target.classList.contains("return-book")) {
      const borrowId = e.target.dataset.id;
      returnBook(borrowId);
    } else if (e.target.classList.contains("renew-book")) {
      const borrowId = e.target.dataset.id;
      renewBook(borrowId);
    } else if (e.target.classList.contains("edit-book")) {
      const bookId = e.target.dataset.id;
      try {
        const book = await getBookById(bookId);
        renderBookForm(book);
      } catch (error) {
        alert(error.message);
      }
    } else if (e.target.classList.contains("delete-book")) {
      const bookId = e.target.dataset.id;
      deleteBook(bookId);
    } else if (e.target.classList.contains("edit-user")) {
      const username = e.target.dataset.username;
      try {
        const user = await getUserByUsername(username);
        renderUserForm(user);
      } catch (error) {
        alert(error.message);
      }
    } else if (e.target.classList.contains("delete-user")) {
      const userId = e.target.dataset.id;
      deleteUser(userId);
    }
  });

  document.getElementById("app").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formId = e.target.id;
    if (formId === "register-form") {
      const username = e.target.username.value;
      const password = e.target.password.value;
      const role = e.target.role.value;
      try {
        await apiCall("/auth/register", "POST", {
          username,
          password,
          role,
        });
        alert("Registration successful:");
        renderLoginPage();
      } catch (error) {
        alert(error.message);
      }
    } else if (formId === "login-form") {
      const username = e.target.username.value;
      const password = e.target.password.value;
      try {
        const response = await apiCall("/auth/login", "POST", {
          username,
          password,
        });
        const { token, role, userId } = response;
        alert("Login Successful");
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        renderDashboard();
      } catch (error) {
        alert(error.message);
      }
    } else if (formId === "book-form") {
      const bookData = {
        title: e.target.title.value,
        isbn: e.target.isbn.value,
        publisherId: e.target.publisher_id.value,
        publicationYear: e.target.publication_year.value,
        genreId: e.target.genre_id.value,
        language: e.target.language.value,
        pages: e.target.pages.value,
        description: e.target.description.value,
      };
      const bookId = e.target.dataset.id;
      if (bookId) {
        await updateBook(bookId, bookData);
      } else {
        await addBook(bookData);
      }
    } else if (formId === "user-form") {
      const userData = {
        username: e.target.username.value,
        password: e.target.password.value,
        role: e.target.role.value,
      };
      const userId = e.target.dataset.id;
      if (userId) {
        await updateUser(userId, userData);
      } else {
        await addUser(userData);
      }
    }
  });
});
