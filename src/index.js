import './styles.css';
import { Book } from './core/Book.js';
import {
  updateShelves,
  toggleBookSpine,
  expandBook,
  contrast,
  linkBookToObject,
} from './core/UI.js';

const mainContainer = document.querySelector('main');
const booksContainer = document.querySelector('.book-container');
const allBooks = []; // For sorting books in shelves
const library = []; //  For storing all book objects
const addBookButton = document.getElementById('add-book');
const cancelButton = document.getElementById('cancel-button');
const dialog = document.querySelector('dialog');
const form = document.getElementById('add-book-form');
const title = document.getElementById('title-text');
const author = document.getElementById('author-text');
const pages = document.getElementById('pages-text');

// Set custom messages whenever the input changes
const inputs = [title, author, pages];

inputs.forEach((input) => {
  input.addEventListener('input', () => {
    // Clear the error message while they type so they can submit again
    input.setCustomValidity('');
  });
});

title.addEventListener('invalid', () => {
  title.setCustomValidity('There is no book without a title eeh!');
});

author.addEventListener('invalid', () => {
  author.setCustomValidity('The book has to be made by someone just like you!');
});

pages.addEventListener('invalid', () => {
  pages.setCustomValidity('No empty books!');
});

function callUpdateShelves() {
  updateShelves(mainContainer, booksContainer, allBooks);
}

function addBookToLibrary(title, author, pages, color, read) {
  const id = crypto.randomUUID();
  const book = new Book(title, author, pages, color, read, id);
  library.push(book);
}

// Add a new book and make it expandable
function addExpandableBook() {
  // Add the book to the shelf
  const newBook = document.createElement('div');
  if (booksContainer.lastChild && booksContainer.lastChild.tagName === 'DIV') {
    // If there's a shelf
    const bookShelf = booksContainer.lastChild;
    bookShelf.appendChild(newBook);
  } else {
    // If there's no shelf
    const bookShelf = document.createElement('div');
    booksContainer.appendChild(bookShelf);
    bookShelf.appendChild(newBook);
  }
  allBooks.push(newBook);
  newBook.dataset.id = library[library.length - 1].id; // Add the object's id to the data-id of the book
  callUpdateShelves();

  // Set the book color
  const bookObj = linkBookToObject(newBook, library);
  newBook.style.backgroundColor = bookObj.color;
  newBook.style.color = contrast(bookObj.color);

  // Add expanding feature
  newBook.addEventListener('click', (e) => {
    if (!e.target.classList.contains('toggle-read')) {
      // makes clicking easier
      expandBook(newBook, library, allBooks, callUpdateShelves);
    }
  });

  // At first the book spine will show
  toggleBookSpine(newBook, library);
}

// Form events
addBookButton.addEventListener('click', () => {
  dialog.showModal();
});
cancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  dialog.close();
});
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const color = document.getElementById('color').value;
  const read = document.getElementById('read').checked;

  // Since it reached here, the browser already confirmed it's valid!
  addBookToLibrary(title.value, author.value, pages.value, color, read);
  addExpandableBook();

  dialog.close();
  form.reset();
});

// Run on load
callUpdateShelves();

// Rearrange with window resize
window.addEventListener('resize', callUpdateShelves);
