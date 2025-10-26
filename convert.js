// generateJson.js
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'input.txt');
const outputFile = path.join(__dirname, 'output.json');

const text = fs.readFileSync(inputFile, 'utf-8');

// Разбиваем по страницам
const pageBlocks = text.split(/--- PAGE START ---|--- PAGE END ---/).map(s => s.trim()).filter(Boolean);

const result = [];

let idCounter = 1;

pageBlocks.forEach(block => {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

  // Находим заголовок
  const titleLine = lines.find(l => l.startsWith('#TITLE:'));
  if (!titleLine) return;

  const title = titleLine.replace('#TITLE:', '').trim();

  // Собираем текст, исключая строку с заголовком
  const contentLines = lines.filter(l => !l.startsWith('#TITLE:'));
  const content = contentLines.join('\r\n');

  // Извлекаем все ответы в {{…}}
  const answers = [];
  const exerciseText = content.replace(/\{\{(.*?)\}\}/g, (_, p1) => {
    answers.push(p1);
    return '|_|';
  });

  result.push({
    title,
    original: content,
    exercise: exerciseText,
    answers,
    id: idCounter++
  });
});

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
console.log(`✅ Успешно создан ${outputFile} с ${result.length} страницами.`);
