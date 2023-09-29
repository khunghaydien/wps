import * as React from 'react';

import ApexError from '../errors/ApexError';
import BaseWSPError from '../errors/BaseWSPError';
import FatalError from '../errors/FatalError';
import ConfirmDialog, {
  bindHandlerToConfirmDialog,
  CustomConfirmDialogComponent,
} from './dialogs/ConfirmDialog';
import ErrorDialog from './dialogs/ErrorDialog';
import ErrorPage from './ErrorPage';
import UnexpectedErrorPage from './errors/UnexpectedErrorPage';
import Spinner from './Spinner';

export type Props = {
  children: React.ReactNode;
  handleCloseErrorDialog: (event: React.SyntheticEvent<any>) => void;
  loading: boolean;
  loadingHint: string;
  isLoadingTargeted: boolean;
  error?: BaseWSPError;
  unexpectedError?: FatalError | ApexError;
  confirmDialog:
    | {
        message?: string;
        Component?: CustomConfirmDialogComponent<any>;
        params?: any;
        okButtonLabel?: string;
        cancelButtonLabel?: string;
        handleClickOkButton: () => void;
        handleClickCancelButton: () => void;
      }
    | null
    | undefined;
};

/**
 * 画面全体をラップして、イベントをハンドリングするコンポーネント
 * - ローディング表示：state.commons.app.loading
 * - エラー表示：state.commons.app.error
 *     - error.isContinuable === true -> エラーダイアログ表示
 *     - error.isContinuable === false -> エラーページ表示
 * TODO: Globalという名称では役割が不明瞭なので、改善案があればリネームする
 */
export default class Global extends React.Component<Props> {
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
      const CustomConfirmDialog =
        confirmDialog.Component as React.ComponentType<any>;

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
        <div className="ts-container">
          {this.props.unexpectedError
            ? this.renderUnexpectedErrorPage()
            : this.renderContent()}
          {this.renderConfirmDialog()}
          {this.renderErrorDialog()}
        </div>
        {!this.props.isLoadingTargeted && (
          <Spinner
            loading={this.props.loading}
            hintMsg={this.props.loadingHint}
          />
        )}
      </>
    );
  }
}
