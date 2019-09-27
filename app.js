const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();
const mongo = require('mongodb');
const app = express();

app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const port = process.env.PORT || 3000;

const Schema = mongoose.Schema;

const urlSchema = new Schema ({
  id: Number,
  url: String,
});

const urlModel = mongoose.model('Url', urlSchema)

// What we need to survive
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

// Producing the food
app.post("/api/shorturl/new", (req, res, next) => {
  let original = req.body;
  let urlData;

  let urlreggie = /https:\/\/www.|http:\/\/www./g;
  dns.lookup(req.body.url.replace(urlreggie, ''), (err) => {
    if (err) {
      res.json({error: err});
    } else {
      onComplete();
    }
  });
  const onComplete = () => {
    urlModel.find()
      .exec()
      .then(docs => {
        urlData = docs;
        let doc = new urlModel({ "id": urlData.length, "url": req.body.url });
        urlData = urlData.filter((obj) => obj["url"] === req.body.url);
        if (urlData.length === 0) {
          doc.save()
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            res.json({"error": err});
          });
        } else {
          res.json({"original url": urlData[0].url, "Short url": urlData[0].id});
        }
      })
      .catch(err => {
        res.json({"error": err});
      })
  }
});

// Retrieving the food
app.get("/api/shorturl", (req, res, next) => {
  urlModel.find()
    .exec()
    .then(docs => {
      res.json(docs);
    })
    .catch(err => {
      res.json({"error": err});
    })
})

// Putting the food in the foodsack
app.get("/api/shorturl/:shorturl", (req, res, next) => {
  let shorturl = req.params.shorturl;
  urlModel.find({"id": shorturl})
  .exec()
  .then(docs => {
    res.redirect(docs[0]["url"]);
  })
  .catch(err => {
    res.json({"error": err});
  })
});

app.listen(port, () => {
  console.log(`You're on port ${port}`);
})
