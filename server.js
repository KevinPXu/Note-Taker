const express = require("express");
const path = require("path");
const fs = require("fs");
const noteStorage = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(noteStorage);
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);

  const { title, text } = note;

  if (title && text) {
    const newNote = {
      title,
      text,
      //TODO: may want to add unique id to note
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const fileData = JSON.parse(data);
        fileData.push(newNote);
        noteStorage = fileData;
        fs.writeFile(
          "./db/reviews.json",
          JSON.stringify(fileData, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes!")
        );
      }
    });

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

//app.delete("/api/notes", (req, res));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
