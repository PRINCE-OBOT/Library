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
  new BookDetails("Luke Jonah","The Bed Book of Short Stories","89", true,"./images/images.jpg",crypto.randomUUID(), 5),
  new BookDetails("Julia Debbalisim","The Gruffallo","56", false,"./images/grufallo.jpg",crypto.randomUUID(), 4),
  new BookDetails("The Spookster","Plus A Short","96", true,"./images/plus.jpg",crypto.randomUUID(), 1),
  new BookDetails("Romeo Julieth","At First Sight","1096", false,"./images/sight.jpg",crypto.randomUUID(), 2),
  new BookDetails("Dani Atkins","A Sky Full of Stars","101", false,"./images/sky.jpg",crypto.randomUUID(), 2),
  new BookDetails("Helen Warner","The Story of Our Lives","16", true,"./images/story.jpg",crypto.randomUUID(), 5),
  new BookDetails("Dani Atkins","The Story of Us","90", false,"./images/us.jpg",crypto.randomUUID(), 3),
  new BookDetails("Daniel Errico","When Do Hippos Play","300", true,"./images/when.jpg",crypto.randomUUID(), 2)
];

class FindIndexOfBook{
  findIndexOfBookInArr(bookId){
    return books.findIndex((book)=> book.id === bookId )
  }
}
const findIndexOfBook = new FindIndexOfBook()

class BookRate {
  bookRate({book, bookId, starIndex}){
    book.querySelectorAll('.star').forEach((star)=> star.classList.toggle('fill-star', star.dataset.index <= starIndex));
    books[findIndexOfBook.findIndexOfBookInArr(bookId)].bookRate = starIndex
  }
}
const bookRate = new BookRate()

class ReadStatus {
  getReadStatus(readStatus) {
    return readStatus ? "Read" : "Not read";
  }

  displayReadStatus({book, bookId, readStatus} ){
    book.querySelector('.display-read-status').textContent = this.getReadStatus(readStatus)
    books[findIndexOfBook.findIndexOfBookInArr(bookId)].isRead = readStatus
  }
}
const readStatus = new ReadStatus()

class GetBook {
  constructor(){
    this.bookTemplate = document.querySelector("#book-template");
  }
  
  getBookFromPage(target) {
    const book = target.closest(".book");
    return { book, bookId: book.getAttribute("id") };
  }
  
  getBookFromTemplate(){
    return this.bookTemplate.content.querySelector('.book').cloneNode(true)
  }
}
const getBook = new GetBook()

class RemoveRating{
  removeAllRating({book, bookId}){
    book.querySelectorAll('.star').forEach((star)=> star.classList.remove('fill-star'));
    books[(new FindIndexOfBook).findIndexOfBookInArr(bookId)].bookRate = 0
  }
}
const removeRating = new RemoveRating()
  
class RemoveBook{
    removeBookInArrAndPage({book, bookId}){
    book.remove()
    books.splice(findIndexOfBook.findIndexOfBookInArr(bookId), 1)
  }
}
const removeBook = new RemoveBook()

class CheckRequirement {
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
const checkRequirement = new CheckRequirement()

class Clear {
  clearForm({author, title, numOfPage, readStatus, coverPageBg}){
    author.value = ''
    title.value = ''
    numOfPage.value = ''
    readStatus.checked = false
    coverPageBg.value = ''
  }
}
const clear = new Clear()

class AddBook {
  constructor() {
    this.bookContainer = document.querySelector(".book-container");
  }

  addNewBook({author, title, numOfPage, readStatus, coverPageBg}){
    books.unshift(new BookDetails(author, title, numOfPage, readStatus, coverPageBg, crypto.randomUUID()));
    this.addBookToPage(books[0])
  }

  addBookToPage(bookDetails) {
    const book = getBook.getBookFromTemplate();
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
      const { book, bookId } = getBook.getBookFromPage(star);
      bookRate.bookRate({ book, bookId, starIndex: bookDetails.bookRate });
    } else if (!isRead.checked) {
      const { book, bookId } = getBook.getBookFromPage(star);
      removeRating.removeAllRating({ book, bookId });
    }

    this.bookContainer.insertAdjacentElement("afterBegin", book);
  }
}
const addBook = new AddBook()
books.forEach(addBook.addBookToPage.bind(addBook));

// `extend` AddBOok to have access to `bookContainer`
class Render extends AddBook{
  constructor(){
    super()
    this.dialogBookForm = document.querySelector(".dialog-book-form");
    this.bookForm = document.querySelector('.book-form')
  }

  bindEvent(){
    this.bookContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("icon-remove")) {
        const { book, bookId } = getBook.getBookFromPage(e.target);
        removeBook.removeBookInArrAndPage({ book, bookId });
      }

      if (e.target.classList.contains("read-status")) {
        const { book, bookId } = getBook.getBookFromPage(e.target);
        readStatus.displayReadStatus({book,bookId,readStatus: e.target.checked,
        });

        if (!e.target.checked) removeRating.removeAllRating({ book, bookId });
      }

      if (e.target.classList.contains("star")) {
        const { book, bookId } = getBook.getBookFromPage(e.target);

        if (!books[findIndexOfBook.findIndexOfBookInArr(bookId)].isRead) {
          alert(
            `You have to read "${books[findIndexOfBook.findIndexOfBookInArr(bookId)].title}" before rating it`
          );
          return;
        }
        bookRate.bookRate({ book, bookId, starIndex: e.target.dataset.index });
      }

      if (e.target.classList.contains("btn-add-book")) {
        this.dialogBookForm.showModal();
      }
    });

    this.bookForm.addEventListener('click', (e)=>{
      if(e.target.classList.contains('send')){

        if(checkRequirement.checkIfInputMeetRequirement(this.dialogBookForm) === 'empty') return

        const [author, title, numOfPage, readStatus, coverPageBg] = this.bookForm.elements
        addBook.addNewBook({author : author.value, title : title.value, numOfPage : numOfPage.value, readStatus : readStatus.checked, coverPageBg : coverPageBg.value})
        this.dialogBookForm.close()
        clear.clearForm({author, title, numOfPage, readStatus, coverPageBg})
      }

      if(e.target.classList.contains('close')){
        this.dialogBookForm.close()
      }
    })
  }
}

(new Render()).bindEvent()











