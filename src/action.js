class Store {
    static getBooks() {
        let internalBooks;
        if(localStorage.getItem('internalBooks') === null) {
            internalBooks = [];
        }
        else {
            internalBooks = JSON.parse(localStorage.getItem('internalBooks'));
        }
        return internalBooks;
    }

    static addBook(book) {
        const internalBooks = Store.getBooks();
        internalBooks.push(book);
        localStorage.setItem('internalBooks', JSON.stringify(internalBooks));
    }

    static removeBook(isbn) {
        const internalBooks = Store.getBooks();
        internalBooks.forEach((book, index) => {
            if(book.isbn === isbn) {
                internalBooks.splice(index, 1);
            }
        });
        localStorage.setItem('internalBooks', JSON.stringify(internalBooks));
    }

    static findBook(bookInput) {
        const internalBooks = Store.getBooks();
        if(internalBooks === undefined || internalBooks.length == 0) {
            return -1;
        }
        else {
            for(let i = 0; i < internalBooks.length; i++) {
                if(internalBooks[i].isbn === bookInput.isbn) {
                    return i;
                } 
            }
        }
        return -1;
    }

    static find(isbn) {
        const internalBooks = Store.getBooks();
        if(internalBooks === undefined || internalBooks.length == 0) {
            return -1;
        }
        else {
            for(let i = 0; i < internalBooks.length; i++) {
                if(internalBooks[i].isbn === isbn) {
                    return i;
                }
            }
        }
        return -1;
    }

    static update(previous_isbn, title, author, isbn) {
        const internalBooks = Store.getBooks();
        const indexValue    = Store.find(previous_isbn); 
        console.log(indexValue);
        if(indexValue !== -1) {
            internalBooks[indexValue].title  = title;
            internalBooks[indexValue].author = author;
            internalBooks[indexValue].isbn   = isbn;
        }
        else {
            console.log('[ERROR] : Error occured')
        }
        localStorage.setItem('internalBooks', JSON.stringify(internalBooks));
    }
}

class Book {
    constructor(title, author, isbn) {
        this.title  = title;
        this.author = author;
        this.isbn   = isbn;
    }
}

class UI {
    static displayBooks() {
        const intenalBooks = Store.getBooks();
        intenalBooks.forEach((book) => UI.addBook(book));
    }

    static addBook(book) {
        const bookList    = document.querySelector('#book-list');
        const tempRow     = document.createElement('tr');
        tempRow.className = 'tbody-row';

        tempRow.innerHTML = `
            <td class = "row-cell">${book.title}</td>
            <td class = "row-cell">${book.author}</td>
            <td class = "row-cell">${book.isbn}</td>
            <td class = "row-cell"><button class="delete">X</button></td>
        `;
        bookList.appendChild(tempRow);
    }

    static removeBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
        else {
            return;
        }
    }

    static cmRemoveBook(target) {
        target.parentElement.remove()   
    }

    static clearFields() {
        document.querySelector('#title').value  = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value   = '';
    }

    static alert(message, popupMode) {
        const alertPopupMessage = document.querySelector('.alert-popup p');
        const alertPopup        = document.querySelector('.alert-popup');
        const alertPopupButton  = document.querySelector('.alert-popup button');

        if(popupMode === 'negative') {
            alertPopup.style.backgroundColor       = '#ef5350';
            alertPopupButton.style.backgroundColor = '#ef5350';
        }

        else if(popupMode === 'positive') {
            alertPopup.style.backgroundColor       = '#4caf50';
            alertPopupButton.style.backgroundColor = '#4caf50'; 
        }

        alertPopupMessage.textContent = message;

        UI.animate(alertPopup, 'flex', 200, .4, 1, -50, 0);         
        setTimeout((e) => alertPopup.style.display = 'none', 2000);
    }

    static animate(javascriptSelect, displayMode, duration_, scaleFrom, scaleTo, yFrom, yTo) {
        const animeObject = popmotion.styler(javascriptSelect);

        popmotion.tween({
            from: {
                scale: scaleFrom,
                y: yFrom
            },
            to: {
                scale: scaleTo,
                y: yTo
            }, 
            duration: duration_
        }).start(animeObject.set);

        javascriptSelect.style.display = displayMode;
    }
}


document.addEventListener('DOMContentLoaded', UI.displayBooks());
document.addEventListener('DOMContentLoaded', UI.clearFields());

// Event Add A Book
const bookForm = document.querySelector('#book-form'); 
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookTitle   = document.querySelector('#title').value;
    const bookAuthor  = document.querySelector('#author').value; 
    const bookISBN    = document.querySelector('#isbn').value;
    
    if(bookTitle === '' || bookAuthor === '' || bookISBN === '') {
        UI.alert('Fill in all inputs', 'negative');
    }
    else {
        const tempBook = new Book(bookTitle, bookAuthor, bookISBN);

        if (Store.findBook(tempBook) == -1) {
            Store.addBook(tempBook);
            UI.addBook(tempBook);
            UI.clearFields();
            UI.alert('Book added', 'positive');
        }
        else {
            UI.alert('This books already exists', 'negative');
        }
    }
});

// Event Pop-Up 
const popupButton = document.querySelector('.alert-popup button');
popupButton.addEventListener('click', (e) => {
    const popupPTag       = document.querySelector('.alert-popup p');
    const popup           = document.querySelector('.alert-popup');
    popup.style.display   = 'none';
    popupPTag.textContent = '';
});

// Event Remove A Book
const bookList = document.querySelector('#book-list');

bookList.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.className === 'delete') {
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        UI.removeBook(e.target);
        UI.alert('Book removed', 'positive');
    }
});

let bookListRow;

const cmRemoveButton = document.querySelector('.cm-item-remove');
cmRemoveButton.addEventListener('click', (e) => {
    UI.cmRemoveBook(bookListRow); 
    UI.alert('Book removed', 'positive');
    Store.removeBook(bookListRow.parentElement.children[2].textContent);
})

// Event Context-Menu
const contextMenu = document.querySelector('.contextMenu');
bookList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.target.className === 'row-cell') {
        contextMenu.style.display = 'block';
        contextMenu.style.left    = `${e.pageX + 10}px`;
        contextMenu.style.top     = `${e.pageY - 50}px`;
    }   
    bookListRow = e.target;
});    

document.addEventListener('click', (e) => {
    contextMenu.style.display = 'none';
})

const overlay        = document.querySelector('.overlay');
const updateBook     = document.querySelector('.update-book');

const updateTitle    = document.querySelector('#update-title');
const updateAuthor   = document.querySelector('#update-author');
const updateIsbn     = document.querySelector('#update-isbn');

const cmUpdateButton = document.querySelector('.cm-item-update');
cmUpdateButton.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.style.display               = 'block';
    updateBook.style.display            = 'block';
    updateTitle.lastElementChild.value  = bookListRow.parentElement.children[0].textContent;
    updateAuthor.lastElementChild.value = bookListRow.parentElement.children[1].textContent;
    updateIsbn.lastElementChild.value   = bookListRow.parentElement.children[2].textContent;
})


const updateSubmit = document.querySelector('#update-button button');
updateSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    pIsbnNumber = bookListRow.parentElement.children[2].textContent;
    title       = updateTitle.lastElementChild.value;
    author      = updateAuthor.lastElementChild.value;
    isbn        = updateIsbn.lastElementChild.value;
    bookListRow.parentElement.children[0].textContent = title;
    bookListRow.parentElement.children[1].textContent = author;
    bookListRow.parentElement.children[2].textContent = isbn;
    Store.update(pIsbnNumber, title, author, isbn);
    overlay.style.display               = 'none';
    updateBook.style.display            = 'none';
    UI.alert('Changes have been made', 'positive');
});

overlay.addEventListener('click', (e) => {
    updateTitle.lastElementChild.value  = '';
    updateAuthor.lastElementChild.value = '';
    updateIsbn.lastElementChild.value   = '';
    overlay.style.display               = 'none';
    updateBook.style.display            = 'none';
});