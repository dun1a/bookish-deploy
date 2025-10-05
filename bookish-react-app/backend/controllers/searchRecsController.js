const { generateSearch} = require("../services/bookRecs");
console.log("generateSearchRecsText route hit");


// GENERATE SEARCHBAR RECS

const generateSearchText = async (req, res) => {
    try {
      const { genre, pageAmount, yearPublished } = req.body;
  
      if (!genre || !pageAmount || !yearPublished) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const markdownResponse = await generateSearch(
        genre,
        pageAmount,
        yearPublished
      );
  
      const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);
  
  
      if (!jsonMatch) {
        return res.status(500).json({ error: "Invalid response format. No JSON found." });
      }
  
      let searchRecs;
      try {
        searchRecs = JSON.parse(jsonMatch[1]);
  
      } catch (parseError) {
        return res.status(500).json({ error: "Error parsing JSON response." });
      }
  
      res.json(searchRecs);
    } catch (err) {
      console.error("Error in searchbar recs generation:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
  
  module.exports = generateSearchText