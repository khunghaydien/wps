import * as React from 'react';

import Comment, { Props as CommentProps } from '../../atoms/Comment';
import Person, { Props as PersonProps } from '../../atoms/Person';

import './CommentArea.scss';

const ROOT = 'mobile-app-molecules-commons-comment-area';

type Props = PersonProps & CommentProps;

export default class CommentArea extends React.PureComponent<Props> {
  render() {
    return (
      <div className={ROOT}>
        <Person
          className={`${ROOT}__person`}
          src={this.props.src}
          alt={this.props.alt}
        />
        <Comment
          className={`${ROOT}__comment`}
          value={this.props.value}
          position="left"
        />
      </div>
    );
  }
}
