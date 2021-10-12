const { id, compose } = require("./core.js");
const db = require("../data/db.js");
const { isOpen, TransferStation } = require("./transferstation.js");

const getFacilityHours = compose((x) => x.map(isOpen), TransferStation);
const unwrapTransferStationHours = compose(
  (x) => x.contents(),
  (x) => x.fold(id)
);
const getTransferStationHours = compose(
  unwrapTransferStationHours,
  getFacilityHours
);
const exec = () => db.data.map(getTransferStationHours);
/* ============================================== */
const app = () => exec();
module.exports = { app };
