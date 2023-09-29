import React from 'react';

import { action } from '@storybook/addon-actions';

import IconButton from '../../components/buttons/IconButton';

import ImgBtnAdd from '../../images/btn_add.png';

export default {
  title: 'commons/buttons',
};

export const _IconButton = () => (
  <IconButton
    src={ImgBtnAdd}
    alt="追加ボタン"
    onClick={action('ボタンクリック')}
  />
);

_IconButton.storyName = 'IconButton';

_IconButton.parameters = {
  info: { propTables: [IconButton], inline: true, source: true },
};

export const IconButtonNoAlt = () => (
  <IconButton src={ImgBtnAdd} onClick={action('ボタンクリック')} />
);

IconButtonNoAlt.storyName = 'IconButton - no alt';

IconButtonNoAlt.parameters = {
  info: {
    text: `
altを指定しない場合、空文字がaltに付与されます
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const IconButtonDisabled = () => (
  <IconButton
    disabled
    src={ImgBtnAdd}
    alt="追加ボタン"
    onClick={action('ボタンクリック')}
  />
);

IconButtonDisabled.storyName = 'IconButton - disabled';
IconButtonDisabled.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const IconButtonWithCssClass = () => (
  <div className="slds-clearfix">
    <IconButton
      className="slds-float--right"
      src={ImgBtnAdd}
      alt="追加ボタン"
      onClick={action('ボタンクリック')}
    />
  </div>
);

IconButtonWithCssClass.storyName = 'IconButton - with css class';
IconButtonWithCssClass.parameters = {
  info: { propTables: false, inline: true, source: true },
};
