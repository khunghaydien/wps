import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import {
  array,
  boolean,
  number,
  text,
  withKnobs,
} from '@storybook/addon-knobs';

import TextAreaField from '../../../../components/molecules/commons/Fields/TextAreaField';

export default {
  title: 'Components/molecules/commons/Fields/TextAreaField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    テキストエリア用のコンポーネントです

    # ラベル

    \`label\` props で必ずラベルを指定して下さい。

    ## 必須マーク

    \`required\` propsと併用すると必須マークがラベルにつきます。

    ~~~js
    <TextAreaField
      label="label"
      required
    />
    ~~~

    ## 強調ラベル

    \`emphasis\` を \`true\` にするとラベルの見出しが強調されます。
    \`required\` と併用することもできます。

    ~~~js
    <TextAreaField
      label="label"
      emphasis
    />
    ~~~

    # バリデーションエラー

    バリデーションエラーメッセージをを文字列の配列として渡すことで、ユーザーにエラーの解決を促すことが出来ます。

    ~~~js
    <TextAreaField
      label="label"
      errors={[
        'ERROR MESSAGE #1',
        'ERROR MESSAGE #2',
      ]}
    />
    ~~~
  `)(() => (
  <TextAreaField
    testId={text('testId', 'unique-id')}
    label={text('label', 'LABEL LABEL LABEL LABEL LABEL LABEL LABEL')}
    placeholder={text('placeholder', 'PLACEHOLDER PLACEHOLDER PLACEHOLDER')}
    required={boolean('required', null)}
    emphasis={boolean('emphasis', null)}
    errors={array('errors', [])}
    value={text('value', '')}
    onChange={action('onChange')}
    rows={number('rows', 2)}
  />
));
