import { css } from 'styled-components';

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

export const Style = {
  event: css`
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
  `,
};
