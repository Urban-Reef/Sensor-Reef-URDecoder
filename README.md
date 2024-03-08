# Urban-Reef-Decoder

This javascript file is used to decode incoming byte arrays sent over LoRaWan using The Things Network.

## Usage
1. Clone the repo and install dependencies
```
git clone
npm install
```

2. Remove export in front of `decodeUplink()` in `URDecoder.js`
```javascript
//from:
export function decodeUplink(input) {}
//to:
function decodeUplink(input) {}
```

3. Minify the decoder using uglify-js:
```
uglifyjs URDecoder.js -o URDecoder.min.js
```
4. Copy the code from `URDecoder.min.js` and paste it in the TTN Console under payload formatters. You can use the decoder application wide or for a device.
## Flowchart
The decoder 'walks' through the byte array it recieves. It tracks its position using `cursor`. The first byte is the 'flag' or 'type', based on 'flag' it will read the following byte(s).

![Flowchart Decoding Process](https://drive.google.com/uc?id=1Aw3_T0eH-Hljleyd9ejlmaVrA-ZOEXto "Flowchart explaining the decoding process")

[Google Drive](https://drive.google.com/open?id=1Aw3_T0eH-Hljleyd9ejlmaVrA-ZOEXto&usp=drive_fs)

## Testing
To test the decoder add `export` in front of `decodeUplink()` in `URDecoder.js`.
Run `index.js` using the folowing command:
```
npm run index.js
```

### Editing the test
To edit the test buffer open `createTestBuffer.js`. In here you can call functions that write to the buffer.

To set the size in bytes of the buffer change `size` to the desired length.
```javascript
let buffer = Buffer.alloc(size);
```

## Extending the decoder
To extend the decoder in `URDecoder.js`. Add a new attribute to type object, make sure to change `NEW_TYPE` and `5` to a number not already used by other types.
```javascript
const TYPES = {};
//other types
TYPES.NEW_TYPE = 5;
```
The number is the 'flag' used to identify how the following byte(s) should be decoded. This number needs to match the 'flag' in the encoder.

Add a case to the switch statement above `default:`
```javascript
switch (buffer.readUInt8(cursor++)) {
    //other cases statements.
    case TYPES.NEW_TYPE:
        //logic to decode the byte(s).
        decoded.points[decoded.points.length -1].newDataType = decodedValue;
}
```
`decoded.points[decoded.points.length -1].newDataType` selects the latest point in the `decoded` object and stores the decoded value under the attribute `newDataType`.

**NOTE**: To decode the byte array you cannot use the `Buffer` module as js modules are blocked by TTN.

### Testing the new type
1. Copy the `TYPE` object to `createTestBuffer.js`.
2. At the bottom create a new function.
```javascript
const addNewDataType = (value, cursor, buffer) => {
    //logic to write to the buffer. Ex:
    buffer.writeUInt8(TYPES.NEW_TYPE, cursor++);
    buffer.writeUInt8(value, cursor++);
    
    return cursor;
}
```
The first byte you write should always be the 'flag'. The byte(s) after the value you want to write.