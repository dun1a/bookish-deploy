// const mongoose = require("mongoose");
// const supertest = require("supertest");
// const app = require("../app"); // Your Express app
// const api = supertest(app);
// const Books = require("../models/bookModel");
// const User = require("../models/userModel");

// const books = [
//   {
//     title: "The Silent Observer",
//     author: "Amelia Hart",
//     description: "A psychological thriller about a woman who uncovers hidden truths in her quiet suburban town.",
//     booktheme: "Secrets and discovery",
//     published: 2021,
//     genre: "Thriller"
//   },
//   {
//     title: "Echoes of Tomorrow",
//     author: "Daniel Cross",
//     description: "A sci-fi adventure exploring time travel, paradoxes, and the cost of rewriting history.",
//     booktheme: "Time and consequence",
//     published: 2019,
//     genre: "Science Fiction"
//   },
// ];
 
// let token = null;

// beforeAll(async () => {
//   await User.deleteMany({});
//   const result = await api.post("/api/users/signup").send({
//     name: "Alice Johnson",
//     username: "alicej",
//     email: "alice@example.com",
//     password: "abcABC1!23321",
//   });
//   token = result.body.token;
// });

// describe("Given there are initially some books saved", () => {
//   beforeEach(async () => {
//     await Books.deleteMany({});
//     await Promise.all([
//       api
//         .post("/api/books")
//         .set("Authorization", "bearer " + token)
//         .send(books[0]),
//       api
//         .post("/api/books")
//         .set("Authorization", "bearer " + token)
//         .send(books[1]),
//     ]);
//   });

//   it("should return all books as JSON when GET /api/books is called", async () => {
//     await api
//       .get("/api/books")
//       .set("Authorization", "bearer " + token)
//       .expect(200)
//       .expect("Content-Type", /application\/json/);
//   });

//   it("should create one book when POST /api/books is called", async () => {
//     const newBook = {
//       title: "Winds of the North",
//         author: "Elena Novak",
//         description: "An epic historical novel set in medieval Europe, following the rise of a warrior queen.",
//         booktheme: "Power and resilience",
//         published: 2018,
//         genre: "Historical Fiction"
//     };
//     await api
//       .post("/api/books")
//       .set("Authorization", "bearer " + token)
//       .send(newBook)
//       .expect(201);
//   });

//   it("should return one book by ID when GET /api/books/:id is called", async () => {
//     const book = await Books.findOne();
//     await api
//       .get("/api/books/" + book._id)
//       .set("Authorization", "bearer " + token)
//       .expect(200)
//       .expect("Content-Type", /application\/json/);
//   });

//   it("should update one book by ID when PUT /api/books/:id is called", async () => {
//     const book = await Books.findOne();
//     const updatedBook = {
//       title: "Updated book information.",
      
//     };
//     const response = await api
//       .put(`/api/books/${book._id}`)
//       .set("Authorization", "bearer " + token)
//       .send(updatedBook)
//       .expect(200)
//       .expect("Content-Type", /application\/json/);
  
//     console.log("Response body:", response.body);
  
//     const updatedBookCheck = await Books.findById(book._id);
//     console.log("Updated book:", updatedBookCheck);
  
//     expect(updatedBookCheck.info).toBe(updatedBook.info);
//     expect(updatedBookCheck.price).toBe(updatedBook.price);
//   });
  

//   it("should delete all books when DELETE /api/books/:id is called", async () => {

//     await api
//       .delete("/api/books/reset")
//       .set("Authorization", "bearer " + token)
//       .expect(200);
//     const bookCheck = await Books.find({});
//     expect(bookCheck).toHaveLength(0);
//   });
// });

// afterAll(() => {
//   mongoose.connection.close();
// });
