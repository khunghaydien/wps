import React, { FC, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import styled from 'styled-components';

import IconBurgerMenu from '@psa/images/icons/burgerMenu.svg';

const MENU = {
  bookmarks: {
    label: 'Bookmarks',
    links: [],
  },
  expense: {
    label: 'Expense',
    links: [
      { name: 'Expense Report', path: '/mobile-app/expense/report/list' },
      { name: 'Expense Request', path: '/mobile-app/request/report/list' },
      { name: 'Expense Approval', path: '/mobile-app/approval/expenses/list' },
      { name: 'Receipt Upload', path: '/mobile-app/expense/receipt/upload' },
    ],
  },
  pages: {
    label: 'Pages',
    links: [
      {
        name: '勤怠打刻 Timestamp',
        path: '/mobile-app?r=attendance/timestamp',
      },
      {
        name: '勤務表 Timesheet Monthly',
        path: '/mobile-app?r=attendance/timesheet-monthly',
      },
      {
        name: '勤務入力 Timesheet Daily',
        path: '/mobile-app?r=attendance/timesheet-daily',
      },
      {
        name: '工数実績 Tracking Monthly',
        path: '/mobile-app?r=tracking/tracking-monthly',
      },
      {
        name: '工数入力 Tracking Daily',
        path: '/mobile-app?r=tracking/tracking-daily',
      },
      {
        name: '承認 Approval（Mobile）',
        path: '/mobile-app/approval/list',
      },
      {
        name: '稟議承認 Custom Request Approval（Mobile）',
        path: '/mobile-app/approval/custom-request/list',
      },
    ],
  },
};

const CurtainMenu: FC = () => {
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const onClick = () => {
    setVisible(true);
  };

  const onDrag = () => {
    setDragging(true);
  };

  const onStop = () => {
    setDragging(false);

    if (!dragging) {
      onClick();
    }
  };

  const addBookmark = () => {
    const label = prompt(
      'This page will be saved as a bookmark, please give it a label name'
    );

    if (label) {
      setBookmarks([
        ...bookmarks,
        {
          name: label,
          path: window.location.pathname,
        },
      ]);
    }
  };

  const removeBookmark = (removeIndex) => () => {
    const updatedBookmarks = [...bookmarks].filter(
      (_, index) => index !== removeIndex
    );

    setBookmarks(updatedBookmarks);
  };

  useEffect(() => {
    try {
      // restore bookmarks from sessionStorage
      const parsedBookmarks = JSON.parse(sessionStorage.getItem('bookmarks'));

      if (parsedBookmarks) {
        setBookmarks(parsedBookmarks);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // set bookmarks to sessionStorage everytime there is changes in bookmarks
    sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const menuItems = {
    ...MENU,
    bookmarks: {
      ...MENU.bookmarks,
      links: bookmarks,
    },
  };

  return (
    <>
      <Draggable onDrag={onDrag} onStop={onStop}>
        <IconBurgerMenuWrapper>
          <IconBurgerMenu />
        </IconBurgerMenuWrapper>
      </Draggable>

      <CurtainMenuContainer $visible={visible} className="overlay">
        <TopRightButtons>
          <TopRightButton onClick={addBookmark}>&#x2B;</TopRightButton>

          <TopRightButton
            className="closebtn"
            onClick={() => setVisible(false)}
          >
            &times;
          </TopRightButton>
        </TopRightButtons>

        <CurtainMenuItems>
          {Object.entries(menuItems).map(([menuKey, { label, links }]) => (
            <AccordionWrapper key={menuKey}>
              {links.length && (
                <details open>
                  <summary>{label}</summary>

                  {links.map(
                    ({ name, path }, index) =>
                      name && (
                        <Row key={path}>
                          <CurtainMenuItem
                            href={`${window.location.origin}${path}`}
                            key={path}
                          >
                            {name}
                          </CurtainMenuItem>
                          {menuKey === 'bookmarks' && (
                            <RemoveBookmarkButton
                              onClick={removeBookmark(index)}
                            >
                              Remove
                            </RemoveBookmarkButton>
                          )}
                        </Row>
                      )
                  )}
                </details>
              )}
            </AccordionWrapper>
          ))}
        </CurtainMenuItems>
      </CurtainMenuContainer>
    </>
  );
};

export default CurtainMenu;

const IconBurgerMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 40px;
  right: 40px;

  width: 40px;
  height: 40px;

  padding: 0px 14px;
  border-radius: 50px;
  z-index: 999;
  text-align: center;
  background-color: #eff7fa;
  box-shadow: rgb(153 153 153) 2px 2px 3px;
`;

const CurtainMenuContainer = styled.div<{ $visible: boolean }>`
  height: 100%;
  width: ${({ $visible }) => ($visible ? '100%' : '0%')};
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
  overflow-x: hidden;
  transition: 0.3s;
  display: flex;
  flex-direction: column;

  a {
    padding: 5px;
    text-decoration: none;
    color: #818181;
    display: block;
    transition: 0.3s;

    :hover {
      color: #f1f1f1;
    }
  }
`;

const TopRightButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 10px;
  height: 50px;
`;

const TopRightButton = styled.a`
  font-size: 6vh;
  text-align: right;

  :hover {
    text-decoration: none;
  }
`;

const AccordionWrapper = styled.div`
  details[open] summary {
    text-decoration: underline;
  }

  summary {
    text-decoration: none;
    color: #f1f1f1;
    display: block;
    transition: 0.3s;
  }

  a {
    text-indent: 10px;
  }
`;

const CurtainMenuItems = styled.div`
  position: relative;
  width: 100%;
  text-align: left;
  padding: 15px;
`;

const CurtainMenuItem = styled.a`
  font-size: 2.2vh;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: normal;
`;

const RemoveBookmarkButton = styled.a``;
