const { prop, compose } = require("./core.js");

const convertTZ = (tzString) => (date) =>
  new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );

const convertHawaiiTZ = convertTZ("Pacific/Honolulu");
const computeCurrentDateTime = () => {
  let now = new Date();
  return () => now;
};
const getCurrentDateTime = () => computeCurrentDateTime()();
const getTime = (date) => {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  return {
    day: dayOfWeek,
    hour: hour >= 12 ? hour - 12 : hour === 0 ? 12 : hour,
    minute: date.getMinutes(),
    am_pm: hour >= 12 ? "pm" : "am",
  };
};

const hawaiiTime = compose(getTime, convertHawaiiTZ);
const getDay = compose(prop("day"), hawaiiTime);

module.exports = { getCurrentDateTime, hawaiiTime, getDay };
