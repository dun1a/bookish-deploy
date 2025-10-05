const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Bookshelf = require("../models/bookShelfModel");
const User = require("../models/userModel");

const bookshelfs = [
    {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "A story about a woman exploring the infinite possibilities of her life through a magical library.",
        booktheme: "Life choices and regrets",
        genre: "Fiction",
        published: 2020,
        status: "Read",
        notes: [
          {
            title: "First Impression",
            text: "The concept of parallel lives is fascinating. I love the philosophical tone.",
            date: "2024-01-12T10:30:00Z",
            page: 45
          },
          {
            title: "Favorite Quote",
            text: "\"Between life and death there is a library...\"",
            date: "2024-01-15T18:20:00Z",
            page: 102
          }
        ],
        images: [
          {
            src: "https://example.com/midnightlibrarycover.jpg",
            name: "Book Cover"
          }
        ],
        rating: {
          stars: 5,
          review: "Beautifully written and emotionally healing."
        },
        noteAmount: 2
      },
      {
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        description: "An aging Hollywood icon tells her scandalous life story to an unknown journalist.",
        booktheme: "Fame, love, and identity",
        genre: "Historical Fiction",
        published: 2017,
        status: "Reading",
        notes: [
          {
            title: "On Evelyn’s character",
            text: "She’s ruthless but deeply human — I admire her honesty.",
            date: "2024-04-09T09:00:00Z",
            page: 130
          }
        ],
        images: [
          {
            src: "https://example.com/evelynhugo.jpg",
            name: "Evelyn Portrait"
          },
          {
            src: "https://example.com/oldhollywoodset.jpg",
            name: "Hollywood Set"
          }
        ],
        rating: {
          stars: 4,
          review: "So captivating! The pacing drags a little near the end though."
        },
        noteAmount: 1
      },
];
 
// let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "Ode Kallio",
    username: "odecodes",
    email: "ode@example.com",
    password: "ABCabc123!"
  })
//   console.log("BODY: ",result.body)
  token = result.body.token;
  console.log("Token: ", token)
});

describe("Given there are initially some bookshelfs saved", () => {
  beforeEach(async () => {
    await Bookshelf.deleteMany({});
    await Promise.all([
      api
        .post("/api/bookshelfs")
        .set("Authorization", "Bearer " + token)
        .send(bookshelfs[0]),
      api
        .post("/api/bookshelfs")
        .set("Authorization", "Bearer " + token)
        .send(bookshelfs[1]),
    ]);
  });

  it("should return all bookshelfs as JSON when GET /api/bookshelfs is called", async () => {
    await api
      .get("/api/bookshelfs")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one bookshelf when POST /api/bookshelfs is called", async () => {
    const newBookshelf = {
        title: "Paris in 3 Days",
        author: "Ode Kallio",
        description: "A cozy travel journal turned into a short story collection.",
        booktheme: "Adventure and freedom",
        genre: "Contemporary Fiction",
        published: 2025,
        status: "TBR",
        notes: [],
        images: [],
        rating: {
          stars: 0,
          review: "default"
        },
        noteAmount: 0
      };
    await api
      .post("/api/bookshelfs")
      .set("Authorization", "Bearer " + token)
      .send(newBookshelf)
      .expect(201);
  });

  it("should return one bookshelf by ID when GET /api/bookshelfs/:id is called", async () => {
    const bookshelf = await Bookshelf.findOne();
    await api
      .get("/api/bookshelfs/" + bookshelf._id)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one bookshelf by ID when PUT /api/bookshelfs/:id is called", async () => {
    const bookshelf = await Bookshelf.findOne();
    const updatedBookshelf = {
        status: "Read",
        rating: { stars: 5, review: "Loved the writing!" }
      };
    const response = await api
      .put(`/api/bookshelfs/${bookshelf._id}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedBookshelf)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
//     console.log("Response body:", response.body);
  
    const updatedBookshelfCheck = await Bookshelf.findById(bookshelf._id);
    console.log("Updated bookshelf:", updatedBookshelfCheck);
  
    expect(updatedBookshelfCheck.info).toBe(updatedBookshelf.info);
    expect(updatedBookshelfCheck.price).toBe(updatedBookshelf.price);
  });
  

  it("should delete one bookshelf by ID when DELETE /api/bookshelfs/:id is called", async () => {
    const bookshelf = await Bookshelf.findOne();
    await api
      .delete("/api/bookshelfs/" + bookshelf._id)
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const bookshelfCheck = await Bookshelf.findById(bookshelf._id);
    expect(bookshelfCheck).toBeNull();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
