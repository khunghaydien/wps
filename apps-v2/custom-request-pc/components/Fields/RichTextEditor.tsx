import React, { useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';

import classNames from 'classnames';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

import styled from 'styled-components';

import Error from './Error';
import Label from './Label';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

type Props = {
  label: string;
  error: string;
  name: string;
  value: string;
  readOnly?: boolean;
  required?: boolean;
};

const FONT_SIZE_LIST = [8, 9, 10, 11, 12, 14, 16, 18, 21, 24, 36, 48, 60, 72];
const FONT_FAMILY_LIST = [
  'Salesforce Sans',
  'Arial',
  'Georgia',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Verdana',
];

const S = styled.div`
  .slds-input {
    padding: unset;
  }
  // Styling same as SF components
  .rdw-editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    white-space: nowrap;
    position: relative;
    padding: var(--lwc-spacingXSmall, 0.5rem) var(--lwc-spacingXSmall, 0.5rem)
      var(--lwc-spacingXxSmall, 0.25rem) var(--lwc-spacingXSmall, 0.5rem);
    border-top-left-radius: var(--lwc-borderRadiusMedium, 0.25rem);
    border-top-right-radius: var(--lwc-borderRadiusMedium, 0.25rem);
    border-bottom: var(--lwc-borderWidthThin, 1px) solid
      var(--lwc-colorBorder, rgb(221, 219, 218));
    background-color: var(--lwc-colorBackground, rgb(243, 242, 242));
  }
  .rdw-editor-main {
    padding: 0 1rem 0 0.75rem;
  }
  .rdw-option-wrapper {
    height: 30px;
  }
  .rte-font-family {
    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
  }
  .rte-inline,
  .rte-text-align,
  .rte-list {
    margin: 0 4px;
    margin-bottom: unset;
    .rdw-option-wrapper {
      margin: unset;
    }
  }
  .DraftEditor-editorContainer {
    z-index: 0;
  }
`;

const Component = (props: Props) => {
  const { label, value: html, readOnly } = props;
  const setFieldValue = get(useFormikContext(), 'setFieldValue');
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (html) {
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  const onChange = (value) => {
    setEditorState(value);
    setFieldValue(
      props.name,
      draftToHtml(convertToRaw(value.getCurrentContent()))
    );
  };

  return (
    <S className="slds-rich-text">
      <Label text={label} required={props.required} />
      <div className={classNames('slds-input', { 'no-value': !html })}>
        <Editor
          editorState={editorState}
          onEditorStateChange={onChange}
          readOnly={readOnly}
          toolbar={{
            options: [
              'fontFamily',
              'fontSize',
              'colorPicker',
              'inline',
              'list',
              'textAlign',
              'link',
            ],
            fontFamily: {
              options: FONT_FAMILY_LIST,
              className: 'rte-font-family',
            },
            fontSize: {
              options: FONT_SIZE_LIST,
              className: 'rte-font-size',
            },
            colorPicker: {
              className: 'rte-color-picker',
            },
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
              className: 'rte-inline',
            },
            list: {
              className: 'rte-list',
            },
            textAlign: {
              className: 'rte-text-align',
            },
            link: {
              className: 'rte-link',
            },
          }}
        />
      </div>
      {props.error && <Error text={props.error} />}
    </S>
  );
};

export default Component;
