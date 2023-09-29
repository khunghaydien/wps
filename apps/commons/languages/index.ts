/* eslint-disable camelcase, @typescript-eslint/naming-convention */

import _ from 'lodash';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import reduce from 'lodash/fp/reduce';
import toPairs from 'lodash/fp/toPairs';

import { compose } from '../utils/FnUtil';

import en_US from './Msg_en_US';
import ja from './Msg_ja';

const defaultLang = en_US;

export const language = {
  EN_US: 'en_US',
  JA: 'ja',
};

type MessageDictionary = typeof ja | typeof en_US | typeof defaultLang;

let __IS_INITIALIZED__ = false;

let languages: {
  [key: string]: MessageDictionary;
} = { ja, en_US, defaultLang };

const SEPARATOR = /{(.+?)}/g;

const configureTemplate = () => {
  _.templateSettings.interpolate = SEPARATOR;
};

const expandVariables = (messages: MessageDictionary): MessageDictionary => {
  const variables: Record<string, any> = flow(
    toPairs,
    filter(([id, _message]) => /^\$/g.test(id)),
    reduce((acc, [id, message]) => ({ ...acc, [id]: message }), {})
  )(messages);
  const expanded: Record<string, any> = flow(
    toPairs,
    filter(
      ([_id, message]: [string, string]) => message && /{(.+?)}/g.test(message)
    ),
    reduce(
      (
        expandedMessages: Record<string, any>,
        [id, message]: [string, string]
      ) => ({
        ...expandedMessages,
        [id]: _.template(message)(variables),
      }),
      {}
    )
  )(messages);
  return {
    ...messages,
    ...expanded,
  };
};

const mergeUserDefinedMessages =
  (lang: string) =>
  (messages: MessageDictionary): MessageDictionary => {
    return window.customMessageMap && window.customMessageMap[lang]
      ? {
          ...messages,
          ...window.customMessageMap[lang],
        }
      : messages;
  };

const buildMessage = (
  lang: string,
  messages: MessageDictionary
): MessageDictionary =>
  compose(expandVariables, mergeUserDefinedMessages(lang))(messages);

/**
 * Build translated messages for each language.
 */
export const setupMessages = (): void => {
  configureTemplate();

  languages = {
    ja: buildMessage('ja', ja),
    en_US: buildMessage('en_US', en_US),
    defaultLang: buildMessage('en_US', defaultLang),
  };
};

export default (): MessageDictionary => {
  if (!__IS_INITIALIZED__ && window.customMessageMap) {
    setupMessages();
    __IS_INITIALIZED__ = true;
  }

  // TODO: windowを使わないようにする
  if (!window.empInfo) {
    return languages.defaultLang;
  }
  switch (window.empInfo.language) {
    case 'ja':
      return languages.ja;
    default:
      return languages.defaultLang;
  }
};

// used when empInfo is not fetched yet
export const getMsgByBrowserLang = () => {
  switch (window.navigator.language) {
    case 'ja':
      return languages.ja;
    default:
      return languages.defaultLang;
  }
};

/* eslint-enable */
