const mainContainer = document.querySelector('main');
const booksContaier = document.querySelector('.book-container');
const allBooks = Array.from(booksContaier.children);
const addBookButton = document.getElementById("add-book");
 

function updateShelves() {

  // Clear all existing shelves from the main container at the start of the function
  document.querySelectorAll('.book-shelf').forEach(shelf => shelf.remove());

  // 40px width + 5px gap
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

window.addEventListener("resize", updateShelves);

// Run on load
updateShelves();

// Add a new book and make it expandable
addBookButton.addEventListener("click", () => {
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
  newBook.classList.add("book" + (allBooks.length + 1));
  newBook.textContent = allBooks.length;
  updateShelves();
  newBook.addEventListener("click", () => {
    newBook.classList.toggle("book-expanded");
  });
});
