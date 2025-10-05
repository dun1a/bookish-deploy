const model = require("./gemini");


const generateBookRecs = async (title, author, rating) => {
  const prompt = `
You are a certified librarian and you are meant to reccomend books according to the input of the user (title, author, rating).
 Based on the user's details, create a **personalized book recommendation**.

### Schema Requirements:
The JSON response should have the following structure:

[
  {
    "title": "title of the book",
      "author": "author's name",
      "genre": "the genre of the book in English",
      "description": "a short description of the book",
      "booktheme": "hex code of a color that represents the theme of the book",
      "published": "the year the book was published"
  }
]

### User Input:
The book name I read was ${title} and the author was ${author}. This is my rating for the book: ${rating} 1 being the lowest
and 5 being the highest. If the rating is below 2, suggest books from at least 4 different genres than this book's genre and none from the same genre of this book.
I would like for you to recommend some book (10 to be exact) that would alighn with my preferences. 
Please take into consideration my rating of the book I read. 

Please:
- Return the response in the exact JSON format above.
`;

  try {
    const result = await model(prompt);
    return result.text;
  } catch (error) {
    throw new Error(error.message);
  }
};



const generateSearch = async (genre, pageAmount, yearPublished) => {

const promptSearch = `
    You are a certified librarian and you are meant to recommend books according to the input of the user (genre, page amount, year published).
    Based on the user's details, create **personalized 50 book recommendations**.
    ### Schema Requirements:
    The JSON response should have the following structure:
    {
      "title": "title of the book",
      "author": "author's name",
      "genre": "the genre of the book in English",
      "description": "a short description of the book",
      "booktheme": "hex code of a color that represents the theme of the book",
      "published": "the year the book was published"
    }
    ### User Input:
    The genre I like is ${genre}, I would like for the books to be around ${pageAmount} pages and published around the year ${yearPublished}.

    Please:
    - Return the response in the exact JSON format above.
    - Give a hex code that represents the theme of the book.
  `

  try {
    const result = await model(promptSearch);
    return result.text;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { generateBookRecs, generateSearch };


//// the because this is connected and will be taken saved stright to the book database, the ai need to generate evey field saved in the bookModel
// "title": "title of the book",
//  "author": "author's name",
//       "genre": "the genre of the book in English",
//       "description": "a short description of the book",
//       "booktheme": "hex code of a color that represents the theme of the book",
//       "published": "the year the book was published"