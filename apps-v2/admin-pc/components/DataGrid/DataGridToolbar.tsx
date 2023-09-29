import * as React from 'react';

const ROOT = 'admin-pc-data-grid-data-grid-toolbar';

type Props = {
  onToggleFilter?: () => void;
  enableFilter: boolean;
};

export default class DataGridToolbar extends React.Component<Props> {
  componentDidMount() {
    const props = this.props as Props;

    // 検索フィルターは初期表示する
    if (props.enableFilter) {
      props.onToggleFilter();
    }
  }

  render() {
    return <div className={ROOT} />;
  }
}
