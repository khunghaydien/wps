import styled from 'styled-components';

import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from '../TimesheetViewType';
import zIndex from '../zIndex';

const FixedCell = styled.td<{ type: TimesheetViewType }>`
  ${({ type }) =>
    type === TIMESHEET_VIEW_TYPE.TABLE
      ? `
      position: sticky;
      top: 0;
      z-index: ${zIndex.rowLeft};
      `
      : ''}
`;

export default FixedCell;
