import * as TaskService from '../services/TaskService.js';

const handleError = (res, error) => {
  console.error(error);

  return res.status(error.status || 500).json({
    status: 'fail',
    message: error.message || 'Terjadi kesalahan pada server.',
  });
};

const createTask = async (req, res) => {
  try {
    const task = await TaskService.createTask(req.user.id, req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Task berhasil ditambahkan.',
      dataTask: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAllTask = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTask(req.user.id);

    return res.status(200).json({
      status: 'success',
      dataTask: tasks,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await TaskService.getTaskById(req.user.id, req.params.id);

    return res.status(200).json({
      status: 'success',
      dataTask: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getTaskSorted = async (req, res) => {
  try {
    const tasks = await TaskService.getTaskSorted(req.user.id);

    return res.status(200).json({
      status: 'success',
      dataTask: tasks,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const editTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await TaskService.editTaskById(
      req.user.id,
      id,
      req.body,
    );

    return res.status(200).json({
      status: 'success',
      message: 'Task berhasil diperbarui.',
      dataTask: updatedTask,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const completeTask = async (req, res) => {
  try {
    const completedTask = await TaskService.completeTask(
      req.user.id,
      req.params.id,
      req.body.actual_time,
    );

    return res.status(200).json({
      status: 'success',
      message: 'Task berhasil diselesaikan.',
      dataTask: completedTask,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getTaskHistory = async (req, res) => {
  try {
    const history = await TaskService.getTaskHistory(req.user.id);

    return res.status(200).json({
      status: 'success',
      dataHistory: history,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteHistoryById = async (req, res) => {
  try {
    await TaskService.deleteHistoryById(req.user.id, req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Riwayat tugas berhasil dihapus.',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteAllHistory = async (req, res) => {
  try {
    await TaskService.deleteAllHistory(req.user.id);

    return res.status(200).json({
      status: 'success',
      message: 'Seluruh riwayat berhasil dihapus.',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteTaskById = async (req, res) => {
  try {
    const task = await TaskService.deleteTaskById(req.user.id, req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Task berhasil dihapus.',
      dataTask: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
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
