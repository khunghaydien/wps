import React from 'react';

import Label from '../../components/fields/Label';
import TextField from '../../components/fields/TextField';

import './Label.story.scss';

export default {
  title: 'commons/fields',
};

export const LabelWithTextField = () => (
  <Label text="入力項目">
    {/*
    //@ts-ignore no id name required in TextField */}
    <TextField id="some-text-filed" name="some-text-filed" />
  </Label>
);

LabelWithTextField.storyName = 'Label - with TextField';

LabelWithTextField.parameters = {
  info: {
    text: `
サイズ, ラベル:テキストフィールド 3:9のレイアウトです。
LabelとTextFieldの紐付けは自動的に行われます。
`,
    propTables: [Label],
    inline: true,
    source: true,
  },
};

export const LabelWithInputElement = () => (
  <Label text="入力項目">
    <input id="some-input" type="text" className="slds-input" />
  </Label>
);

LabelWithInputElement.storyName = 'Label - with input element';

LabelWithInputElement.parameters = {
  info: {
    text: `
id属性をもつプリミティブなelementにも対応しています。
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const LabelWithLongText = () => (
  <Label text="Lorem ipsum dolor sit amet, vix an viderer scripserit.">
    {/*
    //@ts-ignore no id name required in TextField */}
    <TextField id="some-text-filed" name="some-text-filed" />
  </Label>
);

LabelWithLongText.storyName = 'Label - with long text';

LabelWithLongText.parameters = {
  info: {
    text: `
長いLabel.textは省略されますが、title属性にも同じStringが設定されるため、マウスオーバーで表示はされます。
`,
    propTables: false,
    inline: true,
    source: true,
  },
};

export const LabelWithCssClass = () => (
  <Label text="入力項目" className="story-ts-label-background-blue">
    {/*
    //@ts-ignore no id name required in TextField */}
    <TextField id="some-text-filed" name="some-text-filed" />
  </Label>
);

LabelWithCssClass.storyName = 'Label - with css class';
LabelWithCssClass.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const LabelChangeLayoutRatio = () => (
  <Label text="入力項目" labelCols={8} childCols={4}>
    {/*
    //@ts-ignore no id name required in TextField */}
    <TextField id="some-text-filed" name="some-text-filed" />
  </Label>
);

LabelChangeLayoutRatio.storyName = 'Label - change layout ratio';
LabelChangeLayoutRatio.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const LabelHasRequiredInput = () => (
  <Label text="入力項目">
    {/*
    //@ts-ignore no id name required in TextField */}
    <TextField id="some-text-filed" name="some-text-filed" required />
  </Label>
);

LabelHasRequiredInput.storyName = 'Label - has required input';
LabelHasRequiredInput.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const LabelMultiLineLayout = () => (
  <div>
    <Label text="カテゴリ">
      {/*
    //@ts-ignore no id name required in TextField */}
      <TextField id="some-text-filed" name="some-text-filed" required />
    </Label>
    <Label text="分類">
      {/*
    //@ts-ignore no id name required in TextField */}
      <TextField id="some-text-filed2" name="some-text-filed" required />
    </Label>
    <Label text="備考">
      {/*
    //@ts-ignore no id name required in TextField */}
      <TextField id="some-text-filed3" name="some-text-filed" />
    </Label>
  </div>
);

LabelMultiLineLayout.storyName = 'Label - multi line layout';
LabelMultiLineLayout.parameters = {
  info: { propTables: false, inline: true, source: true },
};
