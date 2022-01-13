const { redirect } = require("express/lib/response");
const {ObjectId} = require("mongodb")
const dbConnection = require("../../models/db_connec");
const ValiadtorController = require("./validator");

class User {
  static searchUserByID = (id, data) => {
    let userIndex = data.findIndex((el) => el.id == id);
    return userIndex;
  };
  static showAll = (req, res) => {
    dbConnection((err, client, db) => {
      db.collection("data")
        .find()
        .toArray((error, result) => {
          if (error) return redirect("/err");
          const data = result;
          const isEmpty = data.length == 0;
          client.close();
          res.render("index", { pageTitle: "All Users", data, isEmpty });
        });
    });
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

    dbConnection((err, client, db) => {
      db.collection("data").insertOne(user, (error, result) => {
        if (err) return res.redirect("/err");
        client.close();
        res.render("single", {
          pageTitle: "User Details",
          user: user,
          isNotFound: false,
        });
      });
    });
  };

  static singleUser = (req, res) => {
    let isNotFound = false;
    const id = req.params.id;
    dbConnection((err, client, db) => {
      db.collection("data").find({ _id: ObjectId(id) }, (err, result) => {
        if (err) {
          res.redirect("/err");
          client.close();
        }
        res.render("single", {
          pageTitle: "User Details",
          user: data[userIndex],
          isNotFound,
        });
      });
    });
  };
  static editUserPost = (req, res) => {
    const heads = ["name", "address", "phoneNumber", "balance"];
    const id = req.params.id;
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
    dbConnection((err, client) => {
      if (err) res.redirect("/err");
      client
        .collection("data")
        .updateOne(
          {
            _id: new ObjectId(req.params.id),
          },
          {
            $set: {
              name: req.body.name,
              age: req.body.age,
              email: req.body.email,
            },
          }
        )
        .then((result) => {
          client.close();
          res.redirect("/");
        })
        .catch((error) => res.redirect("/err"));
    });
  };

  static editUser = (req, res) => {
    res.render("edit", {
      pageTitle: "Edit User Details",
    });
  };

  static deleteUser = (req, res) => {
    const id = req.params.id;
    dbConnection((e, client) => {
      db.collection
        .deleteOne({ _id: ObjectId(id) })
        .then((result) => {
          client.close();
          res.redirect("/");
        })
        .catch((error) => res.redirect("/err"));
    });
  };

  static transaction = (req, res) => {
    const id = req.params.id;
    let trans = req.body;
    if (ValiadtorController.isNotNumber(trans.amount)) {
      res.render("single", {
        error: "Transaction amount Should Be a Number",
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

    dbConnection((err, client) => {
      if (err) res.redirect("/err");
      client
        .collection("data")
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              transactions: newTransaction,
            },
          }
        )
        .then((result) => {
          client.close();
          res.redirect("/");
        })
        .catch((error) => res.redirect("/err"));
    });
  };
}
module.exports = User;
