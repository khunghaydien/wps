// @flow

import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

import axios from 'axios';
import puppeteer from 'puppeteer';

const beforeScreenshot = (page, { context: { _kind, story }, _url }) => {
  return new Promise((resolve) =>
    setTimeout(
      () => {
        resolve();
      },
      story === 'RequestDialog' ? 2000 : 800
    )
  );
};

initStoryshots({
  suite: 'TrackSummary: Image storyshots',
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
