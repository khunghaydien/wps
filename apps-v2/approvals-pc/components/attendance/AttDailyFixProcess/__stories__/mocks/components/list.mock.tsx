import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { array, boolean, number, text } from '@storybook/addon-knobs';

import sampleEmployeeIcon from '@apps/commons/images/Sample_photo001.png';

import ApprovalType from '@apps/domain/models/approval/ApprovalType';

import $Content from '../../../List/Content';
import $FilterBar from '../../../List/FilterBar';
import $ToolBar from '../../../List/ToolBar';
import { defaultValue as records } from '../records.mock';
import { time } from '@attendance/__tests__/helpers';

export const ToolBar: React.FC = () => (
  <$ToolBar
    totalCount={number('totalCount', 1000)}
    filteredCount={number('filterMatchedCount', 1000)}
    checkedCount={number('selectedCount', 1000)}
    overLimit={boolean('overLimit', false)}
    approvalType={ApprovalType.ByEmployee}
    enabledByDelegate={boolean('enabledByDelegate', true)}
    enabledBulkApprove={boolean('enabledBulkApprove', true)}
    onSwitchApprovalType={action('onSwitchApprovalType')}
    onClickApproveAllButton={action('onClickApprovalAllButton')}
    ApprovalAllDialog={() => null}
  />
);

export const FilterBar: React.FC = () => (
  <$FilterBar
    records={records}
    changeQuery={action('changeQuery')}
    searchQuery={{
      employee: [],
      department: [],
      targetDate: '',
      requestAndEvent: [],
    }}
  />
);

const $$Content: React.FC<{
  requests: React.ComponentProps<typeof $Content>['requests'];
}> = ({ requests }) => (
  <$Content
    requests={requests}
    order={{
      key: 'submitter.employee.code',
      direction: 'asc',
    }}
    selectedId={text('selectedId', '0003')}
    checkedIds={array('checkedIds', ['0002'])}
    checkedAll={boolean('checkedAll', false)}
    maxSelection={number('maxSelection', 100)}
    onClickSort={action('onClickSort')}
    onClickRow={action('onClickRow')}
    onCheckRow={action('onCheckRow')}
    onCheckAll={action('onCheckAll')}
    onChangeMaxSelection={action('onChangeMaxSelection')}
  />
);

export const Content = {
  Default: (): React.ReactNode => <$$Content requests={records} />,
  WithScroll: (): React.ReactNode => (
    <$$Content
      requests={records.concat(
        [...new Array(10).keys()].map(
          (i) =>
            ({
              id: String(i + records.length).padStart(4, '0'),
              submitter: {
                employee: {
                  code: 'EMP-0001',
                  name: 'Employee Name',
                  photoUrl: sampleEmployeeIcon,
                  department: {
                    name: 'Department',
                  },
                },
              },
              targetDate: '2022/02/22',
              targetRecord: {
                recordDate: '2022/02/22',
                startTime: time(7),
                endTime: time(16),
                realWorkTime: time(9),
                overTime: 0,
                event: 'Early Start Work, Direct',
              },
              records: [],
              recordTotal: {
                overTime: time(22, 22),
              },
              attention: {
                ineffectiveWorkingTime: 0,
                insufficientRestTime: 0,
              },
            } as unknown as React.ComponentProps<
              typeof $Content
            >['requests'][0])
        )
      )}
    />
  ),
};
