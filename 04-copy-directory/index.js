const path = require('path');
const  fs = require('fs');

const filesFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

function createFolder() {    
  fs.mkdir(destFolder, { recursive: true }, (err) => {
    if (err) throw err;
  });  
  fs.readdir(destFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) console.log(err);
      })
    })
  })  
}


function copyFiles() {
  createFolder();
  fs.readdir(filesFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.copyFile(`${filesFolder}/${file}`, `${destFolder}/${file}`, (err) => {
        if (err) console.log(err);
      });
    });
  })
}

copyFiles();
