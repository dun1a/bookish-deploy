

const apiUrl1 = 'https://api.finna.fi/api/v1/search?lookfor='; 
const apiUrl2 = '&type=AllFields&field%5B%5D=title&field%5B%5D=images&field%5B%5D=series&field%5B%5D=languages&field%5B%5D=nonPresenterAuthors&field%5B%5D=year&sort=relevance&page=1&limit=1&prettyPrint=true&lng=en-gb'

async function fetchData() {
    try {
    const bookName = "Hohto"
    //const response = await fetch(apiUrl1+{bookName}+apiUrl2)
    const response = await fetch(`https://api.finna.fi/api/v1/search?lookfor=${bookName}&type=Title&field%5B%5D=title&field%5B%5D=nonPresenterAuthors&sort=relevance&page=1&limit=5&prettyPrint=false&lng=fi`)

    if (!response.ok) {
        throw new Error("Could not fetch resource")
    }

    const data = await response.json()
    console.log(data)
    const prettyData = JSON.stringify(data.records, null, 2) // opens arrays and uses pretty print with 2 space indentation
    //res.status(200).json({data})

    console.log(prettyData)

    const gettableData = JSON.parse(prettyData)
    console.log(gettableData)
    const title = gettableData[0].title
    const author = gettableData[0].nonPresenterAuthors[0].name
    //const year = gettableData[0].year
    //const image = gettableData[0].images[0] 
    // need to make a checking function to check if this book has 
    // images and if not, 
    // find the first one that has and is still the same book
    
    console.log(title, author) //, year, image)

    } catch (error) {
        console.error(error)
    }
}

fetchData()

