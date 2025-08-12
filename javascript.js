const mainContainer = document.querySelector('main');
const booksContaier = document.querySelector('.book-container');
const allBooks = []; // For sorting books in shelves
const library = []; //  For storing all book objects
const addBookButton = document.getElementById("add-book");
const cancelButton = document.getElementById("cancel-button");
const dialog = document.querySelector('dialog');
const form = document.getElementById("add-book-form");
 

function updateShelves() {
  // Clear all existing shelves from the main container at the start of the function
  document.querySelectorAll('.book-shelf').forEach(shelf => shelf.remove());

  // width + gap
  const bookWidth = 40 + 2.5;
  const containerWidth = mainContainer.clientWidth + 10;
  const booksPerShelf = Math.floor(containerWidth / bookWidth);
  let currentShelf;

  // If no books can fit, do nothing
  if (booksPerShelf === 0) {
    return;
  }

  // Loop through all books and place them on shelves
  allBooks.forEach((book, index) => {;
    if (index % booksPerShelf === 0) {
      // Create a new shelf if we've filled the current one
      currentShelf = document.createElement('div');
      currentShelf.classList.add('book-shelf');
      booksContaier.appendChild(currentShelf);
    }
    if (currentShelf) {
      currentShelf.appendChild(book);
    }
  });
}

// Book constructor
function Book(title, author, pages, read, id) {

  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = id;
}

function addBookToLibrary(title, author, pages, read, id) {
  id = crypto.randomUUID();
  const book = new Book(title, author, pages, read, id);
  library.push(book);
}

// Add a new book and make it expandable
function addExpandableBook() {
  const newBook = document.createElement("div");
  if (booksContaier.lastChild && booksContaier.lastChild.tagName === "DIV") {
    const bookShelf = booksContaier.lastChild;
    bookShelf.appendChild(newBook);
  }
  else {
    const bookShelf = document.createElement("div");
    booksContaier.appendChild(bookShelf);
    bookShelf.appendChild(newBook);
  }

  allBooks.push(newBook);
  newBook.classList.add("book" + allBooks.length);
  newBook.dataset.id = library[library.length - 1].id;
  updateShelves();

  newBook.addEventListener("click", () => {
    newBook.classList.toggle("book-expanded");

    // Match the div with the object in the library
    const id = newBook.dataset.id;
    const bookObj = library.find(myBook => myBook.id == id);

    if (newBook.classList.contains("book-expanded")) {
      while (newBook.classList.contains("book-spine")) {
        newBook.classList.remove("book-spine");
        newBook.removeChild(newBook.firstChild);
      }
      const title = document.createElement("p");
      title.textContent = "Title: " + bookObj.title;
      const author = document.createElement("p");
      author.textContent = "Author: " + bookObj.author;
      const pages = document.createElement("p");
      pages.textContent = "Pages: " + bookObj.pages;
      const read = document.createElement("p");
      read.textContent = "Read: " + bookObj.read;
      newBook.appendChild(title);
      newBook.appendChild(author);
      newBook.appendChild(pages);
      newBook.appendChild(read);
    }
    else {
      while (newBook.firstChild) {
        newBook.removeChild(newBook.firstChild);
      }
      const title = document.createElement("p");
      newBook.classList.toggle("book-spine");
      title.textContent = bookObj.title;
      newBook.appendChild(title);
    }
  });

  // At first the book spine will show
  const title = document.createElement("p");
  newBook.classList.toggle("book-spine");
  title.textContent = library[library.length - 1].title;
  newBook.appendChild(title);
}

// Form functions
addBookButton.addEventListener("click", () => {
  dialog.showModal();
});
cancelButton.addEventListener("click", () => {
  dialog.close();
});
form.addEventListener('submit', (e) => {
  
  e.preventDefault(); // Prevent the default form submission behavior

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const read = document.getElementById('read').checked;

  addBookToLibrary(title, author, pages, read);

  addExpandableBook();

  dialog.close();
  form.reset();
});

// Run on load
updateShelves();

window.addEventListener("resize", updateShelves);
