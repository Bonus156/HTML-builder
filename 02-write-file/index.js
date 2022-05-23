const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const rl = readline.createInterface({input, output});

const ws = new fs.WriteStream(path.join(__dirname, 'text.txt'));

const exitProgramm = () => {
  rl.output.write("Exit Programm. Good bye. \n");
  rl.close();
};

rl.output.write(`Hello! Type something here. Type 'exit' for exit programm. \n`);
rl.on('line', (data) => {
  if (data === 'exit') exitProgramm();
  else ws.write(data + '\n');
});

rl.on('SIGINT', () => {
  exitProgramm();
});
