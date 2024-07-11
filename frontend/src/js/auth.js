import { getBooks } from "./books.js";
import { getUsers } from "./users.js";

export function renderRegisterPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>Register</h2>
    <form id="register-form">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      <label for="role">Role:</label>
      <select id="role" name="role" required>
        <option value="patron">Patron</option>
        <option value="librarian">Librarian</option>
      </select>
      <button type="submit">Register</button>
      <button id="show-login-form">Back to Login</button>
    </form>
    
  `;
}

export function renderLoginPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      <button type="submit">Login</button>
      <button id="show-register-form">Register</button>
    </form>
    
  `;
}

export async function renderDashboard() {
  const app = document.getElementById("app");
  const role = localStorage.getItem("role");
  app.innerHTML = `
    <header>
      <h1>Book Cataloging and Management System</h1>
      <input type="text" id="search-input" placeholder="Enter book title">
      <button id="search-button">Search</button>
      ${role === "librarian" ? '<button id="add-book">Add Book</button>' : ""}
      ${role === "librarian" ? '<button id="add-user">Add User</button>' : ""}
      <button id="logout">Logout</button>
    </header>
    <div id="search-results"></div>
    <div id="book-list"></div>
    <div id="user-list"></div>
  `;

  try {
    const books = await getBooks();
    console.log(books);
    renderBookList(books);

    if (role === "librarian") {
      const users = await getUsers();
      renderUserList(users);
    }
  } catch (error) {
    alert(error.message);
  }
}

export function renderBookForm(book = {}) {
  const role = localStorage.getItem("role");
  if (role !== "librarian") {
    alert("Unauthorized access");
    return;
  }
  const app = document.getElementById("app");
  const {
    id,
    title,
    isbn,
    publisher_id,
    publication_year,
    genre_id,
    language,
    pages,
    description,
  } = book;
  app.innerHTML = `
    <h2>${id ? "Edit" : "Add"} Book</h2>
    <form id="book-form" data-id="${id || ""}">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" value="${
        title || ""
      }" required>
      <label for="isbn">ISBN:</label>
      <input type="text" id="isbn" name="isbn" value="${isbn || ""}" required>
      <label for="publisher_id">Publisher ID:</label>
      <input type="number" id="publisher_id" name="publisher_id" value="${
        publisher_id || ""
      }" required>
      <label for="publication_year">Publication Year:</label>
      <input type="number" id="publication_year" name="publication_year" value="${
        publication_year || ""
      }" required>
      <label for="genre_id">Genre ID:</label>
      <input type="number" id="genre_id" name="genre_id" value="${
        genre_id || ""
      }" required>
      <label for="language">Language:</label>
      <input type="text" id="language" name="language" value="${
        language || ""
      }" required>
      <label for="pages">Pages:</label>
      <input type="number" id="pages" name="pages" value="${
        pages || ""
      }" required>
      <label for="description">Description:</label>
      <textarea id="description" name="description" required>${
        description || ""
      }</textarea>
      <button type="submit">${id ? "Update" : "Add"} Book</button>
    </form>
    <button id="show-dashboard">Back to Dashboard</button>
  `;
}

export function renderUserForm(user = {}) {
  const userRole = localStorage.getItem("role");
  if (userRole !== "librarian") {
    alert("Unauthorized access");
    return;
  }
  const app = document.getElementById("app");
  const { id, username, password, role } = user;
  app.innerHTML = `
    <h2>${id ? "Edit" : "Add"} User</h2>
    <form id="user-form" data-id="${id || ""}">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" value="${
        username || ""
      }" required>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" value="" required>
      <label for="role">Role:</label>
      <select id="role" name="role" required>
        <option value="patron" ${
          role === "patron" ? "selected" : ""
        }>Patron</option>
        <option value="librarian" ${
          role === "librarian" ? "selected" : ""
        }>Librarian</option>
      </select>
      <button type="submit">${id ? "Update" : "Add"} User</button>
    </form>
    <button id="show-dashboard">Back to Dashboard</button>
  `;
}

 export function renderSearchResults(books) {
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const searchResults = document.getElementById("search-results");

  searchResults.innerHTML = `
    <h2>Search Results</h2>
    <table>
      <thead>
        <tr>
          <th>Book</th>
          <th>ISBN</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${books.map(book => `
          <tr>
            <td>${book.title}</td>
            <td>${book.isbn}</td>
            <td>
              ${userRole === "patron" ?
                  (book.borrowId ? 
                      (book.borrowedBy ===  parseInt(userId, 10) ?
                          `<button class="return-book" data-id="${book.borrowId}">Return</button>
                          <button class="renew-book" data-id="${book.borrowId}">Renew</button>`
                          : "Book not available")
                      : `<button class="borrow-book" data-id="${book.id}">Borrow</button>`)
                  : ""}

              ${userRole === "librarian" ?
                `<button class="edit-book" data-id="${book.id}">Edit</button>
                <button class="delete-book" data-id="${book.id}">Delete</button>`
                : ""}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

function renderBookList(books) {
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const bookList = document.getElementById("book-list");

  bookList.innerHTML = `
    <h2>Book List</h2>
    <table>
      <thead>
        <tr>
          <th>Book</th>
          <th>ISBN</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${books.map(book => `
          <tr>
            <td>${book.title}</td>
            <td>${book.isbn}</td>
            <td>
              ${userRole === "patron" ?
                (book.borrowId ? 
                    (book.borrowedBy ===  parseInt(userId, 10) ?
                        `<button class="return-book" data-id="${book.borrowId}">Return</button>
                        <button class="renew-book" data-id="${book.borrowId}">Renew</button>`
                        : "Book not available")
                    : `<button class="borrow-book" data-id="${book.id}">Borrow</button>`)
                : ""}

              ${userRole === "librarian" ?
                `<button class="edit-book" data-id="${book.id}">Edit</button>
                <button class="delete-book" data-id="${book.id}">Delete</button>`
                : ""}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}


function renderUserList(users) {
  const userRole = localStorage.getItem("role");
  const userList = document.getElementById("user-list");

  if (userRole !== "librarian") {
    userList.innerHTML = "";
    return;
  }

  userList.innerHTML = `
    <h2>User List</h2>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user) => `
          <tr>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
              <button class="edit-user" data-username="${user.username}">Edit</button>
              <button class="delete-user" data-id="${user.id}">Delete</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}
