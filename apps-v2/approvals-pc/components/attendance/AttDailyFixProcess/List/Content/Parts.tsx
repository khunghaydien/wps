import styled from 'styled-components';

const CELL_SIZE = {
  ATTENTION: `${16 + 8}px`,
  CHECK_BOX: `${16 + 8}px`,
  EMPLOYEE_ICON: `${48 + 12}px`,
  EMPLOYEE: '200px',
  DEPARTMENT: '150px',
  TARGET_DATE: '100px',
  START_TIME: '65px',
  END_TIME: '65px',
  ACTUAL_WORK_TIME: '65px',
  OVER_WORK_TIME: '65px',
  TOTAL_OVER_WORK_TIME: '100px',
  REQUEST_AND_EVENT: '97px',
} as const;

export const Table = styled.table`
  border-collapse: separate;
  table-layout: fixed;
  width: 100%;
`;

export const Row = styled.tr`
  > td {
    border-bottom: 1px solid #d8dde6;
  }
`;

export const AttentionCell = styled.td`
  width: ${CELL_SIZE.ATTENTION};
  align-items: center;
  padding-left: 8px;
`;

export const CheckBoxCell = styled.td`
  width: ${CELL_SIZE.CHECK_BOX};
  align-items: center;
  padding-left: 8px;
`;

export const EmployeeIconCell = styled.td`
  width: ${CELL_SIZE.EMPLOYEE_ICON};
  align-items: center;
  padding-left: 12px;
  text-align: center;

  img {
    max-width: 40px;
    min-width: 40px;
    max-height: 40px;
    min-height: 40px;
    background-color: #fff;
    border-radius: 50%;
  }
`;

export const EmployeeCell = styled.td`
  width: ${CELL_SIZE.EMPLOYEE};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 12px;
`;

export const DepartmentCell = styled.td`
  width: ${CELL_SIZE.DEPARTMENT};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 12px;
`;

export const TargetDateCell = styled.td`
  width: ${CELL_SIZE.TARGET_DATE};
  text-align: center;
  padding-left: 12px;
`;

export const StartTimeCell = styled.td`
  width: ${CELL_SIZE.START_TIME};
  text-align: center;
  padding-left: 12px;
`;

export const EndTimeCell = styled.td`
  width: ${CELL_SIZE.END_TIME};
  text-align: center;
  padding-left: 12px;
`;

export const ActualWorkTimeCell = styled.td`
  width: ${CELL_SIZE.ACTUAL_WORK_TIME};
  text-align: center;
  padding-left: 12px;
`;

export const OverWorkTimeCell = styled.td`
  width: ${CELL_SIZE.OVER_WORK_TIME};
  text-align: center;
  padding-left: 12px;
`;

export const TotalOverWorkTimeCell = styled.td`
  width: ${CELL_SIZE.TOTAL_OVER_WORK_TIME};
  text-align: center;
  padding-left: 12px;
`;

export const RequestAndEventCell = styled.td`
  min-width: ${CELL_SIZE.TOTAL_OVER_WORK_TIME};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 12px;
  padding-right: 8px;
`;
