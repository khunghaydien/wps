import React from 'react';

import isEmpty from 'lodash/isEmpty';

import {
  CostCenter,
  CostCenterList,
} from '../../../../../../domain/models/exp/CostCenter';
import { Delegator } from '../../../../../../domain/models/exp/DelegateApplicant';

import msg from '../../../../../languages';
import MultiColumnFinder, {
  tabTypes,
} from '../../../../dialogs/MultiColumnFinder';

import '../../../../Modal.scss';

export type Props = {
  costCenterList: CostCenterList;
  costCenterRecentItems: CostCenterList;
  costCenterSearchList: CostCenterList;
  hasMore: boolean;
  hintMsg?: string;
  isAdmin?: boolean;
  isFinanceApproval: boolean;
  isLoading: boolean;
  isRecordOpen?: boolean;
  selectedDelegator?: Delegator;
  onClickCostCenterListItem: (arg0: CostCenter, arg1?: any) => void;
  onClickCostCenterSearch: (arg0: string) => void;
  onClickCostCenterSelectByCategory: () => void;
  onClickHideDialogButton: () => void;
};
export default class CostCenterSelect extends React.Component<Props> {
  render() {
    const typeName = this.props.isRecordOpen
      ? msg().Exp_Clbl_CostCenter
      : msg().Exp_Clbl_CostCenterHeader;
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
                isEmpty(this.props.selectedDelegator) &&
                !this.props.isAdmin
              }
              items={this.props.costCenterList}
              typeName={typeName}
              parentSelectable
              onClickItem={this.props.onClickCostCenterListItem}
              onClickCloseButton={this.props.onClickHideDialogButton}
              tabs={[tabTypes.SEARCH, tabTypes.DIRECTORY]}
              onClickSearch={this.props.onClickCostCenterSearch}
              searchResult={this.props.costCenterSearchList}
              recentItems={this.props.costCenterRecentItems}
              isLoading={this.props.isLoading}
              onClickSelectByCategory={
                this.props.onClickCostCenterSelectByCategory
              }
              hintMsg={this.props.hintMsg}
              hasMoreSearchResult={this.props.hasMore}
            />
          </div>
        </div>
      </div>
    );
  }
}
