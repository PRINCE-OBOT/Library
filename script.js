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

  const bookContainer = document.querySelector('.book-container')
  const bookTemplate = document.querySelector("#book-template");
  const dialogBookForm = document.querySelector(".dialog-book-form");
  const bookForm = document.querySelector('.book-form')
  const [author, title, numOfPage, readStatus, coverPageBg] = bookForm.elements;

books.forEach(addBookToPage)
// functions
function addBookToPage(bookDetails){
    const book = getBookFromPageCardTemplateContent(bookTemplate);
    const coverPageBgImg = book.querySelector(".cover-page-bg-img");
    const author = book.querySelector('.author')
    const title = book.querySelector('.title')
    const numOfPage = book.querySelector(".num-of-page");
    const readStatus = book.querySelector(".read-status");
    const displayReadStatus = book.querySelector('.display-read-status')
    const star = book.querySelector('.star')

    book.id = bookDetails.id
    coverPageBgImg.style.background = `url(${bookDetails.coverPageBg}) 0 0 / cover no-repeat content-box var(--dark-grey)`;
    author.textContent = bookDetails.author
    title.textContent = bookDetails.title
    numOfPage.textContent = bookDetails.numberOfPages
    readStatus.checked = bookDetails.isRead ? true : false
    displayReadStatus.textContent = getReadStatus(readStatus.checked)

    if(readStatus.checked){
      const {book, bookId} = getBookFromPage(star)
      bookRate({ book, bookId, starIndex : bookDetails.bookRate });
    } 
    else if(!readStatus.checked){
      const {book, bookId} = getBookFromPage(star)
      removeAllRating({ book, bookId });
    }

    bookContainer.insertAdjacentElement('afterBegin',book)
}

function getBookFromPageCardTemplateContent(bookTemplate){
  return bookTemplate.content.querySelector('.book').cloneNode(true)
}

function addBook({author, title, numOfPage, readStatus, coverPageBg}){
  books.unshift(new BookDetails(author, title, numOfPage, readStatus, coverPageBg, crypto.randomUUID()));
  addBookToPage(books[0])
}

function findIndexOfBookInArr(bookId){
  return books.findIndex((book)=> book.id === bookId )
}

function removeBook({book, bookId}){
  book.remove()
  books.splice(findIndexOfBookInArr(bookId), 1)
}

function getBookFromPage(target){
  const book = target.closest('.book')
  return {book, bookId : book.getAttribute('id')}
}

function getReadStatus(readStatus){
  return readStatus ? "Read" : "Not read";
}

function displayReadStatus({book, bookId, readStatus} ){
  book.querySelector('.display-read-status').textContent = getReadStatus(readStatus)
  books[findIndexOfBookInArr(bookId)].isRead = readStatus
}

function bookRate({book, bookId, starIndex}){
  book.querySelectorAll('.star').forEach((star)=> star.classList.toggle('fill-star', star.dataset.index <= starIndex));
  books[findIndexOfBookInArr(bookId)].bookRate = starIndex
}

function removeAllRating({book, bookId}){
  book.querySelectorAll('.star').forEach((star)=> star.classList.remove('fill-star'));
  books[findIndexOfBookInArr(bookId)].bookRate = 0
}

function checkIfInputMeetRequirement(){
  const requiredInput = dialogBookForm.querySelectorAll("input[required]")
  for(const input of requiredInput){
    if(input.value.trim() === '') return 'empty'
    
    if(input.type === 'number'){
      const num = +input.value
      if(isNaN(num) || typeof num != 'number') return "empty";
    } 
  }
}

function clearInput({author, title, numOfPage, readStatus, coverPageBg}){
  author.value = ''
  title.value = ''
  numOfPage.value = ''
  readStatus.checked = false
  coverPageBg.value = ''
}

// Event Listener for `modifying book`
bookContainer.addEventListener('click', (e)=>{
  if (e.target.classList.contains("icon-remove")) {
    const { book, bookId } = getBookFromPage(e.target); 
    removeBook({ book, bookId });
  }

  if (e.target.classList.contains("read-status")) {
    const { book, bookId } = getBookFromPage(e.target); 
    displayReadStatus({ book, bookId, readStatus: e.target.checked });
   
    if(!e.target.checked) removeAllRating({book, bookId});
  }

  if(e.target.classList.contains('star')){
    const {book, bookId} = getBookFromPage(e.target)
   
    if (!books[findIndexOfBookInArr(bookId)].isRead) {
      alert(`You have to read "${books[findIndexOfBookInArr(bookId)].title}" before rating it`);
      return;
    } 
    bookRate({ book, bookId, starIndex: e.target.dataset.index });
  }
  
  if(e.target.classList.contains('btn-add-book')){
    dialogBookForm.showModal()
  }
})

// Event listener for `book form`
bookForm.addEventListener('click', (e)=>{
  if(e.target.classList.contains('send')){
   
    if(checkIfInputMeetRequirement() === 'empty') return
    
    const [author, title, numOfPage, readStatus, coverPageBg] = bookForm.elements
    addBook({author : author.value, title : title.value, numOfPage : numOfPage.value, readStatus : readStatus.checked, coverPageBg : coverPageBg.value})
    dialogBookForm.close()
    clearInput({author, title, numOfPage, readStatus, coverPageBg})
  }

  if(e.target.classList.contains('close')){
    dialogBookForm.close()
  }
})
