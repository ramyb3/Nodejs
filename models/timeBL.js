const time = function (first, last) {
  let a = last.getHours();
  let b = first.getHours();
  let c = last.getMinutes();
  let d = first.getMinutes();

  if (a == 0)
    //if midnight
    a = 24;

  if (b == 0)
    //if midnight
    b = 24;

  let x = 1440 - (b * 60 + d - (a * 60 + c)); //1440 - 24 hours in minutes

  if (x > 1440)
    //if next day
    x = x - 1440;

  if (x == 1440) {
    //24 hours exactly
    return "YOU ARE OUT OF CREDITS, COME BACK WITHIN 24 HOURS";
  }

  let h = Math.floor(x / 60);
  let m = x % 60;

  if (h < 10 && m > 9) {
    return (
      "YOU ARE OUT OF CREDITS, COME BACK WITHIN  0" + h + ":" + m + " HOURS"
    );
  }

  if (h > 9 && m < 10) {
    return (
      "YOU ARE OUT OF CREDITS, COME BACK WITHIN  " + h + ":0" + m + " HOURS"
    );
  }

  if (h > 9 && m > 9) {
    return "YOU ARE OUT OF CREDITS, COME BACK WITHIN " + h + ":" + m + " HOURS";
  }

  if (h < 10 && m < 10) {
    return (
      "YOU ARE OUT OF CREDITS, COME BACK WITHIN 0" + h + ":0" + m + " HOURS"
    );
  }
};

module.exports = { time };
