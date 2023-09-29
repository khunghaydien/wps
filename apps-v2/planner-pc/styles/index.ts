import { css, FlattenSimpleInterpolation } from 'styled-components';

export const Color = {
  event: '#006dcc',

  eventHover: '#004b99',

  sunday: '#d97474',

  saturday: '#4d97d9',

  today: '#e5f3ff',

  todayText: '#006DCC',
};

export const Ui = {
  eventList: {
    width: 200, // px,
    height: 240, // px
  },
  event: {
    height: 402, // px
    width: 510, // px
  },
};

const readOnlyEvent = css`
  :hover,
  :focus {
    background: ${Color.event};
    cursor: auto;
  }
`;

const editableEvent = css`
  :hover,
  :focus {
    background: ${Color.eventHover};
    cursor: pointer;
  }
`;

export const Style = {
  event: css<{ isReadOnly?: boolean; isEditing?: boolean }>`
    appearance: none;
    border: none;
    outline: none;
    background: ${Color.event};
    border-radius: 2px;
    color: #fff;
    padding: 0 4px;
    display: flex;
    align-items: center;
    width: 100%;
    ${({ isReadOnly }): FlattenSimpleInterpolation =>
      isReadOnly ? readOnlyEvent : editableEvent};
    ${({ isEditing }): FlattenSimpleInterpolation =>
      isEditing &&
      css`
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      `}
  `,
};
