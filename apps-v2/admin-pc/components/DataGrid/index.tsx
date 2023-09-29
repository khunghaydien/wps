import React from 'react';
import ReactDataGrid from 'react-data-grid';

import _ from 'lodash';

import { Data } from '@commons/components/react-data-grid-addons';

import { Column } from './DataGridColumn';
import DataGridToolbar from './DataGridToolbar';
import TextFieldFilter from './filter-field-renderers/TextFieldFilter';

import './index.scss';

const Selectors = Data.Selectors;

const ROOT = 'data-grid';

type Props = {
  rowHeight?: number;
  columns: Column[];
  cellActions?: (column: any, row: any) => void;
  numberOfRowsVisibleWithoutScrolling: number;
  onRowClick?: (rowIdx: number, row: any) => void;
  onRowsDeselected?: (row: any) => void;
  onRowsSelected?: (row: any) => void;
  onFilterChange?: () => void;
  onGridRowsUpdated?: (updatedObj: Record<string, any>) => void;
  rows: Array<any>;
  showCheckbox: boolean;
  enableCellSelect?: boolean;
  disabled: boolean;
  className?: string;
};

type State = {
  columns: Column[];
  filters: Record<string, any>;
  isOpenSearchFilter: boolean;
  rows: any[];
  sortColumn: null | string;
  sortDirection: null | string;
  timeoutId: null | number;
};

export default class DataGrid extends React.Component<Props, State> {
  grid: ReactDataGrid<any>;

  static defaultProps = {
    numberOfRowsVisibleWithoutScrolling: 0,
    showCheckbox: false,
    disabled: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      columns: [],
      filters: {},
      isOpenSearchFilter: true,
      rows: [],
      sortColumn: null,
      sortDirection: null,
      timeoutId: null,
    };

    this.configureSearchFilter = this.configureSearchFilter.bind(this);
    this.getMinHeight = this.getMinHeight.bind(this);
    this.getRows = this.getRows.bind(this);
    this.getSize = this.getSize.bind(this);
    this.handleGridSort = this.handleGridSort.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    this.onClickToggleSearchFilterButton =
      this.onClickToggleSearchFilterButton.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
  }

  UNSAFE_componentWillMount() {
    const columns = _.cloneDeep(this.props.columns);
    this.setState({
      columns: this.configureSearchFilter(columns),
      rows: this.props.rows,
    });
  }

  componentDidMount() {
    // reactDataGridが描画された後リサイズイベントを発火しないと、正しくGridが表示されないためこの対応をしています
    // おそらくページング対応の際にreactDataGridは消えるので、暫定的な対応です。

    // This class of reactDataGrid is not drawn correctly under the influence of the CSS.
    // So, after the reactDataGrid is drawn, we issue a resize event to make it recalculate.
    // This is an interim response, as the reactDataGrid will probably disappear when the paging is enabled.
    const timeoutId = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    this.setState({ timeoutId });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // HACK: Access ref to deal with the bug where selectAllCheckbox is not turned off.
    // https://teamspiritdev.atlassian.net/browse/WPB-146
    const isAnyUnselected = nextProps.rows.some(
      ({ isSelected }) => !isSelected
    );
    if (this.props.showCheckbox && isAnyUnselected) {
      _.set(this.grid, 'selectAllCheckbox.checked', false);
    }
    this.setState({
      rows: nextProps.rows,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
  }

  onClearFilters() {
    this.setState({ filters: {} });
  }

  onRowClick(rowIdx: number, selectedRow: any) {
    if (
      this.props.onRowClick !== null &&
      this.props.onRowClick instanceof Function
    ) {
      this.props.onRowClick(rowIdx, selectedRow);
    }
  }

  onClickToggleSearchFilterButton() {
    this.setState((prevState) => ({
      isOpenSearchFilter: !prevState.isOpenSearchFilter,
    }));
    // TODO
    // @ts-ignore
    this.grid.onToggleFilter();
  }

  onRowsSelected(selectedRows: any) {
    if (
      this.props.onRowsSelected !== null &&
      this.props.onRowsSelected instanceof Function
    ) {
      this.props.onRowsSelected(selectedRows);
    }
  }

  onRowsDeselected(selectedRows: any) {
    if (
      this.props.onRowsDeselected !== null &&
      this.props.onRowsDeselected instanceof Function
    ) {
      this.props.onRowsDeselected(selectedRows);
    }
  }

  getRows() {
    return Selectors.getRows(this.state);
  }

  getSize() {
    return this.getRows().length;
  }

  rowGetter(rowIdx: number) {
    const rows = this.getRows();
    return rows[rowIdx];
  }

  handleGridSort(sortColumn: string, sortDirection: string) {
    this.setState({ sortColumn, sortDirection });
  }

  handleFilterChange(filter: {
    filterTerm: string | null | undefined;
    column: Column;
  }) {
    this.setState((prevState) => {
      const filters = _.cloneDeep(prevState.filters);
      if (filter.filterTerm) {
        const { filterValues } = filter.column;
        filters[filter.column.key] = filterValues
          ? { ...filter, filterValues }
          : filter;
      } else {
        delete filters[filter.column.key];
      }
      return { filters };
    });

    if (this.props.onFilterChange) {
      this.props.onFilterChange();
    }
  }

  configureSearchFilter(columns: Column[]): Column[] {
    return columns.map((column) => ({
      ...column,
      filterRenderer: column.filterable
        ? column.filterRenderer || TextFieldFilter
        : undefined,
    }));
  }

  getMinHeight() {
    const rows = this.state.rows;
    const rowHeight = this.props.rowHeight || 35;
    const numberOfRowsVisibleWithoutScrolling =
      this.props.numberOfRowsVisibleWithoutScrolling;
    let minHeight = 350;
    const scrollbarOffset = 15;

    if (numberOfRowsVisibleWithoutScrolling !== 0) {
      minHeight = rowHeight; // NOTE: ヘッダー分を確保
      if (rows.length > 0) {
        const numberOfRows =
          rows.length > numberOfRowsVisibleWithoutScrolling
            ? numberOfRowsVisibleWithoutScrolling
            : rows.length;
        minHeight += numberOfRows * rowHeight;
      }
      const borderOffset = 1; // NOTE: ボーダーの調整分
      minHeight += borderOffset;
      const searchFilterHeight = 30;
      if (this.state.isOpenSearchFilter) {
        minHeight += searchFilterHeight;
      }
    }
    return minHeight + scrollbarOffset;
  }

  render() {
    _.set(this.grid, 'selectAllCheckbox.disabled', false);
    if (this.props.showCheckbox && this.props.disabled) {
      _.set(this.grid, 'selectAllCheckbox.disabled', true);
    }

    return (
      <div className={`${ROOT} ${this.props.className}`}>
        {/* @ts-ignore */}
        <ReactDataGrid
          rowHeight={this.props.rowHeight}
          getCellActions={this.props.cellActions}
          columns={this.state.columns}
          enableRowSelect
          onAddFilter={this.handleFilterChange}
          onGridSort={this.handleGridSort}
          onClearFilters={this.onClearFilters}
          rowGetter={this.rowGetter}
          rowsCount={this.getSize()}
          onRowClick={this.onRowClick}
          rowSelection={{
            showCheckbox: this.props.showCheckbox,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: { isSelectedKey: 'isSelected' },
          }}
          toolbar={
            <DataGridToolbar
              enableFilter={this.state.columns.some(
                (column) => column.filterable
              )}
            />
          }
          minHeight={this.getMinHeight()}
          ref={(grid) => {
            this.grid = grid;
          }}
          enableCellAutoFocus={false}
          enableCellSelect={this.props.enableCellSelect}
          onGridRowsUpdated={this.props.onGridRowsUpdated}
        />
      </div>
    );
  }
}
