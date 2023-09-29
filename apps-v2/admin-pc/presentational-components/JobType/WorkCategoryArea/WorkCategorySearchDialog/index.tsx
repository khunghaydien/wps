import React from 'react';

import isEmpty from 'lodash/isEmpty';

import Button from '../../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../../commons/languages';
import TextUtil from '../../../../../commons/utils/TextUtil';

import { WorkCategory } from '../../../../../domain/models/time-tracking/WorkCategory';

import { Expense } from '../../../../modules/expTypeLinkConfig/ui';

import DataGrid from '../../../../components/DataGrid';
import SearchArea from '../../../../components/SearchArea';

import './index.scss';

const ROOT = 'admin-pc-job-type-detail-work-category-search-dialog';

export type SearchProps = {
  linkWorkCategories: (arg0: WorkCategory[]) => Promise<void>;
  maxNum: number;
  onClickSearchWorkCategories: (
    code: string,
    name: string
  ) => Promise<WorkCategory[]>;
};

type Props = Readonly<
  SearchProps & {
    hideDialog: () => void;
  }
>;

type State = {
  searchResults: WorkCategory[];
  selectedIds: string[];
};

export default class WorkCategorySearchDialog extends React.Component<
  Props,
  State
> {
  state = {
    searchResults: [],
    selectedIds: [],
  };

  onClickSearchBtn = (query: { code: string; name: string }) => {
    this.props
      .onClickSearchWorkCategories(query.code, query.name)
      .then((records) => {
        this.setState({ searchResults: records, selectedIds: [] });
      });
  };

  toggleSelection = (ids: string[]) => {
    this.setState((prevState) => {
      const selectedIds = [...prevState.selectedIds];
      ids.forEach((id) => {
        const index = selectedIds.indexOf(id);
        if (index === -1) {
          selectedIds.push(id);
        } else {
          selectedIds.splice(index, 1);
        }
      });

      return { selectedIds };
    });
  };

  handleRowClick = (rowIdx: number, row: Expense) => {
    if (row) {
      this.toggleSelection([row.id]);
    }
  };

  handleRowsToggle = (rows: Array<{ row: WorkCategory }>) => {
    const ids = rows.map((info) => info.row.id);
    this.toggleSelection(ids);
  };

  linkWorkCategories = () => {
    const list = this.state.searchResults.filter((item) =>
      this.state.selectedIds.includes(item.id)
    );
    this.props.linkWorkCategories(list);
  };

  render() {
    let rows = this.state.searchResults.map((row) => {
      const isSelected = this.state.selectedIds.includes(row.id);
      return { ...row, isSelected };
    });

    rows = rows.slice(0, this.props.maxNum);

    const isExceeded = this.state.searchResults.length > this.props.maxNum;

    return (
      <DialogFrame
        className={ROOT}
        title={msg().Admin_Lbl_WorkCategorySearch}
        hide={this.props.hideDialog}
        footer={
          <DialogFrame.Footer>
            <Button
              className={`${ROOT}__button`}
              onClick={this.props.hideDialog}
            >
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              className={`${ROOT}__button ${ROOT}__add-button`}
              disabled={isEmpty(this.state.selectedIds)}
              onClick={this.linkWorkCategories}
            >
              {msg().Com_Btn_Add}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
          <SearchArea
            fields={['code', 'name']}
            onClickSearchBtn={this.onClickSearchBtn}
          />
          <DataGrid
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'code',
                name: msg().Admin_Lbl_Code,
              },
              {
                key: 'name',
                name: msg().Admin_Lbl_Name,
              },
            ]}
            showCheckbox
            rows={rows}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
          />
          {isExceeded && (
            <div className={`${ROOT}__too-many-results`}>
              {TextUtil.template(
                msg().Com_Lbl_SearchResultsExceededLimit,
                this.props.maxNum
              )}
            </div>
          )}
        </div>
      </DialogFrame>
    );
  }
}
