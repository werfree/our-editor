import {
  decode as base64Decode,
  encode as base64Encode,
} from "base64-arraybuffer";

export const decodeYJSMessage = (m) => base64Decode(m);
export const encodeYJSMessage = (m) => base64Encode(m);
