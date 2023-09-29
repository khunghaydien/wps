import React from 'react';

import msg from '../../../../commons/languages';

import Table from './Table';

import './index.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-list';

type Props = {
  requestList: Array<any>;
  browseDetail: any;
  selectedRequestId: string;
};

export default class List extends React.Component<Props> {
  render() {
    return (
      <section className={`${ROOT}`}>
        <header className={`${ROOT}__header`}>
          <h1 className={`${ROOT}__header-body`}>
            {msg().Appr_Lbl_ApprovalList}
          </h1>
          <div className={`${ROOT}__toolbar`}>
            <span className={`${ROOT}__toolbar-count`}>
              {this.props.requestList.length} {msg().Appr_Lbl_RecordCount}
            </span>
          </div>
        </header>

        <div className={`${ROOT}__table`}>
          <Table
            requestList={this.props.requestList}
            browseDetail={this.props.browseDetail}
            selectedRequestId={this.props.selectedRequestId}
          />
        </div>
      </section>
    );
  }
}
