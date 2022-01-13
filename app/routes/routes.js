const router = require("express").Router();
const User = require("../controllers/app");

router.get("/", User.showAll);
router.get("/add", User.addUser);
router.post("/add", User.addUserLogic);
router.post("/transaction/:id", User.transaction);

router.get("/edit/:id", User.editUser);
router.post("/edit/:id", User.editUserPost);

router.get("/delete/:id", User.deleteUser);
router.get("/single/:id", User.singleUser);
module.exports = router;
