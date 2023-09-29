import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';

import ResizeObserver from 'resize-observer-polyfill';

import { TIME_TRACK_REQUEST } from '@commons/constants/customEventSource';

import { LinkButton } from '@apps/core';
import msg from '@commons/languages';

import STATUS from '@apps/domain/models/approval/request/Status';

import HistoryDialog from '../../containers/HistoryDialogContainer';
import RequestDialog from '../../containers/RequestDialogContainer';
import Navigation from '../../containers/TrackSummary/NavigationContainer';
import SubmitButton from '../../containers/TrackSummary/SubmitButtonContainer';

import OpenButton from '../molecules/OpenButton';
import {
  Body,
  Card,
  Divider,
  Header,
  HeaderGroup,
  HeaderItem,
  Title,
} from './Card';
import { Row } from './Layout';
import { RequestProps } from './Props';
import StatusLabel from './StatusLabel';
import Summary, { Column } from './Summary';
import WorkHours from './WorkHours';

const useMeasureHeight = () => {
  const ref = useRef();
  const [height, setHeight] = useState(0);
  const [observer] = useState(
    new ResizeObserver(([dom]) => setHeight(dom.contentRect.height))
  );
  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return (): void => observer.disconnect();
  }, [observer]);
  return [ref, height] as const;
};

const Expand = (props: { trigger: boolean; children: ReactNode }) => {
  const [ref, viewHeight] = useMeasureHeight();

  const frame = {
    from: {
      height: 0,
      opacity: 0,
      transform: 'translate3d(0, -50px, 0)',
    },
    to: {
      height: viewHeight,
      opacity: 1,
      transform: `translate3d(0, 0px, 0)`,
    },
  };
  const style = useSpring(
    props.trigger
      ? {
          from: frame.from,
          to: frame.to,
        }
      : {
          from: frame.to,
          to: frame.from,
        }
  );

  return (
    <animated.div style={{ ...style, display: 'inherit' }}>
      <div ref={ref}>{props.children}</div>
    </animated.div>
  );
};

const Request = (
  props: RequestProps & {
    disableMotion?: boolean;
    isOpen: boolean;
    onClickOpen: () => void;
  }
) => {
  const ExpandMotion = props.disableMotion
    ? ({ children }: Record<string, any>) => <div>{children}</div>
    : Expand;

  return (
    <Card>
      <Header>
        <Title>{msg().Time_Lbl_TrackSummaryTitle}</Title>
        <HeaderGroup>
          <HeaderItem>
            {props.useRequest && <StatusLabel status={props.status} />}
          </HeaderItem>
          <HeaderItem>
            {props.useRequest && props.status !== STATUS.NotRequested && (
              <LinkButton onClick={props.openHistoryDialog}>
                {msg().Com_Lbl_ApprovalHistory}
              </LinkButton>
            )}
          </HeaderItem>
        </HeaderGroup>
        <HeaderGroup right>
          <HeaderItem>
            <WorkHours data={props.data} headline />
          </HeaderItem>
          <HeaderItem>
            <OpenButton
              disableMotion={props.disableMotion}
              isOpen={props.isOpen}
              onClick={props.onClickOpen}
            />
          </HeaderItem>
        </HeaderGroup>
      </Header>
      <RequestDialog source={TIME_TRACK_REQUEST} />
      <HistoryDialog />
      {props.isOpen && <Divider />}
      <ExpandMotion trigger={props.isOpen}>
        {props.isOpen && (
          <Body>
            <Row height={props.isOpen ? 'auto' : 0}>
              <Row noMargin>
                <Navigation />
              </Row>

              {props.useRequest && <SubmitButton />}
            </Row>
            <Row noMargin align="start" height={props.isOpen ? 'auto' : 0}>
              <Summary data={props.data} column={Column.Request} />
            </Row>
          </Body>
        )}
      </ExpandMotion>
    </Card>
  );
};

export default Request;
