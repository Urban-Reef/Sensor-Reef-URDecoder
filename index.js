import {createTestBuffer} from "./createTestBuffer.js";
import {decodeUplink} from "./URDecoder.js";

const input = {
    bytes: createTestBuffer()
}
console.log(decodeUplink(input));