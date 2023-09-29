import * as React from 'react';

import Header from '../../atoms/Header';

import './Headline.scss';

const ROOT = 'mobile-app-molecules-commons-headline';

type Props = Readonly<{
  /**
   * page title
   */
  title: string;
}>;

export default class Navigation extends React.Component<Props> {
  render() {
    return (
      <Header className={ROOT}>
        <div className={`${ROOT}__container`}>{this.props.title}</div>
      </Header>
    );
  }
}
