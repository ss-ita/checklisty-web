/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Container, Segment, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { SuccessHandling, ErrorHandling } from '../../toasters/MessagesHandling';
import http from '../../../api/http';
import ListItem from './ListItem';
import ListStatistic from './ListsStatistic';
import NoLists from './NoLists';
import PaginationPage from './PaginationPage';

const MyList = (props) => {
  const user = props.userData;
  const pageLimit = 5;
  let totalRecords = 0;
  let totalPages = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [checklists, setChecklists] = useState(null);
  const [currentChecklists, setCurrentChecklists] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const getLists = async () => {
      try {
        const { data } = await http.get(`/api/checklists/author=${user._id}`);
        if (data.length) setChecklists(data);
        setLoading(false);
      } catch (error) {
        ErrorHandling(error.response.data.message);
      }
    };

    getLists();
  }, []);

  if (checklists && checklists.length) {
    totalRecords = searching ? filtered.length : checklists.length;
    totalPages = Math.ceil(totalRecords / pageLimit);
  }

  const changePage = (page, currentList) => {
    const lists = searching
      ? currentList || filtered
      : currentList || checklists;

    if (Math.ceil(lists.length / pageLimit) < page) {
      const offset = (page - 2) * pageLimit;
      const paginatedLists = lists.slice(offset, offset + pageLimit);

      setCurrentChecklists(paginatedLists);
    } else {
      const offset = (page - 1) * pageLimit;
      const paginatedLists = lists.slice(offset, offset + pageLimit);

      setCurrentChecklists(paginatedLists);
    }
  };

  useEffect(() => {
    changePage(currentPage, filtered);
  }, [filtered]);

  const deleteList = (id) => {
    try {
      http.delete(`/api/checklists/${id}`).then((res) => {
        const updatedChecklists = checklists.filter(list => id !== list.id);
        setChecklists(updatedChecklists);
        changePage(currentPage, updatedChecklists);
        SuccessHandling(res.data.message);
      });
    } catch (error) {
      ErrorHandling(error.response.data.message);
    }
  };

  if (loading) {
    return (
      <Loader active inline="centered" size="large" content="Loading..." />
    );
  }
  return !checklists ? (
    <NoLists />
  ) : (
    <Container>
      <ListStatistic
        setFiltered={setFiltered}
        setSearching={setSearching}
        lists={checklists}
      />
      <Segment>
        <ListItem lists={currentChecklists} del={deleteList} />
      </Segment>
      <Segment.Inline style={{ textAlign: 'center' }}>
        <PaginationPage
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          changePage={changePage}
        />
      </Segment.Inline>
    </Container>
  );
};

const mapStateToProps = ({ user }) => ({
  userData: user.userData,
});

export default connect(mapStateToProps)(MyList);
