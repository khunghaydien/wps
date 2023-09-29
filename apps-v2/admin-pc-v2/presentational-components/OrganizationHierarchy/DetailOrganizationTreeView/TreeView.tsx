import React, { useEffect, useRef, useState } from 'react';

import { cloneDeep, isEmpty } from 'lodash';

import Tree from '@commons/components/TreeView';
import msg from '@commons/languages';

import { HierarchyDisplayObject } from '@apps/domain/models/organization/MasterDepartmentHistory';

import DepartmentManagerDialog from '@admin-pc-v2/containers/OrganizationHierarchyContainer/DepartmentManagerDialogContainer';

import DepartmentSearchDialog from '@admin-pc-v2/components/DepartmentSearchDialog';

import './TreeView.scss';

const ROOT =
  'admin-pc-v2-organization-hierarchy-detail-organization-tree-view-tree-view';

export type Props = {
  targetDate: string;
  orgPatternId: string;
  dialog: string;
  getChildDepartments: (deptId: string) => Promise<HierarchyDisplayObject[]>;
  openDeptManagerDialog: () => void;
  onSearchDepartment: (code, name, targetDate) => void;
  onAddDepartment: (param: {
    childBaseId: string;
    parentBaseId: string;
  }) => Promise<void>;
  onRemoveChild: (id: string) => Promise<void | boolean>;

  // for DepartmentManagerDialog
  validTo: string;
  validFrom: string;
};

const renderLink = (
  id,
  name,
  hasChildren,
  linkAction,
  addChildAction,
  removeChildAction
) => (
  <div className={`${ROOT}__container`}>
    <div id={id} title={name} onClick={linkAction}>
      {name}
    </div>
    <div
      id={id}
      title={name}
      className={`${ROOT}__action-button`}
      onClick={addChildAction}
    >
      {msg().Admin_Lbl_AddChild}
    </div>
    {!hasChildren && (
      <div
        id={id}
        title={name}
        className={`${ROOT}__action-button`}
        onClick={removeChildAction}
      >
        {msg().Admin_Lbl_Remove}
      </div>
    )}
  </div>
);

const convertLabelToLink = (
  x,
  linkAction,
  addChildAction,
  removeChildAction
) => {
  return {
    ...x,
    nodeNameLabel: x.name,
    name: renderLink(
      x.id,
      x.nodeNameLabel ? x.nodeNameLabel : x.name,
      x.hasChildren,
      linkAction,
      addChildAction,
      removeChildAction
    ),
  };
};

const dfs = (
  x: HierarchyDisplayObject,
  res: HierarchyDisplayObject[],
  id: string,
  linkAction: (e: React.MouseEvent<HTMLDivElement>) => void,
  addChildAction: (e: React.MouseEvent<HTMLDivElement>) => void,
  removeChildAction: (
    parentNode: HierarchyDisplayObject,
    childNode: HierarchyDisplayObject
  ) => void
) => {
  if (x.id === id) {
    x.isChildrenLoading = false;
    x.isExpanded = !!(res && res.length > 0);
    x.children = res.map((o) =>
      convertLabelToLink(o, linkAction, addChildAction, () =>
        removeChildAction(x, o)
      )
    );
    x.hasChildren = x.children.length > 0;
    x.name = renderLink(
      x.id,
      x.nodeNameLabel,
      x.hasChildren,
      linkAction,
      addChildAction,
      () => removeChildAction(x.parentNode, x)
    );
    return;
  }
  if (x.children) {
    for (const item of x.children) {
      item.parentNode = x; // Setting link for child to parent
      const check = dfs(
        item,
        res,
        id,
        linkAction,
        addChildAction,
        removeChildAction
      );
      if (check) {
        return check;
      }
    }
  }
  return null;
};

const OrgTreeView = (props: Props) => {
  const { targetDate, orgPatternId, getChildDepartments, dialog } = props;

  const [data, setData] = useState([]);
  const [selectedNode, _setSelectedNode] = useState(
    {} as HierarchyDisplayObject
  );
  const selectedNodeRef = useRef(selectedNode);
  const setSelectedNode = (value: HierarchyDisplayObject) => {
    selectedNodeRef.current = value;
    _setSelectedNode(value);
  };
  const [departmentAddDialog, setDepartmentAddDialog] = useState(false);

  const onClickLink = (e: React.MouseEvent<HTMLDivElement>) => {
    const { id, title: name } = e.currentTarget;
    setSelectedNode({ id, name });
    props.openDeptManagerDialog();
  };

  const onClickAddChild =
    (node: HierarchyDisplayObject, isParent = false) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { id, title: name } = event.currentTarget;
      setSelectedNode({ id, name, node, isParent });
      setDepartmentAddDialog(true);
    };

  const onClickRemoveChild = (
    parentNode: HierarchyDisplayObject,
    childNode: HierarchyDisplayObject
  ) => {
    let id, parentChildId;
    if (!isEmpty(childNode)) {
      id = childNode.id;
      parentChildId = childNode.parentChildId;
    } else if (!isEmpty(parentNode)) {
      id = parentNode.id;
      parentChildId = parentNode.parentChildId;
    }
    setSelectedNode({ id, parentNode, childNode });
    props.onRemoveChild(parentChildId).then(handleRemoveSuccess);
  };

  const initializeOrganisationTree = () => {
    setData([]);
    setDepartmentAddDialog(false);
    getChildDepartments(null).then((res) => {
      setData(
        res.map((o) =>
          convertLabelToLink(o, onClickLink, onClickAddChild(o), () =>
            onClickRemoveChild(o, undefined)
          )
        )
      );
    });
  };

  useEffect(() => {
    initializeOrganisationTree();
  }, [getChildDepartments]);

  const onSetDepartment = (department) => {
    const { isParent } = selectedNodeRef.current;
    props
      .onAddDepartment({
        childBaseId: department.id,
        parentBaseId: isParent ? undefined : selectedNodeRef.current.id,
      })
      .then(handleAddDepartmentSuccess);
  };

  const handleAddDepartmentSuccess = () => {
    const { node, isParent } = selectedNodeRef.current;
    if (!isParent && !isEmpty(node)) {
      node.isChildrenLoading = true;
      getChildDepartments(node.id).then((res) => {
        const updatedData = cloneDeep(data);
        for (const x of updatedData) {
          // When adding a child of newly added parent,
          // we need to update the parent hasChildren state
          // because we are not calling API again
          if (node.id === x.id) {
            x.hasChildren = true;
            x.name = renderLink(
              x.id,
              x.nodeNameLabel,
              true,
              onClickLink,
              onClickAddChild(node),
              onClickRemoveChild
            );
          }
          dfs(
            x,
            res,
            node.id,
            onClickLink,
            onClickAddChild(node),
            onClickRemoveChild
          );
        }
        setData(updatedData);
      });
      setDepartmentAddDialog(false);
      setSelectedNode({});
    } else initializeOrganisationTree();
  };

  const handleRemoveSuccess = (response) => {
    if (!response) {
      setSelectedNode({});
      return;
    }
    const { parentNode } = selectedNodeRef.current;
    if (!isEmpty(parentNode)) {
      getChildDepartments(parentNode.id).then((res) => {
        const updatedData = cloneDeep(data);
        const hasNoChild = res.length === 0;
        const isAllNodeRemoved = updatedData.length === 1;
        for (const x of updatedData) {
          if (x.id === parentNode.id && isAllNodeRemoved && hasNoChild) {
            // Parent has been removed.
            setData([]);
          }
          if (x.id === parentNode.id && hasNoChild) {
            // the parent has no child,
            // reset it's expansion settings
            x.hasChildren = false;
            x.isChildrenLoading = false;
            x.isExpanded = false;
            x.children = [];
            x.name = renderLink(
              x.id,
              x.nodeNameLabel,
              false,
              onClickLink,
              onClickAddChild(parentNode),
              () => onClickRemoveChild(x.parentNode, x)
            );
          } else {
            // Parent has child
            dfs(
              x,
              res,
              parentNode.id,
              onClickLink,
              onClickAddChild(parentNode),
              onClickRemoveChild
            );
          }
        }
        setData(updatedData);
      });
      setSelectedNode({});
    } else setData([]);
  };

  const renderNoChildren = () => {
    return (
      <div className={`${ROOT}__container`}>
        <div>{msg().Admin_Lbl_EmptyPattern}</div>
        <div
          className={`${ROOT}__action-button`}
          onClick={onClickAddChild(undefined, true)}
        >
          {msg().Admin_Lbl_AddParent}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ marginTop: '8px' }}>
        <Tree<HierarchyDisplayObject>
          data={data}
          setData={setData}
          noChildrenAvailableMessage={renderNoChildren()}
          onClickExpand={(node) => {
            if (node.isExpanded === true) {
              node.isChildrenLoading = true;
              if (node.hasChildren && !isEmpty(node.children)) {
                node.isChildrenLoading = false;
                node.isExpanded = true;
                return;
              }
              getChildDepartments(node.id).then((res) => {
                const updatedData = cloneDeep(data);
                for (const x of updatedData) {
                  dfs(
                    x,
                    res,
                    node.id,
                    onClickLink,
                    onClickAddChild(node),
                    onClickRemoveChild
                  );
                }
                setData(updatedData);
              });
            }
          }}
        />
      </div>
      {dialog && (
        <DepartmentManagerDialog
          orgPatternId={orgPatternId}
          deptBaseId={selectedNodeRef.current.id}
          deptName={selectedNodeRef.current.name}
          validFrom={props.validFrom}
          validTo={props.validTo}
        />
      )}
      {departmentAddDialog && (
        <DepartmentSearchDialog
          maxNum={100}
          search={props.onSearchDepartment}
          setDepartment={onSetDepartment}
          targetDate={targetDate}
          hideDialog={() => {
            setDepartmentAddDialog(false);
            setSelectedNode({});
          }}
          isHideDateSearch
        />
      )}
    </>
  );
};

export default React.memo(OrgTreeView);
