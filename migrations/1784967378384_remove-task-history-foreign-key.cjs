exports.up = (pgm) => {
  pgm.dropConstraint('tasks_history', 'tasks_history_task_id_fkey');
};

exports.down = (pgm) => {
  pgm.addConstraint('tasks_history', 'tasks_history_task_id_fkey', {
    foreignKeys: {
      columns: 'task_id',
      references: 'tasks(id)',
      onDelete: 'set null',
    },
  });
};
