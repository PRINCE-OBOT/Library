const btnAddBook = document.querySelector(".btn-add-book");
const main = document.querySelector(".main");
const unread = document.querySelector(".unread");
const read = document.querySelector(".read");

const myLibrary = [];

function Book(author, title, num_of_pages, isRead, cover_page_img) {
  this.author = author;
  this.title = title;
  this.num_of_pages = num_of_pages;
  this.isRead = isRead;
  this.cover_page_img = cover_page_img;
}

function addBookToLibrary(author, title, num_of_pages, isRead, cover_page_img) {
  Book.call(this, author, title, num_of_pages, isRead, cover_page_img);
  myLibrary.push({
    author: author,
    title: title,
    num_of_pages: num_of_pages,
    isRead: isRead,
    cover_page_img: cover_page_img,
    id: crypto.randomUUID(),
  });
}
new addBookToLibrary("J.J Clark","Tomorrow too far",56,true,"./images/paint.jpeg"
);
new addBookToLibrary("J.J Clark","Tomorrow too far",56,true,"./images/laundry-shoe.jpg"
);
new addBookToLibrary("J.J Clark","Tomorrow too far",56,true,"./images/laundry-cloth.jpg"
);

btnAddBook.addEventListener("click", addBook);

let i = 0;
function generateBook() {
  while (i < myLibrary.length) {
    const bookCoverPage = document.createElement("div");
    const bookContainer = document.createElement("div");
    const bookCoverPageImg = document.createElement("div");
    const bookTitle = document.createElement("h3");
    const btnRemoveBook = document.createElement("button");
    const btnAddToRead = document.createElement("button");
    const checkIsRead = document.createElement("input");

    bookTitle.textContent = myLibrary[i].title;

    bookCoverPageImg.style.background = `url(${myLibrary[i].cover_page_img}) 0 0 / cover no-repeat var(--clr-purple-300)`;

    btnRemoveBook.textContent = "Remove Book";
    btnAddToRead.textContent = "I've Read the Book";

    btnRemoveBook.setAttribute("data-remove-book", myLibrary[i].id);
    btnAddToRead.setAttribute("data-button-id", "addToRead");

    bookContainer.classList.add("book-container");

    bookCoverPage.append(bookTitle, btnAddToRead, btnRemoveBook);
    bookContainer.append(bookCoverPageImg, bookCoverPage);
    unread.append(bookContainer);
    i++;
  }
}

generateBook();

function addBook() {
  new addBookToLibrary(
    "Prince Obot",
    "Yeah I wanted to change you",
    56,
    true,
    "./images/laundry-happy.jpg"
  );
  generateBook();
}

main.addEventListener("click", modifyBook);

function ReadState(isRead, buttonId, text) {
  this.isRead = isRead;
  this.buttonId = buttonId;
  this.text = text
  this.btn = null
  this.cloneBook = null

  this.applyClone = function (elem) {
    this.cloneBook = elem.closest(".book-container").cloneNode(true);
    this.btn = this.cloneBook.querySelector(`[data-button-id]`)
    this.btn.setAttribute("data-button-id", this.buttonId)
    this.btn.textContent = this.text
    this.isRead.append(this.cloneBook)
    elem.closest(".book-container").remove();
  };
}

function modifyBook(e) {
  let elem = e.target;
  if (elem.dataset.removeBook) {
    removeBookFromLibrary(elem.dataset.removeBook);
    elem.closest(".book-container").remove();
  }
  if (elem.dataset.buttonId == "addToRead") {
    const addToRead = new ReadState(read, "undo", 'Undo');
    addToRead.applyClone(elem);
  } else if (elem.dataset.buttonId == "undo") {
    const addToUnread = new ReadState(unread,"addToRead","I've Read the Book"
    );
    addToUnread.applyClone(elem);
  }
}

function removeBookFromLibrary(id) {
  for (let j = 0; j < myLibrary.length; j++) {
    if (id === myLibrary[j].id) {
      myLibrary.splice(j, 1);
      i--;
      break;
    }
  }
}
