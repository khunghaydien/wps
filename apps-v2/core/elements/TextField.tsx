import React from 'react';
import TextAreaAutoSize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize';

import styled from 'styled-components';

import { Color } from '../styles';

type TextAreaProps = Omit<TextareaAutosizeProps, 'children' | 'ref' | 'as'>;

interface Props extends TextAreaProps {
  'data-testid'?: string;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number) => void;
  useCacheForDOMMeasurements?: boolean;
  readOnly?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const StyledTextArea = styled(TextAreaAutoSize)`
  background: #fff;
  border: 1px solid ${Color.border3};
  padding: 6px 12px 6px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  resize: none;
  outline: none;
  overflow: auto;
  width: 100%;

  :focus,
  :active {
    border: 1px solid ${Color.accent};
    box-shadow: 0 0 3px #0070d2;
  }

  :read-only {
    border: 1px solid ${Color.bgDisabled};
    background: #eee;
    box-shadow: none;
  }

  :disabled {
    color: #999;
    border: 1px solid ${Color.bgDisabled};
    background: #eee;
    box-shadow: none;
  }

  ::placeholder {
    color: #999;
  }

  &[resize='both'] {
    resize: both;
  }
  &[resize='horizontal'] {
    resize: horizontal;
  }
  &[resize='vertical'] {
    resize: vertical;
  }
  &[resize='none'] {
    resize: none;
  }
`;

const TextField: React.FC<Props> = (props: Props) => {
  return <StyledTextArea {...props} />;
};

TextField.defaultProps = {
  readOnly: false,
} as Partial<Props>;

export default TextField;
