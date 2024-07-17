const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
   const book = books[isbn];
   if(!book){
        return res.status(404).json({ message: "Book not found." });
   }
   
   if(!req.query.review) {
        return res.status(404).json({ message: "Review must be provided." });
   }
   const currentUser = req.session.authorization.username;
   book.reviews[currentUser] = req.query.review;
   res.send( `The review for the book with ISBN ${isbn} has been added/updated.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
   const book = books[isbn];
   if(!book){
        return res.status(404).json({ message: "Book not found." });
   }
   const currentUser = req.session.authorization.username;
   const currentReview = book.reviews[currentUser];
   
   if(!currentReview) {
        return res.status(404).json({ message: "No book review found for the current user." });
   }
   
   delete book.reviews[currentUser];
   res.send( `Reviews for the ISBN ${isbn} posted by the user ${currentUser} deleted.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
