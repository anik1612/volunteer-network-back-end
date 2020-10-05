const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`)
  const volRegisterCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_2}`)
  
  //insert event
  app.post('/addEvent', (req, res) => {
    const event = req.body;
    eventCollection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount)
      })
  })

  //new registration 
  app.post('/volRegister', (req, res) => {
    const volRegisterData = req.body;
    volRegisterCollection.insertOne(volRegisterData)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // event get
  app.get('/events', (req, res) => {
    eventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  // all registered event 
  app.get('/allRegEvents', (req, res) => {
    volRegisterCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // show specific user registered volunteer task
  app.get('/volTasks', (req, res) => {
    volRegisterCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // event delete 
  app.delete('/delete/:id', (req, res) => {
    volRegisterCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

  // registered event delete (admin) 
  app.delete('/deleteRegisteredTask/:id', (req, res) => {
    volRegisterCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

  console.log("database connection established");
});


app.listen(process.env.PORT || port)