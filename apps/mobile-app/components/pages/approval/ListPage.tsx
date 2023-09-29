import React from 'react';

import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';

import msg from '../../../../commons/languages';
import { State as UserSetting } from '../../../../commons/reducers/userSetting';
import EmptyIcon from '../../molecules/commons/EmptyIcon';
import Navigation from '../../molecules/commons/Navigation';

import {
  ApprRequest,
  ApprRequestList,
} from '../../../../domain/models/approval/request/Request';

import Wrapper from '../..//atoms/Wrapper';
import Select from '../../atoms/Fields/Select';
import IconButton from '../../atoms/IconButton';
import ReportSummaryListItem, {
  Props as ReportSummaryListItemProps,
} from '../../molecules/approval/ReportSummaryListItem';

import './ListPage.scss';

const ROOT = 'mobile-app-pages-approval-page-list';

type State = {
  selection: string;
};

type Props = {
  approvalList: ApprRequestList;
  userSetting: UserSetting;
  onClickPushHisotry: (
    requestId: string,
    requestType: string,
    selection: string
  ) => void;
  onClickRefresh: (requestType: string) => void;
  requestType: string;
} & ReportSummaryListItemProps;

export default class ListPage extends React.PureComponent<Props, State> {
  state = {
    selection: this.props.requestType || 'all',
  };

  onChangeSelect = () => {
    return (e: React.SyntheticEvent<HTMLSelectElement>) => {
      this.setState({ selection: e.currentTarget.value });
    };
  };

  getFilteredList = (list: ApprRequestList) => {
    return this.state.selection === 'all'
      ? list
      : (list.filter(
          (item) => item.requestType === this.state.selection
        ) as ApprRequestList);
  };

  render() {
    const { approvalList = [] } = this.props;
    const filteredList = this.getFilteredList(approvalList);

    const requestTypeGroups = [
      {
        available: true,
        item: { label: msg().Com_Sel_All, value: 'all' },
      },
      {
        available: this.props.userSetting.useAttendance,
        item: { label: msg().Appr_Lbl_AttendanceRequest, value: 'attendance' },
      },
    ];
    const requestTypes = flow(
      filter((group: any) => group.available),
      map((group: any) => group.item)
    )(requestTypeGroups);

    const count = filteredList.length;
    const num = (
      <div key="0" className={`${ROOT}__num`}>
        {`${count} ${msg().Appr_Lbl_RecordCount}`}
      </div>
    );

    const refresh = (
      <IconButton
        className={`${ROOT}__refresh`}
        type="submit"
        onClick={() => this.props.onClickRefresh(this.state.selection)}
        icon="refresh-copy"
      />
    );

    return (
      <Wrapper className={ROOT}>
        <Navigation title={msg().Appr_Lbl_Approval} actions={[num, refresh]} />
        <div className="main-content-appr">
          <Select
            onChange={this.onChangeSelect()}
            className={`${ROOT}__select`}
            options={requestTypes}
            value={this.state.selection}
          />
          <div className={`${ROOT}__list`}>
            {filteredList.map((item: ApprRequest) => (
              <ReportSummaryListItem
                key={item.requestId}
                // @ts-ignore
                requestType={item.requestType}
                report={item}
                className={`${ROOT}__item`}
                onClick={() =>
                  this.props.onClickPushHisotry(
                    item.requestId,
                    item.requestType,
                    this.state.selection || 'all'
                  )
                }
                decimalPlaces={this.props.userSetting.currencyDecimalPlaces}
                symbol={this.props.userSetting.currencySymbol}
              />
            ))}
            {!filteredList.length && (
              <EmptyIcon
                className={`${ROOT}__empty`}
                message={msg().Appr_Msg_EmptyRequestList}
              />
            )}
          </div>
        </div>
      </Wrapper>
    );
  }
}
