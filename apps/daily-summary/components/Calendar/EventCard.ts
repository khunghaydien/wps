import styled, { css } from 'styled-components';

const EventCard = styled.div`
  background: #006dcc;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  padding: 4px 0 0 4px;
  word-break: break-all;
  overflow: hidden;
`;

// @ts-ignore https://github.com/microsoft/TypeScript/issues/37597
export const AllDayEvent = styled(EventCard).attrs<{ row: number }>(
  ({ row }) => ({
    style: {
      gridRow: `${row} / span 1`,
    },
  })
)<{ row: number }>`
  border: none;
  grid-column: 2 / span 1;
  margin: 0 8px 2px 2px;
  padding-right: 4px;

  :nth-of-type(2) {
    margin: 2px 8px 2px 2px;
  }
`;

// @ts-ignore https://github.com/microsoft/TypeScript/issues/37597
export const Event = styled(EventCard).attrs<{
  top: number;
  height: number;
  left: number;
  width: number;
}>(({ top, height, left, width }) => ({
  style: {
    top,
    height: height - 3,
    left,
    width,
  },
}))<{
  top: number;
  height: number;
  left: number;
  width: number;
  hasJob: boolean;
}>`
  position: absolute;
  border: 1px solid #fff;
  ${({ height }) =>
    height >= 50 &&
    css`
      display: flex;
      flex-direction: column;
    `}

  ${({ height }) =>
    height > 8 &&
    css`
      margin: 1px 8px 2px 2px;
      padding-left: 8px;
      padding-top: 4px;
    `}

  ${(props) =>
    !props.hasJob &&
    css`
      border: 1px solid #006dcc;
      background: #fff;
      color: #006dcc;
    `}
`;
