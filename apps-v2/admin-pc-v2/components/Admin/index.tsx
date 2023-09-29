import React from 'react';

import _ from 'lodash';

import ContentsSelectorContainer from '@admin-pc-v2/containers/ContentsSelectorContainer';

import AdminV1 from '@admin-pc/components/Admin';

export default class AdminV2 extends AdminV1 {
  renderMainContents(selectedCompanyId: string) {
    if (_.isEmpty(this.props.userSetting)) {
      return null;
    }
    const useFunction =
      _.find(this.props.searchCompany, { id: this.state.selectedCompanyId }) ||
      {};

    return (
      <ContentsSelectorContainer
        key="main"
        companyId={selectedCompanyId}
        selectedKey={this.state.selectedKey}
        title={this.state.title}
        useFunction={useFunction}
      />
    );
  }
}
