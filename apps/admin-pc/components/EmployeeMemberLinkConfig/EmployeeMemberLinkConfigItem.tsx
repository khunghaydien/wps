import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import EmployeeMemberSearchDialog, {
  Props as SearchDialogProps,
} from './EmployeeMemberSearchDialog';

import './EmployeeMemberLinkConfigItem.scss';

const ROOT = 'admin-pc-employee-member-link-config';

export type Labels = Readonly<{
  noItem: string;
  addItem: string;
  dialogTitle: string;
}>;
type Props = SearchDialogProps & {
  labels: Labels;
  isDisabled: boolean;
  isDialogOpen: boolean;
  isSelectedEmpty: boolean;
  openSelection: () => void;
  isSingleSelection?: boolean;
  hasSearch?: boolean;
};

export default class EmployeeMemberLinkConfigItem extends React.Component<Props> {
  render() {
    const { labels } = this.props;

    return (
      <div className={ROOT}>
        {this.props.isSelectedEmpty && (
          <span className={`${ROOT}__text`}>{msg()[labels.noItem]}</span>
        )}
        <Button
          type="secondary"
          className={`${ROOT}__editAction`}
          onClick={this.props.openSelection}
          disabled={this.props.isDisabled}
        >
          {msg()[labels.addItem]}
        </Button>
        {this.props.isDialogOpen && (
          <EmployeeMemberSearchDialog
            dialogTitle={labels.dialogTitle}
            hasSearch={this.props.hasSearch}
            isSingleSelection={this.props.isSingleSelection}
            foundEmployeeMember={this.props.foundEmployeeMember}
            isAddButtonDisabled={this.props.isAddButtonDisabled}
            cancelSelection={this.props.cancelSelection}
            addSelectedEmployeeMember={this.props.addSelectedEmployeeMember}
            search={this.props.search}
            toggleSelection={this.props.toggleSelection}
          />
        )}
      </div>
    );
  }
}
