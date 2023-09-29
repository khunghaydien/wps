import React from 'react';

import { mount, shallow } from 'enzyme';

import TextField from '../TextField';

/*
 * shallow render用 dummy
 * onClick内でe.target.valueを参照するため
 */
const dummyEvent = {
  target: {
    value: 'dummy',
  },
};

/*
 * 単体テスト
 * テキスト項目 - 共通コンポーネント
 */
test('TextField.onFocusにfunctionを設定した場合、フォーカス時にfunctionが実行されること', () => {
  let cnt = 0;

  const textField = mount(
    <TextField
      onFocus={() => {
        cnt += 1;
      }}
    />
  );

  textField.simulate('focus', dummyEvent);
  expect(cnt).toBe(1);
});

test('TextField.onFocusの第２引数でvalueを受け取ること', () => {
  const fieldValue = 'test value';

  const textField = mount(
    <TextField
      value={fieldValue}
      onFocus={(e, value) => {
        expect(value).toBe(fieldValue);
      }}
    />
  );

  textField.simulate('focus');
});

test('TextField.onBlurにfunctionを設定した場合、フォーカスアウト時にfunctionが実行されること', () => {
  let cnt = 0;

  const textField = mount(
    <TextField
      onBlur={() => {
        cnt += 1;
      }}
    />
  );

  textField.simulate('focus', dummyEvent).simulate('blur', dummyEvent);
  expect(cnt).toBe(1);
});

test('TextField.onBlurの第２引数でvalueを受け取ること', () => {
  const fieldValue = 'test value';

  const textField = mount(
    <TextField
      value={fieldValue}
      onBlur={(e, value) => {
        expect(value).toBe(fieldValue);
      }}
    />
  );

  textField.simulate('focus').simulate('blur');
});

test('TextField.onKeyDownにfunctionを設定した場合、キーボード押下時にfunctionが実行されること', () => {
  let cnt = 0;

  const textField = shallow(
    <TextField
      onKeyDown={() => {
        cnt += 1;
      }}
    />
  );

  textField.simulate('keydown', dummyEvent);
  expect(cnt).toBe(1);
});

test('TextField.onKeyDownの第２引数でvalueを受け取ること', () => {
  const fieldValue = 'test value';

  const textField = mount(
    <TextField
      value={fieldValue}
      onKeyDown={(e, value) => {
        expect(value).toBe(fieldValue);
      }}
    />
  );

  textField.simulate('keydown');
});

test('TextField.onChangeにfunctionを設定した場合、入力フィールドの値変更時にfunctionが実行されること', () => {
  let cnt = 0;

  const textField = shallow(
    <TextField
      onChange={() => {
        cnt += 1;
      }}
    />
  );

  textField.simulate('change', dummyEvent);
  expect(cnt).toBe(1);
});

test('TextField.onChangeの第２引数でvalueを受け取ること', () => {
  const fieldValue = 'test value';

  const textField = mount(
    <TextField
      value={fieldValue}
      onChange={(e, value) => {
        expect(value).toBe(fieldValue);
      }}
    />
  );

  textField.simulate('change');
});

test('TextField.classNameに値を設定した場合、class属性に設定した値が付与されること', () => {
  const textFieldClass = 'test-class';
  const textField = shallow(<TextField className={textFieldClass} />);

  expect(textField.find('input').hasClass(textFieldClass)).toBeTruthy();
});

test('TextField.valueに値を設定した場合、生成されるinput elementのvalueに値が設定されていること', () => {
  const value = 'some-value';

  const textField = shallow(<TextField value={value} />);

  expect(textField.find('input').prop('value')).toBe(value);
});

test('TextField.disabledにtrueを設定した場合、input elmentのdisabledプロパティがtrueとなること', () => {
  const textField = shallow(<TextField disabled />);

  expect(textField.find('input').prop('disabled')).toBeTruthy();
});

describe('readOnlyプロパティを設定することができる', () => {
  const value = 'text-value';

  test('valueがテキストノードで表示される', () => {
    const wrapper = shallow(<TextField value={value} readOnly />);

    expect(wrapper.text()).toBe(value);
  });

  test('特定のcssクラスが付与される', () => {
    const wrapper = shallow(<TextField value={value} readOnly />);

    expect(wrapper.hasClass('ts-text-field--readonly')).toBeTruthy();
  });
});

test('TextField.typeにpasswordを設定した場合、input elmentのtype属性がpasswordとなること', () => {
  const type = 'password';
  const textField = shallow(<TextField type={type} />);

  expect(textField.find('input').prop('type')).toBe(type);
});
