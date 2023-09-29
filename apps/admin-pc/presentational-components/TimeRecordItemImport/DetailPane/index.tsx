import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';

import DownloadContainer from '../../../containers/TimeRecordItemImportContainer/DownloadContainer';
import NewContainer from '../../../containers/TimeRecordItemImportContainer/NewContainer';

import DetailPaneFrame from '../../../components/Common/DetailPaneFrame';

const ROOT = 'admin-pc-time-record-item-import-detail-pane';

export type Props = Readonly<{
  isNew: boolean;
  onClickClose: () => void;
}>;

export default class extends React.Component<Props> {
  render() {
    return (
      <DetailPaneFrame
        className={ROOT}
        title={msg().Admin_Lbl_Import}
        subTitle=""
        headerButtons={
          <Button
            className={`${ROOT}__close-button`}
            onClick={this.props.onClickClose}
          >
            {msg().Com_Btn_Close}
          </Button>
        }
      >
        {this.props.isNew ? <NewContainer /> : <DownloadContainer />}
      </DetailPaneFrame>
    );
  }
}
