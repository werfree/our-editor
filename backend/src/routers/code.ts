import { getCode, saveCode } from "../modules/service/code";

import express from "express";

const router = express.Router();

router.get("/:codeId", getCode);
router.post("/save", saveCode);

export default router;
