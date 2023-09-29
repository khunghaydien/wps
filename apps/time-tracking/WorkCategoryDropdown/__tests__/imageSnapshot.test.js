// @flow

import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

import axios from 'axios';
import puppeteer from 'puppeteer';

const disableAnimation = (page) => {
  const content = `
*,
*::after,
*::before {
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    animation-delay: -0.0001s !important;
    animation-duration: 0s !important;
    animation-play-state: paused !important;
    caret-color: transparent !important;
    color-adjust: exact !important;
}
  `;
  page.addStyleTag({ content });
};

const beforeScreenshot = (page, { context: { _kind, _story }, _url }) => {
  disableAnimation(page);
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 600)
  );
};

initStoryshots({
  suite: 'daily-summary: Image storyshots',
  configPath: path.resolve(__dirname, '.storybook'),
  test: imageSnapshot({
    getCustomBrowser: async () => {
      const { data } = await axios.get('http://localhost:9222/json/version');
      return puppeteer.connect({
        browserWSEndpoint: data.webSocketDebuggerUrl,
        defaultViewport: {
          width: 1280,
          height: 768,
          deviceScaleFactor: 1,
        },
      });
    },
    storybookUrl: `file:///V1/storybook-static`,
    beforeScreenshot,
  }),
});
