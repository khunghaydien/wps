import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import { EmployeeSkillset as Skillset } from '../../modules/skillsetLinkConfig/ui';

import DataGrid from '../DataGrid';
import { RatingTypeFormatter } from './SkillsetGrid';
import SkillsetSearchForm, {
  Props as SearchFormProps,
} from './SkillsetSearchForm';

import './SkillsetSearchDialog.scss';

const ROOT = 'admin-pc-skillset-search-dialog';

export type Props = Readonly<
  SearchFormProps & {
    foundSkillset: Array<Skillset>;
    isAddButtonDisabled: boolean;
    cancelSelection: () => void;
    addSelectedSkillset: () => void;
    setFoundSkillset: (updatedSkilltet: any) => void;
    toggleSelection: (arg0: Skillset) => void;
  }
>;

export default class SkillsetSearchDialog extends React.Component<Props> {
  onGridRowsUpdated = ({ toRow, updated }: { toRow: number; updated: any }) => {
    const updatedState = [...this.props.foundSkillset];
    // @ts-ignore
    updatedState[toRow].rating = updated.rating;
    // @ts-ignore
    updatedState[toRow].isSelected = true;
    this.props.setFoundSkillset(updatedState);
  };

  handleRowClick = (rowIdx: number, row: Skillset) =>
    this.props.toggleSelection(row);

  handleRowsToggle = (rows: Array<Record<string, any>>) => {
    return rows.forEach(({ row }) => this.props.toggleSelection(row));
  };

  render() {
    return (
      <DialogFrame
        className={`${ROOT}`}
        title={msg().Admin_Lbl_Skillset}
        hide={this.props.cancelSelection}
        footer={
          <DialogFrame.Footer>
            <Button
              className={`${ROOT}__button`}
              onClick={this.props.cancelSelection}
            >
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              className={`${ROOT}__button ${ROOT}__add-button`}
              disabled={this.props.isAddButtonDisabled}
              onClick={this.props.addSelectedSkillset}
            >
              {msg().Com_Btn_Add}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
          <SkillsetSearchForm search={this.props.search} />
          <DataGrid
            rowHeight={44}
            key={this.props.foundSkillset.length}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'categoryName',
                name: msg().Psa_Lbl_SkillsetCategory,
              },
              {
                key: 'skillCode',
                name: msg().Psa_Lbl_SkillsetCode,
              },
              {
                key: 'skillName',
                name: msg().Psa_Lbl_SkillsetName,
              },
              {
                key: 'ratingType',
                name: msg().Admin_Lbl_RatingType,
                formatter: RatingTypeFormatter,
              },
            ]}
            showCheckbox
            rows={this.props.foundSkillset}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect
          />
        </div>
      </DialogFrame>
    );
  }
}
