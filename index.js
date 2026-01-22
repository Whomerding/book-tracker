import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});
db.connect();
const books_search_data=[
    {
        "id": "6596.The_Four_Agreements",
        "title": "The Four Agreements: A Practical Guide to Personal Freedom",
        "author": "Miguel Ruiz",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630664059l/6596._SY500_.jpg",
        "rating": "4.19"
    },
    {
        "id": "214151420-the-house-of-my-mother",
        "title": "The House of My Mother: A Daughter's Quest for Freedom",
        "author": "Shari Franke",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1728843692l/214151420._SY500_.jpg",
        "rating": "4.31"
    },
    {
        "id": "7905092-freedom",
        "title": "Freedom",
        "author": "Jonathan Franzen",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1316729686l/7905092._SY500_.jpg",
        "rating": "3.80"
    },
    {
        "id": "318431.Long_Walk_to_Freedom",
        "title": "Long Walk to Freedom",
        "author": "Nelson Mandela",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327997342l/318431._SY500_.jpg",
        "rating": "4.36"
    },
    {
        "id": "24611623-in-order-to-live",
        "title": "In Order to Live: A North Korean Girl's Journey to Freedom",
        "author": "Yeonmi Park",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1437799970l/24611623._SY500_.jpg",
        "rating": "4.48"
    },
    {
        "id": "34964905-the-sun-does-shine",
        "title": "The Sun Does Shine: How I Found Life and Freedom on Death Row",
        "author": "Anthony Ray Hinton",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1591203630l/34964905._SY500_.jpg",
        "rating": "4.65"
    },
    {
        "id": "9021.Long_Walk_to_Freedom",
        "title": "Long Walk to Freedom: Volume 1",
        "author": "Nelson Mandela",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348440647l/9021._SY500_.jpg",
        "rating": "4.37"
    },
    {
        "id": "11797365-escape-from-camp-14",
        "title": "Escape from Camp 14: One Man's Remarkable Odyssey from North Korea to Freedom in the West",
        "author": "Blaine Harden",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347954566l/11797365._SY500_.jpg",
        "rating": "4.01"
    },
    {
        "id": "25330108-freedom-is-a-constant-struggle",
        "title": "Freedom is a Constant Struggle: Ferguson, Palestine and the Foundations of a Movement",
        "author": "Angela Y. Davis",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447140494l/25330108._SY500_.jpg",
        "rating": "4.44"
    },
    {
        "id": "56132724-the-woman-they-could-not-silence",
        "title": "The Woman They Could Not Silence: One Woman, Her Incredible Fight for Freedom, and the Men Who Tried to Make Her Disappear",
        "author": "Kate Moore",
        "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1614685052l/56132724._SY500_.jpg",
        "rating": "4.30"
    }
]


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const results = await db.query("SELECT * FROM books");

    res.render("index.ejs", { books: results.rows });});

app.get("/search", (req, res) => { 
    const query = req.query.book;
    const results = books_search_data
    res.render("search.ejs", { results: results, query: query });
});


app.post("/add", async (req, res) => {
    const { title, author, image, rating, api_book_id } = req.body;

    try {
        await db.query(
            "INSERT INTO books (title, author, cover, official_rating, api_book_id) VALUES ($1, $2, $3, $4, $5)",
            [title, author, image, rating, api_book_id]
        );
        res.redirect("/"); 
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/book/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const result = await db.query("SELECT b.id AS book_id, b.title, b.personal_rating, b.cover, b.official_rating, b.author, b.summary, n.id AS note_id, n.note, n.created_at AS note_created_at FROM books b LEFT JOIN notes n ON b.id = n.book_id WHERE b.id = $1 ORDER BY n.created_at ASC", [bookId]);
        const notes = result.rows.map(row => ({
            id: row.note_id,
            note: row.note,
            created_at: row.note_created_at
        }));
        console.log("Retrieved notes:", notes);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }
        const book = result.rows [0];
            console.log("Retrieved book:", book);
        res.render("book.ejs", { book: book, notes: notes });

    } catch (err) {
        console.error("Error retrieving book:", err);
        res.status(500).send("Internal Server Error");
    }
});     

app.post("/update/:id", async (req, res) => {
    const bookId = req.params.id;
    const {personal_rating, summary, note} = req.body;
  const fields = [];

    const values = [];
    
    let idx = 1;

    if (personal_rating !== undefined) {
      fields.push(`personal_rating = $${idx++}`);
      values.push(personal_rating);
       console.log("fields:", fields);
         console.log("values:", values);
    }

    if (summary !== undefined) {
      fields.push(`summary = $${idx++}`);
      values.push(summary);
    }

    if (fields.length > 0) {
      values.push(bookId);
      await db.query(
        `UPDATE books SET ${fields.join(", ")} WHERE id = $${idx}`,
        values
      );
    }

    if (note && note.trim() !== "") {
      await db.query(
        "INSERT INTO notes (book_id, note, created_at) VALUES ($1, $2, NOW())",
        [bookId, note.trim()]
      );
    }
    res.redirect(`/book/${bookId}`);
  } 
);

app.post("/delete/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        await db.query("DELETE FROM books WHERE id = $1", [bookId]);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/edit/note/:id", async (req, res) => {
    const noteId = req.params.id;
    const { note } = req.body;
   try {
    await db.query("UPDATE notes SET note = $1 WHERE id = $2", [note, noteId]);
        const result = await db.query("SELECT book_id FROM notes WHERE id = $1", [noteId]);
        const bookId = result.rows[0].book_id;
        res.redirect(`/book/${bookId}`);
    } catch (err) {
        console.error("Error editing note:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/delete/note/:id", async (req, res) => {
    const noteId = req.params.id;
    try {
        const result = await db.query("SELECT book_id FROM notes WHERE id = $1", [noteId]);
        if (result.rows.length === 0) {
            return res.status(404).send("Note not found");
        }
        const bookId = result.rows[0].book_id;

        await db.query("DELETE FROM notes WHERE id = $1", [noteId]);
        res.redirect(`/book/${bookId}`);
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).send("Internal Server Error");
    }
});
   app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});