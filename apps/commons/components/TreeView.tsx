import React from 'react';
import SuperTreeView from 'react-super-treeview';

import msg from '@apps/commons/languages';

import '../../../node_modules/react-super-treeview/dist/style.scss';

import './TreeView.scss';

type Props<T> = {
  data: Array<T>;
  setData: (data: Array<T>) => void;
  onClickExpand: (node: T, depth: number) => void;
  noChildrenAvailableMessage: string | React.ReactElement;
};

const TreeView = <T,>(props: Props<T>) => {
  const { noChildrenAvailableMessage = msg().Admin_Lbl_EmptyPattern } = props;
  return (
    <div className="ts-tree-view">
      <SuperTreeView
        data={props.data}
        loadingElement={msg().Com_Lbl_Loading}
        noChildrenAvailableMessage={noChildrenAvailableMessage}
        isCheckable={() => false}
        isDeletable={() => false}
        isExpandable={(node, _depth) => node.hasChildren}
        onUpdateCb={(updatedData) => {
          props.setData(updatedData);
        }}
        getStyleClassCb={(_node, depth) => (depth > 0 ? 'depth-2' : '')}
        onExpandToggleCb={props.onClickExpand}
      />
    </div>
  );
};
export default TreeView;
