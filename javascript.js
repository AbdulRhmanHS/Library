const mainContainer = document.querySelector('main');
const books = document.querySelectorAll('div[class^="book"]');
const baseShelves = document.querySelectorAll('.book-shelf'); // shelves that start with books
let numberOfBooks = books.length;

function updateShelves() {
  let totalBookSpaces = 0;

  // Only count the shelves that already contain books
  baseShelves.forEach(shelf => {
    const shelfWidth = shelf.clientWidth;
    const numberOfBookSpaces = Math.floor(shelfWidth / 35.06);
    totalBookSpaces += numberOfBookSpaces;
  });

  // How many shelves do we have right now
  let extraShelves = document.querySelectorAll('.new-book-shelf').length;

  // Calculate needed extra shelves
  let neededExtraShelves = Math.ceil(
    Math.max(numberOfBooks - totalBookSpaces, 0) / Math.floor(baseShelves[0].clientWidth / 35.06)
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

  console.log(`Spaces: ${totalBookSpaces}, Extra shelves: ${extraShelves}`);
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateShelves, 0);
});

// Run on load
updateShelves();
