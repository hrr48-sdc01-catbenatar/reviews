const faker = require('faker');
const fs = require('fs');
const file = fs.createWriteStream('./newSeed.csv');

file.write('id,author,stars,body,would_recommend,title,comfort,style,value,sizing,created_timestamp,created_at,helpful_votes,product_id' + '\n');

let stars = 5;
let author;
let start;
let body;
let wouldRecommend;
let title;
let comfort;
let style;
let value;
let sizing;
let data = '';

function writeOneMillionTimes(writer) {
  let i = 100000000;
  let max = i;
  write();
  function write() {
    let ok = true;
    console.log(`Function call with ${i} of ${max}`);
    do {
      i--;

      ///// data gen /////
      id = max - i;
      author = faker.name.firstName()
      stars = faker.random.number(stars) // 0 through 5
      body = faker.lorem.paragraph()
      wouldRecommend = faker.random.boolean()
      title = faker.random.words()
      comfort = faker.random.number(stars) // 0 - 5
      style = faker.random.number(stars) // 0-5
      value = faker.random.number(stars) // 0-5
      sizing = faker.random.number(sizing);
      createdTimestamp = faker.date.between('2020-07-01', '2020-10-20');
      createdAt = `${createdTimestamp.getFullYear()}-${createdTimestamp.getMonth() + 1}-${createdTimestamp.getDate()}`;
      helpfulVotes = faker.random.number(stars)
      productId = Math.floor(Math.random() * 1000001);
      data = data + `${id},${author},${stars},${body},${wouldRecommend},${title},${comfort},${style},${value},${sizing},${helpfulVotes}\n`;
      ////////////////////

      if (i === 0) {
        // Last time!
        writer.write(data);
      } else if (i % 100000 === 0) {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        console.log(`${i} of ${max}`);
        ok = writer.write(data);
        data = '';
      }
    } while (i >= 0 && ok);
    if (i >= 0) {
      // Had to stop early!
      // Write some more once it drains.
      console.log('########## waiting for the drain event ############')
      writer.once('drain', write);
    }
  }
}

console.time('load');
writeOneMillionTimes(file);
console.timeEnd('load')