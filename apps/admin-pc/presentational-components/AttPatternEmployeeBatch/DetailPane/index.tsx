import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';

import DownloadContainer from '../../../containers/AttPatternEmployeeBatchContainer/DownloadContainer';
import NewContainer from '../../../containers/AttPatternEmployeeBatchContainer/NewContainer';

import DetailPaneFrame from '../../../components/Common/DetailPaneFrame';

const ROOT = 'admin-pc-att-pattern-employee-batch-detail-pane';

export type Props = Readonly<{
  isNew: boolean;
  onClickClose: () => void;
}>;

export default class extends React.Component<Props> {
  render() {
    return (
      <DetailPaneFrame
        className={ROOT}
        title={msg().Admin_Lbl_Apply}
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
