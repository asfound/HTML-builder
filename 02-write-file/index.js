const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const os = require('node:os');

const outputPath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(outputPath);
const prompt = `Hello! Please enter the text:${os.EOL}`;
const farewell = `${os.EOL}Input ended. Ciao!`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processInput = (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
  } else {
    output.write(`${input}${os.EOL}`, (error) => {
      if (error) {
        console.error('Error:', error.message);
      }
    });
  }
};

rl.question(prompt, processInput);
rl.on('line', processInput);

rl.on('close', () => {
  console.log(farewell);
  output.end();
  process.exit(0);
});
