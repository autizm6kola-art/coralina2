// import React, { useEffect, useState } from 'react';
// import MenuPage from './components/MenuPage';
// import TasksPage from './components/TasksPage';

// function App() {
//   const [allTasks, setAllTasks] = useState([]);
//   const [selectedTaskId, setSelectedTaskId] = useState(null);

//   useEffect(() => {
//     // Загружаем JSON из public
//     fetch(process.env.PUBLIC_URL + '/tasks_shrek.json')
//       .then((response) => response.json())
//       .then((data) => setAllTasks(data))
//       .catch((error) => console.error('Ошибка загрузки заданий:', error));
//   }, []);

//   const handleSelectTask = (taskId) => {
//     setSelectedTaskId(taskId);
//   };

//   const handleGoBack = () => {
//     setSelectedTaskId(null);
//   };

//   if (allTasks.length === 0) {
//     return <div>Загрузка заданий...</div>;
//   }

//   return (
//     <div>
//       {selectedTaskId === null ? (
//         <MenuPage allTasks={allTasks} onSelectTask={handleSelectTask} />
//       ) : (
//         <TasksPage
//           tasks={allTasks.filter((task) => task.id === selectedTaskId)}
//           goBack={handleGoBack}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// src/App.js
import React, { useEffect, useState } from 'react';
import MenuPage from './components/MenuPage';
import TasksPage from './components/TasksPage';
import { generateRanges } from './utils/ranges'; // ✅ Импортируем генератор диапазонов

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState(null); // ✅ Храним массив ID

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/tasks_shrek.json')
      .then((response) => response.json())
      .then((data) => setAllTasks(data))
      .catch((error) => console.error('Ошибка загрузки заданий:', error));
  }, []);

  const handleSelectRange = (taskIds) => {
    setSelectedTaskIds(taskIds); // ✅ Сохраняем выбранный диапазон
  };

  const handleGoBack = () => {
    setSelectedTaskIds(null); // ✅ Возврат к меню
  };

  if (allTasks.length === 0) {
    return <div>Загрузка заданий...</div>;
  }

  const tasksInRange = selectedTaskIds
    ? allTasks.filter((task) => selectedTaskIds.includes(task.id))
    : [];

  return (
    <div>
      {selectedTaskIds === null ? (
        <MenuPage allTasks={allTasks} onSelectRange={handleSelectRange} />
      ) : (
        <TasksPage tasks={tasksInRange} goBack={handleGoBack} />
      )}
    </div>
  );
}

export default App;
