exports.up = (pgm) => {
  pgm.alterColumn('tasks_history', 'user_estimated_time', {
    notNull: false,
  });

  pgm.alterColumn('tasks_history', 'deadline', {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('tasks_history', 'user_estimated_time', {
    notNull: true,
  });

  pgm.alterColumn('tasks_history', 'deadline', {
    notNull: true,
  });
};
