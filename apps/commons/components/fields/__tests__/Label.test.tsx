import React from 'react';

import { mount, shallow } from 'enzyme';

import Label from '../Label';
import TextField from '../TextField';

/*
 * 単体テスト
 * Label - 共通コンポーネント
 */
test('childrenに渡した要素が生成される', () => {
  const wrapper = mount(
    <Label text="test">
      <input id="test" />
    </Label>
  );

  expect(
    wrapper.find('.ts-horizontal-layout__body').find('input')
  ).toHaveLength(1);
});

test('自由なclassが付与できる', () => {
  const testClass = 'test-class';

  const wrapper = shallow(
    <Label text="test" className={testClass}>
      <input id="test" />
    </Label>
  );

  expect(wrapper.hasClass(testClass)).toBeTruthy();
});

test('textプロパティからlabel elのtext nodeが生成される', () => {
  const testText = 'test!test!test!';

  const wrapper = shallow(
    <Label text={testText}>
      <input id="test" />
    </Label>
  );

  expect(wrapper.find('label').text()).toBe(testText);
});

test('textプロパティの値がtitleプロパティにセットされる', () => {
  const testText = 'test!test!test!';

  const wrapper = shallow(
    <Label text={testText}>
      <input id="test" />
    </Label>
  );

  expect(wrapper.find('label').prop('title')).toBe(testText);
});

describe('ラベルと子要素のレイアウト比率を調整できる', () => {
  const labelCols = 1;
  const childCols = 2;

  test('label element', () => {
    const wrapper = mount(
      <Label text="test" labelCols={labelCols} childCols={childCols}>
        <TextField />
      </Label>
    );

    expect(
      wrapper
        .find('.ts-horizontal-layout__label')
        .hasClass(`slds-size--${labelCols}-of-12`)
    ).toBeTruthy();
  });

  test('子要素', () => {
    const wrapper = mount(
      <Label text="test" labelCols={labelCols} childCols={childCols}>
        <TextField />
      </Label>
    );

    expect(
      wrapper
        .find('.ts-horizontal-layout__body')
        .hasClass(`slds-size--${childCols}-of-12`)
    ).toBeTruthy();
  });
});

describe('子のidとhtmlForプロパティの紐付けができる', () => {
  const testId = 'test-id';

  test('input elementの場合', () => {
    const wrapper = mount(
      <Label text="test">
        <input id={testId} />
      </Label>
    );

    expect(wrapper.find('label').prop('htmlFor')).toBe(testId);
  });

  test('React Componentの場合', () => {
    const wrapper = mount(
      <Label text="test">
        {/* @ts-ignore */}
        <TextField id={testId} />
      </Label>
    );

    expect(wrapper.find('label').prop('htmlFor')).toBe(testId);
  });
});

test('requiredに設定された子が渡された場合、*シンボルが生成される', () => {
  const wrapper = mount(
    <Label text="test">
      {/* @ts-ignore Label is using `childProps.required`, even though required is not used in TextField */}
      <TextField required />
    </Label>
  );

  const symbol = wrapper
    .find('.ts-horizontal-layout__label')
    .find('.ts-horizontal-layout__label-symbol--required');

  expect(symbol).toHaveLength(1);
});
