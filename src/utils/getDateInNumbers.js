function getDateInNumbers() {
    const date = new Date();
    return Date.parse(date);
  }

exports.getDateInNumbers = getDateInNumbers;