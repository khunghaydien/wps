import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { Delegator } from '../../../../../../domain/models/exp/DelegateApplicant';
import { Job, JobList } from '../../../../../../domain/models/exp/Job';

import msg from '../../../../../languages';
import MultiColumnFinder, {
  tabTypes,
} from '../../../../dialogs/MultiColumnFinder';

import '../../../../Modal.scss';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export type Props = {
  hasMore: boolean;
  hintMsg?: string;
  isFinanceApproval: boolean;
  isLoading: boolean;
  jobList: JobList;
  jobRecentItems: JobList;
  jobSearchList: JobList;
  selectedDelegator: Delegator;
  onClickHideDialogButton: () => void;
  onClickJobListItem: (arg0: Job) => void;
  onClickJobSearch: (arg0: string) => void;
  onClickJobSelectByCategory: () => void;
};

export default class JobSelect extends React.Component<Props> {
  render() {
    return (
      <div className="ts-modal">
        <button
          className="ts-modal__overlay"
          onClick={this.props.onClickHideDialogButton}
        />
        <div className="ts-modal__wrap" style={{ width: 865 }}>
          <div className="ts-modal__contents">
            <MultiColumnFinder
              showRecentlyUsed={
                !this.props.isFinanceApproval &&
                isEmpty(this.props.selectedDelegator)
              }
              items={this.props.jobList}
              typeName={msg().Exp_Lbl_Job}
              parentSelectable
              onClickItem={this.props.onClickJobListItem}
              onClickCloseButton={this.props.onClickHideDialogButton}
              tabs={[tabTypes.SEARCH, tabTypes.DIRECTORY]}
              onClickSearch={this.props.onClickJobSearch}
              searchResult={this.props.jobSearchList}
              recentItems={this.props.jobRecentItems}
              isLoading={this.props.isLoading}
              onClickSelectByCategory={this.props.onClickJobSelectByCategory}
              hintMsg={this.props.hintMsg}
              hasMoreSearchResult={this.props.hasMore}
            />
          </div>
        </div>
      </div>
    );
  }
}
