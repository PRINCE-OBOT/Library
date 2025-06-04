const btn = document.querySelector("button");
const bookContainer = document.querySelector(".book-container");

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
new addBookToLibrary( "J.J Clark", "Tomorrow too far", 56, true, "./images/1.jpeg"
);
new addBookToLibrary("J.J Clark","Tomorrow too far",56,true,"./images/1.jpeg"
);
new addBookToLibrary("J.J Clark","Tomorrow too far",56,true,"./images/1.jpeg"
);

btn.addEventListener("click", handleClick);

let i = 0;
function generateBook() {
  while (i < myLibrary.length) {
    const bookCoverPage = document.createElement("div");
    const bookTitle = document.createElement("h3");
    const btnRemoveBook = document.createElement("button");

    bookTitle.textContent = myLibrary[i].title;
    btnRemoveBook.textContent = "Remove Book";

    btnRemoveBook.setAttribute("data-remove-book", myLibrary[i].id);

    bookCoverPage.classList.add("book-cover-page");

    bookCoverPage.append(bookTitle, btnRemoveBook);
    bookContainer.append(bookCoverPage);
    console.log(i);
    i++;
  }
}

generateBook();

function handleClick() {
  new addBookToLibrary(
    "Prince Obot",
    "Yeah I wanted to change you",
    56,
    true,
    "./images/1.jpeg"
  );
  generateBook();
}

bookContainer.addEventListener("click", modifyBook);

function modifyBook(e) {
  let elem = e.target;
  if (elem.dataset.removeBook) {
    removeBookFromLibrary(elem.dataset.removeBook);
    removeBook(elem)
  }
}

function removeBookFromLibrary(id) {
  for (let j = 0; j < myLibrary.length; j++) {
    if (id === myLibrary[j].id) {
      myLibrary.splice(j, 1);
      i--
      break;
    }
  }
}

function removeBook(elem){
    elem.parentNode.remove()
}

