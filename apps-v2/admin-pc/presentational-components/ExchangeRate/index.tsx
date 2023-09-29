import React from 'react';

import DetailPaneContainer from '../../containers/ExchangeRateContainer/DetailPaneContainer';
import ListPaneContainer from '../../containers/ExchangeRateContainer/ListPaneContainer';

import MainContentFrame from '../../components/Common/MainContentFrame';

export type Props = {
  company: Record<string, unknown>;
  companyId: string;
  onInitialize: () => void;
  isDetailVisible: boolean;
  getCurrencyPair: () => void;
};

export default class ExchangeRate extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.onInitialize();
    this.props.getCurrencyPair();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      nextProps.onInitialize();
    }
  }

  render() {
    return (
      // @ts-ignore
      <MainContentFrame
        // @ts-ignore
        ListPane={<ListPaneContainer company={this.props.company} />}
        DetailPane={<DetailPaneContainer />}
        Dialogs={[]}
        isDetailVisible={this.props.isDetailVisible}
      />
    );
  }
}
