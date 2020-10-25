require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const logger = require('morgan');
const port = process.env.WEBSERVERPORT || 3000;

const app = express();

app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
// app.use('/api/reviews/:id', express.static(__dirname + '/../Public'));
app.use('/', express.static(__dirname + '/../Public'))
app.use('/:id', express.static(__dirname + '/../Public'));

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  max: 20
});

// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error('Error acquiring client', err.stack)
//   }
//   console.log('connected');
// });

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/:id', async (req, res) => {
  let id = req.params.id;
  if (id.includes('favicon')) {
    res.send('ok');
    return;
  }
  if (id === undefined) {
    id = 1;
  }
  console.log('id: ', id);
  const dbResult = await pool.query(`select * from tarjay_reviews where product_id=${id} limit 30`);
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

app.get('/api/reviews/:id', async (req, res) => {
  let id = req.params.id;
  if (id === undefined) {
    id = 1;
  }
  console.log('id: ', id);
  const dbResult = await pool.query(`select * from tarjay_reviews where product_id=${id} limit 30`);
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

app.listen(port, () => {
  console.log('///////////////////////////////////////////////')
  console.log(' Tarjay Reviews service running on port: ', port);
  console.log('///////////////////////////////////////////////')
})

