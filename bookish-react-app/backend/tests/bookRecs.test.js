// bookRecs.routes.test.js
// Mock LLM services BEFORE requiring app so routes pick up the mocks.
jest.mock("../services/bookRecs", () => ({
  generateBookRecs: jest.fn(),
  generateSearch: jest.fn(),
}));

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // your Express app
const api = supertest(app);

const Books = require("../models/bookModel");
const User = require("../models/userModel");
const { generateBookRecs, generateSearch } = require("../services/bookRecs");

const mdWithJSON = (obj) => `Here you go:\n\`\`\`json\n${JSON.stringify(obj)}\n\`\`\``;

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "Alice Johnson",
    username: "alicej",
    email: "alice@example.com",
    password: "Abc12345!X", // strong enough for your validator
  });
  token = result.body.token;
});

describe("POST /api/generateBookRecs (generateBookRecsText)", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await Books.deleteMany({});
  });

  it("should 400 when required fields are missing", async () => {
    await api
      .post("/api/generateBookRecs")
      .set("Authorization", "bearer " + token)
      .send({ title: "Dune", author: "Frank Herbert" }) // rating missing
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("should 500 when AI response has no JSON code fence", async () => {
    generateBookRecs.mockResolvedValue("no fenced json here");
    await api
      .post("/api/generateBookRecs")
      .set("Authorization", "bearer " + token)
      .send({ title: "Dune", author: "Frank Herbert", rating: 5 })
      .expect(500)
      .expect("Content-Type", /application\/json/);
  });

  it("should 500 when JSON parsing fails", async () => {
    generateBookRecs.mockResolvedValue("```json\n{ not: 'valid'\n```");
    await api
      .post("/api/generateBookRecs")
      .set("Authorization", "bearer " + token)
      .send({ title: "Dune", author: "Frank Herbert", rating: 5 })
      .expect(500)
      .expect("Content-Type", /application\/json/);
  });

  it("should 400 when no valid recs after filtering", async () => {
    const invalidOnly = [{ title: "A", author: "B", genre: "SF" }]; // missing description/booktheme/published
    generateBookRecs.mockResolvedValue(mdWithJSON(invalidOnly));

    await api
      .post("/api/generateBookRecs")
      .set("Authorization", "bearer " + token)
      .send({ title: "Dune", author: "Frank Herbert", rating: 5 })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("should 201 and insert only valid recs", async () => {
    const valid = {
      title: "Dune Messiah",
      author: "Frank Herbert",
      description: "Sequel exploring politics and prophecy.",
      booktheme: "Power and consequence",
      published: 1969,
      genre: "Science Fiction",
    };
    const invalid = { title: "Half", author: "Nope" }; // filtered out
    generateBookRecs.mockResolvedValue(mdWithJSON([valid, invalid]));

    const res = await api
      .post("/api/generateBookRecs")
      .set("Authorization", "bearer " + token)
      .send({ title: "Dune", author: "Frank Herbert", rating: 5 })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // DB contains exactly the valid one
    const docs = await Books.find({});
    expect(docs).toHaveLength(1);
    expect(docs[0].title).toBe(valid.title);

    // Response echoes saved docs
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe(valid.title);
  });

  it("should 500 when DB insert fails", async () => {
    const valid = {
      title: "Children of Dune",
      author: "Frank Herbert",
      description: "Next generation struggles with destiny.",
      booktheme: "Prophecy vs free will",
      published: 1976,
      genre: "Science Fiction",
    };
    generateBookRecs.mockResolvedValue(mdWithJSON([valid]));
  
    const spy = jest
      .spyOn(Books, "insertMany")
      .mockRejectedValueOnce(new Error("DB error"));
  
    await api
      .post("/api/generateBookRecs")
      .set("Authorization", "bearer " + token)
      .send({ title: "Dune", author: "Frank Herbert", rating: 5 })
      .expect(500)
      .expect("Content-Type", /application\/json/);
  
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
  
});

describe("POST /api/generateSearchRecs (generateSearchText)", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await Books.deleteMany({});
  });

  it("should 400 when required fields are missing", async () => {
    await api
      .post("/api/generateSearchRecs")
      .set("Authorization", "bearer " + token)
      .send({ genre: "Thriller", pageAmount: 300 }) // yearPublished missing
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("should 500 when AI response has no JSON code fence", async () => {
    generateSearch.mockResolvedValue("no fenced json");
    await api
      .post("/api/generateSearchRecs")
      .set("Authorization", "bearer " + token)
      .send({ genre: "Thriller", pageAmount: 300, yearPublished: 2020 })
      .expect(500)
      .expect("Content-Type", /application\/json/);
  });

  it("should 500 when JSON parsing fails", async () => {
    generateSearch.mockResolvedValue("```json\n[ invalid json \n```");
    await api
      .post("/api/generateSearchRecs")
      .set("Authorization", "bearer " + token)
      .send({ genre: "Thriller", pageAmount: 300, yearPublished: 2020 })
      .expect(500)
      .expect("Content-Type", /application\/json/);
  });

  it("should 200 and return [] when JSON is not an array", async () => {
    generateSearch.mockResolvedValue(mdWithJSON({ note: "not an array" }));

    const res = await api
      .post("/api/generateSearchRecs")
      .set("Authorization", "bearer " + token)
      .send({ genre: "Thriller", pageAmount: 300, yearPublished: 2020 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual([]);
    const docs = await Books.find({});
    expect(docs).toHaveLength(0);
  });

  it("should 200 and return search results array (no DB writes)", async () => {
    const list = [
      { title: "The Silent Observer", author: "Amelia Hart" },
      { title: "Echoes of Tomorrow", author: "Daniel Cross" },
    ];
    generateSearch.mockResolvedValue(mdWithJSON(list));

    const res = await api
      .post("/api/generateSearchRecs")
      .set("Authorization", "bearer " + token)
      .send({ genre: "Science Fiction", pageAmount: 350, yearPublished: 2021 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual(list);
    const docs = await Books.find({});
    expect(docs).toHaveLength(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
