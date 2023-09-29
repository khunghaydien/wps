import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import SkillsetSearchDialog, {
  Props as SearchDialogProps,
} from './SkillsetSearchDialog';

import './SkillsetLinkConfigItem.scss';

const ROOT = 'admin-pc-skillset-link-config';

type Props = SearchDialogProps & {
  isDisabled: boolean;
  isDialogOpen: boolean;
  isSelectedEmpty: boolean;
  openSelection: () => void;
  setFoundSkillset: (updatedSkilltet: any) => void;
};

export default class SkillsetLinkConfigItem extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        {this.props.isSelectedEmpty && (
          <span className={`${ROOT}__text`}>
            {msg().Admin_Lbl_SkillsetNoItemInTheSet}
          </span>
        )}
        <Button
          type="secondary"
          className={`${ROOT}__editAction`}
          onClick={this.props.openSelection}
          disabled={this.props.isDisabled}
        >
          {msg().Admin_Lbl_AddSkillset}
        </Button>
        {this.props.isDialogOpen && (
          <SkillsetSearchDialog
            foundSkillset={this.props.foundSkillset}
            setFoundSkillset={this.props.setFoundSkillset}
            isAddButtonDisabled={this.props.isAddButtonDisabled}
            cancelSelection={this.props.cancelSelection}
            addSelectedSkillset={this.props.addSelectedSkillset}
            search={this.props.search}
            toggleSelection={this.props.toggleSelection}
          />
        )}
      </div>
    );
  }
}
