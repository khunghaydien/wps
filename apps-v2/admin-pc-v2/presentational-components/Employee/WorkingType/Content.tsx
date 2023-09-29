import React, { useMemo } from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { WorkingType } from '../../../modules/employee/ui/workingTypeDialog';
import {
  Condition as SearchCondition,
  WORK_SYSTEM_TYPE,
} from '@admin-pc/modules/workingType/ui/searchCondition';

import ListSearchForm, {
  FIELD_TYPE,
  Props as ListSearchFormProps,
} from '@admin-pc/components/ListSearchFormWithType';
import $ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '@admin-pc/components/MainContents/ListPagingLayout';

type ListPagingLayoutProps = $ListPagingLayoutProps<{
  code: string;
  name: string;
  validDateFrom: string;
  validDateTo: string;
}>;

type Props = {
  searchCondition: SearchCondition;
  workingTypes: {
    [key: string]: any;
  }[];
  selectedWorkingType: WorkingType;
  sortCondition: ListPagingLayoutProps['sort'];
  pageCondition: {
    currentPage: number;
    limitPerPage: number;
    limit: number;
    total: number;
    isOverLimit: boolean;
  };
  onChangeSearchValue: ListSearchFormProps['onChange'];
  onClickSearchButton: ListSearchFormProps['onSubmit'];
  onClickPagerLink: ListPagingLayoutProps['onClickPagerLink'];
  onClickListHeaderCell: ListPagingLayoutProps['onClickListHeaderCell'];
  onClickRow: (
    arg0: {
      [key: string]: any;
    },
    arg1: number
  ) => void;
};

const ContentsWrapper = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 30px;
`;

const ListPagingLayout = styled($ListPagingLayout)`
  height: calc(70vh - 40px);

  .admin-pc-main-contents-list-paging-layout__header {
    background-color: #fff;

    .admin-pc-main-contents-list-paging-layout__list-search-form {
      padding: 0 100px 10px 0;
    }
    .admin-pc-main-contents-list-paging-layout__paginator {
      padding: 10px 0;
      color: #000;
    }
  }
  .admin-pc-main-contents-list-paging-layout__body {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .admin-pc-record-table-cell:first-child {
    width: 110px;
  }
  .admin-pc-record-table-cell:nth-child(2) {
    width: 370px;
  }
  .admin-pc-record-table-cell:nth-child(4) {
    width: 270px;
  }
  .admin-pc-record-table-cell:last-child {
    width: 270px;
  }
`;

const Content: React.FC<Props> = ({
  searchCondition,
  workingTypes,
  selectedWorkingType,
  sortCondition,
  pageCondition,
  onChangeSearchValue,
  onClickSearchButton,
  onClickPagerLink,
  onClickListHeaderCell,
  onClickRow,
}) => {
  const workSystemLabelMap = React.useMemo(
    () => ({
      [WORK_SYSTEM_TYPE.JP_Fix]: msg().Admin_Lbl_JP_Fix,
      [WORK_SYSTEM_TYPE.JP_Flex]: msg().Admin_Lbl_JP_Flex,
      [WORK_SYSTEM_TYPE.JP_Modified]: msg().Admin_Lbl_JP_Modified,
      [WORK_SYSTEM_TYPE.JP_Discretion]: msg().Admin_Lbl_JP_Discretion,
      [WORK_SYSTEM_TYPE.JP_Manager]: msg().Admin_Lbl_JP_Manager,
    }),
    []
  );
  const workSystem = React.useMemo(
    () => [
      {
        label: null,
        value: null,
      },
      {
        label: msg().Admin_Lbl_JP_Fix,
        value: WORK_SYSTEM_TYPE.JP_Fix,
      },
      {
        label: msg().Admin_Lbl_JP_Flex,
        value: WORK_SYSTEM_TYPE.JP_Flex,
      },
      {
        label: msg().Admin_Lbl_JP_FlexWithoutCoreTime,
        value: WORK_SYSTEM_TYPE.JP_Flex_Without_Core,
      },
      {
        label: msg().Admin_Lbl_JP_Modified,
        value: WORK_SYSTEM_TYPE.JP_Modified,
      },
      {
        label: msg().Admin_Lbl_JP_Discretion,
        value: WORK_SYSTEM_TYPE.JP_Discretion,
      },
      {
        label: msg().Admin_Lbl_JP_Manager,
        value: WORK_SYSTEM_TYPE.JP_Manager,
      },
    ],
    []
  );
  const searchFields = useMemo(
    () => [
      {
        key: 'targetDate',
        label: msg().Admin_Lbl_TargetDate,
        value: searchCondition.targetDate,
        fieldType: FIELD_TYPE.DATE,
      },
      {
        key: 'code',
        label: msg().Admin_Lbl_Code,
        value: searchCondition.code,
        fieldType: FIELD_TYPE.TEXT,
      },
      {
        key: 'name',
        label: msg().Admin_Lbl_Name,
        value: searchCondition.name,
        fieldType: FIELD_TYPE.TEXT,
      },
      {
        key: 'workSystem',
        label: msg().Admin_Lbl_WorkingTypeWorkSystem,
        value: searchCondition.workSystem,
        disabledSort: true,
        fieldType: FIELD_TYPE.DROPDOWN,
        options: workSystem,
      },
    ],
    [searchCondition]
  );
  const fields = useMemo(
    () => [
      {
        key: 'checkbox',
        label: '',
        disabledSort: true,
      },
      {
        key: 'code',
        label: msg().Admin_Lbl_Code,
        disabledSort: false,
      },
      {
        key: 'name',
        label: msg().Admin_Lbl_Name,
        disabledSort: true,
      },
      {
        key: 'validDateFrom',
        label: msg().Admin_Lbl_ValidDateFrom,
        disabledSort: true,
      },
      {
        key: 'validDateTo',
        label: msg().Admin_Lbl_ValidDateTo,
        disabledSort: true,
      },
    ],
    []
  );

  const records = useMemo(
    () =>
      workingTypes.map((item) => ({
        ...item,
        checkbox: item.code === selectedWorkingType.code,
      })),
    [workingTypes, selectedWorkingType]
  );

  const renderField = (value, key, record) => {
    switch (key) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            onChange={(event) =>
              onChangeSearchValue('', event.currentTarget.checked)
            }
            checked={value}
          />
        );
      case 'validDateFrom':
      case 'validDateTo':
        return DateUtil.formatYMD(value);
      case 'workSystem': {
        let showValue = workSystemLabelMap[record.workSystem];
        if (record.withoutCoreTime === true) {
          showValue = msg().Admin_Lbl_JP_FlexWithoutCoreTime;
        }
        return showValue;
      }
      default:
        return value;
    }
  };

  return (
    <ContentsWrapper>
      <ListPagingLayout
        hiddenRefresh={true}
        maxLimit={pageCondition.limit}
        renderForm={() => (
          <ListSearchForm
            fields={searchFields}
            disabledFields={['targetDate']}
            onChange={onChangeSearchValue}
            onSubmit={onClickSearchButton}
          />
        )}
        fields={fields}
        records={records}
        renderField={renderField}
        sort={sortCondition}
        currentPage={pageCondition.currentPage}
        pageSize={pageCondition.limitPerPage}
        limit={pageCondition.limit}
        totalNum={pageCondition.total}
        isOverLimit={pageCondition.isOverLimit}
        emptyMessage={msg().Com_Msg_NotFound}
        onClickListRow={onClickRow}
        onClickRefreshButton={() => {}}
        onClickListHeaderCell={onClickListHeaderCell}
        onClickPagerLink={onClickPagerLink}
      />
    </ContentsWrapper>
  );
};

export default Content;
