const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered."});
        } else {
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   let isbn = req.params.isbn;
   res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorToMatch = req.params.author;
    let matchedBooksByAuthor = [];

    for (let key in books) {
        if (books[key].author === authorToMatch) {
            matchedBooksByAuthor.push(books[key]);
        }
    }

    if (matchedBooksByAuthor.length > 0) {
        res.send(JSON.stringify(matchedBooksByAuthor, null, 4));
    } else {
        res.status(404).send({ message: 'No books found by ' + authorToMatch + '.' });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titleToMatch = req.params.title;
    let matchedBooksByTitle = [];

    for (let key in books) {
        if (books[key].title === titleToMatch) {
            matchedBooksByTitle.push(books[key]);
        }
    }

    if (matchedBooksByTitle.length > 0) {
        res.send(JSON.stringify(matchedBooksByTitle, null, 4));
    } else {
        res.status(404).send({ message: 'No books found with title ' + titleToMatch + '.' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).send({ message: 'Book not found.' });
  }
});

module.exports.general = public_users;
