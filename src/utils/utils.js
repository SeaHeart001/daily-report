
const format = function (date, formatString) {
    formatString = formatString || "YYYY-MM-DD hh:mm:ss";
    let year = new Date(date).getFullYear();
    let month =
      new Date(date).getMonth() + 1 > 9
        ? new Date(date).getMonth() + 1
        : "0" + (new Date(date).getMonth() + 1);
    let day =
      new Date(date).getDate() > 9
        ? new Date(date).getDate()
        : "0" + new Date(date).getDate();
    let hours =
      new Date(date).getHours() > 9
        ? new Date(date).getHours()
        : "0" + new Date(date).getHours();
    let minutes =
      new Date(date).getMinutes() > 9
        ? new Date(date).getMinutes()
        : "0" + new Date(date).getMinutes();
    let seconds =
      new Date(date).getSeconds() > 9
        ? new Date(date).getSeconds()
        : "0" + new Date(date).getSeconds();
    let result = formatString
      .replace("YYYY", year)
      .replace("MM", month)
      .replace("DD", day)
      .replace("hh", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
    return result;
  };

  export {
    format
  }