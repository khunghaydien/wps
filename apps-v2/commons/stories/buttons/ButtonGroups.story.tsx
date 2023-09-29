import React from 'react';

import Button from '../../components/buttons/Button';
import ButtonGroups from '../../components/buttons/ButtonGroups';

export default {
  title: 'commons/buttons',
};

export const _ButtonGroups = () => (
  <ButtonGroups>
    <Button>ボタン1</Button>
    <Button>ボタン2</Button>
  </ButtonGroups>
);

_ButtonGroups.storyName = 'ButtonGroups';

_ButtonGroups.parameters = {
  info: { propTables: [ButtonGroups], inline: true, source: true },
};
