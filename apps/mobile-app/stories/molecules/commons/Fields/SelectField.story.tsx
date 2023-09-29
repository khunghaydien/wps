import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';

import SelectField from '../../../../components/molecules/commons/Fields/SelectField';

export default {
  title: 'Components/molecules/commons/Fields/SelectField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    select コンポーネント

    # options

    \`options\` propsで選択肢を設定してください。
    \`value\` は選択済みの項目の値になります。
    \`onChange\` イベントハンドラーで項目の変更をハンドリングできます。

    ~~~js
    <SelectField
      label="label"
      value={2}
      options={[{
        label: 'TEXT 1',
        value: 1
      }, {
        label: 'TEXT 2',
        value: 2
      }]}
      onChange={(e) => ...}
    />
    ~~~

    # ラベル

    \`label\` props で必ずラベルを指定して下さい。

    ## 必須マーク

    \`required\` propsと併用すると必須マークがラベルにつきます。

    ~~~js
    <SelectField
      label="label"
      required
    />
    ~~~

    ## 強調ラベル

    \`emphasis\` を \`true\` にするとラベルの見出しが強調されます。
    \`required\` と併用することもできます。

    ~~~js
    <SelectField
      label="label"
      emphasis
    />
    ~~~

    # バリデーションエラー

    バリデーションエラーメッセージをを文字列の配列として渡すことで、ユーザーにエラーの解決を促すことが出来ます。

    ~~~js
    <SelectField
      label="label"
      errors={[
        'ERROR MESSAGE #1',
        'ERROR MESSAGE #2',
      ]}
    />
    ~~~
  `)(() => (
  <SelectField
    testId={text('testId', 'unique-id')}
    label={text('label', 'LABEL LABEL LABEL')}
    required={boolean('required', true)}
    value={text('value', '2018-10-01')}
    options={object('value', [
      { label: '2018-10-01', value: 1 },
      { label: '2018-10-02', value: 2 },
    ])}
    onChange={action('onChange')}
  />
));
