const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: false}))

app.use('/', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

// app.get('/api', (req, res) => {
//     res.send({"Message": "Hello, Joseph"})
// })

// app.get('/', (req, res, next) => {
//     console.log(req.method, req.path, req.ip)
//     next()
//   })

// app.get('/now', (req, res, next) => {
//     req.time = new Date().toString();
//     next();
// }, (req, res) => {
//     res.send({"time": req.time})
// }
// )

// app.get('/:word', (req, res, next) => {
//     let word = req.params.word
//     res.send({"Message": "Can be anything I want too?"})
// })

// app.get('/name', (req, res, next) => {
//     var first = req.query.first;
//     var last = req.query.last;
//     var jsonObj = {'name': first + ' ' + last};
//     res.json(jsonObj).post
//   })

// app.post('/name', (req, res, next) => {
//     var first = req.body.first;
//     var last = req.body.last;
//     var jsonObj = {'name': first + ' ' + last};
//     res.json(jsonObj)
//   })

// Get time based on browser input 
app.get("/api/timestamp/:date_string?", (req, res) => {
  var date_string = req.params.date_string
  
  if(isNaN(date_string)) {
    var regDate = new Date(date_string).toUTCString()
    var uniDate = new Date(date_string).getTime();
  }
  
  res.json({unix: uniDate, utc: regDate});
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
