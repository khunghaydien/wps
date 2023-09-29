import React from 'react';

import { mount } from 'enzyme';

// @ts-ignore
// eslint-disable-next-line  import/named
import { __get__ } from '../Comparison';

const withComparable: (
  arg0: React.ComponentType<any>
) => React.ComponentType<any> = __get__('withComparable');

describe('Comparison', () => {
  describe('withComparable()', () => {
    describe('差分がある場合', () => {
      describe.each([
        {
          description: '日付(date)',
          props: {
            new: '2019/10/11',
            old: '2018/10/5',
            type: 'date',
          },
          expected: [
            {
              new: '2019',
              old: '2018',
              changed: true,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '10',
              old: '10',
              changed: false,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '11',
              old: '5',
              changed: true,
            },
          ],
        },
        {
          description: '日時(datetime)',
          props: {
            new: '2018/10/11 10:00–19:00',
            old: '2018/11/11 9:00–18:00',
            type: 'datetime',
          },
          expected: [
            {
              new: '2018',
              old: '2018',
              changed: false,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '10',
              old: '11',
              changed: true,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '11',
              old: '11',
              changed: false,
            },
            {
              new: ' ',
              old: ' ',
              changed: false,
            },
            {
              new: '10:00',
              old: '9:00',
              changed: true,
            },
            {
              new: '–',
              old: '–',
              changed: false,
            },
            {
              new: '19:00',
              old: '18:00',
              changed: true,
            },
          ],
        },
        {
          description: 'テキスト(text)',
          props: {
            new: 'FOOBAR',
            old: 'HOGE',
            type: 'text',
          },
          expected: [
            {
              new: '',
              old: '',
              changed: false,
            },
            {
              new: 'FOOBAR',
              old: 'HOGE',
              changed: true,
            },
            {
              new: '',
              old: '',
              changed: false,
            },
          ],
        },
        {
          description: '長いテキスト(longtext)',
          props: {
            new: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を',
            old: '後ろで大きな爆発音がした。俺は驚いて振り返った。',
            type: 'longtext',
          },
          expected: [
            {
              new: '',
              old: '',
              changed: false,
            },
            {
              new: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を',
              old: '後ろで大きな爆発音がした。俺は驚いて振り返った。',
              changed: true,
            },
            {
              new: '',
              old: '',
              changed: false,
            },
          ],
        },
      ])('%p', ({ description, props, expected }) => {
        const mockPresentation = jest.fn((_props) => <div />);
        const ComparisonMock = withComparable(mockPresentation);
        const wrapper = mount(<ComparisonMock {...props} />);

        afterAll(() => {
          mockPresentation.mockClear();
        });

        test(`${description}の差分を計算できる`, () => {
          expect((wrapper.state() as any).tokens).toEqual(expected);
        });

        test('WrappedComponentに props が渡される', () => {
          const passedProps = mockPresentation.mock.calls[0][0];
          expect(passedProps).toEqual({ ...props, tokens: expected });
        });
      });
    });

    describe('差分がない場合', () => {
      describe.each([
        {
          description: '日付(date)',
          props: {
            new: '2019/10/11',
            old: '2019/10/11',
            type: 'date',
          },
          expected: [
            {
              new: '2019',
              old: '2019',
              changed: false,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '10',
              old: '10',
              changed: false,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '11',
              old: '11',
              changed: false,
            },
          ],
        },
        {
          description: '日時(datetime)',
          props: {
            new: '2018/11/11 10:00–19:00',
            old: '2018/11/11 10:00–19:00',
            type: 'datetime',
          },
          expected: [
            {
              new: '2018',
              old: '2018',
              changed: false,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '11',
              old: '11',
              changed: false,
            },
            {
              new: '/',
              old: '/',
              changed: false,
            },
            {
              new: '11',
              old: '11',
              changed: false,
            },
            {
              new: ' ',
              old: ' ',
              changed: false,
            },
            {
              new: '10:00',
              old: '10:00',
              changed: false,
            },
            {
              new: '–',
              old: '–',
              changed: false,
            },
            {
              new: '19:00',
              old: '19:00',
              changed: false,
            },
          ],
        },
        {
          description: 'テキスト(text)',
          props: {
            new: 'FOOBAR',
            old: 'FOOBAR',
            type: 'text',
          },
          expected: [
            {
              new: '',
              old: '',
              changed: false,
            },
            {
              new: 'FOOBAR',
              old: 'FOOBAR',
              changed: false,
            },
            {
              new: '',
              old: '',
              changed: false,
            },
          ],
        },
        {
          description: '長いテキスト(longtext)',
          props: {
            new: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を',
            old: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を',
            type: 'longtext',
          },
          expected: [
            {
              new: '',
              old: '',
              changed: false,
            },
            {
              new: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を',
              old: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を',
              changed: false,
            },
            {
              new: '',
              old: '',
              changed: false,
            },
          ],
        },
      ])('%p', ({ description, props, expected }) => {
        const mockPresentation = jest.fn((_props) => <div />);
        const ComparisonMock = withComparable(mockPresentation);
        const wrapper = mount(<ComparisonMock {...props} />);

        afterAll(() => {
          mockPresentation.mockClear();
        });

        test(`${description}の差分を正しく計算できる`, () => {
          expect((wrapper.state() as any).tokens).toEqual(expected);
        });

        test('WrappedComponentに props が渡される', () => {
          const passedProps = mockPresentation.mock.calls[0][0];
          expect(passedProps).toEqual({ ...props, tokens: expected });
        });
      });
    });
  });
});
