import { getRemainingDays } from './date.helper.js';

const calculateUrgencyScore = (deadline) => {
  // Jika deadline tidak diisi, maka tugas dianggap memiliki tingkat urgensi terendah.
  if (!deadline) {
    return 1;
  }

  const remainingDays = getRemainingDays(deadline);

  if (remainingDays < 0) return 5;
  if (remainingDays <= 3) return 4;
  if (remainingDays <= 5) return 3;
  if (remainingDays <= 7) return 2;

  return 1;
};

const calculatePriorityScore = (difficulty, deadline) => {
  const urgencyScore = calculateUrgencyScore(deadline);

  const priorityScore = urgencyScore * 0.6 + difficulty * 0.4;

  return Number(priorityScore.toFixed(2));
};

export { calculateUrgencyScore, calculatePriorityScore };
