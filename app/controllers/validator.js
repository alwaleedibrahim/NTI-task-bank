const validator = require("validator");
class ValiadtorController {
  static isEmptyString = (val) => {
    return val.length == 0;
  };
  static isMobilePhone = (val) => {
    return validator.isMobilePhone(val);
  };
  static isNotNumber = (val) => {
    return isNaN(val);
  };
}
module.exports = ValiadtorController;
