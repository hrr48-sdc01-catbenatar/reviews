-- Note: this is not sql code, rather commands for cqlsh, to interact with Cassandra
-- Creating Keyspace (similar to creating a database)
CREATE KEYSPACE IF NOT EXISTS testing_cassandra
WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': 3 }

CREATE KEYSPACE IF NOT EXISTS tarjay
WITH replication = { 'class': 'NetworkTopologyStrategy', 'replication_factor': 2 }

CREATE TABLE tarjay_reviews (
  id uuid,
  created_at date,
  created_at_timestamp time,
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
  PRIMARY KEY((product_id), created_at, created_at_timestamp, author, id)
) WITH CLUSTERING ORDER BY (created_at DESC, created_at_timestamp DESC, author ASC, id ASC);

COPY tarjay_reviews(
  id,
  created_at,
  created_at_timestamp,
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