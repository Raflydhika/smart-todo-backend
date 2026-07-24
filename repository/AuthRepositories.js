import pool from '../config/db.js';

// Menambahkan user baru ke database
const createUser = async (userData) => {
  const query = {
    text: `
      INSERT INTO users (
        username,
        password,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        username,
        created_at,
        updated_at
    `,
    values: [
      userData.username,
      userData.password,
      userData.created_at,
      userData.updated_at,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

// Mencari user berdasarkan username
const getUserByUsername = async (username) => {
  const query = {
    text: `
      SELECT
        id,
        username,
        password,
        created_at,
        updated_at
      FROM users
      WHERE username = $1
    `,
    values: [username],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

// Mencari user berdasarkan id
const getUserById = async (id) => {
  const query = {
    text: `
      SELECT
        id,
        username,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `,
    values: [id],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

export { createUser, getUserByUsername, getUserById };
