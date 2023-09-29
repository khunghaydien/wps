import React from 'react';

import classNames from 'classnames';

import './ListPaneFrame.scss';

const ROOT = 'admin-pc-common-list-pane-frame';

type Props = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

export default class ListPaneFrame extends React.Component<Props> {
  render() {
    return (
      <section className={classNames(ROOT, this.props.className)}>
        <header className={`${ROOT}__header`}>
          <span className={`${ROOT}__header-title`}>{this.props.title}</span>
        </header>

        <div className={`${ROOT}__content`}>{this.props.children}</div>
      </section>
    );
  }
}
