const testData = {
  title: "The Matrix",
  type: "MOVIE",
  genre: "Sci-Fi",
};

fetch("http://localhost:3000/api/media", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testData),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
