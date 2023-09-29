import * as React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import TextUtil from '@commons/utils/TextUtil';

import msg from '../../languages';
import Tooltip from '../Tooltip';
import { buildColumnCss, Column, ellipsisCss } from './Util';

import './BodyRow.scss';

const ROOT = 'commons-grid-body-row';
const HANDLE_KEYPRESS_CODE = ['Enter', ' '];

type Props = {
  data: Record<string, any>;
  columns: Column[];
  selected: boolean;
  isBrowsing: boolean;
  onChangeRowSelection: Function;
  id: string;
  ellipsis: boolean;
  onClickRow: (
    id: string,
    arg1:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<HTMLInputElement>
  ) => void;
  showCheckBox?: boolean;
  numSelected?: number;
  maxSelection?: number;
  rowClass?: string;
};

export default class BodyRow extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onClickRowByKey = this.onClickRowByKey.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    const { maxSelection = 100 } = this.props;

    // In case of large number of rows, each row should not update on each selection
    const maxSelectionReached =
      nextProps.numSelected !== this.props.numSelected &&
      nextProps.numSelected >= maxSelection;

    const deselectFromMaxSelected =
      this.props.numSelected >= maxSelection &&
      nextProps.numSelected >= maxSelection - 1;

    const allDeselected =
      nextProps.numSelected !== this.props.numSelected &&
      nextProps.numSelected === 0;

    const updateOnMaxSelection =
      maxSelectionReached || deselectFromMaxSelected || allDeselected;

    return (
      !_.isEqual(this.props.data, nextProps.data) ||
      this.props.selected !== nextProps.selected ||
      this.props.isBrowsing !== nextProps.isBrowsing ||
      updateOnMaxSelection
    );
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChangeRowSelection(
      {
        id: this.props.id,
        checked: e.target.checked,
      },
      e
    );
  }

  onClickLabel(e: any) {
    // 行選択時に詳細移動してしまうことをを防ぐ
    e.stopPropagation();
    // フォーカスが背後の行へ移ることを防ぐ
    (e as React.FocusEvent<HTMLInputElement>).target.focus();
  }

  onClickRow(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.props.onClickRow(this.props.id, e);
  }

  onClickRowByKey(e: React.KeyboardEvent<Element>) {
    if (HANDLE_KEYPRESS_CODE.includes(e.key)) {
      e.preventDefault();
      this.props.onClickRow(this.props.id, e);
    }
  }

  onKeyPressLabel(e: React.SyntheticEvent<Element>) {
    e.stopPropagation();
  }

  getValue(data: Record<string, any>, key: string | string[]): any {
    if (
      _.isArray(key) &&
      Array.isArray(key)
      /* flowtype に key を string[] として推論させる */
    ) {
      const value = {};
      key.forEach((k) => {
        value[k] = data[k];
      });

      return value;
    } else {
      return data[key];
    }
  }

  renderItem(column: Column): React.ReactElement<any> {
    const cssClass = classNames(`${ROOT}__cell`, {
      [`${ROOT}__cell--addon`]: column.isAddon,
    });

    const style = buildColumnCss(column, this.props.ellipsis);

    const innerStyle = this.props.ellipsis
      ? Object.assign({}, ellipsisCss)
      : {};

    const value = this.getValue(this.props.data, column.key);

    let content;
    if (column.formatter) {
      if (column.extraProps) {
        content = (
          <column.formatter
            value={value}
            {...column.extraProps}
            data={this.props.data}
          />
        );
      } else {
        content = <column.formatter value={value} data={this.props.data} />;
      }
    } else {
      content = value;
    }

    return (
      <div key={column.name} className={cssClass} role="gridcell" style={style}>
        <div style={innerStyle} className={`${ROOT}__cell-inner`}>
          {content}
        </div>
      </div>
    );
  }

  renderInputCheckBox() {
    const { selected, numSelected, maxSelection, showCheckBox } = this.props;
    const inputClassName = classNames(`${ROOT}__input-wrapper`, {
      [`${ROOT}__checkbox-hide`]: !showCheckBox,
    });

    const disableCheckBox = !selected && numSelected >= maxSelection;

    const CheckBox = (
      <label
        className={inputClassName}
        onClick={this.onClickLabel}
        onKeyPress={this.onKeyPressLabel}
      >
        <input
          type="checkbox"
          onChange={this.onChange}
          checked={selected}
          disabled={disableCheckBox}
        />
      </label>
    );

    return disableCheckBox ? (
      <Tooltip
        align="top left"
        content={TextUtil.template(msg().Appr_Msg_MaxSelected, maxSelection)}
      >
        {CheckBox}
      </Tooltip>
    ) : (
      CheckBox
    );
  }

  render() {
    const cssClass = classNames(ROOT, {
      [`${ROOT}--is-browsing`]: this.props.isBrowsing,
      [`${this.props.rowClass}`]: !_.isEmpty(this.props.rowClass),
    });

    let rowButtonRole = 'button';
    let rowButtonTabIndex = 0;
    let onClickRow = this.onClickRow;
    let onClickRowByKey = this.onClickRowByKey;

    // 選択済み申請の場合はクリック対象から外す
    if (this.props.isBrowsing) {
      rowButtonTabIndex = null;
      rowButtonRole = '';
      onClickRow = null;
      onClickRowByKey = null;
    }

    return (
      <div className={cssClass} role="row">
        <div
          className={`${ROOT}__selection`}
          role={rowButtonRole}
          tabIndex={rowButtonTabIndex}
          onClick={onClickRow}
          onKeyPress={onClickRowByKey}
        >
          <div
            className={`${ROOT}__cell ${ROOT}__cell--select`}
            role="gridcell"
          >
            {this.props.showCheckBox && this.renderInputCheckBox()}
          </div>
          {this.props.columns.map(this.renderItem)}
        </div>
      </div>
    );
  }
}
