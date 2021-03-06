import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import logo from '../logo.png';
import logoNested from '../checklist-logo.png';
import style from '../../nested-checklists/create-nested-checklist/css/CreateNestedChecklist.module.css';
import styles from './MainPage.module.css';

const ShowListOfCheckList = (props) => {
  const countingItems = (checklist) => {
    const howMuchItems = checklist.reduce((acc, current) => acc + current.items_data.length, 0);
    const msg = howMuchItems === 1 || howMuchItems === 0 ? `${howMuchItems} item` : `${howMuchItems} items`;
    return msg;
  };

  const showCreationData = data => `Created: ${data.slice(0, 10).split('-').reverse().join('/')}`;
  const { data, removeChecklist, createNestedPage, showNestedPage } = props;
  if (data) {
    return (
      data.map(currentCheckList => (
        <div
          key={currentCheckList.id || currentCheckList._id}
          className={createNestedPage ? style.checkListLinkWrapper : styles.checkListLinkWrapper}
        >
          <Link
            to={!currentCheckList.checklists_data ? `/${currentCheckList.slug}` : `/nested-checklist/${currentCheckList.slug}`}
            className={styles.checkListLink}
            target={createNestedPage && '_blank'}
          >
            <div className={styles.imageContainer}>
              <div>
                <img
                  src={!currentCheckList.checklists_data ? logo : logoNested}
                  alt="checklist-logo"
                  className={showNestedPage || createNestedPage ? [styles.checklistLogo, style.checklistLogo].join(' ') : styles.checklistLogo}
                />
              </div>
            </div>
            <div className={styles.checkListInfo}>
              <div className={styles.titleAndAuthor}>
                <div className={styles.title}>
                  {currentCheckList.title}
                </div>
                <div className={styles.author}>
                  {currentCheckList.author === null ? 'User was deleted' : currentCheckList.author.username}
                </div>
              </div>
              <div className={styles.checkListAmount}>
                <div>
                  {currentCheckList.sections_data
                    ? countingItems(currentCheckList.sections_data)
                    : `${currentCheckList.checklists_data.length} checklists`}
                </div>
                <div>
                  {showCreationData(currentCheckList.creation_date)}
                </div>
              </div>
            </div>
          </Link>
          {removeChecklist
            && (
              <div className={style.removeBtn}>
                <Button
                  icon
                  onClick={() => removeChecklist(currentCheckList.id)}
                >
                  <Icon name="trash alternate" color="red" />
                </Button>
              </div>
            )
          }
        </div>
      ))
    );
  }
  return null;
};

export default ShowListOfCheckList;
