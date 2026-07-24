/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('tasks_history', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    task_id: {
      type: 'integer',
      notNull: true,
      references: '"tasks"',
      onDelete: 'set null',
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    difficulty: {
      type: 'integer',
      notNull: true,
    },
    user_estimated_time: {
      type: 'integer',
      notNull: true,
    },
    predicted_time: {
      type: 'numeric',
      notNull: true,
    },
    actual_time: {
      type: 'integer',
      notNull: true,
    },
    completed_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    description: {
      type: 'text',
      allowNull: true,
    },
    deadline: {
      type: 'timestamp',
      notNull: true,
    },
    priority_score: {
      type: 'real',
      default: 0,
    },
    prediction_source: {
      type: 'varchar(20)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('tasks_history');
};
