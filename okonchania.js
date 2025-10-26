// const fs = require('fs');
// const path = require('path');

// console.log("✅ Скрипт запущен...");

// const inputPath = path.join(__dirname, 'input.txt');
// const outputPath = path.join(__dirname, 'output.txt');

// // Функция разбора секций
// function extractSection(content, startMarker, endMarker) {
//     const startIndex = content.indexOf(startMarker);
//     if (startIndex === -1) return '';
//     const fromStart = content.slice(startIndex + startMarker.length);
//     const endIndex = fromStart.indexOf(endMarker);
//     return (endIndex === -1 ? fromStart : fromStart.slice(0, endIndex)).trim();
// }

// // Функция разбора страниц
// function extractBlocks(content) {
//     const pages = content.split('--- PAGE START ---').map(p => p.trim()).filter(Boolean);
//     return pages.map(page => {
//         const endIndex = page.indexOf('--- PAGE END ---');
//         const body = endIndex >= 0 ? page.substring(0, endIndex).trim() : page.trim();

//         const originalText = extractSection(body, '#ORIGINAL:', '#EXERCISE:');
//         const exerciseText = extractSection(body, '#EXERCISE:', '#ANSWERS:');
//         const rest = body.split('#EXERCISE:')[0] + '#EXERCISE:\n' + exerciseText;

//         return {
//             original: originalText,
//             exercise: exerciseText,
//             full: '--- PAGE START ---\n' + rest,
//         };
//     });
// }

// // Сравнение оригинала и упражнения
// function extractMissingParts(original, exercise) {
//     const result = [];
//     let originalIndex = 0;
//     let exerciseIndex = 0;

//     while (exerciseIndex < exercise.length) {
//         if (exercise.slice(exerciseIndex).startsWith('|_||_|')) {
//             const missing = original.slice(originalIndex, originalIndex + 2);
//             result.push(missing);
//             originalIndex += 2;
//             exerciseIndex += 6;
//         } else if (exercise.slice(exerciseIndex).startsWith('|_|')) {
//             const missing = original[originalIndex];
//             result.push(missing);
//             originalIndex += 1;
//             exerciseIndex += 3;
//         } else {
//             if (exercise[exerciseIndex] === original[originalIndex]) {
//                 originalIndex++;
//                 exerciseIndex++;
//             } else {
//                 originalIndex++;
//             }
//         }
//     }

//     return result;
// }

// // Основная функция обработки
// function processFile(inputText) {
//     const pages = extractBlocks(inputText);
//     console.log(`🔍 Найдено страниц: ${pages.length}`);

//     const outputPages = pages.map(({ original, exercise, full }, idx) => {
//         const missingParts = extractMissingParts(original, exercise);
//         console.log(`📄 Страница ${idx + 1}: найдено пропусков — ${missingParts.length}`);
//         return `${full}\n\n#ANSWERS:\n${missingParts.join(', ')}\n\n--- PAGE END ---`;
//     });

//     return outputPages.join('\n\n');
// }

// // Запуск
// fs.readFile(inputPath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('❌ Ошибка чтения input.txt:', err);
//         return;
//     }

//     console.log('📥 Файл input.txt прочитан');

//     const result = processFile(data);

//     fs.writeFile(outputPath, result, 'utf8', err => {
//         if (err) {
//             console.error('❌ Ошибка записи output.txt:', err);
//         } else {
//             console.log('✅ Готово! Файл output.txt создан.');
//         }
//     });
// });

const fs = require('fs');
const path = require('path');

console.log("✅ Скрипт запущен...");

const inputPath = path.join(__dirname, 'input.txt');
const outputPath = path.join(__dirname, 'output.txt');

// Функция разбора секций
function extractSection(content, startMarker, endMarker) {
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return '';
    const fromStart = content.slice(startIndex + startMarker.length);
    const endIndex = fromStart.indexOf(endMarker);
    return (endIndex === -1 ? fromStart : fromStart.slice(0, endIndex)).trim();
}

// Функция разбора страниц
function extractBlocks(content) {
    const pages = content.split('--- PAGE START ---').map(p => p.trim()).filter(Boolean);
    return pages.map(page => {
        const endIndex = page.indexOf('--- PAGE END ---');
        const body = endIndex >= 0 ? page.substring(0, endIndex).trim() : page.trim();

        const originalText = extractSection(body, '#ORIGINAL:', '#EXERCISE:');
        const exerciseText = extractSection(body, '#EXERCISE:', '#ANSWERS:');
        const rest = body.split('#EXERCISE:')[0] + '#EXERCISE:\n' + exerciseText;

        return {
            original: originalText,
            exercise: exerciseText,
            full: '--- PAGE START ---\n' + rest,
        };
    });
}

// Сравнение оригинала и упражнения
function extractMissingParts(original, exercise) {
    const result = [];
    let originalIndex = 0;
    let exerciseIndex = 0;

    while (exerciseIndex < exercise.length) {
        if (exercise.slice(exerciseIndex).startsWith('|_||_|')) {
            const missing = original.slice(originalIndex, originalIndex + 2);
            result.push(missing);
            originalIndex += 2;
            exerciseIndex += 6;
        } else if (exercise.slice(exerciseIndex).startsWith('|_|')) {
            const missing = original[originalIndex];
            result.push(missing);
            originalIndex += 1;
            exerciseIndex += 3;
        } else {
            if (exercise[exerciseIndex] === original[originalIndex]) {
                originalIndex++;
                exerciseIndex++;
            } else {
                originalIndex++;
            }
        }
    }

    return result;
}

// Основная функция обработки
function processFile(inputText) {
    const pages = extractBlocks(inputText);
    console.log(`🔍 Найдено страниц: ${pages.length}`);

    const outputPages = pages.map(({ original, exercise, full }, idx) => {
        try {
            const missingParts = extractMissingParts(original, exercise);
            console.log(`📄 Страница ${idx + 1}: найдено пропусков — ${missingParts.length}`);

            return `${full}\n\n#ANSWERS:\n${missingParts.join(', ')}\n\n--- PAGE END ---`;

        } catch (err) {
            console.error(`❌ Ошибка на странице ${idx + 1}:`, err.message);

            return `${full}\n\n#ERROR:\n${err.message}\n\n--- PAGE END ---`;
        }
    });

    return outputPages.join('\n\n');
}


// Запуск
fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
        console.error('❌ Ошибка чтения input.txt:', err);
        return;
    }

    console.log('📥 Файл input.txt прочитан');

    const result = processFile(data);

    fs.writeFile(outputPath, result, 'utf8', err => {
        if (err) {
            console.error('❌ Ошибка записи output.txt:', err);
        } else {
            console.log('✅ Готово! Файл output.txt создан.');
        }
    });
});
