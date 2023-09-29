import * as React from 'react';

import styled from 'styled-components';

import Button from './Button';
import Name from './Name';
import { EmployeeViewModel } from '@apps/attendance/timesheet-pc-importer/viewModels/EmployeeViewModel';

const Container = styled.div`
  display: flex;
`;

const NameArea = styled.div<{
  allowedSwitching: boolean;
}>`
  margin: auto 0;
  margin-right: ${({ allowedSwitching }) => (allowedSwitching ? '0' : '15px')};
`;

const ButtonArea = styled.div`
  margin: auto 10px;
`;

const Header: React.FC<{
  ownerEmployee: EmployeeViewModel;
  allowedSwitching: boolean;
  changeOwnerEmployee: () => void;
}> = ({ ownerEmployee, allowedSwitching, changeOwnerEmployee }) => (
  <Container>
    <NameArea allowedSwitching={allowedSwitching}>
      <Name {...{ ...ownerEmployee }} />
    </NameArea>
    {allowedSwitching && (
      <ButtonArea>
        <Button onClick={changeOwnerEmployee} />
      </ButtonArea>
    )}
  </Container>
);

export default Header;
