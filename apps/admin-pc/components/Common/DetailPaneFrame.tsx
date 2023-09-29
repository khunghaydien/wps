import React, { ReactNode as Node } from 'react';

import classNames from 'classnames';

import './DetailPaneFrame.scss';

const ROOT = 'admin-pc-common-detail-pane-frame';

type Props = {
  title: string | Node;
  subTitle?: string | Node;
  headerButtons?: Node;
  className?: string;
  children: Node;
};

export default class DetailPaneFrame extends React.Component<Props> {
  render() {
    const { title, subTitle, headerButtons } = this.props;

    return (
      <section className={classNames(ROOT, this.props.className)}>
        <header className={`${ROOT}__header`}>
          <span className={`${ROOT}__header-title`}>{title}</span>

          {subTitle !== null && subTitle !== undefined ? (
            <span className={`${ROOT}__header-sub-title`}>{subTitle}</span>
          ) : null}

          <div className={`${ROOT}__header-buttons`}>{headerButtons}</div>
        </header>

        <div className={`${ROOT}__content`}>{this.props.children}</div>
      </section>
    );
  }
}
