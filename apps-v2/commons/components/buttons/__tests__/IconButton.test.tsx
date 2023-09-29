import React from 'react';

import { mount, shallow } from 'enzyme';

import IconButton from '../IconButton';

/*
 * 単体テスト
 * アイコンボタン - 共通コンポーネント
 */
test('IconButtonをrender時にbutton elementが1つ生成されていること', () => {
  const button = shallow(<IconButton src="path/to/icon" alt="アイコン" />);

  expect(button.find('button')).toHaveLength(1);
});

// IconButton.srcに着目
describe('IconButton.src', () => {
  let button;

  beforeAll(() => {
    button = shallow(<IconButton src="path/to/icon" />);
  });

  test('に値を指定した場合、image elementが一つ生成されていること', () => {
    expect(button.find('button').find('img')).toHaveLength(1);
  });

  test('に値を指定した場合、image elementのsrc属性に値が設定されていること', () => {
    expect(button.find('button').find('img').prop('src')).toBe('path/to/icon');
  });
});

describe('IconButton.alt', () => {
  test('が無指定の時は空白文字がimage elementのalt属性に設定されていること', () => {
    const button = shallow(<IconButton src="path/to/icon" />);

    expect(button.find('button').find('img').prop('alt')).toBe('');
  });

  test('を指定した場合、image elementのalt属性に設定されていること', () => {
    const alt = 'altText';
    const button = shallow(<IconButton src="path/to/icon" alt={alt} />);

    expect(button.find('button').find('img').prop('alt')).toBe(alt);
  });
});

test('IconButtonのbutton elementをClickされた時にonClickプロパティに渡したコールバックメソッドが実行されること', () => {
  let cnt = 0;
  const button = mount(
    <IconButton
      src="path/to/icon"
      onClick={() => {
        cnt += 1;
      }}
    />
  );

  button.find('button').simulate('click').simulate('click');

  expect(cnt).toBe(2);
});

test('IconButton.classNameに値を設定した場合、button elementのclass属性に設定した値が付与されること', () => {
  const button = shallow(
    <IconButton className="someIconClass" src="path/to/icon" alt="altText" />
  );

  expect(button.find('button').hasClass('someIconClass')).toBeTruthy();
});

test('IconButton.disabledにtrueを指定した場合、button elementのdisabledプロパティがtrueになっていること', () => {
  const button = shallow(<IconButton src="path/to/icon" disabled />);

  expect(button.find('button').prop('disabled')).toBeTruthy();
});
