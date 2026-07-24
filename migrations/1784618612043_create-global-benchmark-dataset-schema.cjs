/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('global_benchmark_dataset', {
    task_id: {
      type: 'serial',
      primaryKey: true,
    },
    difficulty: {
      type: 'integer',
      notNull: true,
    },
    priority_score: {
      type: 'integer',
      notNull: true,
    },
    user_estimated_time: {
      type: 'integer',
    },
    actual_time: {
      type: 'integer',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('global_benchmark_dataset');
};
