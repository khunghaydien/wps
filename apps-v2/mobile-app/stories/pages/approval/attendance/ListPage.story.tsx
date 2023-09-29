import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import msg from '@apps/commons/languages';

import { REQUEST_TYPE } from '@apps/domain/models/approval/request/Request';

import Component from '@mobile/components/pages/approval/ListPage';

import image from '@apps/mobile-app/stories/images/sample.png';

export default {
  title: 'Components/pages/approval/ListPage',
  decorators: [withKnobs],
};

const createFilterTypeOptions = (): React.ComponentProps<
  typeof Component
>['filterTypeOptions'] => [
  { label: msg().Com_Sel_All, value: 'all' },
  {
    label: msg().Appr_Lbl_AttendanceRequest,
    value: REQUEST_TYPE.ATTENDANCE_DAILY,
  },
  {
    label: msg().Appr_Lbl_AttMonthlyRequest,
    value: REQUEST_TYPE.ATTENDANCE_FIX,
  },
];

const createFilterTypeOptionsWithNoPermission = (): React.ComponentProps<
  typeof Component
>['filterTypeOptions'] => [{ label: msg().Com_Sel_All, value: 'all' }];

export const Default = (): React.ReactNode => (
  <Component
    filterType="all"
    filterTypeOptions={createFilterTypeOptions()}
    records={[
      {
        requestId: '00001',
        requestDate: '2022-02-22 22:22',
        subject: '各種勤怠申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        startDate: '2022-01-01',
        endDate: '2022-01-02',
        requestStatus: '',
        originalRequestStatus: '',
      },
      {
        requestId: '00002',
        requestDate: '2022-02-22 22:22',
        subject: '勤務確定申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_FIX,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        targetMonth: '2022-01',
      },
    ]}
    checked={[]}
    comment={''}
    checkedAll={false}
    canUseCheckAll={true}
    hasPermissionError={null}
    onCheck={action('onCheck')}
    onCheckAll={action('onCheckAll')}
    onChangeFilter={action('onChangeFilter')}
    onClickRow={action('onClickPushHistory')}
    onClickRefresh={action('onClickRefresh')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const hasChecked = (): React.ReactNode => (
  <Component
    filterType="all"
    filterTypeOptions={createFilterTypeOptions()}
    records={[
      {
        requestId: '00001',
        requestDate: '2022-02-22 22:22',
        subject: '各種勤怠申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        startDate: '2022-01-01',
        endDate: '2022-01-02',
        requestStatus: '',
        originalRequestStatus: '',
      },
      {
        requestId: '00002',
        requestDate: '2022-02-22 22:22',
        subject: '勤務確定申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_FIX,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        targetMonth: '2022-01',
      },
    ]}
    checked={['00001']}
    comment={'COMMENT COMMENT COMMENT'}
    checkedAll={false}
    canUseCheckAll={true}
    hasPermissionError={null}
    onCheck={action('onCheck')}
    onCheckAll={action('onCheckAll')}
    onChangeFilter={action('onChangeFilter')}
    onClickRow={action('onClickPushHistory')}
    onClickRefresh={action('onClickRefresh')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const CheckedAll = (): React.ReactNode => (
  <Component
    filterType="all"
    filterTypeOptions={createFilterTypeOptions()}
    records={[
      {
        requestId: '00001',
        requestDate: '2022-02-22 22:22',
        subject: '各種勤怠申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        startDate: '2022-01-01',
        endDate: '2022-01-02',
        requestStatus: '',
        originalRequestStatus: '',
      },
      {
        requestId: '00002',
        requestDate: '2022-02-22 22:22',
        subject: '勤務確定申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_FIX,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        targetMonth: '2022-01',
      },
    ]}
    checked={['00001', '00002']}
    comment={'COMMENT COMMENT COMMENT'}
    checkedAll={true}
    canUseCheckAll={true}
    hasPermissionError={null}
    onCheck={action('onCheck')}
    onCheckAll={action('onCheckAll')}
    onChangeFilter={action('onChangeFilter')}
    onClickRow={action('onClickPushHistory')}
    onClickRefresh={action('onClickRefresh')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const canNotUseCheckbox = (): React.ReactNode => (
  <Component
    filterType="all"
    filterTypeOptions={createFilterTypeOptions()}
    records={[
      {
        requestId: '00001',
        requestDate: '2022-02-22 22:22',
        subject: '各種勤怠申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        startDate: '2022-01-01',
        endDate: '2022-01-02',
        requestStatus: '',
        originalRequestStatus: '',
      },
      {
        requestId: '00002',
        requestDate: '2022-02-22 22:22',
        subject: '勤務確定申請',
        employeeName: '社員名',
        photoUrl: image,
        departmentName: '部署名',
        requestType: REQUEST_TYPE.ATTENDANCE_FIX,
        approverName: '承認者名',
        approverDepartmentName: '承認者部署名',
        approverPhotoUrl: image,
        targetMonth: '2022-01',
      },
    ]}
    checked={[]}
    comment={''}
    checkedAll={false}
    canUseCheckAll={true}
    hasPermissionError={null}
    onCheck={action('onCheck')}
    onCheckAll={action('onCheckAll')}
    onChangeFilter={action('onChangeFilter')}
    onClickRow={action('onClickPushHistory')}
    onClickRefresh={action('onClickRefresh')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const Empty = (): React.ReactNode => (
  <Component
    filterType="all"
    filterTypeOptions={createFilterTypeOptions()}
    records={[]}
    checked={[]}
    comment=""
    checkedAll={false}
    canUseCheckAll={true}
    hasPermissionError={null}
    onCheck={action('onCheck')}
    onCheckAll={action('onCheckAll')}
    onChangeFilter={action('onChangeFilter')}
    onClickRow={action('onClickPushHistory')}
    onClickRefresh={action('onClickRefresh')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const noDisplayPermission = (): React.ReactNode => (
  <Component
    filterType="all"
    filterTypeOptions={createFilterTypeOptionsWithNoPermission()}
    records={[]}
    checked={[]}
    comment={''}
    checkedAll={false}
    canUseCheckAll={true}
    hasPermissionError={{
      message: msg().Att_Err_CannotDisplayAttendance,
      description: msg().Att_Msg_Inquire,
    }}
    onCheck={action('onCheck')}
    onCheckAll={action('onCheckAll')}
    onChangeFilter={action('onChangeFilter')}
    onClickRow={action('onClickPushHistory')}
    onClickRefresh={action('onClickRefresh')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);
