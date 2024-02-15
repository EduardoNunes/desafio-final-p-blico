const { isAfter, parseISO, startOfDay } = require("date-fns");

function dateValidator(date) {
  const currentDate = startOfDay(new Date());
  const dueDate = startOfDay(parseISO(date));
  return isAfter(currentDate, dueDate);
}

function updateClientStatus(status, updatedDate) {
  if (
    status === "Paga" ||
    (status === "Pendente" && !dateValidator(updatedDate))
  ) {
    return "Em Dia";
  } else {
    return "Inadimplente";
  }
}

module.exports = { dateValidator, updateClientStatus };
