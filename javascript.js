const mainContainer = document.querySelector('main');
const books = document.querySelectorAll('div[class^="book"]');
const baseShelf = document.querySelector('.book-shelf'); // shelves that start with books

function updateShelves() {

  // Only count the first shelf
    const numberOfBookSpaces = Math.floor(baseShelf.clientWidth / 35.06);

  // How many shelves do we have right now
  let extraShelves = document.querySelectorAll('.new-book-shelf').length;

  // Calculate needed extra shelves
  let neededExtraShelves = Math.ceil(
    Math.max(books.length - numberOfBookSpaces, 0) / Math.max(numberOfBookSpaces, 1)
  );
  
  // Add shelves if needed
  while (extraShelves < neededExtraShelves) {
    const newShelf = document.createElement('section');
    newShelf.classList.add('new-book-shelf');
    mainContainer.appendChild(newShelf);
    extraShelves++;
  }

  // Remove shelves if we have too many
  while (extraShelves > neededExtraShelves) {
    const lastShelf = document.querySelector('.new-book-shelf:last-of-type');
    if (lastShelf) {
      mainContainer.removeChild(lastShelf);
      extraShelves--;
    }
  }
}

window.addEventListener("resize", updateShelves);

// Run on load
updateShelves();
