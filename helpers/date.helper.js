const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

const getRemainingDays = (deadline) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();

  const diffTime = deadlineDate.getTime() - today.getTime();

  return diffTime / (1000 * 60 * 60 * 24);
};

const isDeadlinePassed = (deadline) => {
  return getRemainingDays(deadline) < 0;
};

export { getCurrentTimestamp, getRemainingDays, isDeadlinePassed };
