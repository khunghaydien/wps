import * as React from 'react';
import { ReactElement } from 'react';

import chunk from 'lodash/fp/chunk';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';

import styled from 'styled-components';

import { Color } from '../../../core/styles';

type Props = Readonly<{
  dates: ReadonlyArray<Date>;
  DaysView?: React.ComponentType<{
    dates: Date[];
    className: string;
  }>;
  DatesView?: React.ComponentType<{
    weekDates: Date[];
    className: string;
  }>;
  WeekView?: React.ComponentType<{
    role?: string;
    weekDates: Date[];
  }>;
}>;

const Main = styled.div`
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Grid: React.ComponentType<{
  grow?: boolean;
  role?: string;
  children: React.ReactNode;
}> = styled.div<{
  grow: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: ${(props): number => (props.grow ? 1 : 0)};
  min-height: 24px;
`;

const GridRow = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  flex: 1 1 0%;
  border: none;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
`;

const GridCells = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex: 1 1 0%;
  height: 100%;
  width: 100%;
`;

const Layer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const DefaultBox: React.ComponentType<Record<string, unknown>> = styled.div`
  border: dashed 1px ${Color.border1};
  height: 100%;
  width: 100%;
`;

const DefaultDay = styled(DefaultBox)``;

const DefaultDays = (): ReactElement => {
  return (
    <>
      {[...new Array(7)].map((_v, index) => (
        <DefaultDay>{index}</DefaultDay>
      ))}
    </>
  );
};

const DefaultDate = styled(DefaultBox)`
  height: 112px;
`;

const DefaultDates = ({
  weekDates,
}: {
  weekDates: ReadonlyArray<Date>;
}): ReactElement => {
  return (
    <>
      {weekDates.map((date) => (
        <DefaultDate>{date.getDate()}</DefaultDate>
      ))}
    </>
  );
};

const Template: React.FC<Props> = ({
  dates,
  DaysView = DefaultDays,
  DatesView = DefaultDates,
  WeekView,
}: Props) => (
  <Main role="grid">
    <Grid role="row">
      <GridRow role="presentation">
        <GridCells role="columnheader" as={DaysView as any} />
      </GridRow>
    </Grid>
    <Grid role="presentation" grow>
      {flow(
        chunk(7),
        map((dateList: Date[]) => (
          <GridRow role="row">
            <GridCells aria-hidden as={DatesView as any} weekDates={dateList} />
            <GridCells role="presentation" as={Layer}>
              {WeekView && <WeekView role="gridcell" weekDates={dateList} />}
            </GridCells>
          </GridRow>
        ))
      )([...dates])}
    </Grid>
  </Main>
);

export default Template;
