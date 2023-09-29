import * as ReactGrid from '@silevis/reactgrid';
import { Column } from '@silevis/reactgrid';

export type ErrorsCell = ReactGrid.Cell & {
  type: 'errors';
  errors?: string[];
};

export type AttTimeCell = ReactGrid.Cell & {
  type: 'attTime';
  text: string;
  value: number;
  placeholder?: string;
  renderer?: (text: string) => React.ReactNode;
};

export type Cell =
  | ReactGrid.CheckboxCell
  | ReactGrid.HeaderCell
  | ReactGrid.TextCell
  | AttTimeCell
  | ErrorsCell
  | ReactGrid.DropdownCell;

export type CellId = ReactGrid.Id;

export { type Column };

export type Row = ReactGrid.Row<Cell>;

export type CellChange = ReactGrid.CellChange<Cell>;
