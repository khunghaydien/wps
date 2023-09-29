import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import { RATING_TYPE } from '@apps/domain/models/psa/Skillset';

import { EmployeeSkillset } from '../../modules/skillsetLinkConfig/ui';

import DataGrid from '../DataGrid';
import CustomEditor from './CustomEditor';

import './SkillsetGrid.scss';

const ROOT = 'admin-pc-detail-pane-skillset-grid';

type Props = {
  selectedId: string;
  selectedSkillset: Array<EmployeeSkillset>;
  remove: () => void;
  resetToEditRecord: () => void;
  toggleSelectedSkillset: (arg0: EmployeeSkillset) => void;
  cleanSelectedSkillset: () => void;
  setSelectedSkillset: (skillsets: Record<string, any>) => void;
  isDisabled: boolean;
  config: Record<string, any>;
  onChangeDetailItem: (key: string, value: Array<any>) => void;
  isRemoveButtonDisabled: boolean;
};

export const RatingTypeFormatter = ({ value }: { value: string }) => {
  return <span>{msg()[`Admin_Lbl_PsaRatingSetting${value}`]}</span>;
};

export const RatingFormatter = ({
  value,
  selectedSkillset,
  rowIdx,
}: {
  value: string;
  selectedSkillset: Array<EmployeeSkillset>;
  rowIdx: number;
}) => {
  let formattedValue = value;
  const selectedRow = selectedSkillset[rowIdx];

  if (selectedRow) {
    const { grades, ratingType } = selectedRow;
    const isGradeType = ratingType === RATING_TYPE.Grade;
    const hasNoRating = value === '0';

    if (isGradeType) {
      formattedValue = grades[value];
    } else if (hasNoRating) {
      formattedValue = msg().Admin_Lbl_PsaRatingSettingNone;
    }
  }

  return <span>{formattedValue}</span>;
};

export default class SkillsetGrid extends React.Component<Props> {
  componentDidMount() {
    const { selectedId, resetToEditRecord } = this.props;
    if (selectedId) {
      resetToEditRecord();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      selectedId,
      isDisabled,
      selectedSkillset,
      onChangeDetailItem,
      config,
      resetToEditRecord,
      cleanSelectedSkillset,
    } = this.props;

    const isSelectedIdChanged = prevProps.selectedId !== selectedId;
    const isSelectedSkillsetChanged =
      prevProps.selectedSkillset.length !== selectedSkillset.length;
    const isDisabledChanged = prevProps.isDisabled !== isDisabled;

    // if you select another record with a group id,
    // call psa/group/get to get the group details
    if (isSelectedIdChanged) {
      cleanSelectedSkillset();
      if (selectedId) {
        resetToEditRecord();
      }
    }

    // If you add/remove member,
    // update tmpEditRecord with the new members
    if (isSelectedSkillsetChanged) {
      const result = selectedSkillset.map((skillset) => ({
        skillId: skillset.id,
        rating: Number(skillset.rating),
      }));
      onChangeDetailItem(config.key, result);
    }

    // when cancel current operation, reset to original data
    if (isDisabled && isDisabledChanged) {
      this.props.resetToEditRecord();
    }
  }

  componentWillUnmount() {
    this.props.cleanSelectedSkillset();
  }

  onGridRowsUpdated = ({ toRow, updated }: { toRow: number; updated: any }) => {
    const updatedState = [...this.props.selectedSkillset];
    updatedState[toRow].rating = updated.rating;
    updatedState[toRow].isSelected = true;
    this.props.setSelectedSkillset(updatedState);
    const result = updatedState.map((skillset) => ({
      skillId: skillset.id,
      rating: Number(skillset.rating),
    }));
    this.props.onChangeDetailItem(this.props.config.key, result);
  };

  onRatingValueChange = (rowData, value) => {
    let updatedState = [...this.props.selectedSkillset];
    updatedState = updatedState.map((row) => {
      if (row.id === rowData.id) {
        // @ts-ignore
        row.rating = Number(value);
      }
      // @ts-ignore
      row.skillId = row.id;
      return row;
    });

    this.props.setSelectedSkillset(updatedState);

    this.props.onChangeDetailItem(this.props.config.key, updatedState);
  };

  handleRowClick = (rowIdx: number, row: EmployeeSkillset) => {
    // this.props.toggleSelectedSkillset(row);
    if (row) {
      this.props.toggleSelectedSkillset(row);
    }
  };

  handleRowsToggle = (rows: Array<Record<string, any>>) => {
    return rows.forEach(({ row }) => this.props.toggleSelectedSkillset(row));
  };

  render() {
    let rootClassName = ROOT;
    if (this.props.isDisabled) {
      rootClassName += ` ${ROOT}__dataGrid-disabled`;
    }

    return (
      <div className={rootClassName}>
        <p className={`${ROOT}__help-text`}>
          {msg().Admin_Help_SkillsetRating}
        </p>
        {this.props.selectedSkillset.length !== 0 && (
          <DataGrid
            key={this.props.selectedSkillset.length}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'categoryName',
                name: msg().Psa_Lbl_SkillsetCategory,
                filterable: true,
              },
              {
                key: 'skillCode',
                name: msg().Psa_Lbl_SkillsetCode,
                filterable: true,
              },
              {
                key: 'skillName',
                name: msg().Psa_Lbl_SkillsetName,
                filterable: true,
              },
              {
                key: 'ratingType',
                name: msg().Admin_Lbl_RatingType,
                formatter: RatingTypeFormatter,
              },
              {
                key: 'rating',
                name: msg().Admin_Lbl_Rating,
                // @ts-ignore
                formatter: (
                  // @ts-ignore
                  <RatingFormatter
                    selectedSkillset={this.props.selectedSkillset}
                  />
                ),
                // @ts-ignore
                editor: (
                  <CustomEditor onValueChange={this.onRatingValueChange} />
                ),
                editable: (rowData) => rowData.ratingType !== 'None',
              },
            ]}
            showCheckbox
            rows={this.props.selectedSkillset}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect
            disabled={this.props.isDisabled}
          />
        )}
        {this.props.selectedSkillset.length !== 0 && (
          <Button
            type="destructive"
            className={`${ROOT}__editAction ${ROOT}__removeButton`}
            onClick={this.props.remove}
            disabled={this.props.isRemoveButtonDisabled}
          >
            {msg().Com_Btn_Remove}
          </Button>
        )}
      </div>
    );
  }
}
