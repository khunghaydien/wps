import * as React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/attPattern';

import MainContents from '../../components/MainContents';

type Props = Readonly<{
  actions: Record<string, any>;
  companyId: string;
  searchAttPattern: Array<Record<string, any>>;
}>;

export default class AttPattern extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.actions.search({
      companyId: props.companyId,
    });
    props.actions.getConstantsAttPattern();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      this.props.actions.search({
        companyId: nextProps.companyId,
      });
      this.props.actions.getConstantsAttPattern();
    }
  }

  render() {
    const configListAttPattern = _.cloneDeep(configList);
    configListAttPattern.base.forEach((config: Record<string, any>) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="attPattern"
        configList={configListAttPattern}
        itemList={this.props.searchAttPattern}
        {...this.props}
      />
    );
  }
}
