const mainContainer = document.querySelector('main');
const booksContaier = document.querySelector('.book-container');
const allBooks = Array.from(booksContaier.children);
 

function updateShelves() {

  // Clear all existing shelves from the main container at the start of the function
  document.querySelectorAll('.book-shelf').forEach(shelf => shelf.remove());

  // 40px width + 10px gap
  const bookWidth = 40 + 10;
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
    currentShelf.appendChild(book);
  });

}

window.addEventListener("resize", updateShelves);

// Run on load
updateShelves();
