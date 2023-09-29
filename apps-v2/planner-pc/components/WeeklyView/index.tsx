import styled from 'styled-components';

const WeeklyView = styled.div`
  position: relative;
  z-index: 0; // ブラウザ全体のスクロールバーを要素にかぶせて表示するため
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  height: 100%;
  overflow-y: scroll;
`;

export default WeeklyView;
