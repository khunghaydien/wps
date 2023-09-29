import * as React from 'react';

import msg from '../../../../commons/languages';

import Button from '../../atoms/Button';

export type Props = Readonly<{
  floating: boolean;
  onClick: () => void;
  className?: string;
  testId?: string;
  disabled?: boolean;
}>;

export default class AddJobButton extends React.Component<Props> {
  render() {
    return (
      <Button
        className={this.props.className}
        testId={this.props.testId}
        priority="secondary"
        variant="add"
        floating={this.props.floating ? 'bottom' : undefined}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {msg().Trac_Lbl_AddJob}
      </Button>
    );
  }
}
