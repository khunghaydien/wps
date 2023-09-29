import React from 'react';

import styled from 'styled-components';

import { useModal } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import msg from '@commons/languages';

import { WorkSystemType } from '@attendance/domain/models/WorkingType';

import { Props as DialogProps } from '@admin-pc/containers/WorkingTypeContainer/CustomFields/AttPattern/PatternDialogContainer';

type Props = {
  disabled: boolean;
  workSystem: WorkSystemType;
  selectedPattern: any[];
  PatternDialogContainer: React.FC<DialogProps>;
};
const SelectedWrapper = styled.div`
  border: 1px solid #dddbda;
  border-radius: 4px;
  margin-bottom: 5px;
  background-color: #cecece;
  ul {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 140px;
    min-height: 25px;
    padding-left: 3px;
    li {
      color: #101010;
      padding: 3px;
    }
  }
`;

const AttPattern: React.FC<Props> = ({
  disabled,
  workSystem,
  selectedPattern,
  PatternDialogContainer,
}) => {
  const { isOpen, openModal, closeModal, Modal } = useModal();
  return (
    <React.Fragment>
      <SelectedWrapper>
        <ul>
          {selectedPattern.map((item) => (
            <li key={item.code}>
              {item.code}: {item.name}
            </li>
          ))}
        </ul>
      </SelectedWrapper>
      <Button disabled={disabled} onClick={openModal}>
        {msg().Admin_Lbl_AttPatternSelect}
      </Button>
      {isOpen && (
        <Modal>
          <PatternDialogContainer
            isOpen={isOpen}
            workSystem={workSystem}
            onClose={closeModal}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};
export default AttPattern;
