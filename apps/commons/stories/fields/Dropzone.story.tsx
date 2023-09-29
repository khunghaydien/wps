import * as React from 'react';

import { action } from '@storybook/addon-actions';

import Component from '../../components/fields/Dropzone';

interface FCStory extends React.FC {
  storyName?: string;
}
const withState = (WrappedComponent) =>
  class extends React.Component<any, any> {
    state = {
      files: [],
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onDropAccepted={(files, event) => {
            this.props.onDropAccepted(files, event);
            this.setState({ files });
          }}
          onClickDelete={() => {
            this.props.onClickDelete();
            this.setState({ files: [] });
          }}
        />
      );
    }
  };
const Dropzone = withState(Component);

export default {
  title: 'commons/fields',
  parameters: {
    info: {
      inline: true,
      propTables: [Dropzone],
      text: `
          # Description

          Dropzone for file upload.
        `,
    },
  },
};

export const _Dropzone: FCStory = () => (
  <Dropzone
    files={[]}
    onDropAccepted={action('onDropAccepted')}
    onDropRejected={action('onDropRejected')}
    onClickDelete={action('onClickDelete')}
  />
);

_Dropzone.storyName = 'Dropzone';
