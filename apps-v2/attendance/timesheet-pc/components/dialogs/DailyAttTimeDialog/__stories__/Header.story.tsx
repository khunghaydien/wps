import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import {
  detectPerformableActionForFix,
  STATUS,
} from '@attendance/domain/models/FixDailyRequest';

import Component from '../Header';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttTimeDialog/Header',
};

const Row = styled.div`
  display: flex;
`;

const Title = styled.div`
  display: flex;
  width: 304px;
  align-items: center;
  text-align: right;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 720px;
`;

export const Default = (): React.ReactNode => (
  <>
    {Object.values(STATUS).map((status) => (
      <Row key={status}>
        <Title>{status}</Title>
        <Wrapper>
          <Component
            loading={false}
            readOnly={false}
            allowedAction={true}
            fixDailyRequest={{
              id: undefined,
              status,
              approver01Name: 'approver employee name',
              performableActionForFix: detectPerformableActionForFix(status),
            }}
            enabledApprovalHistory={true}
            onClickOpenApprovalHistoryDialog={action(
              'onClickOpenApprovalHistoryDialog'
            )}
            onClickOpenApproverEmployeeSettingDialog={action(
              'onClickOpenApproverEmployeeSettingDialog'
            )}
            onSubmitRequest={action('onSubmitRequest')}
            enabledDisplayingNextApprover={true}
          />
        </Wrapper>
      </Row>
    ))}
    {/** Long Name */}
    <Row>
      <Title>Long Approver Name</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={false}
          allowedAction={true}
          enabledApprovalHistory={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name:
              'APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME ',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={true}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Loading</Title>
      <Wrapper>
        <Component
          loading={true}
          readOnly={false}
          allowedAction={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={true}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Read Only</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={true}
          allowedAction={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={true}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Not allowed action</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={false}
          allowedAction={false}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={true}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Not display history</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={false}
          allowedAction={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={false}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={true}
        />
      </Wrapper>
    </Row>
  </>
);

export const DoNotDisplayApprover = (): React.ReactNode => (
  <>
    {Object.values(STATUS).map((status) => (
      <Row key={status}>
        <Title>{status}</Title>
        <Wrapper>
          <Component
            loading={false}
            readOnly={false}
            allowedAction={true}
            fixDailyRequest={{
              id: undefined,
              status,
              approver01Name: 'approver employee name',
              performableActionForFix: detectPerformableActionForFix(status),
            }}
            enabledApprovalHistory={true}
            onClickOpenApprovalHistoryDialog={action(
              'onClickOpenApprovalHistoryDialog'
            )}
            onClickOpenApproverEmployeeSettingDialog={action(
              'onClickOpenApproverEmployeeSettingDialog'
            )}
            onSubmitRequest={action('onSubmitRequest')}
            enabledDisplayingNextApprover={false}
          />
        </Wrapper>
      </Row>
    ))}
    {/** Long Name */}
    <Row>
      <Title>Long Approver Name</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={false}
          allowedAction={true}
          enabledApprovalHistory={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name:
              'APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME APPROVER EMPLOYEE NAME ',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={false}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Loading</Title>
      <Wrapper>
        <Component
          loading={true}
          readOnly={false}
          allowedAction={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={false}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Read Only</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={true}
          allowedAction={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={false}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Not allowed action</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={false}
          allowedAction={false}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={false}
        />
      </Wrapper>
    </Row>
    <Row>
      <Title>Not display history</Title>
      <Wrapper>
        <Component
          loading={false}
          readOnly={false}
          allowedAction={true}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'approver employee name',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          enabledApprovalHistory={false}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistoryDialog'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSettingDialog'
          )}
          onSubmitRequest={action('onSubmitRequest')}
          enabledDisplayingNextApprover={false}
        />
      </Wrapper>
    </Row>
  </>
);
