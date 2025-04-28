const db = require("../db/connection");

export const selectApi = () => {
  return db.query();
};
