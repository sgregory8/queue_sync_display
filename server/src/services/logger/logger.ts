/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import winston from 'winston';
import path from 'path';
import appRoot from 'app-root-path';

const { Log_Prefix = 'server' } = process.env;
const logLevelRegex = /silly|debug|verbose|info|warn|error/;
const fillExcept = ['message', 'level'];

// default config values
const options = {
    logLevelFile: 'debug',
    logLevelConsole: 'debug',
    logfileRootPath: 'logs',
    logfileMaxsize: 10485760,
    maxNoLogfile: 2,
};

// override config values
const setLogConfig = (config: typeof options): boolean => {
    try {
        if (config && Object.keys(config).length) {
            if (config.logLevelFile && logLevelRegex.test(config.logLevelFile))
                options.logLevelFile = config.logLevelFile;
            if (config.logLevelConsole && logLevelRegex.test(config.logLevelConsole))
                options.logLevelConsole = config.logLevelConsole;
            if (config.logfileRootPath) options.logfileRootPath = config.logfileRootPath;
            if (config.logfileMaxsize) options.logfileMaxsize = config.logfileMaxsize;
            if (config.maxNoLogfile) options.maxNoLogfile = config.maxNoLogfile;
        }
        return true;
    } catch (e) {
        console.log('Error configuring logger service ' + JSON.stringify(e.message));
        return false;
    }
};

const formatter = (info: winston.LogEntry) => {
    const time = moment().format();
    const cleanMetadata = Object.assign({}, info.metadata);
    delete cleanMetadata.error;

    let out = `${time} - [${info.level.toUpperCase()}] - message: {"${info.message}"} `;
    out += ` metadata: ${JSON.stringify(cleanMetadata).split(',').join(', ')}`;
    if (info.metadata.error) {
        out += `, errorMessage: {"${info.metadata.error.message}"}`;
        out += `, errorStack: {"${info.metadata.error.stack}"}`;
    }
    return out;
};

// init the winston logger
const logger = function (): winston.Logger {
    console.log(process.env.NODE_ENV);
    const winstonLogger = winston.createLogger({
        transports: [
            new winston.transports.File({
                silent: process.env.NODE_ENV !== 'production',
                level: options.logLevelFile,
                filename: path.join(
                    `${appRoot}/${options.logfileRootPath}/${Log_Prefix}-${moment().format('yyyy-MM-DD')}.log`,
                ),
                handleExceptions: true,
                maxsize: options.logfileMaxsize,
                maxFiles: options.maxNoLogfile,
                format: winston.format.combine(
                    winston.format.metadata({ fillExcept: fillExcept }),
                    winston.format.printf(formatter),
                ),
            }),
            new winston.transports.Console({
                silent: process.env.NODE_ENV !== 'development',
                level: options.logLevelConsole,
                handleExceptions: true,
                format: winston.format.combine(
                    winston.format.metadata({ fillExcept: fillExcept }),
                    winston.format.printf(formatter),
                ),
            }),
        ],
        exitOnError: false, // do not exit on handled exceptions
    });

    winston.stream({ start: -1 }).on('log', function (log) {
        console.log(log);
    });

    return winstonLogger;
};

const initLogger = function (config: typeof options) {
    setLogConfig(config);
    return logger();
};

export default initLogger({} as typeof options);
