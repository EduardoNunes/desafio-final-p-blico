export default function validateCpf(cpfFormatted) {
  let cpf = cpfFormatted.replace(/[^\d]+/g, "");
  let sumOfdigits = 0;

  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) {
    return false;
  }

  for (let index = 0; index < 9; index++) {
    sumOfdigits += parseInt(cpf.charAt(index)) * (10 - index);
  }

  let firstDigit = 11 - (sumOfdigits % 11);

  if (firstDigit == 10 || firstDigit == 11) {
    firstDigit = 0;
  }
  if (firstDigit != parseInt(cpf.charAt(9))) {
    return false;
  }

  sumOfdigits = 0;

  for (let index = 0; index < 10; index++) {
    sumOfdigits += parseInt(cpf.charAt(index)) * (11 - index);
  }

  let secondDigit = 11 - (sumOfdigits % 11);

  if (secondDigit == 10 || secondDigit == 11) {
    secondDigit = 0;
  }
  if (secondDigit != parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}
