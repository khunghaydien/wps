import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import classNames from 'classnames';

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ROOT = 'commons-reorderble-list';

type Props = {
  list: Array<any>;
  children: (arg0, arg1) => React.ReactNode;
  onDragEnd: (arg0) => void;
  isDropDisabled: boolean;
  className: string;
};
export default class ReorderbleList extends React.Component<Props> {
  static defaultProps = {
    isDropDisabled: false,
    className: null,
  };

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const reorderedList = reorder(
      this.props.list,
      result.source.index,
      result.destination.index
    );

    this.props.onDragEnd(reorderedList);
  }

  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        // @ts-ignore
        isDropDisabled={this.props.isDropDisabled}
      >
        <Droppable droppableId="general">
          {(provided, snapshot) => {
            const className = classNames(ROOT, {
              [this.props.className || '']: this.props.className,
              [`${ROOT}--disabled`]: this.props.isDropDisabled,
              [`${ROOT}--dragging`]: snapshot.isDraggingOver,
            });

            return (
              <ol
                className={className}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {(this.props.list || []).map(this.props.children)}
                {provided.placeholder}
              </ol>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  }
}
