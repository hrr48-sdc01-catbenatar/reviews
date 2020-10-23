-- Note: this is not sql code, rather commands for cqlsh, to interact with Cassandra
-- Creating Keyspace (similar to creating a database)
CREATE KEYSPACE IF NOT EXISTS testing_cassandra
WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': 3 }

CREATE TABLE tarjay_reviews (
  id int,
  created_at text,
  author text,
  stars int,
  body text,
  would_recommend BOOLEAN,
  title text,
  comfort int,
  style int,
  value int,
  sizing int,
  helpful_votes int,
  product_id int,
  PRIMARY KEY((product_id), id)
) WITH CLUSTERING ORDER BY (id DESC);

COPY tarjay_reviews(
  id,
  created_at,
  author,
  stars,
  body,
  would_recommend,
  title,
  comfort,
  style,
  value,
  sizing,
  helpful_votes,
  product_id
)
FROM './newSeed.csv'
WITH DELIMITER=',' AND HEADER = TRUE;

/*
reference command for bulk upload using dsbulk:
~/dsBulk/dsbulk-1.7.0/bin/dsbulk load -url newSeed.csv -k testing_cassandra -t tarjay_reviews -header true
*/