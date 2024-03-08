const TYPES = {};
TYPES.REEF = 1;
TYPES.POINT = 2;
TYPES.TEMPERATURE = 3;
TYPES.RELATIVE_HUMIDITY = 4;


/** Decodes the binary payload send through LoRaWan TTN into a JSON object.
 * @param input The received payload.
 * @returns {object}  Decoded object to be transformed to JSON by TTN.
* */
function decodeUplink(input) {
    //The byte array consist of 8-bit unsigned integers.
    const byteArray = input.bytes;
    //Create object to store decoded information.
    let decoded = {
        reefId: null,
        points: []
    };
    let warnings = []

    //Cursor is used to track the position in the byte array.
    let cursor = 0;
    while (cursor < byteArray.length) {
        //Read the byte at the current cursor position in the array after increment cursor.
        switch (byteArray[cursor++]) {
            //Check the type to define how to read the byte(s) after the type byte.
            case TYPES.REEF:
                //Reef value is stored in 1 byte.
                decoded.reefId = byteArray[cursor++]; //Increment  cursor after reading.
                break;
            case TYPES.POINT:
                //Point value is stored in 1 byte.
                //If a point is flag is read push a new object into the points array.
                decoded.points.push({ position: byteArray[cursor++] });
                break;
            case TYPES.TEMPERATURE:
                // To read temperature we need to combine 2 bytes into a 16-bit signed integer.
                // Combine two bytes
                let temperatureValue = (byteArray[cursor++] << 8) | byteArray[cursor++];
                // If the value is negative, convert it to a signed integer
                temperatureValue = temperatureValue < 0x8000 ? temperatureValue : temperatureValue - 0x10000;
                // Divide by 10 to transform it back into a 1-point decimal
                decoded.points[decoded.points.length - 1].temperature = temperatureValue / 10;
                break;
            case TYPES.RELATIVE_HUMIDITY:
                /*
                * Humidity is stored in 1 byte.
                * Divide by 2 to get its true value.
                * During encoding, it is multiplied by 2 to make it a single byte integer.
                * This can be done as it is measured in steps of 0.5
                * */
                decoded.points[decoded.points.length - 1].humidity = byteArray[cursor++] / 2;
                break;
            default:
                // If type byte is not recognized or empty, do nothing.
                if (byteArray[cursor - 1] !== 0) {
                    warnings.push(`Unrecognised flag/type: ${byteArray[cursor - 1]} at position: ${cursor - 1}`);
                }
                break;
        }
    }

    return {
        data: decoded,
        warnings: warnings
    }
}