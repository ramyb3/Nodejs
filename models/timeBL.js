exports.time = function (first, last) {
  const DAY_IN_MINUTES = 1440;
  const MINUTES = 60;
  const HOURS = 24;
  const endHour = last.getHours() == 0 ? HOURS : last.getHours();
  const startHour = first.getHours() == 0 ? HOURS : first.getHours();
  const endMinute = last.getMinutes();
  const startMinute = first.getMinutes();
  let calc =
    DAY_IN_MINUTES -
    (startHour * MINUTES + startMinute - (endHour * MINUTES + endMinute));

  //if next day
  if (calc > DAY_IN_MINUTES) {
    calc = calc - DAY_IN_MINUTES;
  }

  const h = Math.floor(calc / MINUTES);
  const m = calc % MINUTES;
  let msg;

  if (calc == DAY_IN_MINUTES) {
    msg = `${HOURS}`;
  } else if (h < 10 && m > 9) {
    msg = `0${h}:${m}`;
  } else if (h > 9 && m < 10) {
    msg = `${h}:0${m}`;
  } else if (h > 9 && m > 9) {
    msg = `${h}:${m}`;
  } else if (h < 10 && m < 10) {
    msg = `0${h}:0${m}`;
  }

  return `YOU ARE OUT OF CREDITS, COME BACK WITHIN ${msg} HOURS`;
};
