import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import classNames from 'classnames';

const ROOT = 'commons-reorderble-list-item';

type ChildrenProps =
  | {
      useHandle: true;
      children: (arg0) => React.ReactNode;
    }
  | {
      useHandle: false;
      children: React.ReactNode;
    };

type Props = {
  index: number;
  // children: React.ReactNode | ((arg0) => React.ReactNode);
  itemId: string;
  // useHandle: boolean;
  isDragDisabled: boolean;
  className: string;
} & ChildrenProps;

export default class ReorderbleListItem extends React.Component<Props> {
  static defaultProps = {
    itemId: null,
    useHandle: false,
    isDragDisabled: false,
    className: null,
  };

  render() {
    const { className, isDragDisabled } = this.props;

    const liClassNameBase = [
      {
        [ROOT]: true,
        [`${ROOT}--disabled`]: isDragDisabled,
      },
    ];
    const draggableContainerClassNameBase = [
      {
        [`${ROOT}__draggable`]: true,
        [`${ROOT}__draggable--disabled`]: isDragDisabled,
        [className]: className,
      },
    ];

    return (
      <Draggable
        draggableId={`general-${this.props.itemId || this.props.index}`}
        index={this.props.index}
        key={this.props.itemId || this.props.index}
        isDragDisabled={this.props.isDragDisabled}
      >
        {(provided, snapshot) => {
          const liClassName = [...liClassNameBase];
          const draggableContainerClassName = [
            ...draggableContainerClassNameBase,
          ];

          if (snapshot.isDragging) {
            (liClassName as Array<Record<string, boolean> | string>).push(
              `${ROOT}--dragging`
            );

            draggableContainerClassName.push({
              [`${ROOT}__draggable--dragging`]: true,
            });
          }

          const draggableContainerProps =
            this.props.useHandle === true
              ? provided.draggableProps
              : {
                  ...provided.draggableProps,
                  ...provided.dragHandleProps,
                };

          return (
            <li className={classNames(liClassName)}>
              <div
                className={classNames(draggableContainerClassName)}
                ref={provided.innerRef}
                {...draggableContainerProps}
              >
                {this.props.useHandle === true
                  ? this.props.children(provided.dragHandleProps)
                  : this.props.children}
              </div>
              {(provided as any).placeholder}
            </li>
          );
        }}
      </Draggable>
    );
  }
}
