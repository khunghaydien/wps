export type Column = {
  key: string | Array<string>;
  name: string;
  shrink?: boolean;
  grow?: boolean;
  width?: string | number;
  formatter?: any;
  renderFilter?: () => React.ReactNode;
  selected?: boolean;
  expand?: boolean;
  cssModifier?: string;
  isAddon?: boolean;
  addon?: React.ComponentType<Record<string, any>>;
  extraProps?: Record<string, any>;
};

export type ColumnCss = {
  flexBasis: (string | number) | null | undefined;
  flexShrink: 1 | 0;
  flexGrow: 1 | 0;
  minWidth: 0 | null;
};

export const buildColumnCss = (column: Column, collapse = false): ColumnCss => {
  return {
    flexBasis: column.width,
    flexShrink: column.shrink ? 1 : 0,
    flexGrow: column.grow ? 1 : 0,
    minWidth: collapse ? 0 : null,
  };
};

export const ellipsisCss = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};
