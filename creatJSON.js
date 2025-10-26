
const fs = require('fs');
const path = require('path');

function parsePages(txt) {
  const pageBlocks = txt.split(/--- PAGE START ---/).map(s => s.trim()).filter(Boolean);

  const pages = [];

  for (const block of pageBlocks) {
    const titleMatch = block.match(/#TITLE:\s*(.+)/);
    const originalMatch = block.match(/#ORIGINAL:\s*([\s\S]*?)#EXERCISE:/);
    const exerciseMatch = block.match(/#EXERCISE:\s*([\s\S]*?)#ANSWERS:/);
    const answersMatch = block.match(/#ANSWERS:\s*([^\n\r]*)/);

    if (!(titleMatch && originalMatch && exerciseMatch && answersMatch)) {
      console.warn('Внимание! Пропущен блок или неверный формат в странице:\n', block.slice(0, 100));
      continue;
    }

    const pageObj = {
      title: titleMatch[1].trim(),
      original: originalMatch[1].trim(),
      exercise: exerciseMatch[1].trim(),
      answers: answersMatch[1].split(',').map(s => s.trim())
    };

    pages.push(pageObj);
  }

  pages.forEach((p, i) => p.id = i + 1);

  return pages;
}

const inputFileName = path.join(__dirname, 'data.txt');
const outputFileName = path.join(__dirname, 'output.json');

try {
  const txt = fs.readFileSync(inputFileName, 'utf-8');
  const json = parsePages(txt);

  let jsonStr = JSON.stringify(json, null, 2);

  // Компактный вывод массива answers — в одну строку
  jsonStr = jsonStr.replace(/"answers": \[\n\s+([^\]]+?)\n\s+\]/g, (match, group) => {
    // Убираем все переводы строк и лишние пробелы внутри массива, форматируем красиво
    const oneLine = group.replace(/\s+/g, '').replace(/","/g, '", "');
    return `"answers": [${oneLine}]`;
  });

  fs.writeFileSync(outputFileName, jsonStr);

  console.log(`Готово! Файл ${outputFileName} создан с ${json.length} страницами.`);
} catch (e) {
  console.error('Ошибка при обработке файлов:', e.message);
}
