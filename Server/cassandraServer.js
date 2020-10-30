require('dotenv').config();
require('newrelic');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cassandra = require('cassandra-driver');
const { v4 } = require('uuid');
const port = process.env.WEBSERVERPORT;

const app = express();

const whitelist = ['http://localhost:3000'];
var corsOptions = {
  origin: (origin, cb) => {
    var originCheck = whitelist.indexOf(origin) !== -1;
    cb(null, originCheck);
  },
  credentials: true
}
app.use(cors(corsOptions))

app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/../Public'))
app.use('/:id', express.static(__dirname + '/../Public'));

const client = new cassandra.Client({
  contactPoints: [process.env.CONTACTPOINTS],
  keyspace: process.env.KEYSPACE,
  localDataCenter: process.env.LOCALDATACENTER
});

app.listen(port, () => {
  console.log('///////////////////////////////////////////////////////////////////')
  console.log(' Tarjay Reviews service running on port: ', port, 'with Cassandra');
  console.log('///////////////////////////////////////////////////////////////////')
})

app.get('/api/reviews/:id', async (req, res) => {
  let id = req.params.id;
  if (id === undefined) {
    id = 1;
  }
  console.log('id: ', id);
  const dbResult = await client.execute(`select * from tarjay_reviews where product_id=${id} limit 30`);
  const result = await dbResult.rows.map(val => {
    return ({
      _id: val.id,
      author: val.author,
      stars: val.stars,
      body: val.body,
      createdAt: val.created_at,
      wouldRecommend: val.would_recommend,
      title: val.title,
      comfort: val.comfort,
      style: val.style,
      value: val.value,
      sizing: val.sizing,
      photos: val.photos,
      helpfulVotes: val.helpful_votes,
      productId: val.product_id
    })
  })
  // console.log(await result);
  res.send(await result);
});

app.post('/api/reviews/', async (req, res) => {
  const data = req.body;
  let jsDate = new Date();
  let date = `${jsDate.getFullYear()}-${
    jsDate.getMonth().toString.length === 1 ? '0'+jsDate.getMonth() : jsDate.getMonth()
  }-${jsDate.getDate()}`;
  console.log('date: ', date);
  let time = `${jsDate.getHours()}:${jsDate.getMinutes()}:${jsDate.getSeconds()}.${jsDate.getMilliseconds()}`;
  id = v4();

  let updateQuery = `
  UPDATE tarjay_reviews
  SET
    stars = ${data.stars},
    body = '${data.body}',
    would_recommend = ${data.wouldRecommend},
    title = '${data.title}',
    comfort = ${data.comfort},
    style = ${data.style},
    value = ${data.value},
    sizing = ${data.sizing},
    helpful_votes = ${data.helpfulVotes}
  WHERE
    product_id = ${data.productId} AND
    created_at = '${data.createdAt}' AND
    created_at_timestamp = '${data.createdAtTimeStamp}' AND
    author = '${data.author}' AND
    id = ${data.id}
  `

  let insertQuery = `
    INSERT INTO tarjay_reviews (
      id, created_at, created_at_timestamp,
      author, stars, body, would_recommend,
      title, comfort, style, value, sizing,
      helpful_votes, product_id
    ) VALUES (
      ${data.id},
      '${data.createdAt}',
      '${data.createdAtTimeStamp}',
      '${data.author}',
      ${data.stars},
      '${data.body}',
      ${data.wouldRecommend},
      '${data.title}',
      ${data.comfort},
      ${data.style},
      ${data.value},
      ${data.sizing},
      ${data.helpfulVotes},
      ${data.productId}
    )
  `

  client.execute(`
    SELECT id FROM tarjay_reviews
    WHERE
      product_id = ${data.productId} AND
      created_at = '${data.createdAt}' AND
      created_at_timestamp = '${data.createdAtTimeStamp}' AND
      author = '${data.author}' AND
      id = ${data.id}
  `)
    .then(result => {
      if (result.rows.length === 0) {
        console.log('inserting!')
        return client.execute(insertQuery);
      } else {
        console.log('updating!')
        return client.execute(updateQuery);
      }
    })
    .then(result => {
      console.log('result :',result);
      res.send('ok');
    })
    .catch(err => console.log('following error while trying to select: ', err));
});