const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, data) => {
        if (err) throw err;
        const parseFileName = path.parse(file.name);
        console.log(`${parseFileName.name} - ${path.extname(file.name).slice(1)} - ${data.size / 1024} kb`);
      });
    }
  });
});
