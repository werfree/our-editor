import { Request, Response } from "express";
import CodeRepository, { Code } from "../repository/code";

interface CodeParams {
  codeId: string;
}

export const getCode = async (req: Request<CodeParams>, res: Response) => {
  const { codeId } = req.params;
  console.log(req.query);
  if (!codeId) {
    return res.status(400).json({
      message: "Invalid code",
    });
  }
  CodeRepository.findOneById(codeId)
    .then((code) => {
      if (!code) {
        return res.status(404).json({
          message: "Code not found",
          status: "404",
        });
      }
      return res.status(200).json({
        code: code,
        message: "Code retrieved successfully",
        status: "200",
      });
    })
    .catch((e) => {
      console.error(e?.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};
export const saveCode = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const { editorId, code, language, createdBy } = requestBody;
  if (!editorId || !code || !language || !createdBy) {
    return res.status(400).json({
      message: "Incorrect configuration",
    });
  }
  const codeObj: Code = {
    code: code,
    createdAt: new Date().toISOString(),
    createdBy: createdBy,
    editorId: editorId,
    isEditable: false,
    isPublic: true,
    language: language,
    sharedWith: [],
  };
  const codeId = await CodeRepository.save(editorId, codeObj).catch((e) => {
    console.error(e?.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  });
  return res.status(200).json({
    codeId: codeId,
    message: "Code saved successfully",
    status: "200",
  });
};
