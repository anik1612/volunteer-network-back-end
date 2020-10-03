const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.449nt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Welcome from volunteer network server!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volNetwork").collection("volEvents")

  //insert event
  app.post('/addEvent', (req, res) => {
    const event = req.body;
    eventCollection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount)
      })
  })

  app.get('/events', (req, res) => {
    eventCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  console.log("database connection established");
  // client.close();

});


app.listen(process.env.PORT || port)