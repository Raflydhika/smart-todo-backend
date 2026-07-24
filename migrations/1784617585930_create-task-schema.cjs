/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('tasks', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    difficulty: {
      type: 'integer',
      notNull: true,
    },
    user_estimated_time: {
      type: 'integer',
      notNull: true,
    },
    deadline: {
      type: 'timestamp',
      notNull: true,
    },
    priority_score: {
      type: 'real',
      default: 0,
    },
    predicted_time: {
      type: 'numeric',
      allowNull: true,
    },
    status: {
      type: 'varchar(20)',
      default: 'pending',
    },
    actual_time: {
      type: 'integer',
      allowNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    description: {
      type: 'text',
      allowNull: true,
    },
    prediction_source: {
      type: 'varchar(20)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('tasks');
};
