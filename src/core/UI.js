// Utility functions
export const contrast = (color) => {
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

export function linkBookToObject(newBook, library) {
  const id = newBook.dataset.id;
  const bookObj = library.find((myBook) => myBook.id == id);
  return bookObj;
}

export function updateShelves(mainContainer, booksContainer, allBooks) {
  // Clear all existing shelves from the main container at the start of the function
  document.querySelectorAll('.book-shelf').forEach((shelf) => shelf.remove());

  // width + gap
  const bookWidth = 40 + 5.75;
  const containerWidth = mainContainer.clientWidth + 10;
  const booksPerShelf = Math.floor(containerWidth / bookWidth);
  let currentShelf;

  // If no books can fit, do nothing
  if (booksPerShelf === 0) {
    return;
  }

  // Loop through all books and place them on shelves
  allBooks.forEach((book, index) => {
    if (index % booksPerShelf === 0) {
      // Create a new shelf if we've filled the current one
      currentShelf = document.createElement('div');
      currentShelf.classList.add('book-shelf');
      booksContainer.appendChild(currentShelf);
    }
    // Put the book in the current empty shelf
    if (currentShelf) {
      currentShelf.appendChild(book);
    }
  });
}

export function toggleBookSpine(newBook, library) {
  const bookObj = linkBookToObject(newBook, library);

  newBook.classList.toggle('book-spine');
  const title = document.createElement('p');
  title.textContent = bookObj.title;

  const read = document.createElement('p');
  read.classList.add('toggle-read');
  read.textContent = 'R';
  bookObj.read ? read.classList.add('read') : read.classList.add('unread');
  read.addEventListener('click', (e) => {
    e.stopPropagation();
    bookObj.toggleRead(read);
  });

  newBook.appendChild(title);
  newBook.appendChild(read);
}

export function expandBook(newBook, library, allBooks, updateShelvesCallback) {
  const bookObj = linkBookToObject(newBook, library);

  newBook.classList.toggle('book-expanded');

  if (newBook.classList.contains('book-expanded')) {
    // Expanded book

    while (newBook.firstChild) {
      newBook.classList.remove('book-spine');
      newBook.removeChild(newBook.firstChild); // Remove spine elements
    }

    // Upper section
    const upperDetails = document.createElement('div');
    upperDetails.classList.add('upper-details');
    const title = document.createElement('p');
    title.id = 'title';
    title.textContent = 'Title: ' + bookObj.title;
    const pages = document.createElement('p');
    pages.id = 'pages';
    pages.textContent = 'Pages: ' + bookObj.pages;

    // Remove button for each book
    const removeButton = document.createElement('button');
    removeButton.id = 'remove-button';
    removeButton.textContent = 'X';
    removeButton.style.color = contrast(bookObj.color);
    removeButton.addEventListener('click', () => {
      const id = newBook.dataset.id;
      const index = allBooks.indexOf(newBook);
      if (index > -1) {
        allBooks.splice(index, 1);
      }
      const libraryIndex = library.findIndex((myBook) => myBook.id == id);
      if (libraryIndex > -1) {
        library.splice(libraryIndex, 1);
      }
      newBook.remove();
      updateShelvesCallback();
    });

    // Lower section
    const lowerDetails = document.createElement('div');
    lowerDetails.classList.add('lower-details');
    const read = document.createElement('p');
    read.classList.add('toggle-read');
    read.textContent = 'R';
    bookObj.read ? read.classList.add('read') : read.classList.add('unread');
    read.addEventListener('click', (e) => {
      e.stopPropagation(); // make clicking easier
      bookObj.toggleRead(read);
    });
    const author = document.createElement('p');
    author.textContent = 'Author: ' + bookObj.author;

    // Bind everything
    upperDetails.appendChild(title);
    upperDetails.appendChild(pages);
    upperDetails.appendChild(removeButton);
    lowerDetails.appendChild(read);
    lowerDetails.appendChild(author);
    newBook.appendChild(upperDetails);
    newBook.appendChild(lowerDetails);
  } else if (bookObj) {
    // Book spine

    while (newBook.firstChild) {
      newBook.removeChild(newBook.firstChild); // Remove expanded elements
    }

    toggleBookSpine(newBook, library);
  }
}
