import * as React from 'react';

import './ErrorPageFrame.scss';

const COMPONENT_ROOT = 'commons-errors-error-page-frame';

type Props = {
  icon: string | React.ReactElement<any>;
  title: string;
  solution?: string;
  children?: React.ReactNode;
};

export default class ErrorPageFrame extends React.PureComponent<Props> {
  render() {
    const Icon = () => {
      if (typeof this.props.icon === 'string') {
        return <img src={this.props.icon} alt="Error" />;
      } else {
        return this.props.icon;
      }
    };

    const Header = () => (
      <div className={`${COMPONENT_ROOT}__header`}>
        <div className={`${COMPONENT_ROOT}__icon`}>
          <Icon />
        </div>
        <div className={`${COMPONENT_ROOT}__title`}>{this.props.title}</div>
      </div>
    );

    const Solution = () =>
      this.props.solution ? (
        <p className={`${COMPONENT_ROOT}__solution`}>{this.props.solution}</p>
      ) : null;

    return (
      <div className={COMPONENT_ROOT}>
        <div className={`${COMPONENT_ROOT}__container`}>
          <Header />
          <Solution />
          {this.props.children}
        </div>
      </div>
    );
  }
}
