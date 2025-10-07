const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Bookshelf = require("../models/bookShelfModel");
const User = require("../models/userModel");

const images = [
  {
    src: "https://example.com/images/cover1.jpg",
    name: "Front Cover",
  },
  {
    src: "https://example.com/images/illustration1.png",
    name: "Chapter 1 Illustration",
  },
];

let token;
let book;

beforeAll(async () => {
  await User.deleteMany({});
  await Bookshelf.deleteMany({});

  // Create a user and get token
  const result = await api.post("/api/users/signup").send({
    name: "Alice Johnson",
    username: "alicej",
    email: "alice@example.com",
    password: "abcABC1!23321",
  });
  token = result.body.token;

  book = await Bookshelf.create({
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "A story about a woman exploring the infinite possibilities of her life through a magical library.",
        booktheme: "Life choices and regrets",
        genre: "Fiction",
        published: 2020,
        status: "Read",
        notes: [],
        images: [],
        rating: {
          stars: 5,
          review: "Beautifully written and emotionally healing."
        },
        noteAmount: 2
    });
  });

describe("Given there are initially some images saved", () => {
  beforeEach(async () => {

    book.images = [];
    await book.save();

    await api
      .post(`/api/bookshelfs/${book._id}/images`)
      .set("Authorization", "bearer " + token)
      .send(images[0]);

    await api
      .post(`/api/bookshelfs/${book._id}/images`)
      .set("Authorization", "bearer " + token)
      .send(images[1]);

    // Refresh book from DB
    book = await Bookshelf.findById(book._id);
  });

  it("should return all images as JSON", async () => {
    const response = await api
      .get(`/api/bookshelfs/${book._id}/images`)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });

  it("should create one image", async () => {
    const newImage = {
      src: "https://example.com/images/backcover.jpg",
      name: "black Cover",
    };

    await api
      .post(`/api/bookshelfs/${book._id}/images`)
      .set("Authorization", "bearer " + token)
      .send(newImage)
      .expect(200);

    const updatedBook = await Bookshelf.findById(book._id);
    expect(updatedBook.images).toHaveLength(3);
    expect(updatedBook.images.map((i) => i.name)).toContain("Back Cover");
  });

  it("should return one image by ID", async () => {
    const image = book.images[0];

    const response = await api
      .get(`/api/bookshelfs/${book._id}/images/${image.id}`)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.name).toBe(image.name);
  });

  it("should update one image by ID", async () => {
    const image = book.images[0];
    const updatedImage = { name: "Updated book information." };

    const response = await api
      .put(`/api/bookshelfs/${book._id}/images/${image._id}`)
      .set("Authorization", "bearer " + token)
      .send(updatedImage)
      .expect(200);

    expect(response.body.name).toBe("Updated book information.");

    const updatedBook = await Bookshelf.findById(book._id);
    expect(updatedBook.images.id(image._id).name).toBe("Updated book information.");
  });

  it("should delete one image by ID", async () => {
    const image = book.images[0];

    await api
      .delete(`/api/bookshelfs/${book._id}/images/${image._id}`)
      .set("Authorization", "bearer " + token)
      .expect(200);

    const updatedBook = await Bookshelf.findById(book._id);
    expect(updatedBook.images.id(image._id)).toBeNull();
  });
});



afterAll(async () => {
  await mongoose.connection.close();

})