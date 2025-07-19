class BookDetails {
  constructor(author, title, numberOfPages, isRead, coverPageBgImg, id, bookRate) {
    this.author = author;
    this.title = title;
    this.numberOfPages = numberOfPages;
    this.isRead = isRead;
    this.coverPageBg = coverPageBgImg;
    this.id = id
    this.bookRate = bookRate
  }
}

const books = [
  new BookDetails("Nandini Nayar","The Story School","45",true,"./images/images-1.jpg", crypto.randomUUID(), 4),
  new BookDetails("Richard Girling","The Longest Story","1902", false,"./images/images-2.jpg",crypto.randomUUID(), 1),
  new BookDetails("Luke Jonah","The Bed BookController of Short Stories","89", true,"./images/images.jpg",crypto.randomUUID(), 5),
  new BookDetails("Julia Debbalisim","The Gruffallo","56", false,"./images/grufallo.jpg",crypto.randomUUID(), 4),
  new BookDetails("The Spookster","Plus A Short","96", true,"./images/plus.jpg",crypto.randomUUID(), 1),
  new BookDetails("Romeo Julieth","At First Sight","1096", false,"./images/sight.jpg",crypto.randomUUID(), 2),
  new BookDetails("Dani Atkins","A Sky Full of Stars","101", false,"./images/sky.jpg",crypto.randomUUID(), 2),
  new BookDetails("Helen Warner","The Story of Our Lives","16", true,"./images/story.jpg",crypto.randomUUID(), 5),
  new BookDetails("Dani Atkins","The Story of Us","90", false,"./images/us.jpg",crypto.randomUUID(), 3),
  new BookDetails("Daniel Errico","When Do Hippos Play","300", true,"./images/when.jpg",crypto.randomUUID(), 2)
];

BookDetails.prototype.updateDetails = function(property, value){
  this[property] = value
}

class BookFinder{
  findIndexOfBookInArr(bookId){
    return books.findIndex((book)=> book.id === bookId )
  }
}
const bookFinder = new BookFinder()

class RateController {
  rateBook({book, bookId, starIndex}){
    book.querySelectorAll('.star').forEach((star)=> star.classList.toggle('fill-star', star.dataset.index <= starIndex));
    const bookInArr = books[bookFinder.findIndexOfBookInArr(bookId)]
    bookInArr.updateDetails("bookRate", starIndex);
  }

  removeAllRating({book, bookId}){
    book.querySelectorAll('.star').forEach((star)=> star.classList.remove('fill-star'));
    const bookInArr = books[bookFinder.findIndexOfBookInArr(bookId)]
    bookInArr.updateDetails("bookRate", 0);
  }
}
const rateController = new RateController()

class ReadStatus {
  getReadStatus(readStatus) {
    return readStatus ? "Read" : "Not read";
  }

  displayReadStatus({book, bookId, readStatus} ){
    book.querySelector('.display-read-status').textContent = this.getReadStatus(readStatus)
    const bookInArr = books[bookFinder.findIndexOfBookInArr(bookId)];
    bookInArr.updateDetails('isRead', readStatus)
  }
}
const readStatus = new ReadStatus()

class FormController {
  clearForm({author, title, numOfPage, readStatus, coverPageBg}){
    author.value = ''
    title.value = ''
    numOfPage.value = ''
    readStatus.checked = false
    coverPageBg.value = ''
  }

  checkIfInputMeetRequirement(dialogBookForm){
    const requiredInput = dialogBookForm.querySelectorAll("input[required]")
    for(const input of requiredInput){
      if(input.value.trim() === '') return 'empty'
      if(input.type === 'number'){
        const num = +input.value
        if(isNaN(num) || typeof num != 'number') return "empty";
      }
    }
  }
}
const formController = new FormController()

class BookController {
  #bookTemplate
  constructor() {
    this.bookContainer = document.querySelector(".book-container");
    this.#bookTemplate = document.querySelector("#book-template");
  }

  addNewBook({ author, title, numOfPage, readStatus, coverPageBg }) {
    books.unshift(
      new BookDetails(author,title,numOfPage,readStatus,coverPageBg,crypto.randomUUID())
    );
    this.addBookToPage(books[0]);
  }

  addBookToPage(bookDetails) {
    const book = this.getBookTemplate();
    const coverPageBgImg = book.querySelector(".cover-page-bg-img");
    const author = book.querySelector(".author");
    const title = book.querySelector(".title");
    const numOfPage = book.querySelector(".num-of-page");
    const isRead = book.querySelector(".read-status");
    const displayReadStatus = book.querySelector(".display-read-status");
    const star = book.querySelector(".star");

    book.id = bookDetails.id;
    coverPageBgImg.style.background = `url(${bookDetails.coverPageBg}) 0 0 / cover no-repeat content-box var(--dark-grey)`;
    author.textContent = bookDetails.author;
    title.textContent = bookDetails.title;
    numOfPage.textContent = bookDetails.numberOfPages;
    isRead.checked = bookDetails.isRead ? true : false;
    displayReadStatus.textContent = readStatus.getReadStatus(isRead.checked);

    if (isRead.checked) {
      const { book, bookId } = this.getBookFromPage(star);
      rateController.rateBook({ book, bookId, starIndex: bookDetails.bookRate });
    } else if (!isRead.checked) {
      const { book, bookId } = this.getBookFromPage(star);
      rateController.removeAllRating({ book, bookId });
    }

    this.bookContainer.insertAdjacentElement("afterBegin", book);
  }

  removeBookInArrAndPage({ book, bookId }) {
    book.remove();
    books.splice(bookFinder.findIndexOfBookInArr(bookId), 1);
  }

  getBookFromPage(target) {
    const book = target.closest(".book");
    return { book, bookId: book.getAttribute("id") };
  }

  getBookTemplate() {
    return this.#bookTemplate.content.querySelector(".book").cloneNode(true);
  }
}

const bookController = new BookController()
books.forEach(bookController.addBookToPage.bind(bookController));

// `extend` Book to have access to `bookContainer`
class Render extends BookController{
  constructor(){
    super()
    this.dialogBookForm = document.querySelector(".dialog-book-form");
    this.bookForm = document.querySelector('.book-form')
  }

  bindEvent(){
    this.bookContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("icon-remove")) {
        const { book, bookId } = bookController.getBookFromPage(e.target);
        bookController.removeBookInArrAndPage({ book, bookId });
      }

      if (e.target.classList.contains("read-status")) {
        const { book, bookId } = bookController.getBookFromPage(e.target);
        readStatus.displayReadStatus({book,bookId,readStatus: e.target.checked,
        });

        if (!e.target.checked) rateController.removeAllRating({ book, bookId });
      }

      if (e.target.classList.contains("star")) {
        const { book, bookId } = bookController.getBookFromPage(e.target);

        if (!books[bookFinder.findIndexOfBookInArr(bookId)].isRead) {
          alert(
            `You have to read "${books[bookFinder.findIndexOfBookInArr(bookId)].title}" before rating it`
          );
          return;
        }
        rateController.rateBook({ book, bookId, starIndex: e.target.dataset.index });
      }

      if (e.target.classList.contains("btn-add-book")) {
        this.dialogBookForm.showModal();
      }
    });

    this.bookForm.addEventListener('click', (e)=>{
      if(e.target.classList.contains('send')){

        if(formController.checkIfInputMeetRequirement(this.dialogBookForm) === 'empty') return

        const [author, title, numOfPage, readStatus, coverPageBg] = this.bookForm.elements
        bookController.addNewBook({author : author.value, title : title.value, numOfPage : numOfPage.value, readStatus : readStatus.checked, coverPageBg : coverPageBg.value})
        this.dialogBookForm.close()
        formController.clearForm({author, title, numOfPage, readStatus, coverPageBg})
      }

      if(e.target.classList.contains('close')){
        this.dialogBookForm.close()
      }
    })
  }
}
(new Render()).bindEvent()