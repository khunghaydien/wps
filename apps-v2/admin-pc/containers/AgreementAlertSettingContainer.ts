// @ts-nocheck
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchAgreementAlertSetting } from '../modules/agreement-alert-setting/entities';
import {
  createAgreementAlertSetting,
  deleteAgreementAlertSetting,
  updateAgreementAlertSetting,
} from '../modules/agreement-alert-setting/ui';

import AgreementAlertSetting, {
  Props,
} from '../presentational-components/AgreementAlertSetting';

type AgreementAlertSettingContainerProps = Omit<Props, 'actions' | 'itemList'>;

const mapStateToProps = (state) => ({
  itemList: state.agreementAlertSetting.entities,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      search: searchAgreementAlertSetting,
      create: createAgreementAlertSetting,
      update: updateAgreementAlertSetting,
      delete: deleteAgreementAlertSetting,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  AgreementAlertSetting
) as React.ComponentType<AgreementAlertSettingContainerProps>;
