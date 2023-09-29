import React from 'react';

import styled from 'styled-components';

import { Dialog } from '../../../core';

import { Allowances } from '../models/attDailyAllowanceAll';

import Contents from './Contents';
import Footer from './Footer';
import Header from './Header';

import './index.scss';

type Props = {
  'data-testid'?: string;
  isModal?: boolean;
  isLoading: boolean;
  targetDate: string;
  isLocked: boolean;
  isSelectedTab: boolean;
  dailyAllowanceAllList: Allowances[];
  toggleSelection: (arg0: Allowances) => void;
  onClose: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSave: (e: React.SyntheticEvent<HTMLElement>) => void;
};

const DialogContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  /* Background */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 50000;
`;

const Wrapper = styled.div`
  width: 90vw;
  height: 90vh;
  min-width: 888px;
  min-height: 572px;
  max-width: 900px;
  max-height: 764px;
  z-index: 50001;
  position: absolute;
`;

const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DailyAllowance = ({ isModal = true, ...props }: Props) => {
  return (
    <DialogContainer>
      <Wrapper>
        <StyledDialog
          data-testid={props['data-testid']}
          isModal={isModal}
          header={<Header targetDate={props.targetDate} />}
          content={
            <Contents
              isSelectedTab={props.isSelectedTab}
              dailyAllowanceAllList={props.dailyAllowanceAllList}
              toggleSelection={props.toggleSelection}
              isLoading={props.isLoading}
            />
          }
          footer={
            <Footer
              onClose={props.onClose}
              onSave={props.onSave}
              isLocked={props.isLocked}
              isLoading={props.isLoading}
            />
          }
          onClose={props.onClose}
        />
      </Wrapper>
    </DialogContainer>
  );
};

export default DailyAllowance;
