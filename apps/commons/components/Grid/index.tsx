import * as React from 'react';

import classNames from 'classnames';

import imgIconDoneCircle from '../../images/iconDoneCircle.png';
import msg from '../../languages';
import MessageBoard from '../MessageBoard';
import Tooltip from '../Tooltip';
import BodyRow from './BodyRow';
import { buildColumnCss, Column, ellipsisCss } from './Util';

import './index.scss';

const ROOT = 'commons-grid';

type Props = {
  columns: Column[]; // eslint-disable-line react/no-unused-prop-types
  data: Array<Record<string, any>>;
  idKey: string;
  selected: string[];
  browseId: string;
  onChangeRowSelection: Function;
  onClickRow: (id: string, event: React.SyntheticEvent<Element>) => void;
  ellipsis?: boolean;
  useFilter?: boolean;
  emptyMessage?: string;
  showCheckBox?: boolean;
  maxSelection?: number;
};

type State = {
  columns: Column[];
};

const COLUMN_DEFAULT = {
  selected: false,
  width: 'auto',
  expand: true,
  formatter: null,
};

const COLUMN_FOR_ICON = {
  name: '\u2001', // 1em space
  width: '50',
  shrink: true,
  expand: true,
  selected: false,
  isAddon: true,
};

const buildColumn = (columns: Column[]): Column[] => {
  const columnsWithIconColumn: Column[] = [];
  columns.forEach((column) => {
    if (column.addon) {
      columnsWithIconColumn.push({
        ...COLUMN_FOR_ICON,
        key: '',
        formatter: (props) => (
          <div className={`${ROOT}__addon addon`}>
            {column.addon ? <column.addon {...props} /> : null}
          </div>
        ),
      });
    }

    columnsWithIconColumn.push({
      ...COLUMN_DEFAULT,
      ...column,
    });
  });

  return columnsWithIconColumn;
};

export default class Grid extends React.Component<Props, State> {
  static defaultProps = {
    ellipsis: false,
  };

  static getDerivedStateFromProps(props: Props, _state: State) {
    return {
      columns: buildColumn(props.columns),
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = Grid.getDerivedStateFromProps(props, this.state);

    this.onChange = this.onChange.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChangeRowSelection(
      {
        id: '',
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

  onClickRow(
    id: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    this.props.onClickRow(id, event);
  }

  isSelected(id: string): boolean {
    return this.props.selected.includes(id);
  }

  isBrowsing(id: string): boolean {
    return this.props.browseId === id;
  }

  isSelectedAllChecked() {
    const { data, selected, maxSelection } = this.props;
    const maxSelected = selected.length === maxSelection;
    const noPendingRequest =
      data.length > 0 &&
      data.filter(({ id }) => !selected.includes(id)).length === 0;
    return maxSelected || noPendingRequest;
  }

  renderRow(rowData: { [key: string]: string }): React.ReactElement<any> {
    const { idKey, selected } = this.props;
    const id = rowData[idKey];

    return (
      <BodyRow
        ellipsis={this.props.ellipsis || Grid.defaultProps.ellipsis}
        columns={this.state.columns}
        data={rowData}
        key={id}
        id={id}
        onChangeRowSelection={this.props.onChangeRowSelection}
        selected={this.isSelected(id)}
        isBrowsing={this.isBrowsing(id)}
        onClickRow={this.onClickRow}
        showCheckBox={this.props.showCheckBox}
        numSelected={selected.length}
        maxSelection={this.props.maxSelection}
      />
    );
  }

  renderBody() {
    if (this.props.data.length > 0) {
      return this.props.data.map<React.ReactElement<typeof BodyRow>>(
        this.renderRow
      );
    } else {
      return (
        <MessageBoard
          message={this.props.emptyMessage || ''}
          iconSrc={imgIconDoneCircle}
        />
      );
    }
  }

  renderHeaderItem() {
    return this.state.columns.map<React.ReactElement<'div'>>((column) => {
      let css = buildColumnCss(column, this.props.ellipsis);

      if (!column.isAddon && this.props.ellipsis) {
        css = Object.assign({}, css, ellipsisCss);
      }

      const className = classNames(
        `${ROOT}__cell-head`,
        column.cssModifier ? `${ROOT}__cell-head--${column.cssModifier}` : null
      );

      return (
        <div
          key={column.name}
          style={css}
          className={className}
          role="columnheader"
        >
          {column.name}
        </div>
      );
    });
  }

  renderFilterItem() {
    return this.state.columns.map<React.ReactElement<'div'>>((column) => {
      let css = buildColumnCss(column, this.props.ellipsis);

      if (!column.isAddon && this.props.ellipsis) {
        css = Object.assign({}, css, ellipsisCss);
      }

      const className = classNames(
        `${ROOT}__cell-filter`,
        column.cssModifier
          ? `${ROOT}__cell-filter--${column.cssModifier}`
          : null
      );

      return (
        <div key={column.name} style={css} className={className}>
          {column.renderFilter ? column.renderFilter() : null}
        </div>
      );
    });
  }

  /**
   * This logic is exception to access control settings (AccessControlContainer)
   * Reason: Display of checkbox in approval screen is based on access control permission
   * but it is not correct to add permission settings inside common component, so we
   * are passing permission fields directly from parent to this component
   */
  renderSelectAll() {
    const inputClassName = classNames(`${ROOT}__input-wrapper`, {
      [`${ROOT}__checkbox-hide`]: !this.props.showCheckBox,
    });

    return (
      <label className={inputClassName} onClick={this.onClickLabel}>
        <Tooltip
          id={ROOT}
          align="top left"
          content={msg().Appr_Msg_MaxSelected}
        >
          <input
            type="checkbox"
            onChange={this.onChange}
            checked={this.isSelectedAllChecked()}
          />
        </Tooltip>
      </label>
    );
  }

  render() {
    const { useFilter } = this.props;
    return (
      <div className={`${ROOT}`} role="grid">
        <div className={`${ROOT}__head`}>
          <div className={`${ROOT}__head-row`} role="row">
            <div
              className={`${ROOT}__cell-head ${ROOT}__cell-head--checkbox`}
              role="columnheader"
            >
              <label
                className={`${ROOT}__input-wrapper`}
                onClick={this.onClickLabel}
              >
                {/* <input type="checkbox" /> */}
              </label>
            </div>
            {this.renderHeaderItem()}
          </div>

          {!useFilter && this.renderSelectAll()}
          {useFilter ? (
            <>
              <div className={`${ROOT}__filter-row`} role="row">
                <div
                  className={`${ROOT}__cell-filter ${ROOT}__cell-filter--checkbox`}
                >
                  {this.renderSelectAll()}
                </div>
                {this.renderFilterItem()}
              </div>
            </>
          ) : null}
        </div>

        <div
          className={classNames(`${ROOT}__body`, {
            [`${ROOT}__body--use-filter`]: useFilter,
          })}
          data-testid={`${ROOT}__body`}
        >
          {this.renderBody()}
        </div>
      </div>
    );
  }
}
