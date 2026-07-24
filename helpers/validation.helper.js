const validateTask = (taskData) => {
  const { title, difficulty, user_estimated_time, deadline, description } =
    taskData;

  // ===== Title =====
  if (!title || title.trim() === '') {
    throw {
      status: 400,
      message: 'Title wajib diisi.',
    };
  }

  if (title.length > 100) {
    throw {
      status: 400,
      message: 'Title maksimal 100 karakter.',
    };
  }

  // ===== Difficulty =====
  if (difficulty === undefined || difficulty === null) {
    throw {
      status: 400,
      message: 'Difficulty wajib diisi.',
    };
  }

  if (!Number.isInteger(difficulty)) {
    throw {
      status: 400,
      message: 'Difficulty harus berupa angka bulat.',
    };
  }

  if (difficulty < 1 || difficulty > 5) {
    throw {
      status: 400,
      message: 'Difficulty harus bernilai antara 1 sampai 5.',
    };
  }

  // ===== User Estimated Time (Opsional) =====
  if (
    user_estimated_time !== undefined &&
    user_estimated_time !== null &&
    user_estimated_time !== ''
  ) {
    if (!Number.isInteger(user_estimated_time)) {
      throw {
        status: 400,
        message: 'Estimasi waktu harus berupa angka bulat.',
      };
    }

    if (user_estimated_time <= 0) {
      throw {
        status: 400,
        message: 'Estimasi waktu harus lebih dari 0 menit.',
      };
    }
  }

  // ===== Deadline (Opsional) =====
  if (deadline) {
    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      throw {
        status: 400,
        message: 'Format deadline tidak valid.',
      };
    }
  }

  // ===== Description =====
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    throw {
      status: 400,
      message: 'Description harus berupa text.',
    };
  }
};

export { validateTask };
