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

Book.prototype.toggleRead = function(readButton) {
    if (this.read) {
      readButton.classList.remove("read");
      readButton.classList.add("unread");
      this.read = false;
    }
    else {
      readButton.classList.remove("unread");
      readButton.classList.add("read");
      this.read = true;
    }
}

function addBookToLibrary(title, author, pages, read, id) {
  id = crypto.randomUUID();
  const book = new Book(title, author, pages, read, id);
  library.push(book);
}

function linkBookToObject(newBook) {
  const id = newBook.dataset.id;
  const bookObj = library.find(myBook => myBook.id == id);
  return bookObj;
}

function toggleBookSpine(newBook) {
  const bookObj = linkBookToObject(newBook);

  newBook.classList.toggle("book-spine");
  const title = document.createElement("p");
  title.textContent = bookObj.title;

  const read = document.createElement("p");
  read.classList.add("toggle-read");
  read.textContent = "R";
  bookObj.read ? read.classList.add("read") : read.classList.add("unread");
  read.addEventListener("click", (e) => {
    e.stopPropagation();
    bookObj.toggleRead(read);
  });

  newBook.appendChild(title);
  newBook.appendChild(read);
}

function expandBook(newBook) {
  const bookObj = linkBookToObject(newBook);

  newBook.classList.toggle("book-expanded");

  if (newBook.classList.contains("book-expanded")) { // Expanded book

    while (newBook.firstChild) {
      newBook.classList.remove("book-spine");
      newBook.removeChild(newBook.firstChild); // Remove spine elements
    }

    // Upper section
    const upperDetails = document.createElement("div");
    upperDetails.classList.add("upper-details");
    const title = document.createElement("p");
    title.id = "title";
    title.textContent = "Title: " + bookObj.title;
    const pages = document.createElement("p");
    pages.id = "pages";
    pages.textContent = "Pages: " + bookObj.pages;

    // Remove button for each book
    const removeButton = document.createElement("button");
    removeButton.id = "remove-button";
    removeButton.textContent = "X";
    removeButton.addEventListener('click', () => {
      const id = newBook.dataset.id;
      const index = allBooks.indexOf(newBook);
      if (index > -1) {
        allBooks.splice(index, 1);
      }
      const libraryIndex = library.findIndex(myBook => myBook.id == id);
      if (libraryIndex > -1) {
        library.splice(libraryIndex, 1);
      }
      newBook.remove();
      updateShelves();
    });

    // Lower section
    const lowerDetails = document.createElement("div");
    lowerDetails.classList.add("lower-details");
    const read = document.createElement("p");
    read.classList.add("toggle-read");
    read.textContent = "R";
    bookObj.read ? read.classList.add("read") : read.classList.add("unread");
    read.addEventListener("click", (e) => {
        e.stopPropagation(); // make clicking easier
        bookObj.toggleRead(read);
    });
    const author = document.createElement("p");
    author.textContent = "Author: " + bookObj.author;

    // Bind everything
    upperDetails.appendChild(title);
    upperDetails.appendChild(pages);
    upperDetails.appendChild(removeButton);
    lowerDetails.appendChild(read);
    lowerDetails.appendChild(author);
    newBook.appendChild(upperDetails);
    newBook.appendChild(lowerDetails);
  }
  else if (bookObj) { // Book spine

    while (newBook.firstChild) { 
      newBook.removeChild(newBook.firstChild); // Remove expanded elements
    }

    toggleBookSpine(newBook);
  }
}

// Add a new book and make it expandable
function addExpandableBook() {

  // Add the book to the shelf
  const newBook = document.createElement("div");
  if (booksContaier.lastChild && booksContaier.lastChild.tagName === "DIV") { // If there's a shelf
    const bookShelf = booksContaier.lastChild;
    bookShelf.appendChild(newBook);
  }
  else { // If there's no shelf
    const bookShelf = document.createElement("div");
    booksContaier.appendChild(bookShelf);
    bookShelf.appendChild(newBook);
  }
  allBooks.push(newBook);
  newBook.dataset.id = library[library.length - 1].id; // Add the object's id to the data-id of the book 
  updateShelves();

  // Add expanding feature
  newBook.addEventListener("click", (e) => {
    if (!e.target.classList.contains("toggle-read")) { // makes clicking easier
      expandBook(newBook);
    }
  });

  // At first the book spine will show
  toggleBookSpine(newBook);
}

// Form events
addBookButton.addEventListener("click", () => {
  dialog.showModal();
});
cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  dialog.close();
});
form.addEventListener('submit', (e) => {
  
  e.preventDefault(); // Prevent the default form submission behavior

  const title = document.getElementById('title-text').value;
  const author = document.getElementById('author-text').value;
  const pages = document.getElementById('pages-text').value;
  const read = document.getElementById('read').checked;

  addBookToLibrary(title, author, pages, read);

  addExpandableBook();

  // Close the dialog after submitting
  dialog.close();
  form.reset();
});

// Run on load
updateShelves();

// Rearrange with window resize
window.addEventListener("resize", updateShelves);
