const fs = require('node:fs');
const path = require('node:path');

const fullPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fullPath, 'utf-8');

readStream.on('data', (chunk) => console.log(chunk.toString()));
readStream.on('error', (error) => console.log('Error: ', error.message));
