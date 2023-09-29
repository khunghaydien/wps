import React, { useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import IconAdd from '../../../psa-pc/images/icons/add.svg';
import { default as EmployeeLink, LinkStateProps } from './EmployeeLink';

import './index.scss';

const ROOT = 'admin-pc-details__link';

type Props = {
  tmpEditRecord: Record<string, any>;
  editRecord: Record<string, any>;
  onChangeDetailItem: (key: string, value: any) => void;
  isDisabled: boolean;
};

const EmployeeProfileLinks = (props: Props) => {
  // Always init from tmpEditRecord.
  // If tmpEditRecord is empty (initial get capacity ID), init from editRecord
  const tmpLinks = props.tmpEditRecord.links;
  const savedLinks = props.editRecord.links;
  const savedLinkState = tmpLinks || savedLinks;

  const newLink: LinkStateProps = {
    name: '',
    url: '',
  };

  const getInitialLinkStateFromRecords = () => {
    // if there's anything from editRecord or tmpEditRecord, init from there.
    if (savedLinkState && savedLinkState.length !== 0) {
      return cloneDeep(savedLinkState);
    } else {
      // initialise from empty state
      return [newLink];
    }
  };

  const initialLink: Array<LinkStateProps> = getInitialLinkStateFromRecords();
  const [links, setLinks] = useState(initialLink);
  const [isDialogVisible, setDialogVisibility] = useState(false);

  const closeDialog = () => {
    setDialogVisibility(false);
  };

  const openDialog = () => {
    setDialogVisibility(true);
    setLinks(getInitialLinkStateFromRecords());
  };

  const validateUrl = (url) => {
    const urlRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    return urlRegex.test(url);
  };

  const validateLinks = () => {
    let isValid = true;

    const validatedLinks: Array<LinkStateProps> = links.map(({ name, url }) => {
      const isNameEmpty = !name;
      const isUrlEmpty = !url;
      const isBothFieldsEmpty = isNameEmpty && isUrlEmpty;
      const isUrlValid = isUrlEmpty ? true : validateUrl(url);

      const errors = {
        name: '',
        url: '',
      };

      if (!isBothFieldsEmpty) {
        if (isNameEmpty) {
          errors.name = msg().Com_Lbl_Required;
          isValid = false;
        }

        if (isUrlEmpty) {
          errors.url = msg().Com_Lbl_Required;
          isValid = false;
        }
      }

      if (!isUrlValid) {
        errors.url = msg().Admin_Err_LinkInvalid;
        isValid = false;
      }

      return {
        name,
        url,
        errors: isValid ? null : errors,
      };
    });

    setLinks(validatedLinks);

    return {
      isValid,
      validatedLinks,
    };
  };

  const saveAndCloseDialog = () => {
    const { isValid, validatedLinks } = validateLinks();
    if (isValid) {
      const notEmptyLinks = validatedLinks.filter(
        (link) => link.name && link.url
      );
      props.onChangeDetailItem('links', notEmptyLinks);
      closeDialog();
    }
  };

  const cancelAndCloseDialog = () => {
    // reset from tmpEditRecord
    if (
      links.length === 1 &&
      links[0].name === '' &&
      links[0].url === '' &&
      savedLinkState.length === 1 &&
      savedLinkState[0].name === '' &&
      savedLinkState[0].url === ''
    ) {
      setLinks([]);
    } else setLinks(savedLinkState);
    closeDialog();
  };

  const addLink = () => {
    const updatedState = [...links];
    updatedState.push(newLink);
    setLinks(updatedState);
  };

  const removeLink = (i) => () => {
    let updatedState = [...links];
    updatedState.splice(i, 1);
    if (updatedState.length === 0) {
      updatedState = [newLink];
    }
    setLinks(updatedState);
  };

  const updateLinkProperty = (i, key) => (e) => {
    const updatedState = [...links];
    updatedState[i][key] = e.target.value;
    setLinks(updatedState);
  };

  const isAddLinksDisabled = links.length === 5;

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__btn-container`}>
        <p>
          {savedLinkState.length === 0 && msg().Admin_Lbl_LinkNoItemInTheSet}
        </p>
        <Button
          type="secondary"
          disabled={props.isDisabled}
          className={`${ROOT}__add-links`}
          onClick={openDialog}
        >
          {msg().Psa_Lbl_ManageLinks}
        </Button>
      </div>
      {savedLinkState.length !== 0 && (
        <div className={`${ROOT}__read-only-links`}>
          {savedLinkState &&
            savedLinkState.map((_, index) => (
              <EmployeeLink linkState={savedLinkState[index]} readOnly />
            ))}
        </div>
      )}
      {isDialogVisible && (
        <DialogFrame
          className={`${ROOT}__dialog`}
          title={msg().Psa_Lbl_ManageLinks}
          hide={closeDialog}
          footer={
            <DialogFrame.Footer>
              <Button
                className={`${ROOT}__add-links--dialog`}
                onClick={addLink}
                disabled={isAddLinksDisabled}
              >
                <IconAdd className={`${ROOT}__add-links-icon`} />
                <span className={`${ROOT}__add-links-text`}>
                  {msg().Psa_Lbl_AddLinks}
                </span>
              </Button>
              <div className={`${ROOT}__right`}>
                <Button
                  className={`${ROOT}__button`}
                  onClick={cancelAndCloseDialog}
                >
                  {msg().Com_Btn_Cancel}
                </Button>
                <Button
                  className={`${ROOT}__button ${ROOT}__add-button`}
                  onClick={saveAndCloseDialog}
                >
                  {msg().Com_Btn_Save}
                </Button>
              </div>
            </DialogFrame.Footer>
          }
        >
          {links.length !== 0 &&
            links.map((_, index) => (
              <EmployeeLink
                updateName={updateLinkProperty(index, 'name')}
                updateUrl={updateLinkProperty(index, 'url')}
                removeLink={removeLink(index)}
                linkState={links[index]}
              />
            ))}
        </DialogFrame>
      )}
    </div>
  );
};

export default EmployeeProfileLinks;
