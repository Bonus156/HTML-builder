const path = require('path');
const  fs = require('fs');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const wsBundle = fs.createWriteStream(bundle);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (path.extname(file) === '.css') {        
      fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8').pipe(wsBundle);
    }
  });  
});