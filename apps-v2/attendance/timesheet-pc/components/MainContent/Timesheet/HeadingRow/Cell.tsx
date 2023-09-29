import styled from 'styled-components';

import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from '../TimesheetViewType';

const Cell = styled.th<{ type: TimesheetViewType }>`
  ${({ type }) =>
    type === TIMESHEET_VIEW_TYPE.TABLE
      ? `
      position: sticky;
      top: 0;
      left: 0;
      `
      : ''}
`;

export default Cell;
