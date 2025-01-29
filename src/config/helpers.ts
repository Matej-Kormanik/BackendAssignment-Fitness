import en from '../locales/en.json';
import sk from '../locales/sk.json';
import {MESSAGE} from "../utils/enums";
import winston from 'winston';

const translations = { en, sk };

export const translate = (key: string | MESSAGE, language: string): string => {
    // @ts-ignore
    return translations[language]?.[key] || translations['en'][key] || key;
};


const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', dirname: 'log' }),
        new winston.transports.Console()
    ],
});

export const logError = (message: string, path: string, error?: any) => {
    logger.error(message, path, error);
};

