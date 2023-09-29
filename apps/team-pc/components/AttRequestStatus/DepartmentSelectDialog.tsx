import * as React from 'react';

import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import MultiColumnFinder from '../../../commons/components/dialogs/MultiColumnFinder';
import msg from '../../../commons/languages';

import { Department } from '../../../domain/models/organization/Department';

import { ItemList } from '../../modules/ui/attRequestStatus/departmentSelectDialog';

import './DepartmentSelectDialog.scss';

const ROOT = 'team-pc-att-request-status-department-select-dialog';

export type Props = Readonly<{
  isOpened: boolean;
  items: ItemList[];

  onClickItem: (item: Department) => void;
  onClickCloseButton: () => void;
}>;

export default class DepartmentSelectDialog extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        {this.props.isOpened && (
          // @ts-ignore titleが指定されていない、要検討
          <DialogFrame className={ROOT} hide={this.props.onClickCloseButton}>
            <MultiColumnFinder
              items={this.props.items}
              typeName={msg().Team_Lbl_Department}
              parentSelectable
              onClickItem={this.props.onClickItem}
              onClickCloseButton={this.props.onClickCloseButton}
            />
          </DialogFrame>
        )}
      </React.Fragment>
    );
  }
}
