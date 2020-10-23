const fs = require('fs');
const Stream = require('stream');

// const iReadThings = new Stream.Readable();

const readableStream = new Stream.Readable();
readableStream.push('ping!');

// iReadThings.push('hi');
// iReadThings.push('hello');

// console.log(iReadThings);