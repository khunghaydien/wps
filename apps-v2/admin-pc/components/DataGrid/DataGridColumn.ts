import * as React from 'react';

type ColumnKey = string;
type Row = Record<ColumnKey, any>;

export type Column = {
  key: string;
  name?: string | JSX.Element;
  width?: number;
  filterable?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  //  formatter?: ({ value }: { value: string }) => JSX.Element;
  formatter?: (any) => JSX.Element;
  editor?: ({ value }: { value: string }) => JSX.Element;
  editable?: (any) => boolean;
  filterRenderer?: React.ComponentType<any>;
  filterValues?: (
    arg0: Row,
    arg1: {
      filterTerm: string;
      column: Column;
      filterValues?: Column['filterValues'];
    },
    arg2: string
  ) => boolean;
};
