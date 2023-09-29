import React from 'react';

import msg from '../../../commons/languages';
import DualList from '@commons/components/fields/DualList';

import { MODE } from '../../modules/base/detail-pane/ui';

export type Labels = {
  headerLeft: string;
  headerRight: string;
};
export type Props = {
  disabled: boolean;
  selections: {
    options: Array<Record<string, any>>;
    selected: Array<Record<string, any>>;
  };
  mode: string;
  itemId: string; // selected item
  configKey: string;
  labels: Labels;
  initialiseOptions: () => void;
  setOptions: (selected: Array<string>) => void;
  // admin method
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

export default class DualListbox extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.initialiseOptions();
  }

  componentDidUpdate(prevProps: Props) {
    const { itemId, disabled, mode } = this.props;
    const isClone = mode === MODE.CLONE && prevProps.mode === MODE.VIEW;
    const isClickedNewAfterClone =
      mode === MODE.NEW && prevProps.mode === MODE.CLONE;
    const isSelectedIdChanged = itemId !== prevProps.itemId;

    if (!isClone && (isSelectedIdChanged || isClickedNewAfterClone)) {
      this.props.initialiseOptions();
    }
    // when cancel current operation, reset to original data
    const isDisabledChanged = prevProps.disabled !== disabled;
    if (disabled && isDisabledChanged) {
      this.props.initialiseOptions();
    }
  }

  handleOptionChange = (selected: Array<string>) => {
    this.props.setOptions(selected);
    this.props.onChangeDetailItem(this.props.configKey, selected);
  };

  /**
   *
   * Display first option in the selected list with `default` label
   */
  getOptionsWithDefaultLabel = () => {
    const { options, selected } = this.props.selections;
    const defaultValue = selected[0];
    if (!defaultValue) {
      return options;
    }
    const optionsWithDefault = options.map((option) => {
      if (option.value === defaultValue) {
        const label = option.label + ` (${msg().Admin_Lbl_Default})`;
        return { ...option, label };
      }
      return option;
    });
    return optionsWithDefault;
  };

  render() {
    const { disabled, selections, labels, itemId } = this.props;
    const optionsWithDefault = this.getOptionsWithDefaultLabel();

    return (
      <DualList
        headerLeft={labels.headerLeft}
        headerRight={labels.headerRight}
        key={itemId + disabled.toString()}
        options={optionsWithDefault}
        selected={selections.selected}
        disabled={disabled}
        onChange={this.handleOptionChange}
      />
    );
  }
}
