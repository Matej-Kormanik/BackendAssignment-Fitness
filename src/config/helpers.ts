import en from '../locales/en.json';
import sk from '../locales/sk.json';
import {MESSAGE} from "../utils/enums";

const translations = { en, sk };

export const translate = (key: string | MESSAGE, language: string): string => {
    // @ts-ignore
    return translations[language]?.[key] || translations['en'][key] || key;
};
