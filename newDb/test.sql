CREATE TABLE tarjay_reviews (
  id INT PRIMARY KEY,
  created_at VARCHAR(16),
  author VARCHAR(256),
  stars INT,
  body VARCHAR,
  would_recommend BOOLEAN,
  title VARCHAR(256),
  comfort INT,
  style INT,
  value INT,
  sizing INT,
  helpful_votes INT,
  product_id INT
);

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
FROM '/home/singh/hackreactor/SDC/service/target_reviews_component/newDb/newSeed.csv'
DELIMITER ','
CSV HEADER;

COPY tarjay_reviews
FROM '/home/singh/hackreactor/SDC/service/target_reviews_component/newDb/newSeed.tsv'
DELIMITER E'\t';