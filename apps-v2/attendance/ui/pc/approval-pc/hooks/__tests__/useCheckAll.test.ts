import { act, renderHook } from '@testing-library/react-hooks';

import useCheckAll from '../useCheckAll';

const createArray = (length: number) =>
  new Array(length).fill(0).map((_, key) => `${key + 1}`);

const targets = createArray(1000);
const setChecked = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkedAll', () => {
  it.each`
    targets              | checked             | max          | expected
    ${createArray(10)}   | ${[]}               | ${undefined} | ${false}
    ${createArray(10)}   | ${createArray(10)}  | ${undefined} | ${true}
    ${createArray(1000)} | ${createArray(100)} | ${undefined} | ${true}
    ${createArray(10)}   | ${[]}               | ${0}         | ${false}
    ${createArray(10)}   | ${createArray(10)}  | ${0}         | ${true}
    ${createArray(1000)} | ${createArray(100)} | ${0}         | ${true}
    ${createArray(10)}   | ${[]}               | ${10}        | ${false}
    ${createArray(10)}   | ${createArray(10)}  | ${10}        | ${true}
    ${createArray(1000)} | ${createArray(100)} | ${10}        | ${true}
    ${createArray(10)}   | ${[]}               | ${1000}      | ${false}
    ${createArray(10)}   | ${createArray(10)}  | ${1000}      | ${true}
    ${createArray(1000)} | ${createArray(100)} | ${1000}      | ${false}
  `('should be $expected', ({ targets, checked, max, expected }) => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked,
        setChecked,
        max,
      })
    );
    expect(result.current.checkedAll).toBe(expected);
  });
});

describe('check()', () => {
  it('should check', () => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked: [],
        setChecked,
      })
    );

    act(() => {
      result.current.check('1');
    });

    expect(setChecked).toBeCalledTimes(1);
    expect(setChecked).toBeCalledWith(['1']);
  });

  it('should uncheck', () => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked: ['1', '2', '3'],
        setChecked,
      })
    );

    act(() => {
      result.current.check('1');
    });

    expect(setChecked).toBeCalledTimes(1);
    expect(setChecked).toBeCalledWith(['2', '3']);
  });

  it.each`
    targetId | max
    ${'1'}   | ${100}
    ${'100'} | ${100}
  `('should uncheck if checked is max', ({ targetId, max }) => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked: createArray(max),
        setChecked,
        max,
      })
    );

    let $result;
    act(() => {
      $result = result.current.check(targetId);
    });

    expect($result).toEqual(true);
    expect(setChecked).toBeCalledTimes(1);
    expect(setChecked.mock.calls[0][0].includes(targetId)).toEqual(false);
  });

  it.each`
    targetId | max
    ${'101'} | ${100}
    ${'201'} | ${200}
  `('should do nothing if checked is max', ({ targetId, max }) => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked: createArray(max),
        setChecked,
        max,
      })
    );

    let $result;
    act(() => {
      $result = result.current.check(targetId);
    });

    expect($result).toEqual(false);
    expect(setChecked).toBeCalledTimes(0);
  });
});

describe('checkAll()', () => {
  it.each`
    checked             | max
    ${[]}               | ${100}
    ${createArray(50)}  | ${100}
    ${createArray(100)} | ${200}
  `('should check', ({ checked, max }) => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked,
        setChecked,
        max,
      })
    );

    act(() => {
      result.current.checkAll();
    });

    expect(setChecked).toBeCalledTimes(1);
    expect(setChecked).toBeCalledWith(createArray(max));
  });

  it.each`
    checked             | max
    ${createArray(50)}  | ${50}
    ${createArray(100)} | ${100}
    ${createArray(200)} | ${200}
  `('should uncheck', ({ checked, max }) => {
    const { result } = renderHook(() =>
      useCheckAll({
        targets,
        checked,
        setChecked,
        max,
      })
    );

    act(() => {
      result.current.checkAll();
    });

    expect(setChecked).toBeCalledTimes(1);
    expect(setChecked).toBeCalledWith([]);
  });
});

describe('max', () => {
  it('should not slice checked when changing max', () => {
    renderHook(() =>
      useCheckAll({
        targets,
        checked: createArray(5),
        setChecked,
        max: 10,
      })
    );
    expect(setChecked).toBeCalledTimes(0);
  });

  it('should slice checked when changing max', () => {
    renderHook(() =>
      useCheckAll({
        targets,
        checked: createArray(5),
        setChecked,
        max: 3,
      })
    );

    expect(setChecked).toBeCalledTimes(1);
    expect(setChecked.mock.calls[0][0].length).toEqual(3);
  });
});
