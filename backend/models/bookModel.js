import db from "../utils/dbUtils.js";

class Book {
  static add(book, callback) {
    const {
      title,
      isbn,
      publisherId,
      publicationYear,
      genreId,
      language,
      pages,
      description,
    } = book;
    db.run(
      `INSERT INTO books (title, isbn, publisher_id, publication_year, genre_id, language, pages, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        isbn,
        publisherId,
        publicationYear,
        genreId,
        language,
        pages,
        description,
      ],
      function (err) {
        callback(err, this.lastID);
      }
    );
  }

  static searchByTitle(title, callback) {
    db.all(`
      SELECT books.*, borrows.id as borrowId, borrows.user_id as borrowedBy
      FROM books
      LEFT JOIN borrows ON books.id = borrows.book_id AND borrows.return_date IS NULL
      WHERE books.title LIKE ?
    `, [`%${title}%`], (err, rows) => {
      if (err) {
        callback(err); 
      } else {
        callback(null, rows); 
      }
    });
  }
  

  static getAll(callback) {
    db.all(`
      SELECT books.*, borrows.id as borrowId, borrows.user_id as borrowedBy
      FROM books
      LEFT JOIN borrows ON books.id = borrows.book_id AND borrows.return_date IS NULL
    `, [], callback);
  }
  

  static getById(id, callback) {
    db.get(`SELECT * FROM books WHERE id = ?`, [id], callback);
  }

  static update(id, book, callback) {
    const {
      title,
      isbn,
      publisherId,
      publicationYear,
      genreId,
      language,
      pages,
      description,
    } = book;
    db.run(
      `UPDATE books SET title = ?, isbn = ?, publisher_id = ?, publication_year = ?, genre_id = ?, language = ?, pages = ?, description = ? WHERE id = ?`,
      [
        title,
        isbn,
        publisherId,
        publicationYear,
        genreId,
        language,
        pages,
        description,
        id,
      ],
      function (err) {
        if (err) {
          callback(err);
        } else {
          // Retrieve the updated book after update
          Book.getById(id, callback);
        }
      }
    );
  }

  static delete(id, callback) {
    db.run(`DELETE FROM books WHERE id = ?`, [id], callback);
  }
}

export default Book;
