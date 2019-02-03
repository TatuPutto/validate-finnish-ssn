var SSN_REGEX = /^(((0[1-9]|[12][0-9]|3[01])(0[13578]|10|12))|((0[1-9]|[12][0-9]|30)(0[469]|11))|(0[1-9]|[12][0-9])02)[0-9]{2}[+-A][0-9]{3}[0-9A-FHJ-NPR-Y]$/;

/*
 * Check if argument ssn is valid Finnish Social Security Number.
 * @param {string} ssn - SSN to validate.
 * @param {boolean} allowTemporary - should validation allow temporary SSNs.
 * @return {boolean}
 */
export default function isValidFinnishSsn(ssn, allowTemporary) {
  return ssn &&
         structureIsValid(ssn) &&
         idNumberIsValid(ssn, allowTemporary) &&
         checkDigitIsValid(ssn);

}

// SSN adheres to one of following formats:
// XXXXXX+XXXX || XXXXXX-XXXX || XXXXXXAXXXX
function structureIsValid(ssn) {
  ssn = ssn.toUpperCase();
  return SSN_REGEX.test(ssn);
}

// Validate id number (......-XXX.).
function idNumberIsValid(ssn, allowTemporary) {
  var idNumber = parseInt(ssn.substring(7, 10));

  // Temporary id number can range from 900 to 999.
  if (allowTemporary && idNumber > 899 && idNumber < 1000) {
    return true;
  // Permanent id number can range from 2 to 899
  } else if (idNumber > 1 && idNumber < 900) {
    return true;
  } else {
    return false;
  }
};

// Validate check digit (......-...X).
function checkDigitIsValid(ssn) {
  var expectedCheckDigit = getCheckDigit(ssn).toLowerCase();
  var checkDigit = ssn.charAt(ssn.length - 1).toLowerCase();

  if (checkDigit === expectedCheckDigit) {
    return true;
  } else {
    return false;
  }
};

function getCheckDigit(ssn) {
  // Accept SSN ending in 0000 for testing purposes in development builds.
  if (process.env.NODE_ENV === 'development' && ssn.substring(7, 11) === '0000') {
    return '0';
  }

  var mod = (ssn.substring(0, 6) + ssn.substring(7, 10)) % 31;

  if (mod >= 0 && mod <= 9) {
    return mod.toString();
  } else if (mod >= 10 && mod <= 15) {
    return String.fromCharCode(55 + mod);
  } else if (mod === 16) {
    return 'H';
  } else if (mod >= 17 && mod <= 21) {
    return String.fromCharCode(57 + mod);
  } else if (mod === 22) {
    return 'P';
  } else if (mod >= 23 && mod <= 30) {
    return String.fromCharCode(59 + mod);
  } else {
    return false;
  }
};
