/* jshint esversion: 6 */
function getNormalCount(number, one, two, five) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number == 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;
}

module.exports = function(time) {
    var sec = time;
    var min = sec / 60;
    var hour = min / 60;

    var normalDay = `${Math.floor(hour / 24)} ${getNormalCount(Math.floor(hour / 24), "день", "дня", "дней")}`;
    var normalHour = `${Math.floor(hour % 24)} ${getNormalCount(Math.floor(hour % 24), "час", "часа", "часов")}`;
    var normalMinutes = `${Math.floor(min % 60)} ${getNormalCount(Math.floor(min % 60), "минута", "минуты", "минут")}`;
    var normalSeconds  = `${Math.floor(sec % 60)} ${getNormalCount(Math.floor(sec % 60), "секунда", "секунды", "секунд")}`;

    return `${normalDay}, ${normalHour}, ${normalMinutes}, ${normalSeconds}`;
};