const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const baseUrl = 'http://localhost:5000/';


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const response = {
        books: books
      };
    res.send(JSON.stringify(response, null, 4));
});

const getBooksAsync = async () => {
    try {
        const response = await axios.get(baseUrl);
        const books = response.data;
        console.log(books);
    } catch (error) {
        console.error(error.toString());
    }
}

// getBooksAsync();

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 4));
});

const getBookByISBNAsync = async (isbn) => {
    try {
        const response = await axios.get(`${baseUrl}isbn/${isbn}`);
        const books = response.data;
        console.log(books);
    } catch (error) {
        console.error(error.toString());
    }
}

// getBookByISBNAsync(1);

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorToMatch = req.params.author;
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

    if (matchedBooksByAuthor.length > 0) {
        const response = {
            booksbyauthor: matchedBooksByAuthor
          };
        res.send(JSON.stringify(response, null, 4));
    } else {
        res.status(404).send({ message: "No books found by " + authorToMatch + "." });
    }
});

const getBooksByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`${baseUrl}author/${author}`);
        const books = response.data;
        console.log(books);
    } catch (error) {
        console.error(error.toString());
    }
}
// getBooksByAuthorAsync("Dante Alighieri");

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titleToMatch = req.params.title;
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
    }

    if (matchedBooksByTitle.length > 0) {
        const response = {
            booksbytitle: matchedBooksByTitle
          };
        res.send(JSON.stringify(response, null, 4));
    } else {
        res.status(404).send({ message: "No books found with title " + titleToMatch + "." });
    }
});

const getBooksByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`${baseUrl}title/${title}`);
        const books = response.data;
        console.log(books);
    } catch (error) {
        console.error(error.toString());
    }
}
// getBooksByTitleAsync("Fairy tales")


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
