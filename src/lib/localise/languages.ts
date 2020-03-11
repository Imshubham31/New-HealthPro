import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeFr from '@angular/common/locales/fr';
import localeHe from '@angular/common/locales/he';
import { InjectionToken } from '@angular/core';

import { LANG_AR_TRANS } from './lang-ar';
import { LANG_EN_TRANS } from './lang-en';
import { LANG_FR_TRANS } from './lang-fr';
import { LANG_HE_TRANS } from './lang-he';
import { LANG_IT_TRANS } from './lang-it';
import localeIt from '@angular/common/locales/it';
import { LANG_ES_TRANS } from './lang-es';
import localeEs from '@angular/common/locales/es';

import { LANG_DE_TRANS } from './lang-de';
import localeDe from '@angular/common/locales/de';

import { LANG_NL_TRANS } from './lang-nl';
import localeNl from '@angular/common/locales/nl';
import { DateUtils } from '@lib/utils/date-utils';

// NOTICE: To pull correct translations, new language is required to be added to strings.js
// with gid (identifier for google spreadsheet containing translations )
// Also new language should be added to regex at extra-webpack.config.js (allow moment locale to be added)

export function registerRequiredLocales() {
    registerLocaleData(localeAr, 'ar');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localeHe, 'he');
    registerLocaleData(localeDe, 'de');
    registerLocaleData(localeNl, 'nl');
    registerLocaleData(localeIt, 'it');
    registerLocaleData(localeEs, 'es');
}

export const Languages = new InjectionToken('languages');

const calendarWeekFormatLtr = (date: Date) => {
    return `<div class="date">
        <div class="day-name">${DateUtils.formatDate(date, 'EEEE')}</div>
        <div class="day-and-month">
            <span class="day">${DateUtils.formatDate(date, 'dd')}</span>
            <span>${DateUtils.formatDate(date, 'MMM')}</span>
        </div>
    </div>`;
};
export const LANGUAGE_PROVIDERS = [
    {
        provide: Languages,
        useValue: {
            en: {
                strings: LANG_EN_TRANS,
                dir: 'ltr',
                name: 'English',
                dateFormat: 'dd/mm/yyyy',
                calendarWeeklyHeader: calendarWeekFormatLtr,
            },
            fr: {
                strings: LANG_FR_TRANS,
                dir: 'ltr',
                name: 'Français',
                dateFormat: 'dd/mm/yyyy',
                calendarWeeklyHeader: calendarWeekFormatLtr,
            },
            ar: {
                strings: LANG_AR_TRANS,
                dir: 'rtl',
                name: 'عربى',
                dateFormat: 'yyyy/mm/dd',
            },
            he: {
                strings: LANG_HE_TRANS,
                dir: 'rtl',
                name: 'עִבְרִית',
                dateFormat: 'yyyy/mm/dd',
            },
            de: {
                strings: LANG_DE_TRANS,
                dir: 'ltr',
                name: 'Deutsch',
                dateFormat: 'dd.mm.yyyy',
                calendarWeeklyHeader: calendarWeekFormatLtr,
            },
            nl: {
                strings: LANG_NL_TRANS,
                dir: 'ltr',
                name: 'Dutch',
                dateFormat: 'dd-mm-yyyy',
                calendarWeeklyHeader: calendarWeekFormatLtr,
            },
            it: {
                strings: LANG_IT_TRANS,
                dir: 'ltr',
                name: 'Italiano',
                dateFormat: 'dd.mm.yyyy',
                calendarWeeklyHeader: calendarWeekFormatLtr,
            },
            es: {
                strings: LANG_ES_TRANS,
                dir: 'ltr',
                name: 'Español',
                dateFormat: 'dd-mm-yyyy',
                calendarWeeklyHeader: calendarWeekFormatLtr,
            },
        },
    },
];
