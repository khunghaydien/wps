import React from 'react';

import SelectField from '../../components/fields/SelectField';

const dummyData = [
  { value: 'value1', text: '選択肢1' },
  { value: 'value2', text: '選択肢2' },
  { value: 'value3', text: '選択肢3' },
  { value: 'value4', text: '選択肢4' },
];

export default {
  title: 'commons/fields',
};

export const _SelectField = () => <SelectField options={dummyData} />;

_SelectField.storyName = 'SelectField';

_SelectField.parameters = {
  info: { propTables: [SelectField], inline: true, source: true },
};
