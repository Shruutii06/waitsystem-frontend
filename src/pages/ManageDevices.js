import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useMemo, useState } from 'react';
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
  CssBaseline,
  useTheme,
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
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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
    return filter(array, (_user) => _user?.location?.name?.toLowerCase()?.includes(query.toLowerCase()) || false);
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
  const poles = useSelector(({ pole }) => pole.poles);
  const theme = useTheme();
  const [poleFetchingError, setPoleFetchingError] = useState(false);
  const [editData, setEditData] = useState();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  useEffect(() => {
    if (!places?.length) {
      dispatch(FetchAllPlaces());
    }
  }, [places, dispatch]);

  const fetchPoles = () => {
    setPoleFetchingError(false);
    dispatch(
      FetchAllPoles({
        payload: { fetchjunctions: true },
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
          if (typeof recall === 'function') {
            recall();
          }
        },
      })
    );
  };

  useEffect(() => {
    if (!poles?.length) fetchPoles();
  }, [poles, dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => setFilterName(event.target.value);

  const filteredPoles = useMemo(
    () => applySortFilter(poles || [], getComparator(order, orderBy), filterName),
    [poles, order, orderBy, filterName]
  );

  const isUserNotFound = filteredPoles.length === 0;

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
                });
              } else if (typeof recall === 'function') {
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
                toast.error(typeof data === 'string' ? data : 'Error editing pole details', {
                  position: 'top-right',
                  autoClose: 5000,
                });
              } else if (typeof recall === 'function') {
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

  return (
    <Page title="Manage Devices">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" mt={0} mb={3} color={theme.palette.text.primary}>
            Manage Devices
          </Typography>
          <AddPoleDialogBox />
          {editData && <AddPoleDialogBox data={editData} callback={poleActions} setEditData={setEditData} />}
        </Stack>

        <Card sx={{ backgroundColor: 'background.default.light' }}>
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
                            backgroundColor: (() => {
                              if (theme.palette.mode === 'light') {
                                return index % 2 === 0 ? '#e6f2ff' : '#ffe9a6';
                              } 
                                return index % 2 === 0 ? '#002a51' :' #9a7400';
                              
                            })(),
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
