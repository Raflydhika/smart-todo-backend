import * as TaskRepository from '../repository/TaskRepositories.js';
import { validateTask } from '../helpers/validation.helper.js';
import { calculatePriorityScore } from '../helpers/priority.helper.js';
import { getCurrentTimestamp } from '../helpers/date.helper.js';
import PredictionService from './PredictionService.js';

const findTaskOrThrow = async (userId, id) => {
  const task = await TaskRepository.getTaskById(userId, id);

  if (!task) {
    throw {
      status: 404,
      message: 'Task tidak ditemukan.',
    };
  }

  return task;
};

const findHistoryOrThrow = async (userId, id) => {
  const history = await TaskRepository.getHistoryById(userId, id);

  if (!history) {
    throw {
      status: 404,
      message: 'Riwayat tugas tidak ditemukan.',
    };
  }

  return history;
};

const createTask = async (userId, taskData) => {
  validateTask(taskData);

  const { title, difficulty, user_estimated_time, deadline, description } =
    taskData;

  const priority_score = calculatePriorityScore(difficulty, deadline);

  const predictionResult = await PredictionService.predictTaskDuration(
    difficulty,
    user_estimated_time,
  );

  const prediction =
    typeof predictionResult === 'string'
      ? JSON.parse(predictionResult)
      : predictionResult;

  const timestamp = getCurrentTimestamp();

  const newTask = {
    user_id: userId,
    title,
    difficulty,
    user_estimated_time,
    deadline,
    priority_score,
    predicted_time: prediction?.predicted_time || null,
    prediction_source: prediction?.source || null,
    status: 'pending',
    actual_time: null,
    created_at: timestamp,
    updated_at: timestamp,
    description,
  };

  return await TaskRepository.createTask(newTask);
};

const getAllTask = async (userId) => {
  return await TaskRepository.getAllTask(userId);
};

const getTaskById = async (userId, id) => {
  return await findTaskOrThrow(userId, id);
};
const getTaskSorted = async (userId) => {
  return await TaskRepository.getTaskSorted(userId);
};

const editTaskById = async (userId, id, taskData) => {
  await findTaskOrThrow(userId, id);

  validateTask(taskData);

  const { title, difficulty, user_estimated_time, deadline, description } =
    taskData;

  const priority_score = calculatePriorityScore(difficulty, deadline);

  const predictionResult = await PredictionService.predictTaskDuration(
    difficulty,
    user_estimated_time,
  );

  const prediction =
    typeof predictionResult === 'string'
      ? JSON.parse(predictionResult)
      : predictionResult;

  const updatedTask = {
    title,
    difficulty,
    user_estimated_time,
    deadline,
    description,
    priority_score,
    predicted_time: prediction?.predicted_time || null,
    prediction_source: prediction?.source || null,
    updated_at: getCurrentTimestamp(),
  };

  return await TaskRepository.editTaskById(userId, id, updatedTask);
};

const completeTask = async (userId, id, actualTime) => {
  await findTaskOrThrow(userId, id);

  const parsedTime = Number(actualTime);

  if (
    actualTime === undefined ||
    actualTime === null ||
    Number.isNaN(parsedTime) ||
    parsedTime <= 0
  ) {
    throw {
      status: 400,
      message:
        'Kolom actual_time wajib berupa angka bulat positif lebih besar dari nol.',
    };
  }

  return await TaskRepository.completeTask(userId, id, parsedTime);
};

const getTaskHistory = async (userId) => {
  return await TaskRepository.getTaskHistory(userId);
};

const deleteHistoryById = async (userId, id) => {
  await findHistoryOrThrow(userId, id);

  return await TaskRepository.deleteHistoryById(userId, id);
};

const deleteAllHistory = async (userId) => {
  return await TaskRepository.deleteAllHistory(userId);
};

const deleteTaskById = async (userId, id) => {
  await findTaskOrThrow(userId, id);

  return await TaskRepository.deleteTaskById(userId, id);
};

export {
  createTask,
  getAllTask,
  getTaskById,
  getTaskSorted,
  editTaskById,
  completeTask,
  deleteTaskById,
  getTaskHistory,
  deleteHistoryById,
  deleteAllHistory,
};
