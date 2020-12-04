NOTATKI

GET // http://localhost:3000/notes/:userID //wszystkie notatki użytkownika
GET // http://localhost:3000/notes/:userID/:noteID //jedna notatka o id ................
POST // http://localhost:3000/notes/:userID // notatka dla użytkownika
PATCH // http://localhost:3000/notes/:userID/:noteID {body: [title, value]} // aktualizacja notatki
DELETE // http://localhost:3000/notes/:userID/:noteID // usunięcie notatki Użytkownika

UŻYTKOWNIK

POST // http://localhost:3000/user/signin {body : [email, password]} // logowanie
POST // http://localhost:3000/user/signup {body : [email, password]} // rejestracja
