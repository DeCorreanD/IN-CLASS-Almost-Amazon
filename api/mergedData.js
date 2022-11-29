// for merged promises
import { getSingleAuthor, deleteAuthor } from './authorData';
import { getSingleBook, deleteBook, getBooksByAuthor } from './bookData';

const getBookDetails = (firebaseKey) => new Promise((resolve, reject) => {
  // GET SINGLE BOOK
  getSingleBook(firebaseKey).then((bookObject) => {
    getSingleAuthor(bookObject.author_id)
      .then((authorObject) => resolve({ ...bookObject, authorObject }));
  }).catch(reject);
});

const getAuthorBooks = (firebaseKey) => new Promise((resolve, reject) => {
  getSingleAuthor(firebaseKey).then((author) => {
    getBooksByAuthor(author.firebaseKey)
      .then((authorBooks) => resolve({ ...author, authorBooks }));
  }).catch(reject);
});

const deleteAuthorBooksRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  getBooksByAuthor(firebaseKey).then((booksArray) => {
    const deleteBookPromises = booksArray.map((book) => deleteBook(book.firebaseKey));
    Promise.all(deleteBookPromises).then(() => {
      deleteAuthor(firebaseKey).then(resolve);
    });
  })
    .catch(reject);
});
export { getBookDetails, getAuthorBooks, deleteAuthorBooksRelationship };
