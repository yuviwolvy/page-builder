import express from "express";
import UsersCtrl from "./users.controller.js";

const router = express.Router();

router.route("/new").post(UsersCtrl.apiPostUser);
router.route("/:id")
    .get(UsersCtrl.apiGetUser);

export default router;