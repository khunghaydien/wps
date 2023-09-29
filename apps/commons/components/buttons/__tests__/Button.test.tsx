import React from 'react';

import { mount, shallow } from 'enzyme';

import Button from '../Button';

/*
 * 単体テスト
 * ボタン - 共通コンポーネント
 */
test('Buttonをrender時にbutton elementが1つ生成されていること', () => {
  const button = shallow(<Button>テスト文言</Button>);

  expect(button.find('button')).toHaveLength(1);
});

test('Buttonのbutton elementがClickされた時にonClickプロパティに渡したコールバックメソッドが実行されること', () => {
  let cnt = 0;
  const button = mount(
    <Button
      onClick={() => {
        cnt += 1;
      }}
    >
      テスト文言
    </Button>
  );

  button.find('button').simulate('click').simulate('click');

  expect(cnt).toBe(2);
});

test('Button.childrenにStringを挿入した場合、ラベルとして表示されること', () => {
  const button = shallow(<Button>テスト文言</Button>);

  expect(button.find('button').text()).toBe('テスト文言');
});

describe('Button.type', () => {
  test('が無指定の場合ts-button--defaultがclassに設定される', () => {
    const button = shallow(<Button>ボタン</Button>);

    expect(button.find('button').hasClass('ts-button--default')).toBeTruthy();
  });

  test('がprimaryの場合、ts-button--primaryがclassに設定される', () => {
    const button = shallow(<Button type="primary">ボタン</Button>);

    expect(button.find('button').hasClass('ts-button--primary')).toBeTruthy();
  });
});

test('Button.disabledにtrueを設定した場合、disabledプロパティがtrueとなること', () => {
  const button = shallow(<Button disabled>ボタン</Button>);

  expect(button.find('button').prop('disabled')).toBeTruthy();
});

describe('Button.iconSrc', () => {
  const src = 'some-url';
  test('を指定した際にbutton elementの子要素にアイコン表示用のimage elementが1つ生成されること', () => {
    const button = shallow(<Button iconSrc={src}>ボタン</Button>);

    expect(button.find('button').find('img')).toHaveLength(1);
  });

  test('を指定した際にimage elementのsrc属性に指定したiconSrcが設定されていること', () => {
    const button = shallow(<Button iconSrc={src}>ボタン</Button>);

    expect(button.find('button').find('img').prop('src')).toBe(src);
  });

  test('を指定かつiconAltにも値を設定すると生成されたimage elementのalt属性に値がセットされること', () => {
    const button = shallow(
      <Button iconSrc="/path/to/image" iconAlt="test alt">
        ボタン
      </Button>
    );

    expect(button.find('button').find('img').prop('alt')).toBe('test alt');
  });

  test('を指定かつiconAlignにrightを設定した場合、img elementが生成されること', () => {
    const button = shallow(
      <Button iconSrc="/path/to/image" iconAlign="right">
        ボタン
      </Button>
    );

    // Next Text Node
    const img = button.find('button').find('div').childAt(1);

    expect(img.type()).toBe('img');
  });

  test('を指定かつiconAlignにrightを設定した場合、img elementへレイアウト用のクラスが付与されること', () => {
    const button = shallow(
      <Button iconSrc="/path/to/image" iconAlign="right">
        ボタン
      </Button>
    );

    const img = button.find('button').find('div').childAt(1);

    expect(img.hasClass('ts-button__icon--right')).toBeTruthy();
  });
});

test('classNameに値を設定した場合、class属性に設定した値が付与されること', () => {
  const button = shallow(<Button className="test-class">ボタン</Button>);

  expect(button.find('button').hasClass('test-class')).toBeTruthy();
});

describe('文字列とアイコンを同時に設定した際に', () => {
  test('文字列が表示されていること', () => {
    const button = shallow(<Button iconSrc="/path/to/image">ボタン</Button>);

    expect(button.find('button').text()).toBe('ボタン');
  });

  test('image elementが生成されていること', () => {
    const button = shallow(<Button iconSrc="/path/to/image">ボタン</Button>);

    expect(button.find('button').find('img')).toHaveLength(1);
  });
});

describe('Button.submit', () => {
  test('がtrueの際はbutton(type=submit)となること', () => {
    const button = shallow(<Button submit>ボタン</Button>);

    expect(button.find('button').prop('type')).toBe('submit');
  });

  test('がfalseの際はbutton(type=button)となること', () => {
    const button = shallow(<Button submit={false}>ボタン</Button>);

    expect(button.find('button').prop('type')).toBe('button');
  });

  test('がデフォルトではbutton(type=button)となること', () => {
    const button = shallow(<Button>ボタン</Button>);

    expect(button.find('button').prop('type')).toBe('button');
  });
});
