import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { MODE } from '../../modules/base/detail-pane/ui';

import DualListbox, { Labels } from '../../components/DualListBox';
import Select from '../../components/MainContents/DetailPane/Select';

export type Props = {
  disabled: boolean;
  selections: {
    options: Array<Record<string, any>>;
    selected: Array<string>;
  };
  mode: boolean;
  itemId: string; // selected item's Id
  configKey: string;
  labels: Labels;
  isSingleSelection: boolean;
  initialiseOptions: () => void;
  setSelected: (selected: Array<string>) => void;
  // admin method
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

export default class ExpTaxType extends React.Component<Props> {
  componentDidMount() {
    this.props.initialiseOptions();
  }

  componentDidUpdate(prevProps: Props) {
    const { itemId, disabled, mode, isSingleSelection, selections } =
      this.props;
    // @ts-ignore
    const isClone = mode === MODE.CLONE && prevProps.mode === MODE.VIEW;

    const isClickedNewAfterClone =
      // @ts-ignore
      mode === MODE.NEW && prevProps.mode === MODE.CLONE;
    const isSelectedIdChanged = itemId !== prevProps.itemId;
    const isComponnetChanged =
      isSingleSelection !== prevProps.isSingleSelection;

    if (!isClone && (isSelectedIdChanged || isClickedNewAfterClone)) {
      this.props.initialiseOptions();
      return;
    }
    // when cancel current operation, reset to original data
    const isDisabledChanged = prevProps.disabled !== disabled;
    if (disabled && isDisabledChanged) {
      this.props.initialiseOptions();
      return;
    }
    // when change to single tax selection, set the first tax as default; when change to multi tax selection, reset the selected tax
    if (isComponnetChanged) {
      const defaultSingleValue = get(selections, 'options.0.value', '');
      const updateSelected = isSingleSelection ? [defaultSingleValue] : [];
      this.props.setSelected(updateSelected);
      this.onChangeDetailItem(this.props.configKey, updateSelected);
    }
  }

  componentWillUnmount() {
    const { onChangeDetailItem, configKey } = this.props;
    onChangeDetailItem(configKey, null);
  }

  onChangeDetailItem = (
    configKey: string,
    selectedValue: Array<string> | null | undefined
  ) => {
    const value = isEmpty(selectedValue) ? null : selectedValue;
    this.props.onChangeDetailItem(configKey, value);
  };

  handleSingleSelection = (selected: string) => {
    this.props.setSelected([selected]);
    this.onChangeDetailItem(this.props.configKey, [selected]);
  };

  render() {
    const {
      disabled,
      selections,
      labels,
      itemId,
      setSelected,
      initialiseOptions,
      mode,
      configKey,
      isSingleSelection,
    } = this.props;

    const key = itemId + disabled.toString();

    const dropdownOptions = selections.options.map(({ value, label }) => ({
      value,
      text: label,
    }));

    return (
      <div
        className={classNames('expense-tax-type-config', {
          'single-selection': isSingleSelection,
        })}
      >
        {isSingleSelection ? (
          <Select
            key={key}
            // @ts-ignore
            onChange={(value) => this.handleSingleSelection(value)}
            disabled={disabled}
            // @ts-ignore
            options={dropdownOptions}
            // @ts-ignore
            value={selections.selected[0]}
            required
          />
        ) : (
          <DualListbox
            key={key}
            selections={selections}
            disabled={disabled}
            // @ts-ignore
            mode={mode}
            configKey={configKey}
            itemId={itemId}
            initialiseOptions={initialiseOptions}
            onChangeDetailItem={this.onChangeDetailItem}
            setOptions={setSelected}
            labels={labels}
          />
        )}
      </div>
    );
  }
}
