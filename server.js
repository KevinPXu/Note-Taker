const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helper/uuid");

//creates a port number and set it to PORT
const PORT = process.env.PORT || 3001;

//creates an express application and instantiates it to app
const app = express();

//middleware that allows express to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware that serves static files from the public directory
app.use(express.static("public"));

//get request that loads the home page index.html file to the page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//get request for the endpoint of /api/notes that loads the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    console.log(data.toString());
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});
//post request to store notes to the db.json file by rewriting the file
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    //pulls the data from the db.json file and pushes the new note to the database as long as all the information has been filled in.
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const fileData = JSON.parse(data);
        fileData.push(newNote);
        noteStorage = fileData;
        //writes the file back to the database file with it in the array
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(fileData, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes!")
        );
      }
    });
    //creates a response object that returns a status and a body of newNote.
    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json("Error in posting notes");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  let storageArr;
  storageArr = JSON.parse(fs.readFileSync("./db/db.json").toString());
  console.log(storageArr);
  const deleted = storageArr.find((note) => note.id === id);
  const newFileData = storageArr.filter((note) => note.id !== id);
  if (deleted) {
    fs.writeFile(
      "./db/db.json",
      JSON.stringify(newFileData, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully deleted note")
    );
    res.status(200).json(deleted);
  } else {
    res.status(404);
  }
});

//listens on the port given above or the one given by heroku
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
