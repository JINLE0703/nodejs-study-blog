const fs = require('fs');
const path = require('path');

// 生成 wirtestream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName);
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream;
}

// 写日志
function wirteLog(writeStream, log) {
    writeStream.write(log + '\n');
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log');
function access(log) {
    wirteLog(accessWriteStream, log);
}

module.exports = {
    access
}