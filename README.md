# book-tracker
Personal reading tracker built with Node, Express, EJS, and MySQL. Focused on relational data modeling and API integration.
📚 Book Tracker App

Book Tracker is a full-stack web application that allows users to search for books, build a personal library, and capture their thoughts through ratings, summaries, and notes.
The app is designed to support reflective reading and long-form thinking with a clean, distraction-free interface.

This project prioritizes clarity, usability, and maintainable server-rendered architecture over unnecessary complexity.

✨ Current Features (v1)
🔍 Book Discovery

Search for books via an external books API

View book metadata including:

title

author

cover image

external rating

Add books to a personal library

📚 Personal Library

Responsive grid-based library view

Individual book detail pages

Persistent storage of saved books

✍️ Notes & Summaries

Write and edit a personal summary per book

Add multiple notes per book

Inline editing (read mode ↔ edit mode)

Delete notes with safe redirect flow

Thoughtful empty-state handling

⭐ Ratings

Store a personal rating per book

Display personal rating alongside external rating

🎨 UI / UX

Fully responsive design

Subtle icon-based interactions with hover feedback

Minimal visual design optimized for reading and reflection

Intentional typography and color palette

🔐 Authentication (In Progress)

User authentication is currently being implemented and will include:

User registration and login

Per-user libraries, notes, and summaries

Secure session handling

Authorization checks for edit/delete actions

Authentication is expected to be completed shortly and will mark the transition to v1.1.

🛠 Tech Stack

Frontend

EJS (server-rendered templates)

HTML5 / CSS3

Vanilla JavaScript (UI toggles and interactions)

Backend

Node.js

Express.js

RESTful routing patterns

Server-side rendering

Data

Relational database

Notes, summaries, ratings, and user associations

External Books API integration

🧠 Architectural Highlights

Follows POST → Redirect → GET pattern to prevent duplicate submissions

Server-rendered views for predictable state management

Minimal client-side JavaScript where appropriate

Clean separation between:

data fetching

business logic

presentation

Designed with extensibility in mind

