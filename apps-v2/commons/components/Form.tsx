import React from 'react';

export type Props = {
  onSubmit: (arg0: React.SyntheticEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
  [key: string]: any;
};

export default class Form extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (this.props.onSubmit !== null && this.props.onSubmit !== undefined) {
      this.props.onSubmit(event);
    }
  }

  render() {
    const restProps = { ...this.props };
    delete restProps.onSubmit;

    return (
      <form onSubmit={this.onSubmit} {...restProps}>
        {this.props.children}
      </form>
    );
  }
}
