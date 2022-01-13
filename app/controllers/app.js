const fs = require("fs");
const ValiadtorController = require("./validator");

const readFromJSON = () => {
  let data;
  try {
    data = JSON.parse(fs.readFileSync("./models/data.json"));
    if (!Array.isArray(data)) throw new Error();
  } catch (e) {
    data = [];
  }
  return data;
};

const writeDataToJSON = (data) => {
  try {
    fs.writeFileSync("./models/data.json", JSON.stringify(data));
  } catch (e) {
    console.log(e.message);
  }
};

class User {
  static showAll = (req, res) => {
    const data = readFromJSON();
    const isEmpty = data.length == 0;
    res.render("index", { pageTitle: "All Users", data, isEmpty });
  };

  static addUser = (req, res) => {
    res.render("add", { pageTitle: "Add New User" });
  };

  static addUserLogic = (req, res) => {
    let user = req.body;
    if (ValiadtorController.isNotNumber(req.body.balance)) {
      res.render("add", { error: "Balance Should Be a Number" });
    }
    if (!ValiadtorController.isMobilePhone(req.body.phoneNumber)) {
      res.render("add", { error: "Mobile number is not valid" });
    }
    if (ValiadtorController.isEmptyString(req.body.name)) {
      res.render("add", { error: "Name cannot be empty" });
    }
    const data = readFromJSON();
    if (data.length == 0) user.id = 5000;
    else user.id = data[data.length - 1].id + 1;
    user.transactions = [];
    data.push(user);
    writeDataToJSON(data);

    res.render("single", {
      pageTitle: "User Details",
      user: user,
      isNotFound: false,
    });
  };
  static searchUserByID = (id, data) => {
    let userIndex = data.findIndex((el) => el.id == id);
    return userIndex;
  };
  static singleUser = (req, res) => {
    let isNotFound = false;
    const id = req.params.id;
    const data = readFromJSON();
    const userIndex = this.searchUserByID(id, data);
    if (userIndex == -1) isNotFound = true;
    res.render("single", {
      pageTitle: "User Details",
      user: data[userIndex],
      isNotFound,
    });
  };

  static editUserPost = (req, res) => {
    const heads = ["name", "address", "phoneNumber", "balance"];
    const id = req.params.id;
    const data = readFromJSON();
    const userIndex = this.searchUserByID(id, data);
    if (!ValiadtorController.isMobilePhone(req.body.phoneNumber)) {
      res.render("edit", {
        error: "Mobile number is not valid",
        pageTitle: "Edit User Details",
        user: data[userIndex],
      });
    }
    if (ValiadtorController.isEmptyString(req.body.name)) {
      res.render("edit", {
        error: "Name cannot be empty",
        pageTitle: "Edit User Details",
        user: data[userIndex],
      });
    }

    heads.forEach((head) => {
      data[userIndex][head] = req.body[head];
    });
    res.render("single", {
      pageTitle: "User Details",
      user: data[userIndex],
      isNotFound: false,
    });
  };

  static editUser = (req, res) => {
    let isNotFound = false;
    const id = req.params.id;
    const data = readFromJSON();
    const userIndex = this.searchUserByID(id, data);
    if (userIndex == -1) isNotFound = true;
    res.render("edit", {
      pageTitle: "Edit User Details",
      user: data[userIndex],
      isNotFound,
    });
  };

  static deleteUser = (req, res) => {
    const id = req.params.id;
    const data = readFromJSON();
    const userIndex = this.searchUserByID(id, data);
    if (userIndex != -1) {
      data.splice(userIndex, 1);
      writeDataToJSON(data);
      res.redirect("/");
    } else res.redirect("/err");
  };

  static transaction = (req, res) => {
    const id = req.params.id;
    let trans = req.body;
    const data = readFromJSON();
    const userIndex = this.searchUserByID(id, data);
    if (ValiadtorController.isNotNumber(trans.amount)) {
      res.render("single", {
        error: "Transaction amount Should Be a Number",
        pageTitle: "User Details",
        user: data[userIndex],
        isNotFound: false,
      });
    }

    const newTransaction = {};
    newTransaction.type = trans.type;
    newTransaction.amount = Number(trans.amount);
    newTransaction.time = new Date();
    if (newTransaction.type === "withdraw")
      newTransaction.amount = -newTransaction.amount;
    let balance = Number(data[userIndex].balance);
    balance += newTransaction.amount;
    data[userIndex].balance = balance;
    data[userIndex].transactions.push(newTransaction);

    writeDataToJSON(data);

    res.render("single", {
      pageTitle: "User Details",
      user: data[userIndex],
      isNotFound: false,
    });
  };
}
module.exports = User;
