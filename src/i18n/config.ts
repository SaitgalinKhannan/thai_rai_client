import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from "react-i18next";
import i18next from 'i18next';
import Backend from 'i18next-http-backend';

import translationRU from "./ru/ru_ns.json"
import translationEN from "./en/en_ns.json"
import translationTH from "./th/th_ns.json"
import translationCN from './cn/cn_ns.json'

const resources = {
    en: {
        translation: translationEN
    },
    ru: {
        translation: translationRU
    },
    th: {
        translation: translationTH
    },
    "zh-CN": {
        translation: translationCN
    }
};

i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'ru',
        interpolation: {
            escapeValue: false,
        },
        resources
    });

i18next.changeLanguage('ru')

export default i18next;
