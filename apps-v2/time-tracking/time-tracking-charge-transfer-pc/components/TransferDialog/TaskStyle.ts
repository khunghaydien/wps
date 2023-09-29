import styled from 'styled-components';

const S = {
  Task: styled.div`
    display: flex;
    align-content: center;
  `,
  Job: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 270px;
    margin: 0 40px 0 0;
  `,
  JobCode: styled.span`
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  JobName: styled.span`
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  WorkCategory: styled.div`
    display: flex;
    align-items: center;
    width: 272px;
  `,
};

export default S;
