

// import React, { useEffect, useState } from 'react';
// import {
//   saveUserInputs,
//   getUserInputs,
//   saveCorrectInputs,
//   getCorrectInputs,
// } from '../utils/storage';
// import '../styles/taskItem.css';

// function Task({ task }) {
//   const [inputs, setInputs] = useState([]);
//   const [checked, setChecked] = useState(false);
//   const [correctInputs, setCorrectInputs] = useState([]);
//   const [shuffledAnswers, setShuffledAnswers] = useState([]);

//   const placeholders = task.exercise.split('|_|');
//   const correctAnswers = task.answers;

//   // === Перемешивание массива (алгоритм Фишера-Йетса) ===
//   const shuffleArray = (array) => {
//     const arr = [...array];
//     for (let i = arr.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
//     return arr;
//   };

//   useEffect(() => {
//     // === Запрещаем любое перетаскивание по странице ===
//     const preventDefault = (e) => e.preventDefault();
//     document.addEventListener('dragstart', preventDefault);
//     document.addEventListener('drop', preventDefault);

//     // === Восстанавливаем данные пользователя ===
//     const savedInputs = getUserInputs(task.id);
//     const savedCorrectIndexes = getCorrectInputs(task.id);

//     setShuffledAnswers(shuffleArray(correctAnswers));

//     if (savedInputs.length === correctAnswers.length) {
//       setInputs(savedInputs);
//       setCorrectInputs(savedCorrectIndexes);
//       if (savedCorrectIndexes.length > 0) {
//         setChecked(true);
//       }
//     } else {
//       setInputs(Array(correctAnswers.length).fill(''));
//     }

//     // === Очистка при размонтировании ===
//     return () => {
//       document.removeEventListener('dragstart', preventDefault);
//       document.removeEventListener('drop', preventDefault);
//     };
//   }, [task]);

//   const handleChange = (index, value) => {
//     const updated = [...inputs];
//     updated[index] = value;
//     setInputs(updated);
//     saveUserInputs(task.id, updated);
//   };

//   const handleCheck = () => {
//     const correctIndexes = inputs
//       .map((input, i) =>
//         input.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase()
//           ? i
//           : null
//       )
//       .filter((i) => i !== null);

//     saveCorrectInputs(task.id, correctIndexes);
//     setCorrectInputs(correctIndexes);
//     setChecked(true);
//   };

//   const handleResetCheck = () => {
//     setChecked(false);
//   };

//   return (
//     <div className="task-container">
//       {/* === БАНК СЛОВ === */}
//       <div className="word-bank">
//         {shuffledAnswers.map((word, index) => (
//           <span
//             key={index}
//             className="word-bank-item no-select"
//           >
//             {word}
//           </span>
//         ))}
//       </div>

//       {/* === ТЕКСТ С ПРОПУСКАМИ === */}
//       <div className="task-button">
//         <div className="text-block" onClick={handleResetCheck}>
//           {placeholders.map((text, i) => (
//             <React.Fragment key={i}>
//               <span>{text}</span>
//               {i < correctAnswers.length && (
//                 <input
//                   type="text"
//                   value={inputs[i] || ''}
//                   onChange={(e) => handleChange(i, e.target.value)}
//                   onDrop={(e) => e.preventDefault()}       // запрет перетаскивания
//                   onDragStart={(e) => e.preventDefault()}  // запрет начала перетаскивания
//                   onPaste={(e) => e.preventDefault()}      // запрет вставки
//                   onCopy={(e) => e.preventDefault()}       // запрет копирования
//                   onCut={(e) => e.preventDefault()}        // запрет вырезания
//                   className={
//                     correctInputs.includes(i)
//                       ? 'input-correct'
//                       : checked
//                       ? 'input-wrong'
//                       : ''
//                   }
//                 />
//               )}
//             </React.Fragment>
//           ))}
//         </div>

//         <div className="reset-button-contaner">
//           <button className="button-proverit" onClick={handleCheck}>
//             ✓
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Task;
import React, { useEffect, useState } from 'react';
import {
  saveUserInputs,
  getUserInputs,
  saveCorrectInputs,
  getCorrectInputs,
} from '../utils/storage';
import '../styles/taskItem.css';

function Task({ task }) {
  const [inputs, setInputs] = useState([]);
  const [checked, setChecked] = useState(false);
  const [correctInputs, setCorrectInputs] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // === Новые состояния ===
  const [attempts, setAttempts] = useState([]); // попытки по каждому полю
  const [locked, setLocked] = useState([]);     // заблокировано ли поле

  const placeholders = task.exercise.split('|_|');
  const correctAnswers = task.answers;

  // === Перемешивание массива ===
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener('dragstart', preventDefault);
    document.addEventListener('drop', preventDefault);

    const savedInputs = getUserInputs(task.id);
    const savedCorrectIndexes = getCorrectInputs(task.id);

    setShuffledAnswers(shuffleArray(correctAnswers));

    const len = correctAnswers.length;

    setInputs(savedInputs.length === len ? savedInputs : Array(len).fill(''));
    setCorrectInputs(savedCorrectIndexes);
    setChecked(savedCorrectIndexes.length > 0);

    // инициализируем попытки и блокировки
    setAttempts(Array(len).fill(0));
    setLocked(Array(len).fill(false));

    return () => {
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, [task]);

  const handleChange = (index, value) => {
    if (locked[index]) return; // нельзя вводить, если заблокировано
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    saveUserInputs(task.id, updated);
  };

  // === Проверка ===
  const handleCheck = () => {
    const newCorrect = [];
    const newAttempts = [...attempts];
    const newLocked = [...locked];

    inputs.forEach((input, i) => {
      const correct =
        input.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase();

      if (correct) {
        newCorrect.push(i);
      } else {
        // --- важное правило: пустая строка не считается попыткой ---
        if (input.trim() !== '' && !locked[i]) {
          newAttempts[i] += 1;

          if (newAttempts[i] >= 2) {
            newLocked[i] = true; // блокируем поле
          }
        }
      }
    });

    setCorrectInputs(newCorrect);
    saveCorrectInputs(task.id, newCorrect);

    setAttempts(newAttempts);
    setLocked(newLocked);
    setChecked(true);
  };

  const handleResetCheck = () => {
    setChecked(false);
  };

  return (
    <div className="task-container">
      {/* === БАНК СЛОВ === */}
      <div className="word-bank">
        {shuffledAnswers.map((word, index) => (
          <span key={index} className="word-bank-item no-select">
            {word}
          </span>
        ))}
      </div>

      {/* === ТЕКСТ === */}
      <div className="task-button">
        <div className="text-block" onClick={handleResetCheck}>
          {placeholders.map((text, i) => (
            <React.Fragment key={i}>
              <span>{text}</span>

              {i < correctAnswers.length && (
                <input
                  type="text"
                  value={inputs[i] || ''}
                  disabled={locked[i]}    // ← поле блокируется!
                  onChange={(e) => handleChange(i, e.target.value)}

                  onDrop={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}

                  className={
                    locked[i]
                      ? 'input-locked'       // красное, заблокированное
                      : correctInputs.includes(i)
                      ? 'input-correct'      // зелёное
                      : checked && inputs[i].trim() !== ''
                      ? 'input-wrong'        // красное, если ошибка
                      : ''
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="reset-button-contaner">
          <button className="button-proverit" onClick={handleCheck}>
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task;
