const { Some, None, isNone, compose, prop } = require("./core.js");
const { getCurrentDateTime, hawaiiTime, getDay } = require("./timezone.js");

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

module.exports = { isOpen, TransferStation };
