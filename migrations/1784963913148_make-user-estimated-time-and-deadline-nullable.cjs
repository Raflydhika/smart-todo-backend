exports.up = (pgm) => {
  pgm.alterColumn('tasks', 'user_estimated_time', {
    notNull: false,
  });

  pgm.alterColumn('tasks', 'deadline', {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('tasks', 'user_estimated_time', {
    notNull: true,
  });

  pgm.alterColumn('tasks', 'deadline', {
    notNull: true,
  });
};
