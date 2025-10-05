import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function BookshelfBooks() {
    const [bookshelfBooks, setBookshelfBooks] = useState("")


    // Auth decleration
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.token : null;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("/api/bookshelfs", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }); if (!response.ok) {
                    throw new Error("Response not okay")
                }
                const data = await response.json();
                setBookshelfBooks(data)
            } catch (err) {
                console.error("Error with fetching bookshelf books", err)
            }
        }
        fetchBooks()
    }, [token])


    return { bookshelfBooks, setBookshelfBooks }

}

export function ThisBook() {

    console.log("thisbook called")
    const [thisBook, setThisBook] = useState("")
    const { bookId } = useParams();
    // Auth decleration
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.token : null;

    console.log("inside this book", bookId)
    useEffect(() => {
        console.log("useeffect called")
        const fetchBook = async () => {
            console.log("fetch called")
            try {
                const response = await fetch("/api/bookshelfs", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }); if (!response.ok) {
                    throw new Error("Error fetching book")
                }
                const data = await response.json()
                setThisBook(data)
                console.log("the book 1: ", thisBook)
            } catch (err) {
                console.error("Error with fetching this book")
            }
        }
        fetchBook()
        console.log("the book: ", thisBook)

    }, [token, thisBook])

    return { thisBook, setThisBook, bookId }

}
