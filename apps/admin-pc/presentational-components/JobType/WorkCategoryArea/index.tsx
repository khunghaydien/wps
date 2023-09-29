import React from 'react';

import isEmpty from 'lodash/isEmpty';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';

import { WorkCategory } from '../../../../domain/models/time-tracking/WorkCategory';

import DataGrid from '../../../components/DataGrid';

import WorkCategorySearchDialog, {
  SearchProps as WorkCategorySearchProps,
} from './WorkCategorySearchDialog/index';

import './index.scss';

const ROOT = 'admin-pc-job-type-detail-work-category-area';

type State = {
  isDialogOpen: boolean;
  selectedIds: string[];
};

export type Props = WorkCategorySearchProps & {
  workCategories: Array<WorkCategory>;
  unlinkWorkCategories: (ids: string[]) => Promise<void>;
};

export default class WorkCategoryArea extends React.Component<Props, State> {
  state = {
    isDialogOpen: false,
    selectedIds: [],
  };

  onFilterChange = () => {
    this.setState({ selectedIds: [] });
  };

  openDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  hideDialog = () => {
    this.setState({ isDialogOpen: false });
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

  handleRowClick = (rowIdx: number, row: WorkCategory) => {
    if (row && row.id) {
      this.toggleSelection([row.id]);
    }
  };

  handleRowsToggle = (rows: Array<{ row: WorkCategory }>) => {
    const ids = rows.map((info) => info.row.id);
    this.toggleSelection(ids);
  };

  handleLink = async (list: WorkCategory[]) => {
    this.props.linkWorkCategories(list);
    this.setState({ isDialogOpen: false });
  };

  handleUnlink = () => {
    this.props.unlinkWorkCategories(this.state.selectedIds);
    this.setState({ selectedIds: [] });
  };

  render() {
    const addBtn = (
      <Button
        type="secondary"
        className={`${ROOT}__new`}
        onClick={this.openDialog}
        disabled={false}
      >
        {msg().Admin_Lbl_AddWorkCategory}
      </Button>
    );

    const deleteBtn = (
      <Button
        type="destructive"
        disabled={isEmpty(this.state.selectedIds)}
        className={`${ROOT}__delete`}
        onClick={this.handleUnlink}
      >
        {msg().Com_Btn_Remove}
      </Button>
    );

    const rows = this.props.workCategories.map((row) => {
      const isSelected = this.state.selectedIds.includes(row.id);
      return { ...row, isSelected };
    });

    const table = (
      <DataGrid
        numberOfRowsVisibleWithoutScrolling={5}
        columns={[
          {
            key: 'code',
            name: msg().Admin_Lbl_Code,
            filterable: true,
          },
          {
            key: 'name',
            name: msg().Admin_Lbl_Name,
            filterable: true,
          },
        ]}
        showCheckbox
        rows={rows}
        onRowClick={this.handleRowClick}
        onRowsSelected={this.handleRowsToggle}
        onRowsDeselected={this.handleRowsToggle}
        disabled={false}
        onFilterChange={this.onFilterChange}
      />
    );

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__title`}>{msg().Admin_Lbl_WorkCategory}</div>
        {addBtn}
        {isEmpty(rows) && (
          <span className={`${ROOT}__hint`}>
            {msg().Admin_Lbl_NoConfiguredWorkCategory}
          </span>
        )}
        {deleteBtn}
        {table}
        {this.state.isDialogOpen && (
          <WorkCategorySearchDialog
            maxNum={this.props.maxNum}
            hideDialog={this.hideDialog}
            linkWorkCategories={this.handleLink}
            onClickSearchWorkCategories={this.props.onClickSearchWorkCategories}
          />
        )}
      </div>
    );
  }
}
