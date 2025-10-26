


// // src/utils/storage.js

// import { supabase } from './supabaseClient';

// const STORAGE_PREFIX = "coralina2_";
// const USE_SUPABASE = false;

// const localStorageImpl = {
//   clearAllAnswers: () => {
//     const keys = Object.keys(localStorage);
//     keys.forEach((key) => {
//       if (key.startsWith(STORAGE_PREFIX)) {
//         localStorage.removeItem(key);
//       }
//     });
//   },

//   getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

//   isTaskCorrect: (id) => {
//     return localStorage.getItem(localStorageImpl.getTaskKey(id)) === 'true';
//   },

//   saveCorrectAnswer: (id) => {
//     localStorage.setItem(localStorageImpl.getTaskKey(id), 'true');
//   },

//   migrateOldProgress: () => {
//     const keys = Object.keys(localStorage);
//     const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

//     oldProgressKeys.forEach((key) => {
//       try {
//         const data = JSON.parse(localStorage.getItem(key));
//         if (data && data.answeredTasks) {
//           Object.keys(data.answeredTasks).forEach((taskId) => {
//             localStorageImpl.saveCorrectAnswer(taskId);
//           });
//         }
//       } catch (e) {
//         console.error("Ошибка при миграции из", key, e);
//       }
//     });
//   },

//   clearAnswersByIds: (ids) => {
//     ids.forEach((id) => {
//       localStorage.removeItem(localStorageImpl.getTaskKey(id));
//       localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${id}`);
//     });
//   },

//   saveUserInputs: (id, inputs) => {
//     localStorage.setItem(`${STORAGE_PREFIX}task_inputs_${id}`, JSON.stringify(inputs));
//   },

//   getUserInputs: (id) => {
//     const stored = localStorage.getItem(`${STORAGE_PREFIX}task_inputs_${id}`);
//     return stored ? JSON.parse(stored) : [];
//   },

//   // --- Новый функционал: отдельные input как подзадания ---
//   saveCorrectInput: (taskId, inputIndex) => {
//     const key = `${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`;
//     localStorage.setItem(key, 'true');
//   },

//   isInputCorrect: (taskId, inputIndex) => {
//     return localStorage.getItem(`${STORAGE_PREFIX}input_correct_${taskId}_${inputIndex}`) === 'true';
//   },

//   clearCorrectInputs: (taskId, totalInputs) => {
//     for (let i = 0; i < totalInputs; i++) {
//       const key = `${STORAGE_PREFIX}input_correct_${taskId}_${i}`;
//       localStorage.removeItem(key);
//     }
//   },

//   getAllCorrectInputs: () => {
//     const keys = Object.keys(localStorage).filter(k =>
//       k.startsWith(`${STORAGE_PREFIX}input_correct_`)
//     );
//     return keys;
//   },

//   // Добавить в localStorageImpl:
// getCorrectInputs: (taskId) => {
//   const key = `${STORAGE_PREFIX}correct_inputs_${taskId}`;
//   const stored = localStorage.getItem(key);
//   return stored ? JSON.parse(stored) : [];
// },

// saveCorrectInputs: (taskId, indexes) => {
//   const key = `${STORAGE_PREFIX}correct_inputs_${taskId}`;
//   localStorage.setItem(key, JSON.stringify(indexes));
// }
// };

// const supabaseImpl = {
//   // оставить как есть — пока не используется
// };

// const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// export const clearAllAnswers = (userId) => storage.clearAllAnswers(userId);
// export const isTaskCorrect = (id, userId) => storage.isTaskCorrect(id, userId);
// export const saveCorrectAnswer = (id, userId) => storage.saveCorrectAnswer(id, userId);
// export const migrateOldProgress = (userId) => storage.migrateOldProgress(userId);
// export const clearAnswersByIds = (ids, userId) => storage.clearAnswersByIds(ids, userId);
// export const getTaskKey = localStorageImpl.getTaskKey;
// export const saveUserInputs = (id, inputs) => storage.saveUserInputs(id, inputs);
// export const getUserInputs = (id) => storage.getUserInputs(id);
// export const saveCorrectInput = (taskId, index) => storage.saveCorrectInput(taskId, index);
// export const isInputCorrect = (taskId, index) => storage.isInputCorrect(taskId, index);
// export const getAllCorrectInputs = () => storage.getAllCorrectInputs();
// export const getCorrectInputs = (taskId) => storage.getCorrectInputs(taskId);
// export const saveCorrectInputs = (taskId, indexes) => storage.saveCorrectInputs(taskId, indexes);

// src/utils/storage.js
import { supabase } from './supabaseClient';

// === НАСТРОЙКИ ===
export const STORAGE_PREFIX = "coralina2_"; // просто поменяешь здесь для нового проекта
const USE_SUPABASE = false;

// === ЛОКАЛЬНАЯ РЕАЛИЗАЦИЯ ===
const localStorageImpl = {
  // --- Очистить всё, что относится к этому приложению ---
  clearAllAnswers: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  // --- Сохранение и получение введённых пользователем данных ---
  saveUserInputs: (taskId, inputs) => {
    localStorage.setItem(`${STORAGE_PREFIX}task_inputs_${taskId}`, JSON.stringify(inputs));
  },

  getUserInputs: (taskId) => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}task_inputs_${taskId}`);
    return stored ? JSON.parse(stored) : [];
  },

  // --- Сохранение и получение правильных ответов (индексов) ---
  saveCorrectInputs: (taskId, indexes) => {
    localStorage.setItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`, JSON.stringify(indexes));
  },

  getCorrectInputs: (taskId) => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`);
    return stored ? JSON.parse(stored) : [];
  },

  // --- Получить все правильные ответы (для прогресса) ---
  getAllCorrectInputs: () => {
    return Object.keys(localStorage).filter((key) =>
      key.startsWith(`${STORAGE_PREFIX}correct_inputs_`)
    );
  },

  // --- Очистить данные по конкретной задаче ---
  clearTaskProgress: (taskId, totalInputs) => {
    // удаляем введённые пользователем ответы
    localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${taskId}`);

    // удаляем индексы правильных ответов (новая система)
    localStorage.removeItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`);

    // удаляем старые ключи, если вдруг они остались от старых версий
    for (let i = 0; i < totalInputs; i++) {
      localStorage.removeItem(`${STORAGE_PREFIX}input_correct_${taskId}_${i}`);
    }
  },

  // --- Очистить данные по списку задач ---
  clearAnswersByIds: (ids, tasks = []) => {
    ids.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      const totalInputs = task ? task.answers.length : 10; // запасной вариант
      localStorageImpl.clearTaskProgress(id, totalInputs);
    });
  },
};

// === (Опционально) Реализация через Supabase ===
const supabaseImpl = {
  // оставляем на будущее, если будет нужно
};

// === ВЫБОР ХРАНИЛИЩА ===
const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// === ЭКСПОРТЫ ===
export const clearAllAnswers = () => storage.clearAllAnswers();
export const saveUserInputs = (id, inputs) => storage.saveUserInputs(id, inputs);
export const getUserInputs = (id) => storage.getUserInputs(id);
export const saveCorrectInputs = (id, indexes) => storage.saveCorrectInputs(id, indexes);
export const getCorrectInputs = (id) => storage.getCorrectInputs(id);
export const getAllCorrectInputs = () => storage.getAllCorrectInputs();
export const clearTaskProgress = (id, totalInputs) => storage.clearTaskProgress(id, totalInputs);
export const clearAnswersByIds = (ids, tasks) => storage.clearAnswersByIds(ids, tasks);
