import React from 'react';

import HorizontalLayout from '../../../components/fields/layouts/HorizontalLayout';

export default {
  title: 'commons/fields',
};

export const _HorizontalLayout = () => (
  <HorizontalLayout>
    <HorizontalLayout.Label>項目</HorizontalLayout.Label>
    <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
  </HorizontalLayout>
);

_HorizontalLayout.storyName = 'HorizontalLayout';

_HorizontalLayout.parameters = {
  info: {
    text: `
Labelコンポーネントと基本は同じ
`,
    propTables: [HorizontalLayout],
    inline: true,
    source: true,
  },
};

export const HorizontalLayoutLayoutRatio = () => (
  <HorizontalLayout>
    <HorizontalLayout.Label cols={8}>項目</HorizontalLayout.Label>
    <HorizontalLayout.Body cols={4}>
      <input type="text" className="slds-input" />
    </HorizontalLayout.Body>
  </HorizontalLayout>
);

HorizontalLayoutLayoutRatio.storyName = 'HorizontalLayout - layout ratio';
HorizontalLayoutLayoutRatio.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const HorizontalLayoutRequiredLabel = () => (
  <HorizontalLayout>
    <HorizontalLayout.Label required>必須項目</HorizontalLayout.Label>
    <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
  </HorizontalLayout>
);

HorizontalLayoutRequiredLabel.storyName = 'HorizontalLayout - required Label';
HorizontalLayoutRequiredLabel.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const HorizontalLayoutWithCssClass = () => (
  <HorizontalLayout className="slds-border--bottom">
    <HorizontalLayout.Label className="slds-theme--shade">
      必須項目
    </HorizontalLayout.Label>
    <HorizontalLayout.Body className="slds-text-align--right">
      テキスト
    </HorizontalLayout.Body>
  </HorizontalLayout>
);

HorizontalLayoutWithCssClass.storyName = 'HorizontalLayout - with css class';
HorizontalLayoutWithCssClass.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const HorizontalLayoutWithLongText = () => (
  <HorizontalLayout>
    <HorizontalLayout.Label>
      項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目項目
    </HorizontalLayout.Label>
    <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
  </HorizontalLayout>
);

HorizontalLayoutWithLongText.storyName = 'HorizontalLayout - with long text';
HorizontalLayoutWithLongText.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const HorizontalLayoutMultiLineLayout = () => (
  <div>
    <HorizontalLayout>
      <HorizontalLayout.Label required>項目1</HorizontalLayout.Label>
      <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
    </HorizontalLayout>

    <HorizontalLayout>
      <HorizontalLayout.Label required>項目2</HorizontalLayout.Label>
      <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
    </HorizontalLayout>

    <HorizontalLayout>
      <HorizontalLayout.Label>項目3</HorizontalLayout.Label>
      <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
    </HorizontalLayout>
  </div>
);

HorizontalLayoutMultiLineLayout.storyName =
  'HorizontalLayout - multi line layout';
HorizontalLayoutMultiLineLayout.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const HorizontalLayoutWithHelpMessage = () => (
  <HorizontalLayout>
    <HorizontalLayout.Label helpMsg="this is the help text.">
      項目
    </HorizontalLayout.Label>
    <HorizontalLayout.Body>テキスト</HorizontalLayout.Body>
  </HorizontalLayout>
);

HorizontalLayoutWithHelpMessage.storyName =
  'HorizontalLayout - with help message';
HorizontalLayoutWithHelpMessage.parameters = {
  info: { propTables: false, inline: true, source: true },
};
