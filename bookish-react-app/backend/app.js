// const dotenv = require('dotenv');
// dotenv.config();
// const connectDB = require("./config/db");
// const express = require("express");
// const bookRouter = require("./routes/bookRouter");
// const userRouter = require("./routes/userRouter")

// const { generateSearchText } = require("../controllers/bookRecsControllers");
// // const aiSearchRecs = require('./controllers/searchRecsController');

// const bookshelfRouter = require("./routes/bookshelfRouter");
// const noteRouter = require("./routes/noteRouter");
// const imageRouter = require('../backend/routes/imageRouter');
// const searchRouter = require("./routes/searchRouter");
// const auth = require('./middleware/auth');


// //console.log("Gemini key:", process.env.GEMINI_API_KEY)

// console.log("generateSearchText typeof:", typeof generateSearchText);

// //const {requestLogger,unknownEndpoint,errorHandler} = require("./middleware/customMiddleware");
 
// // express app
// const app = express();

// connectDB();
 
// // middleware
// app.use(express.json());



// app.get("/", (req, res) => res.send("API Running!"));


// // routes for AI book recommendations and search

// app.post('/api/generateBookRecs', generateBookRecsText);
// app.post('/api/generateSearchRecs', generateSearchText);
// app.use("/api/search", searchRouter);


// // app.get('/api/protectedroute', auth, async (req,res) => {
// //   res.status(200).json({message: 'protected route accessed successfully', user: await req.user});
// // })

// // userRouter for all /user routes
// app.use("/api/users", userRouter);

// app.use(auth);
// // bookRouter for all /books routes
// app.use("/api/books", bookRouter); // originally auth is here

// // bookshelfRouter for all /booshelfs
// app.use("/api/bookshelfs", bookshelfRouter);   // literally spent 10 minutes to find this
// app.use("/api/bookshelf", bookshelfRouter);


// // noteRouter for all the /notes routes
// app.use("/api/bookshelfs/notes", noteRouter);

// // imageROuter for all the /images routes
// app.use('/api/bookshelfs/images', imageRouter);

// //app.use(unknownEndpoint);
// //app.use(errorHandler);

// const port = process.env.PORT || 4000;
// app.listen(port, () =>
//   console.log(`Server is running on http://localhost:${port}`)
// );




// backend/app.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const connectDB = require("./config/db");

const bookRouter = require("./routes/bookRouter");
const userRouter = require("./routes/userRouter");
const bookshelfRouter = require("./routes/bookshelfRouter");
const noteRouter = require("./routes/noteRouter");
const imageRouter = require("./routes/imageRouter");
const searchRouter = require("./routes/searchRouter");
// const auth = require("./middleware/auth");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.static('view'));


const {
  generateBookRecsText,
  generateSearchText,
} = require("./controllers/bookRecsControllers");


connectDB();

app.use(express.json({ limit: "2000mb" }));
app.use(express.urlencoded({ extended: true, limit: "2000mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// health
app.get("/", (_req, res) => res.send("API Running!"));

// legacy endpoints (optional)
app.post("/api/generateBookRecs", generateBookRecsText);
app.post("/api/generateSearchRecs", generateSearchText);

// primary search endpoint used by the frontend
app.use("/api/search", searchRouter);

// (optional safety; you can keep or remove this duplicate direct mount)
app.post("/api/search/generate", generateSearchText);

// public routes
app.use("/api/users", userRouter);

// protected (re-enable when needed)
// app.use(auth);
app.use("/api/books", bookRouter);

// bookshelf routes (both for compatibility)
app.use("/api/bookshelf", bookshelfRouter);
app.use("/api/bookshelfs", bookshelfRouter);

// notes & images
app.use("/api/bookshelfs/notes", noteRouter);
app.use("/api/bookshelfs/images", imageRouter);

app.use((req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
module.exports = app;