const faker = require('faker');
const fs = require('fs');
const file = fs.createWriteStream('./newSeedUpdated.csv');
const { v4 } = require('uuid');

file.write('id,created_at,created_at_timestamp,author,stars,body,would_recommend,title,comfort,style,value,sizing,helpful_votes,product_id' + '\n');

function getNextDate(date='2020-07-01') {
  let [year, month, day] = date.split('-').map(val => parseInt(val));
  let adjustedDay = (day % 31 === 0 ? 1 : (day % 30));
  let dayString = (adjustedDay + 1 < 10 ? `0${adjustedDay + 1}` : `${adjustedDay + 1}`);
  month = month + (day === 30 ? 1 : 0);
  let monthString = (month.toString().length === 1 ? `0${month}` : `${month}`);
  return `${year}-${monthString}-${dayString}`;
};

function getNextTime(dateTime = '00:00:00.000000000') {
  let [hour, minute, sec] = dateTime.split(':');
  let [secPart, nanoSecPart] = sec.split('.').map(val => parseInt(val));
  if (nanoSecPart > 98) {
    // debugger;
  }
  nanoSecPart += 1;
  if ((nanoSecPart / 999999999) > 1) {
    nanoSecPart = 000000;
    secPart += 1;
  }
  nanoSecPart = nanoSecPart.toString();
  secPart = secPart.toString();
  while (nanoSecPart.length < 9) {
    nanoSecPart = '0' + nanoSecPart
  }
  if (secPart.length < 2) {
    secPart = '0' + secPart;
  }
  return `${hour}:${minute}:${secPart}.${nanoSecPart}`;
}

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
let createdAt = getNextDate();
let createdAtTime = getNextTime();
let data = '';

function writeOneHundredMillionTimes(writer) {
  let i = 100000000;
  let chunk = 10000;
  let max = i;
  write();
  function write() {
    let ok = true;
    console.log(`Function call with ${i} of ${max}`);
    do {
      i--;

      ///// data gen /////
      id = v4();
      author = faker.name.firstName()
      stars = faker.random.number(5) // 0 through 5
      body = faker.lorem.paragraph()
      wouldRecommend = faker.random.boolean()
      title = faker.random.words()
      comfort = faker.random.number(5) // 0 - 5
      style = faker.random.number(5) // 0-5
      value = faker.random.number(5) // 0-5
      sizing = faker.random.number(5);
      // createdTimestamp = faker.date.between('2020-07-01', '2020-10-20');
      createdAt = (i % 1000000 === 0 ? getNextDate(createdAt) : createdAt);
      createdAtTime = (i % 1000000 === 0 ? getNextTime(`00:00:00.000000`) : getNextTime(createdAtTime));
      helpfulVotes = faker.random.number(5)
      productId = Math.floor(Math.random() * (max/10));
      data = data + `${id},${createdAt},${createdAtTime},${author},${stars},"${body}",${wouldRecommend},"${title}",${comfort},${style},${value},${sizing},${helpfulVotes},${productId}\n`;
      ////////////////////

      if (i === 0) {
        // Last time!
        writer.write(data);
      } else if (i % chunk === 0) {
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
writeOneHundredMillionTimes(file);
console.timeEnd('load')