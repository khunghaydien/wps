import styled, { css } from 'styled-components';

type CellNumber = 1 | 3 | 8;

const Cell = styled.div<{
  left: number;
  width: number;
  isHeader?: boolean;
  cellNumber?: CellNumber;
}>`
  // ヘッダー・本文共通の値の例
  width: 100%;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  text-align: left;
  display: inline-block;
  position: absolute;
  margin: 0;

  // カラムごとの値の指定の例
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;

  // なんらかの条件で「プロパティ: 値」のセットを切り替える例
  ${({ isHeader }) =>
    isHeader
      ? css`
          height: 35px;
          background-color: #fafaf9;
          color: #514f4d;
          font-weight: 700;
        `
      : css`
          display: flex;
          height: 47px;
          color: #363635;
          border-bottom: 1px solid #ddd;
        `}

  ${({ cellNumber }) =>
    cellNumber === 1 &&
    css`
      padding-left: 20px;
    `}

  ${({ cellNumber }) =>
    cellNumber === 3 &&
    css`
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}

  ${({ cellNumber }) =>
    cellNumber === 8 &&
    css`
      padding-top: 7px;
      padding-bottom: 7px;
    `}
`;

export default Cell;
