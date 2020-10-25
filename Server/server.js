const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');

const Reviews = require('../DB/Reviews');

const app = express();
const port = 3004;

const whitelist = ['http://localhost:3004'];

var corsOptions = {
  origin: (origin, cb) => {
    var originCheck = whitelist.indexOf(origin) !== -1;
    cb(null, originCheck);
  },
  credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static(__dirname + '/../Public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/api/reviews', (req, res) => {
  Reviews.find({})
  .then(function(results) {
    res.send(results);
  })
})

app.get('/:id', (req, res) => {
  Reviews.find({ productId : ` ${req.params.id} ` }, function(err, result) {
    if (err) {
      console.log('ERROR')
      throw new Error();
    } else {
      res.sendFile(path.resolve('./Public/index.html'))
    }
  })
});

app.get('/api/reviews/:id', (req, res) => {
  Reviews.find({ productId : ` ${req.params.id} ` }, function(err, result) {
    if (err) {
      console.log('ERROR')
      throw new Error();
    } else {
      res.send(result);
    }
  })
});
//////////////CRUD Operations/////////////////////
// CREATE operation
// app.post('/api/reviews/:id', (req, res) => {
//   Reviews.create(req.body)
//     .then(result => {
//       res.json({id: result._id})
//     })
//     .catch(err => {
//       console.log('following error while procesing POST: ', err);
//       res.status(500);
//       res.send('Internal Server Error');
//     })
// });

// // DELETE operation
// app.delete('/api/reviews/:id', (req, res) => {
//   console.log('DELETE /api/reviews/:id')
//   // this would be the comment id
//   const idToDelete = req.body.id;
//   Reviews.deleteOne({_id: idToDelete})
//     .then(result => {
//       res.json({id: idToDelete})
//     })
//     .catch(err => console.log('following error for delete: ', err));
// });

// // UPDATE operation
// app.put('/api/reviews/:id', (req, res) => {
//   console.log('PUT /api/reviews/:id');
//   Reviews.exists({_id: req.body._id})
//     .then(result => {
//       if (result) {
//         console.log('found the item');
//         return Reviews.replaceOne({_id: req.body._id}, req.body)
//           .then(result => {
//             console.log(result);
//             res.status(200)
//             res.json({id: result._id})
//           })
//       } else {
//         console.log('item not found. creating a new doc');
//         return Reviews.create(req.body)
//           .then(result => {
//             console.log(result);
//             res.status(201);
//             res.json({id: result._id})
//           })
//       }
//     })
//     .catch(err => {
//       console.log('following error occured while trying the PUT operation: ', err)
//       res.status(500);
//       res.send('Internal Server Error');
//     })

// });