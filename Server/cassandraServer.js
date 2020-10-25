require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cassandra = require('cassandra-driver');

const app = express();

app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use('/:id', express.static(__dirname + '/../Public'));

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  keyspace: 'testing_cassandra',
  localDataCenter: 'datacenter1'
});

const query = 'select * from tarjay_reviews where product_id=5 limit 2;';

client.execute(query)
  .then(result => {
    console.log(result.rows);
  })
  .catch(err => console.log('cassandra: following error: ', err));