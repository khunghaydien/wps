import * as React from 'react';

import { mount, shallow } from 'enzyme';

// @ts-ignore
import { __get__ } from '../Tooltip';

const asElement = __get__('asElement');
const withStyledChildren = __get__('withStyledChildren');
const withTriggerableChildren = __get__('withTriggerableChildren');
const withTriggerable = __get__('withTriggerable');

describe('withTriggerable()', () => {
  /* eslint-disable jsx-a11y/tabindex-no-positive */

  const mockPresentation = jest.fn((_props) => <div />);
  const TooltipMock = withTriggerable(mockPresentation);
  const props = {
    content: 'TOOLTIP TEST',
    align: 'top left',
    position: 'abosolute',
  };
  mount(
    <TooltipMock {...props}>
      {/* @ts-ignore */}
      <div tabIndex="777">CONTENT</div>
    </TooltipMock>
  );
  const passedProps = mockPresentation.mock.calls[0][0];

  test('ツールチップが表示出来る', () => {
    const html = shallow(passedProps.children).find('div');
    expect(passedProps.align).toEqual('top left');
    expect(passedProps.content).toEqual('TOOLTIP TEST');
    expect(passedProps.contentStyle).toBeUndefined();
    expect(passedProps.position).toEqual('abosolute');
    expect(html.text()).toEqual('CONTENT');
    expect(html.prop('tabIndex')).toEqual('777');
    expect(html.prop('style')).toEqual({});
  });

  /* eslint-enable jsx-a11y/tabindex-no-positive */
});

describe('asElement()', () => {
  test('文字列をツールチップ表示用の要素に変換出来る', () => {
    const element = asElement('TOOLTIP TEXT');
    expect(element.type).toEqual('div');
    expect(element.props.children).toEqual('TOOLTIP TEXT');
    expect(element.props.tabIndex).toEqual(0);
    expect(element.props.style).toEqual({ display: 'inline' });
  });
});

describe('withStyledChildren()', () => {
  describe('props: style', () => {
    test('スタイルが設定できる', () => {
      const expectedStyle = {
        width: '100em',
        position: 'abosolute',
      };
      const actual = withStyledChildren(expectedStyle)(<div />);
      expect(actual.props.style).toEqual(expectedStyle);
    });
  });
});

describe('withTriggerableChildren()', () => {
  describe('props: tabIndex', () => {
    describe.each([0, 1, 2, 3, 4, 5])('tabIndexが %i の場合', (tabIndex) => {
      test(`tabIndex: ${tabIndex}`, () => {
        const actual = withTriggerableChildren(<div tabIndex={tabIndex} />);
        expect(actual.props.tabIndex).toEqual(tabIndex);
      });
    });
    describe('tabIndexがnullの場合', () => {
      test('tabIndexは0になる', () => {
        const actual = withTriggerableChildren(<div tabIndex={null} />);
        expect(actual.props.tabIndex).toEqual(0);
      });
    });
    describe('tabIndexがundefinedの場合', () => {
      test('tabIndexは0になる', () => {
        const actual = withTriggerableChildren(<div tabIndex={undefined} />);
        expect(actual.props.tabIndex).toEqual(0);
      });
    });
    describe.each(['a', 'button', 'input', 'select', 'textarea'])(
      'トリガー可能な要素(%s)が対象の場合',
      (elemString) => {
        test(`${elemString}要素のtabIndexは変更されない`, () => {
          const actual = withTriggerableChildren(
            React.createElement(elemString, { tabIndex: 100 })
          );
          expect(actual.props.tabIndex).toEqual(100);
        });
      }
    );
  });
});
