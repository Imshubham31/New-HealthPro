import { Inject, Injectable } from '@angular/core';
import { Languages } from './languages';
import { enUS, fr, he, de, nl, it, es, arSA } from 'date-fns/esm/locale';
import {
    en_US,
    fr_FR,
    he_IL,
    de_DE,
    nl_NL,
    it_IT,
    es_ES,
    ar_EG,
} from 'ng-zorro-antd/i18n';

@Injectable()
export class LocaliseService {
    private currentLang = 'en';
    public appLanguages = this.getLanguages();

    constructor(@Inject(Languages) private languages: any) {}

    public static toNgZorroLocale(lang: string) {
        const ngZorroMapping = {
            en: en_US,
            fr: fr_FR,
            he: he_IL,
            de: de_DE,
            nl: nl_NL,
            it: it_IT,
            es: es_ES,
            ar: ar_EG,
        };
        return ngZorroMapping[lang] ? ngZorroMapping[lang] : en_US;
    }

    public static toDateFnsLocale(lang?: string): Locale {
        const locales = {
            en: enUS,
            de,
            fr,
            nl,
            he,
            ar: arSA,
            es,
            it,
        };
        return locales[lang] ? locales[lang] : enUS;
    }

    public use(lang: string): void {
        if (this.languages.hasOwnProperty(lang)) {
            this.currentLang = lang;
            return;
        }

        const nav = navigator as any;
        const browserLang = nav.languages
            ? nav.languages[0].substring(0, 2)
            : nav.language.substring(0, 2);
        if (this.languages.hasOwnProperty(browserLang)) {
            this.currentLang = browserLang;
        }
    }

    public getLocale() {
        return this.currentLang;
    }

    public getDirection() {
        return this.languages[this.currentLang]['dir'];
    }

    public get calendarWeeklyHeader() {
        return this.languages[this.currentLang]['calendarWeeklyHeader'];
    }

    private translate(key: string): string {
        if (!this.currentLang) {
            return key;
        }

        if (
            !(
                this.languages[this.currentLang] &&
                this.languages[this.currentLang]['strings'][key]
            )
        ) {
            console.warn(
                `"${key}" is missing from localisation. Please add it to localisation sources.`,
            );
            return key;
        }

        return this.languages[this.currentLang]['strings'][key];
    }

    public fromKey(key: string) {
        return this.translate(key);
    }

    public fromParams(key: string, params: string[]): string {
        if (!this.currentLang) {
            return key;
        }

        if (
            !(
                this.languages[this.currentLang] &&
                this.languages[this.currentLang]['strings'][key]
            )
        ) {
            console.warn(
                `"${key}" is missing from localisation. Please add it to localisation sources.`,
            );
            return key;
        }

        const interpolated: Interpolated = this.languages[this.currentLang][
            'strings'
        ][key];
        if (typeof interpolated !== 'function') {
            console.error(
                `"${key}" is not a function that can be used for interpolation.`,
            );
            return key;
        }

        return interpolated(params);
    }

    public fromParamsOrKey(key: string, params: string[]): string {
        if (params) {
            return this.fromParams(key, params);
        }
        return this.fromKey(key);
    }

    public getLanguages() {
        return Object.entries(this.languages).map(
            ([code, { name }]: [any, any]) => ({
                code,
                name,
            }),
        );
    }
}

type Interpolated = (params: string[]) => string;
