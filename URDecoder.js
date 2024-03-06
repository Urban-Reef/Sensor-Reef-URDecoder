const TYPES = {};
TYPES.REEF = 1;
TYPES.POINT = 2;
TYPES.TEMPERATURE = 3;
TYPES.RELATIVE_HUMIDITY = 4;


/** Decodes the binary payload send through LoRaWan TTN into a JSON object.
 * @param input The received payload.
 * @returns {object}  Decoded object to be transformed to JSON by TTN.
* */
function decodeUplink(input){
    //Buffer is created from the byte array inside input.
    //The byte array consist of 8-bit unsigned integers.
    const buffer = Buffer.from(input.bytes);
    //Create object to store decoded information.
    let decoded = {
        reefId: null,
        points: []
    }
    //Cursor to track our position in the buffer.
    let cursor = 0;
    while (cursor < buffer.length){
        //Read the byte at the current cursor position in the buffer and increment cursor.
        //Check the type to define how to read the byte(s) after the type byte.
        switch (buffer.readUInt8(cursor++)) {
            case TYPES.REEF:
                //Reef value is stored in 1 byte.
                //Increment  cursor after reading.
                decoded.reefId = buffer.readUInt8(cursor++);
                break;
            case TYPES.POINT:
                //Point value is stored in 1 byte.
                //If a point is flag is read push a new object into the points array.
                decoded.points.push({position: buffer.readUInt8(cursor++)});
                break;
            case TYPES.TEMPERATURE:
                /*
                * Temperature is stored in 2 bytes as an 16-bit signed integer.
                * Read 2 bytes and divide the value by 10 to transform it back into a 1-point decimal.
                * example: 655 / 10 = 65.5
                * Store the value in the last created point object.
                * */
                decoded.points[decoded.points.length - 1].temperature = buffer.readInt16BE(cursor) / 10;
                cursor += 2; //increment cursor by 2 as we've read 2 bytes.
                break;
            case TYPES.RELATIVE_HUMIDITY:
                /*
                * Humidity is stored in 1 byte.
                * Divide by 2 to get its true value.
                * During encoding, it is multiplied by 2 to make it a single byte integer.
                * This can be done as it is measured in steps of 0.5
                * */
                decoded.points[decoded.points.length -1].humidity = buffer.readUInt8(cursor++) / 2;
                break;
            default:
                //if type byte is not recognised or empty do nothing.
                break
        }
    }
    return decoded;
}