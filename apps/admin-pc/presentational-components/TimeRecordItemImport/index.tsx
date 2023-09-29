import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import keyBy from 'lodash/keyBy';

import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';

import { TimeRecordItemImportResult } from '@apps/repositories/time-tracking/TimeRecordItemImportRepository';

import DetailPane from '../../containers/TimeRecordItemImportContainer/DetailPaneContainer';

import DataGrid from '../../components/DataGrid';
import ListPaneHeader from '../../components/MainContents/ListPaneHeader';

import './index.scss';

const ROOT = 'admin-pc-time-record-item-import';

type Props = Readonly<{
  companyId: string;
  items: TimeRecordItemImportResult[];

  isShowDetail: boolean;
  onClickCreate: () => void;
  onClickEdit: (result: TimeRecordItemImportResult) => void;

  initialize: (companyId: string, showLoading: boolean) => void;
}>;

type State = {
  interval: any;
};

export default class TimeRecordItemImport extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      interval: null,
    };

    this.onRowClick = this.onRowClick.bind(this);
  }

  componentDidMount() {
    this.props.initialize(this.props.companyId, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      this.props.initialize(nextProps.companyId, true);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const nextItemHash = keyBy(nextProps.items, (item) => item.id);
    return (
      this.props.items.length !== nextProps.items.length ||
      this.props.items.length <= 0 ||
      this.props.items.some(
        (item) =>
          !nextItemHash[item.id] ||
          nextItemHash[item.id].count !== item.count ||
          nextItemHash[item.id].successCount !== item.successCount ||
          nextItemHash[item.id].failureCount !== item.failureCount ||
          nextItemHash[item.id].status !== item.status
      ) ||
      this.props.isShowDetail !== nextProps.isShowDetail
    );
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  onRowClick(_rowIndex: number, row: TimeRecordItemImportResult) {
    this.props.onClickEdit(row);
  }

  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__list`}>
          <ListPaneHeader
            title={msg().Admin_Lbl_TimeRecordItemImport}
            onClickCreateNewButton={this.props.onClickCreate}
          />
          <div className={`${ROOT}__react-data-grid-wrapper`}>
            <div className={`${ROOT}__react-data-grid`}>
              <DataGrid
                columns={[
                  {
                    key: 'importDateTimeDisplay',
                    name: msg().Admin_Lbl_ExecutedAt,
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    width: 150,
                  },
                  {
                    key: 'statusDisplay',
                    name: msg().Admin_Lbl_Status,
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    width: 100,
                  },
                  {
                    key: 'count',
                    name: msg().Admin_Lbl_Count,
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    width: 80,
                  },
                  {
                    key: 'successCount',
                    name: msg().Admin_Lbl_SuccessCount,
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    width: 80,
                  },
                  {
                    key: 'failureCount',
                    name: msg().Admin_Lbl_FailureCount,
                    filterable: true,
                    sortable: true,
                    resizable: true,
                    width: 80,
                  },
                  {
                    key: 'actorName',
                    name: msg().Admin_Lbl_Actor,
                    filterable: true,
                    sortable: true,
                    resizable: true,
                  },
                ]}
                rows={this.props.items.map((item) => ({
                  ...item,
                  importDateTimeDisplay: DateUtil.formatYMDhhmm(
                    item.importDateTime
                  ),
                  statusDisplay: msg()[`Batch_Lbl_${item.status}`] || '',
                }))}
                onRowClick={this.onRowClick}
              />
            </div>
          </div>
        </div>
        <CSSTransition
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <React.Fragment>
            {this.props.isShowDetail && (
              <div className={`${ROOT}__detail`}>
                <DetailPane />
              </div>
            )}
          </React.Fragment>
        </CSSTransition>
      </div>
    );
  }
}
