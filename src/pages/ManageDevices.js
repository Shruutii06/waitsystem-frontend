import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Skeleton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import AddPoleDialogBox from '../components/AddPoleDialogBox';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import { FetchAllPlaces } from '../redux/locationReducer';
import { DeletePole, FetchAllPoles, EditPole } from '../redux/PolesReducer';

const TABLE_HEAD = [
  { id: 'name', label: 'Serial No.', alignRight: false },
  { id: 'company', label: 'Latitude', alignRight: false },
  { id: 'role', label: 'Longitude', alignRight: false },
  { id: 'isVerified', label: 'Location', alignRight: false },
  { id: 'status', label: 'Health Status', alignRight: false },
  { id: 'addedBy', label: 'Added By', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.location.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function ManageDevices() {
  const [page, setPage] = useState(0);
  const navigation = useNavigate();
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const places = useSelector(({ location }) => location.Places);

  useEffect(() => {
    if (!places || !places.length) {
      dispatch(
        FetchAllPlaces({
          callback: (msg, data, recall) => {
            recall();
          },
        })
      );
    }
  }, []);

  const poles = useSelector(({ pole }) => pole.poles);
  const [poleFetchingerror, setPoleFetchingError] = useState(false);

  const FetchPoles = () => {
    setPoleFetchingError(false);
    dispatch(
      FetchAllPoles({
        payload: {
          fetchjunctions: true,
        },
        callback: (msg, data, recall) => {
          if (msg === 'error') {
            toast.error(typeof data === 'string' ? data : 'Something went wrong', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setPoleFetchingError(true);
          }
          recall();
        },
      })
    );
  };

  useEffect(() => {
    if (!poles || !poles?.length) {
      FetchPoles();
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [editData, setEditData] = useState();

  const poleActions = (type, data) => {
    switch (type) {
      case 'DELETE':
        dispatch(
          DeletePole({
            payload: data,
            callback: (msg, data, recall) => {
              if (msg === 'error') {
                toast.error('Could not delete pole', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                recall();
              }
            },
          })
        );
        break;
      case 'EDIT':
        setEditData(data);
        break;
      case 'EDIT_DONE':
        setEditData(null);
        dispatch(
          EditPole({
            payload: data,
            callback: (msg, data, recall) => {
              if (msg === 'error') {
                toast.error(typeof data === 'string' ? data : 'Error in editing pole details', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                recall();
              }
            },
          })
        );
        break;
      default:
        break;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filterPoles = (poles) => {
    if (!Array.isArray(poles)) return null;
    return poles?.filter(
      (pole) =>
        pole.serialno.toLowerCase().includes(filterName.toLowerCase()) ||
        pole.location.name.toLowerCase().includes(filterName.toLowerCase())
    );
  };

  const filteredPoles = filterPoles(poles);
  const isUserNotFound = filteredPoles && filteredPoles.length === 0;

  return (
    <Page title="Manage Devices" >
      <Container >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} >
          <Typography variant="h3" gutterBottom>
            Manage Devices
          </Typography>
          <AddPoleDialogBox />
          {editData && <AddPoleDialogBox data={editData} callback={poleActions} setEditData={setEditData} />}
        </Stack>

        <Card sx={{ backgroundColor: ' #FFFBEE' }}>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredPoles?.length || 0}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                {filteredPoles ? (
                  <TableBody>
                    {filteredPoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      const { _id, latitude, longitude, serialno, healthStatus, location, addedBy } = row;
                      const status = healthStatus === '1' ? 'good' : 'bad';
                      return (
                        <TableRow
                          hover
                          key={index}
                          tabIndex={-1}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: index % 2 === 0 ? '#e6f3ff' : '#ffe9a6',
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            onClick={() => navigation(`/dashboard/pole/${_id}`, { replace: false })}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography sx={{ ml: 3 }} variant="subtitle2" noWrap>
                                {'#'} {serialno}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" onClick={() => navigation(`/dashboard/pole/${_id}`, { replace: false })}>
                            {latitude}
                          </TableCell>
                          <TableCell align="left" onClick={() => navigation(`/dashboard/pole/${_id}`, { replace: false })}>
                            {longitude}
                          </TableCell>
                          <TableCell
                            sx={{ textTransform: 'capitalize' }}
                            align="left"
                            onClick={() => navigation(`/dashboard/pole/${_id}`, { replace: false })}
                          >
                            {location.name}
                          </TableCell>
                          <TableCell align="left" onClick={() => navigation(`/dashboard/pole/${_id}`, { replace: false })}>
                            <Label variant="ghost" color={(status === 'bad' && 'error') || 'success'}>
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>
                          <TableCell align="left" onClick={() => navigation(`/dashboard/pole/${_id}`, { replace: false })}>
                            {addedBy || 'N/A'}
                          </TableCell>
                          <TableCell align="right">
                            <UserMoreMenu callback={poleActions} data={row} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredPoles.length < rowsPerPage && (
                      <TableRow style={{ height: 53 * (rowsPerPage - filteredPoles.length) }}>
                        <TableCell colSpan={7} />
                      </TableRow>
                    )}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 1 }}>
                        <Skeleton variant="rectangular" width="100%" height={53} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                          

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPoles ? filteredPoles.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ManageDevices;

