// SERVER SIDE!!

// https://discord.com/channels/752553802359505017/1046900384481951754/1047052679492419614
import path from 'path';

import i18n, { InitOptions } from 'i18next';
import i18nextFSBackend from 'i18next-fs-backend';
// import { i18n as i18nConfig } from 'next-i18next.config';
import { I18n, InitPromise, CreateClientReturn } from 'next-i18next';

let globalInstance: I18n;
const localesFolder = path.join(process.cwd(), '/public/locales');

type TranslatorProps = {
  template: string;
  ns: string[];
  args: object;
  lng?: string;
};

type UseTranslatorProps = {
  ns: string[];
  lng?: string;
};

type CreateInstanceProps = {
  locale?: string;
  namespaces: string[] | readonly string[];
};

const createI18nClient = ({ namespaces }: CreateInstanceProps): CreateClientReturn => {
  let instance: I18n;

  const config: InitOptions = {
    initImmediate: false,
    fallbackLng: ['en'],
    // NOTE: pass in locale to make this dynamic -- originally imported from 'next-i18next.config' compile issue in CI
    // fallbackLng: i18nConfig.defaultLocale,
    ns: namespaces,
    // lng: i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale,
    lng: 'en',
    // preload for server side -- preload ['en']
    // preload: readdirSync(localesFolder).filter((fileName) => {
    //   const joinedPath = path.join(localesFolder, fileName);
    //   return lstatSync(joinedPath).isDirectory();
    // }),
    preload: ['en'],
    backend: {
      loadPath: path.join(localesFolder, '{{lng}}/{{ns}}.json'),
    },
    load: 'all',
    // return empty string instead of key if something went wrong
    saveMissing: true,
    saveMissingTo: 'all',
    missingKeyNoValueFallbackToKey: true,
    parseMissingKeyHandler: (key, defaultValue) => {
      console.log('Missing Key:', key);

      return defaultValue || '';
    },
    // useSuspense to avoid first render issues
    react: { useSuspense: true },
    // debugging info
    debug: false,
  };

  if (!globalInstance) {
    globalInstance = i18n.createInstance(config);
    instance = globalInstance;
  } else {
    instance = globalInstance.cloneInstance(config);
  }

  let initPromise: InitPromise;

  if (!instance.isInitialized) {
    instance.use(i18nextFSBackend);
    initPromise = instance.init(config);
  } else {
    initPromise = Promise.resolve(i18n.t);
  }

  return { i18n: instance, initPromise };
};

export default createI18nClient;

// returns 't' as you would expect
export const translator = ({ ns, lng = 'en' }: UseTranslatorProps) => {
  const { i18n } = createI18nClient({ namespaces: ns, locale: lng });

  return i18n.t;
};

// Just do the good thing... I don't care about my options here.
export const translate = ({ template, ns, args, lng = 'en' }: TranslatorProps) => {
  const { i18n } = createI18nClient({ namespaces: ns, locale: lng });

  const { t } = i18n;
  return t(template, { ...args, ns });
};
