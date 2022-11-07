const path = require('path');
const  fs = require('fs');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const wsBundle = fs.createWriteStream(bundle);

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {        
      fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8').pipe(wsBundle);
    }
  });  
});