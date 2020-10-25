require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cassandra = require('cassandra-driver');
const port = process.env.WEBSERVERPORT;

const app = express();

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
  console.log(await result);
  res.send(await result);
})