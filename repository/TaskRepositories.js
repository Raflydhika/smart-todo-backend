import pool from '../config/db.js';

const BASE_SELECT = `
SELECT
    id,
    user_id,
    title,
    difficulty,
    user_estimated_time,
    TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
    priority_score,
    predicted_time,
    prediction_source,
    actual_time,
    status,
    description,
    created_at,
    updated_at
FROM tasks
`;

// Menambah Task
const createTask = async (taskData) => {
  const normalizedDeadline =
    taskData.deadline === '' || taskData.deadline === undefined
      ? null
      : taskData.deadline;

  const query = {
    text: `
      INSERT INTO tasks (
        user_id,
        title,
        difficulty,
        user_estimated_time,
        deadline,
        priority_score,
        predicted_time,
        prediction_source,
        status,
        actual_time,
        created_at,
        updated_at,
        description
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
     RETURNING
    id,
    user_id,
    title,
    difficulty,
    user_estimated_time,
    TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
    priority_score,
    predicted_time,
    prediction_source,
    actual_time,
    status,
    description,
    created_at,
    updated_at
    `,
    values: [
      taskData.user_id,
      taskData.title,
      taskData.difficulty,
      taskData.user_estimated_time,
      normalizedDeadline,
      taskData.priority_score,
      taskData.predicted_time,
      taskData.prediction_source,
      taskData.status,
      taskData.actual_time,
      taskData.created_at,
      taskData.updated_at,
      taskData.description,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

// Ambil Task
const getAllTask = async (userId) => {
  const query = {
    text: `
    ${BASE_SELECT}
    WHERE user_id = $1
    ORDER BY created_at DESC
  `,
    values: [userId],
  };

  const result = await pool.query(query);

  return result.rows;
};

// Ambil Task berdasar ID
const getTaskById = async (userId, id) => {
  const query = {
    text: `
      ${BASE_SELECT}
     WHERE id = $1
     AND user_id = $2
    `,
    values: [id, userId],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

// Ambil Task berdasar Priority Score
const getTaskSorted = async (userId) => {
  const query = {
    text: `
    ${BASE_SELECT}
    WHERE user_id = $1
    ORDER BY
      priority_score DESC,
      deadline ASC,
      difficulty DESC
  `,
    values: [userId],
  };

  const result = await pool.query(query);

  return result.rows;
};

// Complete Task
const completeTask = async (userId, id, actualTime) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Ambil data task
    const taskResult = await client.query(
      `
      SELECT
        id,
        user_id,
        title,
        description,
        difficulty,
        user_estimated_time,
        TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
        priority_score,
        predicted_time,
        prediction_source
      FROM tasks
      WHERE id = $1
      AND user_id = $2;
      `,
      [id, userId],
    );

    if (taskResult.rowCount === 0) {
      throw {
        status: 404,
        message: 'Task tidak ditemukan.',
      };
    }

    const task = taskResult.rows[0];

    console.log(task);
    // Simpan ke history
    const historyResult = await client.query(
      `
      INSERT INTO tasks_history
      (
      task_id,
      user_id,
      title,
      description,
      difficulty,
      user_estimated_time,
      deadline,
      priority_score,
      predicted_time,
      prediction_source,
      actual_time,
      completed_at
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING
      id,
      task_id,
      user_id,
      title,
      description,
      difficulty,
      user_estimated_time,
      deadline,
      priority_score,
      predicted_time,
      prediction_source,
      actual_time,
      completed_at
      `,
      [
        task.id,
        task.user_id,
        task.title,
        task.description,
        task.difficulty,
        task.user_estimated_time,
        task.deadline,
        task.priority_score,
        task.predicted_time,
        task.prediction_source,
        actualTime,
        new Date(),
      ],
    );

    // Hapus task aktif
    const deleteResult = await client.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      AND user_id = $2
      `,
      [id, userId],
    );

    // Validasi penghapusan
    if (deleteResult.rowCount === 0) {
      throw {
        status: 500,
        message: 'Gagal menghapus task setelah dipindahkan ke history.',
      };
    }

    await client.query('COMMIT');

    return historyResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getTaskHistory = async (userId) => {
  const query = {
    text: `
      SELECT
      id,
      task_id,
      user_id,
      title,
      description,
      difficulty,
      user_estimated_time,
      TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
      priority_score,
      predicted_time,
      prediction_source,
      actual_time,
      completed_at
  FROM tasks_history  
    WHERE user_id = $1
    ORDER BY completed_at DESC
    `,
    values: [userId],
  };

  const result = await pool.query(query);

  return result.rows;
};

// Ambil satu history berdasarkan ID
const getHistoryById = async (userId, id) => {
  const query = {
    text: `
      SELECT
        id,
        task_id,
        user_id,
        title,
        description,
        difficulty,
        user_estimated_time,
        TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
        priority_score,
        predicted_time,
        prediction_source,
        actual_time,
        completed_at
      FROM tasks_history
      WHERE id = $1
      AND user_id = $2
    `,
    values: [id, userId],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

/**
 * Menghapus task
 */
const deleteTaskById = async (userId, id) => {
  const query = {
    text: `
      DELETE FROM tasks
      WHERE id = $1
      AND user_id = $2
      RETURNING
        id
    `,
    values: [id, userId],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const editTaskById = async (userId, id, taskData) => {
  const {
    title,
    difficulty,
    user_estimated_time,
    deadline,
    description,
    priority_score,
    predicted_time,
    prediction_source,
    updated_at,
  } = taskData;

  const normalizedDeadline =
    deadline === '' || deadline === undefined ? null : deadline;

  const query = {
    text: `
      UPDATE tasks
      SET
        title = $1,
        difficulty = $2,
        user_estimated_time = $3,
        deadline = $4,
        description = $5,
        priority_score = $6,
        predicted_time = $7,
        prediction_source = $8,
        updated_at = $9
      WHERE id = $10
      AND user_id = $11
     RETURNING
    id,
    user_id,
    title,
    difficulty,
    user_estimated_time,
    TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
    priority_score,
    predicted_time,
    prediction_source,
    actual_time,
    status,
    description,
    created_at,
    updated_at
    `,
    values: [
      title,
      difficulty,
      user_estimated_time,
      normalizedDeadline,
      description,
      priority_score,
      predicted_time,
      prediction_source,
      updated_at,
      id,
      userId,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

// Menghapus History
const deleteHistoryById = async (userId, historyId) => {
  const query = {
    text: `
      DELETE FROM tasks_history
      WHERE id = $1
      AND user_id = $2
      RETURNING id
    `,
    values: [historyId, userId],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const deleteAllHistory = async (userId) => {
  const query = {
    text: `
      DELETE FROM tasks_history
      WHERE user_id = $1
    `,
    values: [userId],
  };

  await pool.query(query);

  return true;
};

export {
  createTask,
  getAllTask,
  getTaskById,
  getTaskSorted,
  completeTask,
  deleteTaskById,
  getTaskHistory,
  getHistoryById,
  deleteHistoryById,
  deleteAllHistory,
  editTaskById,
};
