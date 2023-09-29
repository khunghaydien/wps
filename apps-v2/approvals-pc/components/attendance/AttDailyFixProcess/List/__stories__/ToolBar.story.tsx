import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';

import ApprovalType from '@apps/domain/models/approval/ApprovalType';

import Component from '../ToolBar';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/List/ToolBar',
  decorators: [withKnobs],
};

const Dialog = () => null;

export const Default = (): React.ReactNode => (
  <>
    <div>
      <Component
        totalCount={number('totalCount', 1000)}
        filteredCount={number('filteredCount', 0)}
        checkedCount={number('selectedCount', 0)}
        overLimit={boolean('overLimit', false)}
        approvalType={select(
          'approvalType',
          ApprovalType,
          ApprovalType.ByEmployee
        )}
        enabledByDelegate={boolean('enabledByDelegate', false)}
        enabledBulkApprove={boolean('enabledBulkApprove', false)}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={1000}
        filteredCount={0}
        checkedCount={0}
        overLimit={true}
        enabledByDelegate={false}
        enabledBulkApprove={false}
        approvalType={ApprovalType.ByEmployee}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={0}
        filteredCount={0}
        checkedCount={0}
        overLimit={false}
        enabledByDelegate={true}
        enabledBulkApprove={false}
        approvalType={ApprovalType.ByEmployee}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={1000}
        filteredCount={0}
        checkedCount={0}
        overLimit={false}
        enabledByDelegate={true}
        enabledBulkApprove={false}
        approvalType={ApprovalType.ByEmployee}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={1000}
        filteredCount={0}
        checkedCount={0}
        overLimit={false}
        enabledByDelegate={true}
        enabledBulkApprove={true}
        approvalType={ApprovalType.ByEmployee}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={1000}
        filteredCount={1000}
        checkedCount={100}
        enabledByDelegate={true}
        enabledBulkApprove={true}
        overLimit={false}
        approvalType={ApprovalType.ByEmployee}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={0}
        filteredCount={0}
        checkedCount={0}
        overLimit={false}
        enabledByDelegate={true}
        enabledBulkApprove={false}
        approvalType={ApprovalType.ByDelegate}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
    <div>
      <Component
        totalCount={0}
        filteredCount={0}
        checkedCount={0}
        overLimit={false}
        enabledByDelegate={false}
        enabledBulkApprove={false}
        approvalType={ApprovalType.ByDelegate}
        onSwitchApprovalType={action('onSwitchApprovalType')}
        onClickApproveAllButton={action('onClickApprovalAllButton')}
        ApprovalAllDialog={Dialog}
      />
    </div>
  </>
);
