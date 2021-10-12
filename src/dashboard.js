const { Some, None, isNone, id, compose } = require("./core.js");
const db = require("../data/db.js");

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
const prop = (name) => (x) => x[name]; // get a property name
const hawaiiTime = compose(getTime, convertHawaiiTZ);
const getDay = compose(prop("day"), hawaiiTime);

/* Transfer Station Domain */
const convertDayToInt = (x) => {
  const days = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return prop(x.toLowerCase())(days);
};

const facilityClosed = (facility) => None(`${facility.name}: closed`);
const openNow = (facility) =>
  Some(`${facility.name}: open now, closes at ${facility.close} pm`);

const getDays = (x) => x.split("/").map(convertDayToInt); // split on the days field from Facility structure
const byDay = (x) => x.includes(getDay(getCurrentDateTime()));
const isToday = compose(compose(byDay, getDays), prop("days"));

const maybeOpenByDay = (facility) =>
  isToday(facility) ? Some(facility) : facilityClosed(facility);

const hourToInt = compose(parseInt, (x) => x.split(":"));
const getOpenHour = compose(hourToInt, prop("open"));
const getClosedHour = compose(hourToInt, prop("close"));
const isAM = (x) => x.am_pm === "am";

const maybeOpenByHour = (time, facility) =>
  isAM(time)
    ? time.hour < getOpenHour(facility)
      ? facilityClosed(facility)
      : openNow(facility)
    : time.hour >= getClosedHour(facility)
    ? facilityClosed(facility)
    : openNow(facility);

const isOpen = (facility) => {
  const res = maybeOpenByDay(facility);
  return isNone(res)
    ? res
    : maybeOpenByHour(hawaiiTime(getCurrentDateTime()), facility);
};

const TransferStation = (x) => ({
  map: (f) => TransferStation(f(x)),
  fold: (f) => f(x),
  inspect: () => `TransferStation(${x})`,
});

const getFacilityHours = compose((x) => x.map(isOpen), TransferStation);
const unwrapTransferStationHours = compose(
  (x) => x.contents(),
  (x) => x.fold(id)
);
const getTransferStationHours = compose(
  unwrapTransferStationHours,
  getFacilityHours
);
const showFunctor = compose(console.log, (x) => x.inspect());
const exec = () => db.data.map(getTransferStationHours);
/* ============================================== */
const app = () => exec();
module.exports = { app };
