import * as React from 'react';

import './Person.scss';

const ROOT = 'mobile-app-atoms-person';

export type Props = Readonly<{
  className?: string;
  src: string;
  alt?: string | null | undefined;
}>;

export default class Person extends React.PureComponent<Props> {
  render() {
    return (
      <div className={this.props.className}>
        <img className={ROOT} src={this.props.src} alt={this.props.alt} />
      </div>
    );
  }
}
