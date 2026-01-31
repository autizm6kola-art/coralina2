


// src/components/MenuPage.js
import React, { useEffect, useState } from 'react';
import { clearAllAnswers, getCorrectInputs } from '../utils/storage';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';
import { generateRanges } from '../utils/ranges';
import '../styles/menuPage.css';
import BackupControls from './BackupControls';

function MenuPage({ allTasks, onSelectRange }) {
  const [correctInputsByTask, setCorrectInputsByTask] = useState({});
  const [totalInputs, setTotalInputs] = useState(0);

  const ranges = generateRanges(allTasks, 1); // группировка по 5 заданий

  useEffect(() => {
    // Собираем количество правильных инпутов по каждой задаче
    const corrects = {};
    allTasks.forEach((task) => {
      const correctForTask = getCorrectInputs(task.id);
      corrects[task.id] = correctForTask.length;
    });
    setCorrectInputsByTask(corrects);

    // Подсчёт общего количества инпутов
    const total = allTasks.reduce((sum, task) => sum + task.answers.length, 0);
    setTotalInputs(total);
  }, [allTasks]);

  const countCorrectInRange = (range) => {
    return range.taskIds.reduce((count, id) => count + (correctInputsByTask[id] || 0), 0);
  };

  const countTotalInRange = (range) => {
    return range.taskIds.reduce((sum, id) => {
      const task = allTasks.find((t) => t.id === id);
      return sum + (task ? task.answers.length : 0);
    }, 0);
  };

  const totalCorrect = Object.values(correctInputsByTask).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-container">
      <BackButton />

      <h1 className="menu-title">КОРАЛИНА</h1>

      <ProgressBar correct={totalCorrect} total={totalInputs} />

      <p className="menu-progress-text">
        Правильных ответов {totalCorrect} из {totalInputs}
      </p>

      <div className="range-buttons-wrapper">
        {ranges.map((range, i) => {
          const total = countTotalInRange(range);
          const correct = countCorrectInRange(range);

          let buttonClass = 'range-button';
          if (correct === total && total > 0) {
            buttonClass += ' completed';
          } else if (correct > 0) {
            buttonClass += ' partial';
          }

          return (
            <button
              key={i}
              className={buttonClass}
              onClick={() => onSelectRange(range.taskIds)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="reset-button-contaner">
        <button
          className="reset-button"
          onClick={() => {
            clearAllAnswers();
            window.location.reload();
          }}
        >
          Сбросить все ответы
        </button>

        
      </div>
      <div className="reset-button-contaner"><BackupControls /></div>
    </div>
  );
}

export default MenuPage;
