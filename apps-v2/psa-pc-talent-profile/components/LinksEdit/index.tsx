import React, { useEffect, useState } from 'react';

import IconButton from '@apps/commons/components/buttons/IconButton';
import TextField from '@apps/commons/components/fields/TextField';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import DeleteIcon from '@apps/commons/images/icons/iconTrash.svg';
import msg from '@apps/commons/languages';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

const ROOT = 'ts-psa__talent-profile__link-edit';

type Props = {
  validationError: any;
  userLinks: Array<any>;
  onAddNewLink: () => void;
  onUpdateLinks: (userLinks: Array<any>) => void;
};

const LinksEdit = (props: Props) => {
  const [links, setLinks] = useState(props.userLinks);

  useEffect(() => {
    setLinks(props.userLinks);
  }, [props.userLinks]);

  const onClickDeleteLink = (idx: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(idx, 1);
    setLinks(updatedLinks);
    props.onUpdateLinks(updatedLinks);
  };
  const onUpdateLink = (idx: number, id: string, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[idx][id] = value;
    setLinks(updatedLinks);
    props.onUpdateLinks(updatedLinks);
  };
  const generateHeaderTitle = () => {
    return (
      <MultiColumnsGrid
        className={`${ROOT}__header-title`}
        sizeList={[3, 8, 1]}
      >
        <div className={`${ROOT}__header-title-column`}>
          {msg().Psa_Lbl_Name}
        </div>
        <div className={`${ROOT}__header-title-column`}>
          {msg().Psa_Lbl_LinkUrl}
        </div>
        <div className={`${ROOT}__header-title-column`}></div>
      </MultiColumnsGrid>
    );
  };
  const generateLinkRow = (idx: number, linkItem: any) => {
    const { validationError } = props;
    return (
      <div className={`${ROOT}__row`}>
        <MultiColumnsGrid className={`${ROOT}__link-item`} sizeList={[3, 8, 1]}>
          <div className={`${ROOT}__link-item-column`}>
            <TextField
              disabled={false}
              onChange={(e) => {
                onUpdateLink(idx, 'name', e.target.value);
              }}
              value={linkItem.name}
              className={
                validationError[idx] && validationError[idx].name
                  ? 'has-error'
                  : ''
              }
            />
            {validationError[idx] && validationError[idx].name && (
              <p className={`${ROOT}__error`}>
                {msg()[validationError[idx].name]}
              </p>
            )}
          </div>
          <div className={`${ROOT}__link-item-column`}>
            <TextField
              disabled={false}
              onChange={(e) => {
                onUpdateLink(idx, 'url', e.target.value);
              }}
              value={linkItem.url}
              className={
                validationError[idx] && validationError[idx].url
                  ? 'has-error'
                  : ''
              }
            />
            {validationError[idx] && validationError[idx].url && (
              <p className={`${ROOT}__error`}>
                {msg()[validationError[idx].url]}
              </p>
            )}
          </div>
          <div className={`${ROOT}__link-item-delete`}>
            <IconButton
              src={DeleteIcon}
              srcType="svg"
              className={`${ROOT}__button--delete ts-button`}
              data-testid={`${ROOT}__button--delete`}
              onClick={() => onClickDeleteLink(idx)}
            />
          </div>
        </MultiColumnsGrid>
      </div>
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>
        {msg().Psa_Lbl_ManageLinks}
        <div className={`${ROOT}__add-button`} onClick={props.onAddNewLink}>
          <IconAdd className={`${ROOT}__add-button__icon`} />
        </div>
      </div>
      <div className={`${ROOT}__subheader`}>{generateHeaderTitle()}</div>
      <div className={`${ROOT}__link-divider`}></div>
      <div className={`${ROOT}__editable-links`}>
        {links && links.map((item, idx) => generateLinkRow(idx, item))}
      </div>
    </div>
  );
};

export default LinksEdit;
