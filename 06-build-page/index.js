const path = require('path');
const  fs = require('fs');
const fsPromises = require('fs/promises');

const destFolder = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');

const components = path.join(__dirname, 'components');

let temporaryTemplate = '';

// const rs = fs.createReadStream(templateFile);
const index = path.join(__dirname, 'project-dist', 'index.html');
// const wsIndex = new fs.WriteStream(index);

// создать целевую папку с проектом
async function createFolder(destFolder) {    
  await fs.mkdir(destFolder, { recursive: true }, (err) => {
    if (err) throw err;
  });
  // всё удалить из целевой папки с проектом, если она была и в ней уже что-то было
  fsPromises.readdir(destFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fsPromises.rm(path.join(destFolder, file), { recursive: true }, (err) => {
        if (err) throw err;
      });
    });
  });  
}
// создание пустой папки
createFolder(destFolder);

// скопировать файл template.html в целевую папку и назвать его index.html
fs.copyFile(templateFile, index, (err) => {
  if (err) console.log(err);
});

// работа с css
const style = path.join(destFolder, 'style.css');
const wsStyleBundle = fs.createWriteStream(style);
//  создать в целевой папке бандл со стилями из папки styles (как в 5й задаче)
fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {        
      fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8').pipe(wsStyleBundle);
    };
  });  
});

// скопировать папку ассетс со всем содержимым в целевую папку 
function createCopyOfDirectory(dir, destDir) {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(dir, { withFileTypes: true }, (err, elements) => {
      if (err) throw err;
      elements.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(path.join(dir, file.name), path.join(destDir, file.name), (err) => {
            if (err) throw err;
          });
        }
        // (для вложенных папок используется рекурсия)
        if (file.isDirectory()) {
          createCopyOfDirectory(path.join(dir, file.name), path.join(destDir, file.name))
        }
      });  
    });
  });
}

createCopyOfDirectory(path.join(__dirname, 'assets'), path.join(destFolder, 'assets'));

// записываем содержимое файла index.html в переменную text
let text = '';
fs.readFile(index, 'utf8', (err, data) => {
  if (err) throw err;
  text = data;
});

// находим имена файлов в директории components
fs.readdir(components, { withFileTypes: true }, (err, filesList) => {
  if (err) throw err;
  filesList.forEach(file => {
    if (file.isFile() && path.extname(file.name) === '.html') {
      fs.readFile(path.join(components, file.name), (err, data) => {
        if (err) throw err;
        let fileName = path.parse(file.name).name;
        // заменяем шаблонные теги на содержимое одноименных файлов
        text = text.replace(`{{${fileName}}}`, data);
        //  переписываем содержимое файла index.html
        fsPromises.writeFile(index, text, (err) => {
          if (err) throw err;
        });
      });
    };
  });
});
