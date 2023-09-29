import React from 'react';

import msg from '../../../../commons/languages';
import Navigation from '../../molecules/commons/Navigation';

import Button from '../../atoms/Button';
import TextArea from '../../atoms/Fields/TextArea';
import Person from '../../atoms/Person';
import Wrapper from '../../atoms/Wrapper';

import './SubmitWithCommentPage.scss';

const ROOT = 'mobile-app-pages-commons-submit-with-comment-page';

const testId = (suffix: string) => ({ testId: `${ROOT}__${suffix}` });

type State = {
  comment: string;
};

export type Props = Readonly<{
  avatarUrl: string;
  title: string;
  submitLabel: string;
  type?: string;
  onClickBack: () => void;
  onClickSubmit: (comment: string) => void;
  getBackLabel: () => string;
}>;

export default class SubmitWithCommentPage extends React.PureComponent<
  Props,
  State
> {
  state = { comment: '' };

  onChangeComment = (value: string) => {
    this.setState({ comment: value });
  };

  render() {
    return (
      <Wrapper className={ROOT}>
        <Navigation
          title={this.props.title}
          backButtonLabel={this.props.getBackLabel()}
          onClickBack={this.props.onClickBack}
        />
        <section className="main-content">
          <Person
            className={`${ROOT}__person-area`}
            src={this.props.avatarUrl}
          />
          <TextArea
            {...testId('comment')}
            onChange={(e: any) => {
              this.onChangeComment(e.target.value);
            }}
            value={this.state.comment}
            placeholder={msg().Appr_Lbl_Comments}
            rows={4}
            maxLength={1000}
          />
          <Button
            className={`${ROOT}__action`}
            priority="primary"
            variant="neutral"
            {...testId('submit-button')}
            onClick={() => this.props.onClickSubmit(this.state.comment)}
          >
            {this.props.submitLabel}
          </Button>
        </section>
      </Wrapper>
    );
  }
}
