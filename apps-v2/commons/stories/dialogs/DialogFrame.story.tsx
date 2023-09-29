import React from 'react';

import uuid from 'uuid/v1';

import { action } from '@storybook/addon-actions';

import Button from '../../components/buttons/Button';
import DialogFrame from '../../components/dialogs/DialogFrame';

import './DialogFrame.story.scss';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const dummyIconImage = require('../../images/HeaderIconInfo.png');

const focusId = uuid();

interface State {
  open: boolean;
}

class DialogContainer extends React.Component {
  state: State;
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState: State) => ({
      open: !prevState.open,
    }));
  }

  render() {
    return (
      <div>
        <button onClick={this.toggle}>open dialog</button>

        {this.state.open ? (
          <DialogFrame
            className="commons-dialog-frame-story"
            titleIcon={dummyIconImage}
            title="ダイアログタイトル"
            hide={this.toggle}
            initialFocus={focusId}
            headerSub={
              <div className="commons-dialog-frame-story__header-sub">
                <Button>ツール</Button>
              </div>
            }
            footer={
              <DialogFrame.Footer
                sub={<Button type="destructive">削除</Button>}
              >
                <Button type="default">キャンセル</Button>
                <Button type="primary" id={focusId}>
                  保存
                </Button>
              </DialogFrame.Footer>
            }
          >
            <div>
              初期フォーカスが保存ボタンになっています。
              <br />
              上部の×ボタンをおして閉じると、元のボタンにフォーカスが戻ります。
            </div>
          </DialogFrame>
        ) : null}
      </div>
    );
  }
}

export default {
  title: 'commons/dialogs',
};

const dialogComponent = (args) => (
  <DialogFrame
    className="commons-dialog-frame-story"
    titleIcon={dummyIconImage}
    title={args.title}
    hide={action('閉じるボタンクリック')}
    headerSub={
      <div className="commons-dialog-frame-story__header-sub">
        <Button>ツール</Button>
      </div>
    }
    draggable={args.draggable}
    footer={
      <DialogFrame.Footer sub={<Button type="destructive">削除</Button>}>
        <Button type="default">キャンセル</Button>
        <Button type="primary">保存</Button>
      </DialogFrame.Footer>
    }
  >
    <div>&lt;SomeComponent&gt;</div>
  </DialogFrame>
);

export const _DialogFrame = () =>
  dialogComponent({ title: 'ダイアログタイトル', draggable: false });

_DialogFrame.storyName = 'DialogFrame';

_DialogFrame.parameters = {
  info: {
    text: 'タイトル文言／アイコン／適当な内容',
    propTables: [DialogFrame],
    inline: false,
    source: true,
  },
};

export const DraggableDialogFrame = () =>
  dialogComponent({
    title: 'ダイアログタイトル (header is draggable)',
    draggable: true,
  });
DraggableDialogFrame.storyName = 'DraggableDialogFrame';
DraggableDialogFrame.parameters = {
  info: { propTables: false, inline: false, source: true },
};

export const DialogFrameFocusControl = () => {
  return <DialogContainer />;
};

DialogFrameFocusControl.storyName = 'DialogFrame - focus control';
DialogFrameFocusControl.parameters = {
  info: { propTables: false, inline: false, source: true },
};
