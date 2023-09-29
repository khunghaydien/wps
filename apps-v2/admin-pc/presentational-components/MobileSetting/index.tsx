import React from 'react';

import DetailPaneContainer from '../../containers/MobileSettingContainer/DetailPaneContainer';

import './index.scss';

const ROOT = 'admin-pc-mobile-setting';

export type Props = {
  companyId: string;
  onInitialize: () => void;
};

export default class MobileSetting extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.onInitialize();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      nextProps.onInitialize();
    }
  }

  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__detail-pane`}>
          {/* @ts-ignore */}
          <DetailPaneContainer />
        </div>
      </div>
    );
  }
}
