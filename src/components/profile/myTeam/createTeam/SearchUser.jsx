import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { debounce } from 'throttle-debounce';
import { connect } from 'react-redux';
import http from '../../../../api/http';
import { addSelectedUser, changeSuggestionState } from '../../../../actions/selectUserAction';
import SuggestionSearch from './Suggestion';
import styles from './createModal.module.css';


const getUsers = (setState, searchUsersValue, changeState, creator) => {
  http.get(`api/team/searchUsers/searchUsers=${searchUsersValue}`)
    .then((res) => {
      setState(res.data.filter(currentUser => currentUser._id !== creator));
      changeState(true);
    });
};

const SearchUser = (props) => {
  const { changeSuggestionState, userData } = props;
  const [data, setData] = useState(null);

  const onChangeUser = debounce(500, (text) => {
    if (text === '') {
      changeSuggestionState(false);
      return false;
    }
    getUsers(setData, text, changeSuggestionState, userData._id);
  });
  return (
    <div className={styles.findMembersContainer}>
      <h2>Find your teammates</h2>
      <div className={styles.searchContainer}>
        <input placeholder="Search for members..." className={styles.searchUserInput} onChange={e => onChangeUser(e.target.value)} />
        <div className={styles.searchIcon}>
          <Icon name="search" size="large" />
        </div>
      </div>
      <SuggestionSearch data={data} />
    </div>
  );
};

const mapStateToProps = ({ selectedUsers, user }) => (
  {
    arrayOfSelectedUsers: selectedUsers.arrayOfSelectedUsers,
    showSuggestion: selectedUsers.showSuggestion,
    searchUserValue: selectedUsers.searchUserValue,
    userData: user.userData,
  });

const mapDispatchToProps = dispatch => ({
  addSelectedUser: (arrayOfSelectedUsers) => {
    dispatch(addSelectedUser(arrayOfSelectedUsers));
  },
  changeSuggestionState: (showSuggestion) => {
    dispatch(changeSuggestionState(showSuggestion));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);
