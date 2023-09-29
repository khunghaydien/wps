import React from 'react';

import { act as reactAct, render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { useDropdown } from '../index';

jest.mock('nanoid', () => {
  return (): string => 'id###';
});

it('should return options', () => {
  // Arrange
  const options = [
    {
      id: '1',
      label: '#1',
      value: 1,
    },
    {
      id: '2',
      label: '#2',
      value: 2,
    },
    {
      id: '3',
      label: '#3',
      value: 3,
    },
  ];
  const props = {
    disabled: false,
    readOnly: false,
    options,
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  const expected = [
    {
      id: '1',
      label: '#1',
      value: 1,
    },
    {
      id: '2',
      label: '#2',
      value: 2,
    },
    {
      id: '3',
      label: '#3',
      value: 3,
    },
  ];
  expect(result.current.options).toEqual(expected);
});

it('should return options with ids', () => {
  // Arrange
  const options = [
    {
      label: '#1',
      value: 1,
    },
    {
      label: '#2',
      value: 2,
    },
    {
      label: '#3',
      value: 3,
    },
  ];
  const props = {
    disabled: false,
    readOnly: false,
    options,
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  const expected = [
    {
      id: 'id###',
      label: '#1',
      value: 1,
    },
    {
      id: 'id###',
      label: '#2',
      value: 2,
    },
    {
      id: 'id###',
      label: '#3',
      value: 3,
    },
  ];
  expect(result.current.options).toEqual(expected);
});

it('should return options with an empty option if hasEmptyOption', () => {
  // Arrange
  const options = [
    {
      label: '#1',
      value: 1,
    },
    {
      label: '#2',
      value: 2,
    },
    {
      label: '#3',
      value: 3,
    },
  ];
  const props = {
    disabled: false,
    readOnly: false,
    hasEmptyOption: true,
    options,
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  const expected = [
    {
      id: 'id###',
      label: 'None',
      value: '',
    },
    {
      id: 'id###',
      label: '#1',
      value: 1,
    },
    {
      id: 'id###',
      label: '#2',
      value: 2,
    },
    {
      id: 'id###',
      label: '#3',
      value: 3,
    },
  ];
  expect(result.current.options).toEqual(expected);
});

it('should disable isOpening by default', () => {
  // Arrange
  const props = {
    disabled: false,
    readOnly: false,
    options: [],
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  expect(result.current.isOpening).toBe(false);
});

it('should enable isOpening if it runs onClick', () => {
  // Arrange
  const props = {
    disabled: false,
    readOnly: false,
    options: [],
  };
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));
  const event = {
    currentTarget: {},
  };

  // Act
  act(() => {
    // @ts-ignore
    result.current.onClick(event);
  });

  // Assert
  expect(result.current.isOpening).toBe(true);
});

it('should select an option via onSelect', () => {
  // Arrange
  const onSelect = jest.fn();
  const props = {
    onSelect,
    disabled: false,
    readOnly: false,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };
  const { result } = renderHook(() => useDropdown(props));
  const event = {
    currentTarget: {},
  };

  // Act
  act(() => {
    // @ts-ignore
    result.current.onClick(event);
    result.current.onSelect({
      id: '2',
      label: '#2',
      value: 2,
    });
  });

  // Assert
  expect(onSelect).toHaveBeenCalledWith({
    id: '2',
    label: '#2',
    value: 2,
  });
});

it('should return selected option', () => {
  // Arrange
  const props = {
    disabled: false,
    readOnly: false,
    value: 2,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  expect(result.current.selectedOption).toEqual({
    id: '2',
    label: '#2',
    value: 2,
  });
});

it('should not select an option by default', () => {
  // Arrange
  const props = {
    disabled: false,
    readOnly: false,
    value: undefined,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  expect(result.current.selectedOption).toEqual({ value: null });
});

it.each`
  readOnly | disabled
  ${true}  | ${false}
  ${false} | ${true}
  ${true}  | ${true}
`(
  'should not fire onClick if readOnly is $readOnly and disabled is $disabled',
  ({ readOnly, disabled }) => {
    // Arrange
    const props = {
      disabled,
      readOnly,
      value: 2,
      options: [],
    };
    // @ts-ignore
    const { result } = renderHook(() => useDropdown(props));
    const event = {
      currentTarget: {},
    };

    // Act
    act(() => {
      // @ts-ignore
      result.current.onClick(event);
    });

    // Assert
    expect(result.current.isOpening).toBe(false);
  }
);

it.each`
  readOnly | disabled
  ${true}  | ${false}
  ${false} | ${true}
  ${true}  | ${true}
`(
  'should not fire onSelect if readOnly is $readOnly and disabled is $disabled',
  ({ readOnly, disabled }) => {
    // Arrange
    const onSelect = jest.fn();
    const props = {
      onSelect,
      disabled,
      readOnly,
      value: 2,
      options: [],
    };
    const { result } = renderHook(() => useDropdown(props));
    const event = {
      currentTarget: {},
    };

    // Act
    act(() => {
      // @ts-ignore
      result.current.onClick(event);
      // @ts-ignore
      result.current.onSelect({});
    });

    // Assert
    expect(onSelect).not.toHaveBeenCalled();
  }
);

it('should return the label of selected option as dropdown label', () => {
  // Arrange
  const props = {
    value: 2,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  expect(result.current.label).toBe('#2');
});

it('should return the value of selected option as dropdown label', () => {
  // Arrange
  const props = {
    value: 2,
    options: [
      {
        id: '1',
        value: 1,
      },
      {
        id: '2',
        value: 2,
      },
      {
        id: '3',
        value: 3,
      },
    ],
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  expect(result.current.label).toBe(2);
});

it('should return placeholder as dropdown label', () => {
  // Arrange
  const props = {
    placeholder: 'Placeholder',
    value: undefined,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };

  // Act
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));

  // Assert
  expect(result.current.label).toBe('Placeholder');
});

it('should toggle dropdown menu', () => {
  // Arrange
  const props = {
    placeholder: 'Placeholder',
    value: undefined,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };
  // @ts-ignore
  const { result } = renderHook(() => useDropdown(props));
  const event = {
    currentTarget: {},
  };

  // Act
  act(() => {
    // @ts-ignore
    result.current.onClick(event);
    // @ts-ignore
    result.current.onClick(event);
  });

  // Assert
  expect(result.current.isOpening).toBe(false);
});

it('should close dropdown menu if the outside of the menu is clicked', () => {
  // Arrange
  const props = {
    value: undefined,
    options: [
      {
        id: '1',
        label: '#1',
        value: 1,
      },
      {
        id: '2',
        label: '#2',
        value: 2,
      },
      {
        id: '3',
        label: '#3',
        value: 3,
      },
    ],
  };
  const Dropdown = () => {
    // @ts-ignore
    const { isOpening, onClick, DropdownMenu } = useDropdown(props);
    return (
      <>
        <div data-testid="outside" />
        <button data-testid="open" onClick={onClick}>
          Open
        </button>
        {isOpening && (
          <div data-testid="menu">
            <DropdownMenu>menu</DropdownMenu>
          </div>
        )}
      </>
    );
  };
  const { getByTestId, queryByTestId } = render(<Dropdown />);

  // Act
  reactAct(() => {
    userEvent.click(getByTestId('open'));
    userEvent.click(getByTestId('outside'));
  });

  // Assert
  expect(queryByTestId('menu')).toBeNull();
});
