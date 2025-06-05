const btnAddBook = document.querySelector(".btn-add-book");
const main = document.querySelector(".main");
const unread = document.querySelector(".unread");
const read = document.querySelector(".read");
const dialog = document.querySelector('dialog')
const form = document.querySelector('form')

const myLibrary = [];

const unreadText = "Click <em>if</em> you've read the book"
const unreadBtnId = "addToRead"
const readBtnId = 'undo'
const readText = "Undo"

btnAddBook.addEventListener("click", addBook);
main.addEventListener("click", modifyBook);


function Book(author, title, num_of_pages, cover_page_img) {
  this.author = author;
  this.title = title;
  this.num_of_pages = num_of_pages;
  this.cover_page_img = cover_page_img;
}

function addBookToLibrary(author, title, num_of_pages, cover_page_img) {
  Book.call(this, author, title, num_of_pages, cover_page_img);
  myLibrary.push({
    author: author,
    title: title,
    num_of_pages: num_of_pages,
    cover_page_img: cover_page_img,
    id: crypto.randomUUID(),
});
}
new addBookToLibrary("J.J Clark","Tomorrow too far",56,"./images/paint.jpeg");
new addBookToLibrary("J.J Clark","Tomorrow too far",56,"./images/laundry-shoe.jpg");
new addBookToLibrary("J.J Clark","Tomorrow too far",56,"./images/laundry-cloth.jpg");


let i = 0;
function GenerateBook(isRead, text, btnId) {
    this.isRead = isRead
    this.text = text
    this.btnId = btnId

    this.generateBook = function(){
        const bookContainer = document.createElement("div");
        const bookCoverPage = document.createElement("div");
        const bookCoverPageImg = document.createElement("div");
        const bookTitle = document.createElement("h3");
        const bookAuthor = document.createElement('h4')
        const bookNumOfPage = document.createElement('h5')
        const btnRemoveBook = document.createElement("button");
        const btnAddToRead = document.createElement("button");
        
        bookTitle.textContent = `Title: ${myLibrary[i].title}`;
        bookAuthor.textContent = `Author: ${myLibrary[i].author}`
        bookNumOfPage.textContent = `Number of Pages: ${myLibrary[i].num_of_pages}`
        btnRemoveBook.textContent = "Remove Book";
        btnAddToRead.innerHTML = this.text;
        
        bookCoverPageImg.style.background = `url(${myLibrary[i].cover_page_img}) 0 0 / cover no-repeat var(--clr-purple-300)`;
        
        btnRemoveBook.setAttribute("data-remove-book", myLibrary[i].id);
        btnAddToRead.setAttribute("data-button-id", this.btnId);
        
        bookContainer.classList.add("book-container");
        
        bookCoverPage.append(bookTitle, bookAuthor, bookNumOfPage, btnAddToRead, btnRemoveBook);
        bookContainer.append(bookCoverPageImg, bookCoverPage);
        this.isRead.append(bookContainer);
    }
}

let generateUnreadBook;
while (i < myLibrary.length) {
    if(i > 0){
        const generateReadBook = new GenerateBook(read, readText, readBtnId) 
        generateReadBook.generateBook()
    } else {
        generateUnreadBook = new GenerateBook(unread, unreadText, unreadBtnId)
        generateUnreadBook.generateBook()
    }
    i++;
}

function addBook() {
    new addBookToLibrary(
        "Prince Obot",
        "Yeah I wanted to change you but then i wanted to see if the content will stop",
        56,
        "./images/laundry-happy.jpg"
    );
    
    generateUnreadBook.generateBook();
    isUnreadEmpty()
    i++
}


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
    this.btn.innerHTML = this.text
    this.isRead.append(this.cloneBook)
    elem.closest(".book-container").remove();
  };
}

function modifyBook(e) {
  let elem = e.target;
  if (elem.dataset.removeBook) {
    removeBookFromLibrary(elem.dataset.removeBook);
    elem.closest(".book-container").remove();
    isUnreadEmpty()
    isReadEmpty()
}
if (elem.dataset.buttonId == unreadBtnId) {
    const addToRead = new ReadState(read, readBtnId, readText);
    addToRead.applyClone(elem);
    isUnreadEmpty()
    isReadEmpty()
} else if (elem.dataset.buttonId == readBtnId) {
    const addToUnread = new ReadState(unread, unreadBtnId, unreadText);
    addToUnread.applyClone(elem);
    isUnreadEmpty()
    isReadEmpty()
  }
}

function Empty(isRead, isSetText){
    this.isRead = isRead
    this.isSetText = isSetText

    this.setText = function(){
        this.isRead.innerHTML = `<div class="empty">Empty</div>`
    }
}

let readIsEmpty = new Empty()
function isReadEmpty(){
    const readLen = [...read.children].length;
    
    if (readLen == 0) {
        readIsEmpty = new Empty(read, true);
        readIsEmpty.setText();
    } else if (readIsEmpty.isSetText && readLen == 2) {
        readIsEmpty = new Empty(read, false);
        read.querySelector('.empty').remove()
    }
}

let unreadIsEmpty = new Empty()
function isUnreadEmpty(){
    const unreadLen = [...unread.children].length;

    if (unreadLen === 0) {
        unreadIsEmpty = new Empty(unread, true);
        unreadIsEmpty.setText();
    } else if(unreadIsEmpty.isSetText && unreadLen == 2){
        unreadIsEmpty = new Empty(unread, false);
        unread.querySelector('.empty').remove()
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
