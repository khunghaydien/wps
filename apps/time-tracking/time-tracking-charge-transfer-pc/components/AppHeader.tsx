import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import PersonalMenuPopoverButtonContainer from '@apps/commons/containers/PersonalMenuPopoverButtonContainer';
import ProxyIndicatorContainer from '@apps/commons/containers/ProxyIndicatorContainer';
import msg from '@apps/commons/languages';
import { NavigationBar, Text } from '@apps/core';

import { State } from '@apps/time-tracking/time-tracking-charge-transfer-pc/modules';

import App from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/App';

import AppIcon from '@apps/time-tracking/time-tracking-charge-transfer-pc/images/Track.svg';

const S = {
  Wrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `,
  ProxyIndicatorWrapper: styled.div`
    padding-right: 20px;
  `,
};

const AppHeader: React.FC = () => {
  const isDelegated = useSelector(
    (state: State) => state.common.proxyEmployeeInfo.isProxyMode
  );

  const dispatch = useDispatch();
  const { unselectDelegatedEmployee } = React.useMemo(
    () => App(dispatch),
    [dispatch]
  );

  return (
    <NavigationBar icon={AppIcon}>
      <S.Wrapper>
        <Text size="xxl" color="secondary" bold>
          {msg().Trac_Lbl_TimeTrackingChargeTransfer}
        </Text>
        {isDelegated ? (
          <ProxyIndicatorContainer
            onClickExitButton={unselectDelegatedEmployee}
          />
        ) : (
          <S.ProxyIndicatorWrapper>
            <PersonalMenuPopoverButtonContainer />
          </S.ProxyIndicatorWrapper>
        )}
      </S.Wrapper>
    </NavigationBar>
  );
};

export default AppHeader;
