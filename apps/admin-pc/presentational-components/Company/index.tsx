import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/company';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  searchCompany: Array<Record>;
  getOrganizationSetting: {
    [key: string]: string | null | undefined;
  };
  sfObjFieldValues: any;
};
export default class Company extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.actions.searchCountry();
    const defaultLanguage = [];
    this.makeDefaultLanguage(
      this.props.getOrganizationSetting.language0,
      defaultLanguage
    );
    this.makeDefaultLanguage(
      this.props.getOrganizationSetting.language1,
      defaultLanguage
    );
    this.makeDefaultLanguage(
      this.props.getOrganizationSetting.language2,
      defaultLanguage
    );
    this.props.actions.setDefaultLangage(defaultLanguage);
  }

  makeDefaultLanguage(code, array) {
    if (!code) {
      return;
    }
    array.push(
      _.find(this.props.sfObjFieldValues.language, (lang) => {
        return lang.value === code;
      })
    );
  }

  render() {
    return (
      <MainContents
        componentKey="company"
        configList={configList}
        itemList={this.props.searchCompany}
        {...this.props}
      />
    );
  }
}
