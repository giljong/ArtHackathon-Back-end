const router = require("express").Router()
const controller = require("./auth")
const authmiddleware = require('./authmiddleware');

router.get('/rank',authmiddleware,controller.rank)

router.post("/register", controller.register)
router.post("/login", controller.login)


module.exports = router