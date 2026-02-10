export class Book {
  constructor(title, author, pages, color, read, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.color = color;
    this.read = read;
    this.id = id;
  }
  toggleRead(readButton) {
    if (this.read) {
      readButton.classList.remove('read');
      readButton.classList.add('unread');
      this.read = false;
    } else {
      readButton.classList.remove('unread');
      readButton.classList.add('read');
      this.read = true;
    }
  }
}
