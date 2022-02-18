const router = require("express").Router();
const userController = require("../controllers/auth-controllers");
const auth = require("../controllers/auth");
router.get("/hello", userController.hello);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/googleLogin", userController.googleLogin);
router.post("/verifyUser", auth.required, userController.activateAccount);
module.exports = router;
