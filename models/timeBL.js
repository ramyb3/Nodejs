exports.time = function (first, last) {
  let endHour = last.getHours();
  let startHour = first.getHours();
  let endMinute = last.getMinutes();
  let startMinute = first.getMinutes();

  if (endHour == 0) {
    //if midnight
    endHour = 24;
  }
  if (startHour == 0) {
    //if midnight
    startHour = 24;
  }

  let calc = 1440 - (startHour * 60 + startMinute - (endHour * 60 + endMinute)); //1440 - 24 hours in minutes

  //if next day
  if (calc > 1440) {
    calc = calc - 1440;
  }

  //24 hours exactly
  if (calc == 1440) {
    return "YOU ARE OUT OF CREDITS, COME BACK WITHIN 24 HOURS";
  }

  const h = Math.floor(calc / 60);
  const m = calc % 60;
  let msg;

  if (h < 10 && m > 9) {
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
