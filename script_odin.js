const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');
const outputPath = path.join(__dirname, 'output.txt'); // или input.txt, если хочешь перезаписать

// Читаем файл
fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения файла:', err);
    return;
  }

  // Заменяем каждое |_\|\_| на один |_|
  const fixed = data.replace(/\|_\|\|_\|/g, '|_|');

  // Записываем результат
  fs.writeFile(outputPath, fixed, 'utf8', (err) => {
    if (err) {
      console.error('Ошибка записи файла:', err);
      return;
    }

    console.log('Файл успешно обработан и сохранён:', outputPath);
  });
});
