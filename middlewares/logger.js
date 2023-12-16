const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const assert = require('assert');

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const padString = (argString, defaultPadLength) => {
    const argStringLength = argString.length;
    assert(argStringLength < defaultPadLength, 'defaultPadLength must be greater than argString length.');
    let padLength = defaultPadLength - argStringLength;
    for (let i=0; i<padLength; i++) {
        argString += ' ';
    }
    return argString;
}

const formatString = (argString, defaultPadSpaceLength) => {
    let separatedArgString = argString.split('&');
    let separatedArgStringLength = separatedArgString.length;
    let result = '';
    for (let i=0; i<separatedArgStringLength; i++) {
        result += padString(separatedArgString[i], defaultPadSpaceLength);
    }
    return result;
}


const logEvents = async (location, message) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`;
    const logItem = `[${NODE_ENV}] ->  ${dateTime}   ${uuid()}\t${message}`;
    console.log(logItem);

    if ( NODE_ENV === 'development' ) {
        try {
            const logDir = 'logs';
            const logDirPath = path.join(location, logDir);
            if (!fs.existsSync(logDirPath)) {
                await fsPromises.mkdir(logDirPath, (err) => {
                    if (err) throw err;
                    console.log('Directory created...');
                });
            }
            const logFilePath = path.join(logDirPath, 'eventsLog.txt');
            await fsPromises.appendFile(logFilePath, `${logItem}\n`);
        } catch (err) {
            console.error(err);
        }
    }
};

module.exports = {
    formatString,
    logEvents
};