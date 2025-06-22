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
   new BookDetails("Nandini Nayar","The Story School","45",true,"../image/images-1.jpg", crypto.randomUUID(), 4),
   new BookDetails("Richard Girling","The Longest Story","1902", false,"../image/images-2.jpg",crypto.randomUUID(), 1),
   new BookDetails("Luke Jonah","The Bed Book of Short Stories","89", true,"../image/images.jpg",crypto.randomUUID(), 5)
 ];

  const bookContainer = document.querySelector('.book-container')
  const bookTemplate = document.querySelector("#book-template");
  const dialogBookForm = document.querySelector(".dialog-book-form");
  const bookForm = document.querySelector('.book-form')

books.forEach(addBookToPage)
// functions
function addBookToPage(bookDetails){
    const book = getBookCardTemplateContent(bookTemplate);
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
      bookRate(getBook(star), bookDetails.bookRate)
    } else if(!readStatus.checked){
      removeAllRating(getBook(star))
    }

    bookContainer.insertAdjacentElement('afterBegin',book)
}

function getBookCardTemplateContent(bookTemplate){
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

function getBook(target){
  const book = target.closest('.book')
  return {book, bookId : book.getAttribute('id')}
}

function getReadStatus(readStatus){
  return readStatus ? "Read" : "Not read";
}

function displayReadStatus({book, bookId}, readStatus){
  book.querySelector('.display-read-status').textContent = getReadStatus(readStatus)
  books[findIndexOfBookInArr(bookId)].isRead = readStatus
}

function bookRate({book, bookId}, rate){
  book.querySelectorAll('.star').forEach((star)=> star.classList.toggle('fill-star', star.dataset.index <= rate));
  books[findIndexOfBookInArr(bookId)].bookRate = rate
}
function removeAllRating({book, bookId}){
  const voidRating = 0
  book.querySelectorAll('.star').forEach((star)=> star.classList.remove('fill-star'));
  books[findIndexOfBookInArr(bookId)].bookRate = voidRating
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
    removeBook(getBook(e.target));
  }
  if (e.target.classList.contains("read-status")) {
    displayReadStatus(getBook(e.target), e.target.checked);
    if(!e.target.checked) removeAllRating(getBook(e.target))
  }
  if(e.target.classList.contains('star')){
    const {bookId} = getBook(e.target)
    if (!books[findIndexOfBookInArr(bookId)].isRead) {
      alert("You have to read the book before rating it");
      return;
    } 
    bookRate(getBook(e.target), +e.target.dataset.index)
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