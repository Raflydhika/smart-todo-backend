import express from 'express';
import {
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
} from '../controllers/TaskController.js';
import authenticateToken from '../middleware/auth.js';

const routes = express.Router();
routes.use(authenticateToken);
routes.post('/', createTask);
routes.get('/', getAllTask);
routes.get('/sorted', getTaskSorted);
routes.get('/history', getTaskHistory);
routes.delete('/history', deleteAllHistory);
routes.delete('/history/:id', deleteHistoryById);
routes.get('/:id', getTaskById);
routes.put('/:id', editTaskById);
routes.patch('/:id/complete', completeTask);
routes.delete('/:id', deleteTaskById);

export default routes;
