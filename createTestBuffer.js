const TYPES = {};
TYPES.REEF = 1;
TYPES.POINT = 2;
TYPES.TEMPERATURE = 3;
TYPES.RELATIVE_HUMIDITY = 4;

export function createTestBuffer() {
    let buffer = Buffer.alloc(18);
    let cursor = 0;
    cursor = addReef(1, cursor, buffer);
    cursor = addPoint(1, cursor, buffer);
    cursor = addTemperature(75.5, cursor, buffer);
    cursor = addHumidity(55.5, cursor, buffer);
    cursor = addPoint(2, cursor, buffer);
    cursor = addTemperature(-65.5, cursor, buffer);
    cursor = addHumidity(33.5, cursor, buffer);
    return buffer;
}

const addReef = (id, cursor, buffer) => {
    console.log('writing reef flag on pos: ' + cursor);
    buffer.writeUInt8(TYPES.REEF, cursor++);
    console.log('writing reef id on pos: ' + cursor);
    buffer.writeUInt8(id, cursor++);
    return cursor;
};
const addPoint = (id, cursor, buffer) => {
    console.log('writing point flag on pos: ' + cursor);
    buffer.writeUInt8(TYPES.POINT, cursor++);
    console.log('writing point id on pos: ' + cursor);
    buffer.writeUInt8(id, cursor++);
    return cursor;
};
const addTemperature = (celsius, cursor, buffer) => {
    const val = celsius * 10;
    console.log('writing temp flag on pos: ' + cursor);
    buffer.writeUInt8(TYPES.TEMPERATURE, cursor++);
    console.log('writing temp value on pos: ' + cursor);
    buffer.writeInt16BE(val, cursor++);
    cursor++
    console.log('cursor after writing: ' + cursor);
    return cursor;
};
const addHumidity = (percentage, cursor, buffer) => {
    console.log('writing humidity flag on pos: ' + cursor);
    buffer.writeUInt8(TYPES.RELATIVE_HUMIDITY, cursor++);
    console.log('writing humidity value on pos: ' + cursor);
    buffer.writeUInt8(percentage * 2, cursor++);
    return cursor;
}