import React from 'react';

import { action } from '@storybook/addon-actions';

import TextField from '../../components/fields/TextField';

export default {
  title: 'commons/fields',
};

export const _TextField = () => (
  // @ts-ignore no id name in TextField
  <TextField id="some-text-filed" name="some-text-filed" />
);

_TextField.storyName = 'TextField';
_TextField.parameters = {
  info: { propTables: [TextField], inline: true, source: true },
};

export const TextFieldType = () => (
  <TextField type="password" value="sercret" />
);

TextFieldType.storyName = 'TextField - type';

TextFieldType.parameters = {
  info: {
    text: `
  typeはデフォルトでtextが設定されます。
  sampleはpasswordです。
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const TextFieldDisabled = () => <TextField disabled />;

TextFieldDisabled.storyName = 'TextField - disabled';

TextFieldDisabled.parameters = {
  propTables: false,
  inline: true,
  source: true,
};

export const TextFieldReadOnly = () => (
  <TextField
    readOnly
    value="read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, read only, "
  />
);

TextFieldReadOnly.storyName = 'TextField - readOnly';

TextFieldReadOnly.parameters = {
  info: {
    text: `
readOnly, Oが大文字なので注意
単純なinline-blockを表示します。
paddingなどはreadOnlyでない時に合わせて統一しています。
title属性にvalueを設定しているので、文字が長くて省略された場合も、
マウスホバーによってツールチップを表示することで内容を確認できます。
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const TextFieldPlaceholder = () => (
  <TextField value="text" placeholder="サンプルプレースホルダー" />
);

TextFieldPlaceholder.storyName = 'TextField - placeholder';

TextFieldPlaceholder.parameters = {
  info: {
    text: `
  placeholderが設定されます。
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const TextFieldOnEvent = () => (
  <TextField
    onFocus={action('Focus')}
    onBlur={action('Blur')}
    onKeyDown={action('KeyDown')}
    onChange={action('change')}
  />
);

TextFieldOnEvent.storyName = 'TextField - onEvent';

TextFieldOnEvent.parameters = {
  info: {
    text: `
onFocus: フォーカスが当たった時
onBlur: フォーカスが外れた時
onKeyDown: フォーカス中にキーボードが押された時
onChange: 値が変更されたとき
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const TextFieldWithCssClass = () => (
  <TextField className="slds-theme--success" value="default value" />
);

TextFieldWithCssClass.storyName = 'TextField - with css class';
TextFieldWithCssClass.parameters = {
  info: { propTables: false, inline: true, source: true },
};
