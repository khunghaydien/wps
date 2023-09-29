import * as React from 'react';

import TextArea from '@mobile/components/atoms/Fields/TextArea';

type Props = React.ComponentProps<typeof TextArea> & {
  rows?: number;
  variableRows?: number;
};

const VariableRowsTextArea: React.FC<Props> = ({
  rows,
  variableRows,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <TextArea
      {...props}
      rows={isFocused ? variableRows : rows}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

VariableRowsTextArea.defaultProps = {
  rows: 1,
  variableRows: 2,
};

export default VariableRowsTextArea;
