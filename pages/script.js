const myLibrary = [];

const unreadText = "Click <em>if</em> you've read the book"
const unreadBtnId = "addToRead"
const readBtnId = 'undo'
const readText = "Click if you've <em>not</em> read"

const btnAddBook = document.querySelector(".btn-add-book");
const main = document.querySelector(".main");
const unread = document.querySelector(".unread");
const read = document.querySelector(".read");
const dialog = document.querySelector('dialog')
const btnCancel = document.querySelector('.btn-cancel')
const btnSubmit = document.querySelector('.btn-submit')

btnAddBook.addEventListener("click", ()=>{
    dialog.showModal();
});

main.addEventListener("click", modifyBook);
btnCancel.addEventListener('click', (e)=>{
    dialog.close(e.target.textContent)
})

dialog.addEventListener('close', submitBookDetails)

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
new addBookToLibrary("Joanne Hichens","The Bed Book of Short Stories",56,"./images/images.jpg");
new addBookToLibrary("Nandini Nayar","The Story School",43,"./images/images-1.jpg");
new addBookToLibrary("Richard Girling","The Longest Story",1560,"./images/images-2.jpg");

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
        
        bookCoverPageImg.style.background = `url(${myLibrary[i].cover_page_img}) 0 0 / cover no-repeat var(--clr-yellow-100)`;
        
        btnRemoveBook.setAttribute("data-remove-book", myLibrary[i].id);
        btnAddToRead.setAttribute("data-button-id", this.btnId);
        
        bookContainer.classList.add("book-container");
        
        bookCoverPage.append(bookTitle, bookAuthor, bookNumOfPage, btnAddToRead, btnRemoveBook);
        bookContainer.append(bookCoverPageImg, bookCoverPage);
        this.isRead.append(bookContainer);
    }
}
// Manual Generated book - Set some book to `unread (Pending)` and some to `read (Completed)` container
let generateUnreadBook, generateReadBook;
while (i < myLibrary.length) {
    if(i > 0){
        generateReadBook = new GenerateBook(read, readText, readBtnId) 
        generateReadBook.generateBook()
    } else {
        generateUnreadBook = new GenerateBook(unread, unreadText, unreadBtnId)
        generateUnreadBook.generateBook()
    }
    i++;
}


function submitBookDetails(e) {
  e.preventDefault()
  if(dialog.returnValue !== 'submit') return
  dialog.returnValue = null
  const form = document.querySelector("form").elements;
  const book = {
    author: form[0].value,
    title: form[1].value,
    num_of_pages: form[2].value,
    isRead: form[3].checked,
    imgCoverPage: form[4].value,
  };

  new addBookToLibrary(book.author,book.title,book.num_of_pages,book.imgCoverPage);
  if(book.isRead){
      generateReadBook.generateBook()
    } else{
      generateUnreadBook.generateBook();
  }
  checkIfUnreadIsEmpty()
  form[0].value = ""
  form[1].value = ""
  form[2].value = ""
  form[3].checked = false
  form[4].value = ""
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
    checkIfUnreadIsEmpty()
    checkIfReadIsEmpty()
}
if (elem.dataset.buttonId == unreadBtnId) {
    const addToRead = new ReadState(read, readBtnId, readText);
    addToRead.applyClone(elem);
    checkIfUnreadIsEmpty()
    checkIfReadIsEmpty()
} else if (elem.dataset.buttonId == readBtnId) {
    const addToUnread = new ReadState(unread, unreadBtnId, unreadText);
    addToUnread.applyClone(elem);
    checkIfUnreadIsEmpty()
    checkIfReadIsEmpty()
  }
}

function Empty(isRead, isSetText){
    this.isRead = isRead
    this.isSetText = isSetText

    this.setText = function(){
        this.isRead.innerHTML = `<div class="empty">&#128722;</div>`
    }
}

let readIsEmpty = new Empty()
function checkIfReadIsEmpty(){
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
function checkIfUnreadIsEmpty(){
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
