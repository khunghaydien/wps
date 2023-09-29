import * as React from 'react';

import ConfirmDialog, {
  bindHandlerToConfirmDialog,
  CustomConfirmDialogComponent,
} from '../../commons/components/dialogs/ConfirmDialog';
import ErrorDialog from '../../commons/components/dialogs/ErrorDialog';
import ErrorPage from '../../commons/components/ErrorPage';
import UnexpectedErrorPage from '../../commons/components/errors/UnexpectedErrorPage';
import Spinner from '../../commons/components/Spinner';
import ApexError from '../../commons/errors/ApexError';
import BaseWSPError from '../../commons/errors/BaseWSPError';
import FatalError from '../../commons/errors/FatalError';

export type Props = {
  children: React.ReactNode;
  handleCloseErrorDialog: (event: React.SyntheticEvent<any>) => void;
  loading: boolean;
  error: BaseWSPError | null | undefined;
  unexpectedError?: FatalError | ApexError;
  confirmDialog:
    | {
        message?: string;
        Component?: CustomConfirmDialogComponent<any>;
        params?: any;
        okButtonLabel?: string | null | undefined;
        cancelButtonLabel?: string | null | undefined;
        handleClickOkButton: () => void;
        handleClickCancelButton: () => void;
      }
    | null
    | undefined;
  dialog: any;
};

/**
 * 打刻ウィジェット全体をラップして、イベントをハンドリングするコンポーネント
 * - ローディング表示：state.commons.app.loading
 * - エラー表示：state.commons.app.error
 *     - error.isContinuable === true -> エラーダイアログ表示
 *     - error.isContinuable === false -> エラーページ表示
 */
export default class TimestampWidgetWrapper extends React.Component<Props> {
  static defaultProps = {
    error: null,
  };

  renderContent() {
    const { error, children } = this.props;
    return error && !error.isContinuable ? (
      <ErrorPage error={error} />
    ) : (
      children
    );
  }

  renderConfirmDialog() {
    const { confirmDialog } = this.props;

    if (confirmDialog === undefined || confirmDialog === null) {
      return null;
    }

    if (confirmDialog.Component) {
      const CustomConfirmDialog = confirmDialog.Component as React.FC<any>;

      const CommonConfirmBoundHandler = bindHandlerToConfirmDialog({
        onClickOk: confirmDialog.handleClickOkButton,
        onClickCancel: confirmDialog.handleClickCancelButton,
      });

      return (
        <CustomConfirmDialog
          ConfirmDialog={CommonConfirmBoundHandler}
          params={confirmDialog.params}
        />
      );
    }

    return (
      <ConfirmDialog
        okButtonLabel={confirmDialog.okButtonLabel}
        cancelButtonLabel={confirmDialog.cancelButtonLabel}
        onClickOk={confirmDialog.handleClickOkButton}
        onClickCancel={confirmDialog.handleClickCancelButton}
      >
        {confirmDialog.message}
      </ConfirmDialog>
    );
  }

  renderErrorDialog() {
    const { error, handleCloseErrorDialog } = this.props;
    return error && error.isContinuable ? (
      <ErrorDialog error={error} handleClose={handleCloseErrorDialog} />
    ) : null;
  }

  renderUnexpectedErrorPage() {
    const { unexpectedError } = this.props;
    return unexpectedError ? (
      <UnexpectedErrorPage error={unexpectedError} />
    ) : null;
  }

  render() {
    return (
      <>
        <div>
          {this.props.unexpectedError
            ? this.renderUnexpectedErrorPage()
            : this.renderContent()}
          {this.renderConfirmDialog()}
          {this.renderErrorDialog()}
        </div>
        <Spinner loading={this.props.loading} />
      </>
    );
  }
}
