const express = require("express");
const path = require("path");
const fs = require("fs");
const database = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'))

app.get("/api/notes", function(req, res) {

  res.json(database);

});

app.get("/api/notes/:id", function(req, res) {
  let chosen = req.params.id;

  for (let i = 0; i < database.length; i++) {
    if (chosen === database[i].id) {
      return res.json(database[i]);
    }
  }

  return res.json(false);

});



app.post("/api/notes", function(req, res) {

  let note = req.body
  let id = "newId" + Math.floor(Date.now() / 1000);
  note.id = id
  console.log(note.id, id)
  
  
  database.push(note)

  fs.writeFile('./db/db.json', JSON.stringify(database), (err) => {
    if (err) throw (err)
    console.log("I work")
  })

  return res.json(note);
});

app.delete('/api/notes/:id', function (req, res) {
  let newId = req.params.id
  const index = database.findIndex( fullData => fullData.id === newId)
  database.splice(index,1)
  fs.writeFile('./db/db.json', JSON.stringify(database), (err) => {
    if (err) throw (err)
    console.log("I work")
  })

  res.json(database)
})

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on http://localhost:" + PORT);
  });