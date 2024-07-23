const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const baseUrl = 'http://localhost:5000/';


// Get the book list available in the shop
public_users.get('/',async (req, res) => {
    const response = await getBooksAsync();
    res.send(JSON.stringify(response, null, 4));
});

const getBooksAsync = async () => {
    try {
        const response = {
            books: books
       };
       return new Promise((resolve) => {
            resolve(response);
        });
    } catch (error) {
        console.error(error.toString());
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const response = await getBookByISBNAsync(isbn);
    res.send(JSON.stringify( response, null, 4));
});

const getBookByISBNAsync = async (isbn) => {
    try {
        const response = books[isbn];
        return new Promise((resolve) => {
            resolve(response);
        });
    } catch (error) {
        console.error(error.toString());
    }
}

// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
    const authorToMatch = req.params.author;
    const matchedBooksByAuthor = await getBooksByAuthorAsync(authorToMatch);

    if (matchedBooksByAuthor && matchedBooksByAuthor.length > 0) {
        const response = {
            booksbyauthor: matchedBooksByAuthor
          };
        res.send(JSON.stringify(response, null, 4));
    } else {
        res.status(404).send({ message: "No books found by " + authorToMatch + "." });
    }
});

const getBooksByAuthorAsync = async (authorToMatch) => {
    try {
        let matchedBooksByAuthor = [];

        for (let key in books) {
            if (books[key].author === authorToMatch) {
                // destructure the book, to remove the author, because in the sample screenshot
                // it is requested to have the result without the author property
                const { author, ...bookWithoutAuthor } = books[key];
    
                //Add isbn, to match how the result is requested in the sample screenshot
                const bookWithISBN = {
                    isbn: key,
                    ...bookWithoutAuthor
                };
                matchedBooksByAuthor.push(bookWithISBN);
            }
        }
        return new Promise((resolve) => {
            resolve(matchedBooksByAuthor);
        });
    } catch (error) {
        console.error(error.toString());
    }
}

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const titleToMatch = req.params.title;
    const matchedBooksByTitle = await getBooksByTitleAsync(titleToMatch);
    if (matchedBooksByTitle && matchedBooksByTitle.length > 0) {
        const response = {
            booksbytitle: matchedBooksByTitle
          };
        res.send(JSON.stringify(response, null, 4));
    } else {
        res.status(404).send({ message: "No books found with title " + titleToMatch + "." });
    }
});

const getBooksByTitleAsync = async (titleToMatch) => {
    try {
        let matchedBooksByTitle = [];

        for (let key in books) {
            if (books[key].title === titleToMatch) {
                // destructure the book, to remove the title, because in the sample screenshot
                // it is requested to have the result without the title property
                const { title, ...bookWithoutTitle} = books[key];

                //Add isbn, to match how the result is requested in the sample screenshot
                const bookWithISBN = {
                isbn: key,
                ...bookWithoutTitle
            }
            matchedBooksByTitle.push(bookWithISBN);
        }

        return new Promise((resolve) => {
            resolve(matchedBooksByTitle);
        })
    }

    } catch (error) {
        console.error(error.toString());
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
      
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).send({ message: "Book not found." });
  }
});

module.exports.general = public_users;
