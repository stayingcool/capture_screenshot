const today = new Date();

const getToday = () => {
  return getDateInDDMMYYYFormat(today);
};

const getTomorrow = () => {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateInDDMMYYYFormat(tomorrow);
};

const getDateInDDMMYYYFormat = (date) => {
  const dd = String(date.getDate()).padStart(2, "0"),
    mm = String(date.getMonth() + 1).padStart(2, "0"),
    yy = date.getFullYear();
  return `${yy}-${mm}-${dd} 00:00:00`;
};

module.exports = { getToday, getTomorrow };
