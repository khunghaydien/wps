import React from 'react';

import EmptyIcon from '../../molecules/commons/EmptyIcon';
import Navigation from '../../molecules/commons/Navigation';
import msg from '@apps/commons/languages';
import { ErrorInfo } from '@commons/utils/AppPermissionUtil';
import PermissionError from '@mobile/components/organisms/commons/PermissionError';

import {
  ApprRequest,
  ApprRequestList,
} from '@apps/domain/models/approval/request/Request';

import { FilterType } from '@mobile/modules/approval/entities/list';

import CheckBox from '@mobile/components/atoms/Fields/CheckBox';
import Select from '@mobile/components/atoms/Fields/Select';
import IconButton from '@mobile/components/atoms/IconButton';
import Wrapper from '@mobile/components/atoms/Wrapper';
import ReportSummaryListItem from '@mobile/components/molecules/approval/ReportSummaryListItem';
import Footer from '@mobile/components/organisms/approval/BulkResolveFooter';

import './ListPage.scss';

const ROOT = 'mobile-app-pages-approval-page-list';

type Props = {
  filterType: FilterType;
  filterTypeOptions: {
    label: string;
    value: FilterType;
  }[];
  records: ApprRequestList;
  checked: string[];
  checkedAll: boolean;
  canUseCheckAll: boolean;
  hasPermissionError: ErrorInfo | null;
  onChangeFilter: (filterType: FilterType) => void;
  onCheckAll: () => void;
  onCheck: (record: ApprRequest) => void;
  onClickRow: (record: ApprRequest) => void;
  onClickRefresh: () => void;
} & React.ComponentProps<typeof Footer>;

const Tools: React.FC<{
  filterValue: FilterType;
  filterOptions: {
    label: string;
    value: FilterType;
  }[];
  canUseChecked: boolean;
  checkedAll: boolean;
  onCheckAll: () => void;
  onChangeFilter: (requestType: FilterType) => void;
}> = ({
  filterValue,
  filterOptions,
  canUseChecked,
  checkedAll,
  onCheckAll,
  onChangeFilter: $onChangeFilter,
}) => {
  const CLASS = `${ROOT}__tools`;
  const onChangeFilter = React.useCallback(
    (e: React.SyntheticEvent<HTMLSelectElement>) => {
      $onChangeFilter(e.currentTarget.value as FilterType);
    },
    [$onChangeFilter]
  );

  return (
    <div className={`${CLASS}`}>
      {canUseChecked ? (
        <div className={`${CLASS}__checked-all-container`}>
          <CheckBox
            className={`${CLASS}__checked-all`}
            value={checkedAll}
            onChange={onCheckAll}
          />
        </div>
      ) : null}
      <div className={`${CLASS}__select-container`}>
        <Select
          onChange={onChangeFilter}
          className={`${CLASS}__select`}
          options={filterOptions}
          value={filterValue}
        />
      </div>
    </div>
  );
};

const ListPage: React.FC<Props> = ({
  filterType,
  filterTypeOptions,
  records,
  checked,
  checkedAll,
  canUseCheckAll,
  hasPermissionError,
  comment,
  onCheck,
  onCheckAll,
  onChangeFilter,
  onClickRefresh,
  onChangeComment,
  onClickRow,
  onClickApproveButton,
}) =>
  hasPermissionError ? (
    <PermissionError errorInfo={hasPermissionError} />
  ) : (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Appr_Lbl_AttendanceApproval}
        actions={[
          <div key="num" className={`${ROOT}__num`}>
            {`${records.length} ${msg().Appr_Lbl_RecordCount}`}
          </div>,
          <IconButton
            key="refresh"
            className={`${ROOT}__refresh`}
            type="submit"
            onClick={onClickRefresh}
            icon="refresh-copy"
          />,
        ]}
      />
      <div className="main-content-appr">
        <Tools
          canUseChecked={canUseCheckAll}
          checkedAll={checkedAll}
          onCheckAll={onCheckAll}
          onChangeFilter={onChangeFilter}
          filterOptions={filterTypeOptions}
          filterValue={filterType}
        />
        <div className={`${ROOT}__list`}>
          {records.map((item: ApprRequest) => (
            <ReportSummaryListItem
              key={item.requestId}
              // @ts-ignore
              requestType={item.requestType}
              report={item}
              className={`${ROOT}__item`}
              checked={checked.includes(item.requestId)}
              onCheck={() => onCheck(item)}
              onClick={() => onClickRow(item)}
            />
          ))}
          {records.length === 0 && (
            <EmptyIcon
              className={`${ROOT}__empty`}
              message={msg().Appr_Msg_EmptyRequestList}
            />
          )}
        </div>
        {checked.length ? (
          <Footer
            comment={comment}
            onChangeComment={onChangeComment}
            onClickApproveButton={onClickApproveButton}
          />
        ) : null}
      </div>
    </Wrapper>
  );

export default ListPage;
