import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { Delegator } from '../../../../../../domain/models/exp/DelegateApplicant';
import {
  CustomEIOption,
  CustomEIOptionList,
  EISearchObj,
} from '../../../../../../domain/models/exp/ExtendedItem';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import LabelWithHint from '../../../../fields/LabelWithHint';
import TextField from '../../../../fields/TextField';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '../../../../FixedHeaderTable';
import Skeleton from '../../../../Skeleton';
import Icon from '../../../Icon';

import './index.scss';

const ROOT = 'ts-expenses-modal-lookup-dialog';

export type Props = {
  eiRecentlyUsed: CustomEIOptionList;
  extendedItemLookup: EISearchObj;
  isFinanceApproval: boolean;
  isLoading: boolean;
  selectedDelegator: Delegator;
  onClickCustomObjectOption: (item: CustomEIOption) => void;
  onClickHideDialogButton: () => void;
  onClickSearchLookup: (
    id: string,
    query: string
  ) => Promise<CustomEIOptionList>;
};

type State = {
  hasMore: boolean;
  isSearch: boolean;
  keyword: string;
  records: Array<CustomEIOption>;
};

export default class EILookupDialog extends React.Component<Props, State> {
  state = {
    isSearch: false,
    keyword: '',
    // false positive
    // eslint-disable-next-line react/no-unused-state
    records: [],
    hasMore: false,
  };

  onKeyPress = (e: any) => {
    const lookupId = this.props.extendedItemLookup.extendedItemCustomId;
    if (e.key === 'Enter' && lookupId) {
      e.preventDefault();
      this.props
        .onClickSearchLookup(lookupId, this.state.keyword)
        .then((res: CustomEIOptionList) =>
          this.setState({
            // false positive
            // eslint-disable-next-line react/no-unused-state
            records: res.records,
            hasMore: res.hasMore,
            isSearch: true,
          })
        );
    }
  };

  onChangeSearchField = (e: any) => {
    this.setState({
      keyword: e.target.value,
    });
  };

  render() {
    const { isSearch, keyword } = this.state;
    const items = isSearch ? this.state : this.props.eiRecentlyUsed;
    const label =
      isSearch ||
      !isEmpty(this.props.selectedDelegator) ||
      this.props.isFinanceApproval
        ? msg().Exp_Lbl_SearchResult
        : msg().Exp_Lbl_RecentlyUsedItems;
    const count = items.hasMore ? '100+' : items.records.length;
    const name = this.props.extendedItemLookup.name || '';
    const title = `${name} ${msg().Exp_Lbl_Select}`;
    const hintMsg = this.props.extendedItemLookup.hintMsg || '';

    return (
      <DialogFrame
        title={title}
        hide={this.props.onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <LabelWithHint
              className={`${ROOT}__hint-msg`}
              text={hintMsg && msg().Exp_Lbl_Hint}
              infoAlign="left"
              hintMsg={hintMsg}
            />
            <Button type="default" onClick={this.props.onClickHideDialogButton}>
              {msg().Com_Btn_Cancel}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <div>{msg().Exp_Lbl_SearchCodeOrName}</div>

          <div className={`${ROOT}__search-field`}>
            <TextField
              className={`${ROOT}__search-field-input`}
              // @ts-ignore
              onKeyPress={this.onKeyPress}
              value={keyword}
              placeholder={msg().Com_Lbl_Search}
              onChange={this.onChangeSearchField}
              data-testid={`${ROOT}__search-field`}
            />

            <Icon
              className={`${ROOT}__search-btn`}
              type="search"
              color="#AFADAB"
            />
          </div>

          <div className={`${ROOT}__label`}>
            <span> {label} </span>
            <span className={`${ROOT}__count`}>
              {isSearch && `${count} ${msg().Exp_Lbl_RecordCount}`}
            </span>
          </div>

          {this.props.isLoading ? (
            <Skeleton
              noOfRow={6}
              colWidth="100%"
              className={`${ROOT}__skeleton`}
              rowHeight="25px"
              margin="30px"
            />
          ) : (
            <FixedHeaderTable
              scrollableClass={`${ROOT}__scrollable`}
              className={`${ROOT}--is-ellipsis`}
            >
              <HeaderRow>
                <HeaderCell className={`${ROOT}__code`}>
                  {msg().Exp_Lbl_Code}
                </HeaderCell>
                <HeaderCell className={`${ROOT}__name`}>
                  {msg().Exp_Lbl_Name}
                </HeaderCell>
              </HeaderRow>

              {(items as CustomEIOptionList).records.map((item, idx) => {
                return (
                  <BodyRow
                    key={idx}
                    className={`${ROOT}__row`}
                    data-testid={`${ROOT}__row-${idx}`}
                    // @ts-ignore
                    onClick={() => this.props.onClickCustomObjectOption(item)}
                  >
                    <BodyCell className={`${ROOT}__code`}>{item.code}</BodyCell>
                    <BodyCell className={`${ROOT}__name`}>{item.name}</BodyCell>
                  </BodyRow>
                );
              })}
            </FixedHeaderTable>
          )}

          {this.state.hasMore && !this.props.isLoading && (
            <span className={`${ROOT}__message`}>
              {msg().Com_Lbl_TooManySearchResults}
            </span>
          )}
        </div>
      </DialogFrame>
    );
  }
}
