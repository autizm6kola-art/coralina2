
// // src/components/TasksPage.js
// import React, { useEffect, useState } from 'react';
// import BackButton from './BackButton';
// import ProgressBar from './ProgressBar';
// import Task from './Task';
// import {
//   clearAnswersByIds,
//   getAllCorrectInputs,
// } from '../utils/storage';
// import '../styles/tasksPage.css';

// function TasksPage({ tasks, goBack }) {
//   const [correctInputs, setCorrectInputs] = useState([]);
//   const [totalInputs, setTotalInputs] = useState(0);

//   const updateCorrectInputs = () => {
//     const allCorrect = getAllCorrectInputs(); // ["app_audio_input_correct_1_0", ...]
//     setCorrectInputs(allCorrect);
//   };

//   useEffect(() => {
//     updateCorrectInputs();
//     const total = tasks.reduce((acc, task) => acc + task.answers.length, 0);
//     setTotalInputs(total);
//   }, [tasks]);

//   const handleReset = () => {
//     tasks.forEach((task) => {
//       clearAnswersByIds([task.id]);
//       const total = task.answers.length;
//       for (let i = 0; i < total; i++) {
//         localStorage.removeItem(`coralina2_input_correct_${task.id}_${i}`);
//       }
//     });

//     setCorrectInputs([]);
//     window.location.reload(); // можно заменить на updateCorrectInputs() + пересчёт, если без перезагрузки
//   };

//   if (!tasks || tasks.length === 0) {
//     return <div>Нет вопросов</div>;
//   }

//   const taskIds = tasks.map((t) => t.id);
//   const start = Math.min(...taskIds);

//   return (
//     <div className="task-container">
//       <BackButton />

//       <button onClick={goBack} className="back-link task-back-button">
//         ← Назад к выбору
//       </button>

//       {/* <h1 className="task-heading">Страница {start}</h1> 

//       <ProgressBar correct={correctInputs.length} total={totalInputs} />

//       <p>
//         <strong className="task-strong">
//           Правильных ответов: {correctInputs.length} из {totalInputs}
//         </strong>
//       </p> */}

//       <hr />

//       <div className="task-grid">
//         {tasks.map((task) => (
//           <div className="task-item" key={task.id}>
//             <Task task={task} onCheck={updateCorrectInputs} />
//           </div>
//         ))}
//       </div>

//       <div className="reset-button-contaner">
//         <button onClick={handleReset} className="reset-button">
//           Сбросить ответы на этой странице
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TasksPage;

import React, { useEffect, useState } from 'react';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';
import Task from './Task';
import { clearAnswersByIds, getAllCorrectInputs, clearTaskProgress } from '../utils/storage';
import '../styles/tasksPage.css';

function TasksPage({ tasks, goBack }) {
  const [correctInputs, setCorrectInputs] = useState([]);
  const [totalInputs, setTotalInputs] = useState(0);

  const updateCorrectInputs = () => {
    const allCorrect = getAllCorrectInputs();
    setCorrectInputs(allCorrect);
  };

  useEffect(() => {
    updateCorrectInputs();
    const total = tasks.reduce((acc, task) => acc + task.answers.length, 0);
    setTotalInputs(total);
  }, [tasks]);

  const handleReset = () => {
    tasks.forEach((task) => clearTaskProgress(task.id, task.answers.length));
    setCorrectInputs([]);
    window.location.reload();
  };

  if (!tasks || tasks.length === 0) {
    return <div>Нет вопросов</div>;
  }

  return (
    <div className="task-container">
      <BackButton />
      <button onClick={goBack} className="back-link task-back-button">
        ← Назад к выбору
      </button>

      <div className="task-grid">
        {tasks.map((task) => (
          <div className="task-item" key={task.id}>
            <Task task={task} onCheck={updateCorrectInputs} />
          </div>
        ))}
      </div>

      <div className="reset-button-contaner">
        <button onClick={handleReset} className="reset-button">
          Сбросить ответы на этой странице
        </button>
      </div>
    </div>
  );
}

export default TasksPage;

