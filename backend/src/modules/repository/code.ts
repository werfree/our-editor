import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../../helpers/db";
import generateId from "../../utils/generateId";

export type Code = {
  code: string;
  language: string;
  createdBy: string;
  sharedWith?: string[];
  isPublic: boolean;
  isEditable: boolean;
  createdAt: string;
  editorId: number;
};
class CodeRepository {
  tableName: string;
  constructor() {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_CODE ?? "";
  }

  async findOneById(codeId: string) {
    const params = new GetCommand({
      TableName: this.tableName,
      Key: {
        codeId,
      },
    });

    const data = await dynamoDB.send(params).catch((err) => {
      console.error(err);
      throw new Error("Error fetching data from DB");
    });
    return data.Item;
  }

  async save(editorId: string, code: Code) {
    const codeId = generateId();
    const params = new PutCommand({
      TableName: this.tableName,
      Item: {
        codeId,
        editorId,
      },
    });
    try {
      await dynamoDB.send(params);
      return codeId;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching data from DB");
    }
  }
}

export default new CodeRepository();
