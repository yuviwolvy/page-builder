import express from "express";
import ContentsCtrl from "./contents.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.route("/addblog").post(upload.single("attachments"), ContentsCtrl.apiPostContent);
router.route("/user/:id").get(ContentsCtrl.apiGetBlogs);
router.route("/published").get(ContentsCtrl.apiGetPublishedPages);
router.route("/page/:id").get(ContentsCtrl.apiGetPageBySlug);
router.route("/download/uploads/:id").get(ContentsCtrl.apiGetFile);
router.route("/:id")
    .get(ContentsCtrl.apiGetPageData)
    .put(ContentsCtrl.apiUpdatePage)
    .delete(ContentsCtrl.apiDeletePage);

export default router;