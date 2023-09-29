import * as React from 'react';

interface Props extends React.ComponentProps<'label'> {
  id?: string;
  'data-testid'?: string;
  children: React.ReactNode;
}

const Label: React.FC<Props> = (props: Props) => {
  return <label {...props} />;
};

export default Label;
