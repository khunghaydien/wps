import path, { sep as pathSep } from 'path';

import React from 'react';
import { act, create } from 'react-test-renderer';

import { Stories2SnapsConverter } from '@storybook/addon-storyshots';
import { styleSheetSerializer } from 'jest-styled-components/serializer';

const getSnapshotFileName = (context) => {
  const converter = new Stories2SnapsConverter();
  const paths = converter.getSnapshotFileName(context).split(pathSep);
  const fileName = paths.pop();
  return path.join(
    '__snapshots__',
    [...paths.slice(2, paths.length - 1), fileName].join(pathSep)
  );
};

export const generateAsyncMatchSpecificSnapshotTestOptions = () => ({
  asyncJest: true,
  test:
    // https://github.com/storybookjs/storybook/issues/7745
    async ({ story, context, done }) => {
      let renderer;
      await act(async () => {
        renderer = create(React.createElement(story.render));
      });

      // eslint-disable-next-line jest/no-standalone-expect
      expect(renderer.toJSON()).toMatchSpecificSnapshot(
        getSnapshotFileName(context)
      );
      done();
    },

  // NOTE: https://storybook.js.org/addons/@storybook/addon-storyshots/
  // "the multiSnapshot function is used to create multiple snapshot files (i.e. one per story),
  //  since it ignores any serializers specified in your jest config."
  snapshotSerializers: [styleSheetSerializer],
});
