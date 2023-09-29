import React from 'react';

import { mount } from 'enzyme';

// @ts-ignore
import Dropdown, { __get__ } from '../Dropdown';

const withStyle = __get__('withStyle');
const withState = __get__('withState');

describe('Dropdown', () => {
  const dummyData = [
    { type: 'item', label: 'test1', value: 1 },
    { type: 'item', label: 'test2', value: 2 },
    { type: 'item', label: 'test3', value: 3 },
  ];

  describe('withStyle()', () => {
    const mockPresentation = jest.fn((_props) => <div />);
    const DropdownMock = withStyle(mockPresentation);
    const className = 'test-classname';
    mount(<DropdownMock options={dummyData} value={2} className={className} />);

    let passedProps;
    beforeEach(() => {
      passedProps = mockPresentation.mock.calls[0][0];
    });

    test('カスタム className が追加出来る', () => {
      expect(passedProps.className).toEqual(
        `commons-fields-dropdown ${className}`
      );
    });
  });

  describe('withState()', () => {
    describe('props: options', () => {
      const mockPresentation = jest.fn((_props) => <div />);
      const DropdownMock = withState(mockPresentation);

      describe('optionsをバインドする', () => {
        const wrapper = mount<any>(
          <DropdownMock options={dummyData} value={2} />
        );

        afterAll(() => {
          mockPresentation.mockClear();
        });

        test('ステートに正しいオプションが設定される', () => {
          expect(wrapper.state().label).toEqual('test2');
          expect(wrapper.state().value).toEqual(2);
        });

        test('プレゼンテーションに正しい props が渡される', () => {
          const passedProps = mockPresentation.mock.calls[0][0];
          expect(passedProps.label).toEqual('test2');
          expect(passedProps.value).toEqual(2);
        });
      });

      describe('optionsがvalueより後にバインドされる', () => {
        const wrapper = mount<typeof Dropdown>(<DropdownMock value={3} />);

        afterAll(() => {
          mockPresentation.mockClear();
        });

        beforeAll(() => {
          wrapper.setProps({
            options: dummyData,
          });
        });

        test('ステートに正しいオプションが設定される', () => {
          expect(wrapper.state().label).toEqual('test3');
          expect(wrapper.state().value).toEqual(3);
        });

        test('プレゼンテーションに正しい props が渡される', () => {
          const passedProps = mockPresentation.mock.calls[0][0];
          expect(passedProps.label).toEqual('test3');
          expect(passedProps.value).toEqual(3);
        });
      });
    });

    describe('props: onSelect', () => {
      const onSelectMock = jest.fn();
      const mockPresentation = jest.fn((_props) => <div />);
      const DropdownMock = withState(mockPresentation);
      const wrapper = mount<typeof Dropdown>(
        <DropdownMock options={dummyData} value={2} onSelect={onSelectMock} />
      );

      describe.each(dummyData)('%oが選択される', (option) => {
        afterEach(() => {
          mockPresentation.mockClear();
        });

        beforeEach(() => {
          wrapper.instance().onSelect(option);
        });

        test(`ステート: value は ${option.value}`, () => {
          expect(wrapper.state().value).toEqual(option.value);
        });
        test(`ステート: label は ${option.label}`, () => {
          expect(wrapper.state().label).toEqual(option.label);
        });

        test(`onSelectが引数 ${JSON.stringify(option)} でコールされる`, () => {
          expect(onSelectMock).toHaveBeenCalledWith(option);
        });
      });
    });

    describe('props: value', () => {
      const mockPresentation = jest.fn((_props) => <div />);
      const DropdownMock = withState(mockPresentation);
      const wrapper = mount<typeof Dropdown>(
        <DropdownMock options={dummyData} value={2} />
      );

      describe('valueをバインドする', () => {
        afterAll(() => {
          mockPresentation.mockClear();
        });

        test('ステートに正しいオプションが設定される', () => {
          expect(wrapper.state().label).toEqual('test2');
          expect(wrapper.state().value).toEqual(2);
        });

        test('プレゼンテーションに正しい props が渡される', () => {
          const passedProps = mockPresentation.mock.calls[0][0];
          expect(passedProps.label).toEqual('test2');
          expect(passedProps.value).toEqual(2);
        });
      });

      describe('valueの変更', () => {
        afterEach(() => {
          mockPresentation.mockClear();
        });

        describe.each(dummyData)('%oに変更する', (option) => {
          let passedProps;
          beforeEach(() => {
            wrapper.setProps({
              value: option.value,
            });
            passedProps = mockPresentation.mock.calls[0][0];
          });

          test(`ステート: value は ${option.value}`, () => {
            expect(wrapper.state().value).toEqual(option.value);
          });
          test(`ステート: label は ${option.label}`, () => {
            expect(wrapper.state().label).toEqual(option.label);
          });

          test(`プレゼンテーションに props.value (${option.value}) が渡される`, () => {
            expect(passedProps.value).toEqual(option.value);
          });
          test(`プレゼンテーションに props.value (${option.label}) が渡される`, () => {
            expect(passedProps.label).toEqual(option.label);
          });
        });
      });
    });

    describe('props: label', () => {
      const mockPresentation = jest.fn((_props) => <div />);
      const DropdownMock = withState(mockPresentation);
      const wrapper = mount<typeof Dropdown>(
        <DropdownMock options={dummyData} label="label" />
      );

      describe('label をバインドする', () => {
        afterAll(() => {
          mockPresentation.mockClear();
        });

        test('ステートに正しいオプションが設定される', () => {
          expect(wrapper.state().label).toEqual('label');
          expect(wrapper.state().value).toBeUndefined();
        });

        test('プレゼンテーションに正しい props が渡される', () => {
          const passedProps = mockPresentation.mock.calls[0][0];
          expect(passedProps.label).toEqual('label');
          expect(passedProps.value).toBeUndefined();
        });
      });

      describe('label の変更', () => {
        afterEach(() => {
          mockPresentation.mockClear();
        });

        describe.each(['label1', 'label2'])('%sに変更する', (label) => {
          let passedProps;
          beforeEach(() => {
            wrapper.setProps({
              label,
            });
            passedProps = mockPresentation.mock.calls[0][0];
          });

          test(`ステート: value は undefined`, () => {
            expect(wrapper.state().value).toBeUndefined();
          });
          test(`ステート: label は ${label}`, () => {
            expect(wrapper.state().label).toEqual(label);
          });

          test(`プレゼンテーションに props.value (undefined) が渡される`, () => {
            expect(passedProps.value).toBeUndefined();
          });
          test(`プレゼンテーションに props.value (${label}) が渡される`, () => {
            expect(passedProps.label).toEqual(label);
          });
        });
      });
    });
  });
});
