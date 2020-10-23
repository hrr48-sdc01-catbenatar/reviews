const faker = require('faker');
const fs = require('fs');

const file = fs.createWriteStream('./seedData.csv', {flags: 'a'});
file.once('drain', function() {
  console.log('########## Drain Triggered for the first time ###########');
})

file.write('id,author,stars,body,created_at,would_recommend,title,comfort,style,value,sizing,helpful_votes,product_id' + '\n');

var generateIds = function (num) {
  var array = [];
  for (var i = 1; i <= num; i++ ) {
    array.push(i);
  }
  return array;
};

var productIds = generateIds(100);

var generateReviews = function(numReviews, i) {
  var data = [];
  var uniq = 0;
  var counter = 0;

  var stars = {
    'min': 1,
    'max': 5
  };
  var sizing = {
    'min': 1,
    'max': 3
  };

  function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


  let canWriteMore = true;
  while (i > 0 && canWriteMore) {
    console.log(`${i} of ${numReviews}`);
    uniq++;
    counter++;
    // var fakeReview = {
    _id = uniq
    author = faker.name.firstName()
    stars = faker.random.number(stars) // 0 through 5
    body = faker.lorem.paragraph()
    createdAt = randomDate(new Date("2020-07-15T20:44:19.172Z"), new Date("2020-10-01T20:44:19.172Z")) // date
    wouldRecommend = faker.random.boolean()
    title = faker.random.words()
    comfort = faker.random.number(stars) // 0 - 5
    style = faker.random.number(stars) // 0-5
    value = faker.random.number(stars) // 0-5
    sizing = faker.random.number(sizing) // [too small, too big, true to size]
    photos = ['null'] //img links //======= TO DO ======
    helpfulVotes = faker.random.number(stars) // number of "helpful" votes
    // }
    if (counter < 20) {
      // fakeReview.productId = productIds[0]
      productId = productIds[0]
    } else {
      counter = 0;
      // fakeReview.productId = productIds.shift();
      productId = productIds[0]
    }

    let fakeString = `${_id},${author},${stars},${body},${createdAt},${wouldRecommend},${title},${comfort},${style},${value},${sizing},${photos},${helpfulVotes},${productId}\n`

    canWriteMore = file.write(fakeString);
    console.log(file.writableHighWaterMark)
    console.log('writableLength: ', file.writableLength);
    console.log('canWriteMore: ', canWriteMore);
    if (canWriteMore === false) {
      file.once('drain', function() {
        console.log('############ DRAIN TRIGGERED ###############');
        break
      })
    }
    i--;
  }
  file.end();
};

generateReviews(100);
