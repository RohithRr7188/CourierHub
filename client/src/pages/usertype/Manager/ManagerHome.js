import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	TextField,
	InputAdornment,
	IconButton,
	Button,
	Snackbar,
	Table,
	TableCell,
	tableCellClasses,
	TableHead,
	TableRow,
	TableBody,
	TableContainer,
	Paper,
	TablePagination,
	FormControl,
	InputLabel,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { UserContext } from "../../../UserContext";
import { readusers, readorders, orderupdate, adduseraccess } from "../../../api/user";
//import icon from '.../public/logo512.png';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const ManagerHome = () => {
	const { usertype } = useContext(UserContext);
	const history = useNavigate();

	const [users, setUsers] = useState([]);
	const [count, setCount] = useState(0);
	const [readuser, setReaduser] = useState("10");
	const [showtable, setShowtable] = useState("1");
	const [refresh, setRefresh] = useState("");

	// pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	// snackbar
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	// search
	// const [search, setSearch] = useState("");

	// const Search = ({ onSearch }) => {
	// 	const [search1, setSearch1] = useState("");
	
	// 	const onInputChange = value => {
	// 		setSearch1(value);
	// 		onSearch(value);
	// 	};
	// 	return (
	// 		<input
	// 			type="text"
	// 			className="form-control"
	// 			style={{ width: "240px" }}
	// 			placeholder="Search"
	// 			value={search1}
	// 			onChange={e => onInputChange(e.target.value)}
	// 		/>
	// 	);
	// };

	// const commentsData = useMemo(() => {
    //     let computedComments = users;

    //     if (search) {
    //         computedComments = computedComments.filter(
    //             (user) =>
    //                 // user.name.toLowerCase().includes(search.toLowerCase()) ||
    //                 user.email.toLowerCase().includes(search.toLowerCase())
    //         );
    //     }
    //     setCount(computedComments.length);

	// 	return computedComments.slice(
    //         (page - 1) * rowsPerPage,
    //         (page - 1) * rowsPerPage + rowsPerPage
    //     );

    // }, [page,search]);

	// update Details
	const [addDriver,setaddDriver] = useState("");
	const [addManager,setaddManager] = useState("");
	const [TrackingID_u,setTrackingID_u] = useState("");
	const [Driver_u,setDriver_u] = useState("");
	const [OrderStatus_u,setOrderStatus_u] = useState("");
	const [Location_u,setLocation_u] = useState("");
	const [buttoncolor,setButtoncolor] = useState("Customers");

	const fetchUsers = async () => {
		try {
			const { users, count, error } = await readusers({
				page: page + 1,
				perPage: rowsPerPage,
				userType: readuser
			});
			if (error) {
				setSnackbarOpen(true);
				setSnackbarMessage(error);
				return;
			}
			// set users
			setUsers(users);
			setCount(count);
			// set snackbar
			setSnackbarOpen(true);
			setSnackbarMessage(`${users?.length} user(s) fetched`);
			// console.log(readuser);
		} catch (error) {
			setSnackbarOpen(true);
			setSnackbarMessage(error.message);
		}
	};

	const fetchOrders = async () => {
		try {
			const { users, count, error } = await readorders({
				page: page + 1,
				perPage: rowsPerPage
			});
			if (error) {
				setSnackbarOpen(true);
				setSnackbarMessage(error);
				return;
			}
			// set users
			setUsers(users);
			setCount(count);
			// set snackbar
			setSnackbarOpen(true);
			setSnackbarMessage(`${users?.length} order(s) fetched`);
		} catch (error) {
			setSnackbarOpen(true);
			setSnackbarMessage(error.message);
		}
	};

	useEffect(() => {
		if(showtable == "4"){
			fetchOrders();
		}
		else{
			fetchUsers();
		}
		
	}, [page, rowsPerPage,showtable,refresh]);

	const handleReadUsers = async (e) => {
		// e.preventDefault();
		await fetchUsers();
	};

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	const handleCusView= async () => {
		setReaduser("10");
		setShowtable("1");
		setButtoncolor('Customers');
	};

	const handleDriverView= async () => {
		setReaduser("20");
		setShowtable("2");
		setButtoncolor('Drivers');
	};

	const handleManagerView= async () => {
		setReaduser("30");
		setShowtable("3");
		setButtoncolor('Managers');
	};

	const handleOrdersView= async () => {
		setReaduser("20");
		setShowtable("4");
		setButtoncolor('Orders');
	};
	
	const handleAddDriver= async (e) => {
		const adduserType = '20';
		const addemail = addDriver;
		const res = await adduseraccess({addemail, adduserType});
			if (res.error) toast.error(res.error);
			else {
				toast.success(res.message);
			}
	};

	const handleAddManager= async (e) => {
		const adduserType = '30';
		const addemail = addManager;
		const res = await adduseraccess({addemail, adduserType});
			if (res.error) toast.error(res.error);
			else {
				toast.success(res.message);
			}
	};

	const handleOrderUpdate= async (e) => {
		const res = await orderupdate({TrackingID_u, Driver_u, OrderStatus_u, Location_u});
			if (res.error) toast.error(res.error);
			else {
				toast.success(res.message);
			}
			setRefresh(Math.random());
	};

	if(usertype == 30){
	return (
		<>
		<div style={{ display: "flex" }}/>
          <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "#FFF1DC",
                boxShadow: "none",
                width: 190,
                top: 94, // Adjust based on your navbar height
              },
            }}
          >
            <List style={{ paddingTop: 36 }}>
						<ListItem disablePadding>
							<ListItemButton onClick={handleCusView} selected={buttoncolor === 'Customers'}>
								<ListItemText primary="View Customers Data" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={handleDriverView} selected={buttoncolor === 'Drivers'}>
								<ListItemText primary="View Drivers Data" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={handleManagerView} selected={buttoncolor === 'Managers'}>
								<ListItemText primary="View Managers Data" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton onClick={handleOrdersView} selected={buttoncolor === 'Orders'}>
								<ListItemText primary="View Orders Data" />
							</ListItemButton>
						</ListItem>
					</List>
				</Drawer>
				<div style={{ flexGrow: 1, padding: "50px", marginLeft: 200 }}>
				
				<div className=" mt-5 py-4 w-100 col-10 col-sm-8">
						{(showtable=="1") ? (
							
							<div>
							
							<Paper elevation={2}>
								<TableContainer sx={{ maxHeight: 350 }}>
									<Table stickyHeader>
										<TableHead>
											<TableRow>
												<StyledTableCell><b>Index</b></StyledTableCell>
												<StyledTableCell><b>User Type</b></StyledTableCell>
												<StyledTableCell><b>User Name</b></StyledTableCell>
												<StyledTableCell><b>Email</b></StyledTableCell>	
											</TableRow>
										</TableHead>
										<TableBody>
											{users.map(
												({userType,username,email},index) => (
													<TableRow key={username} hover>
														<TableCell>{index + 1}</TableCell>
														<TableCell>Customer</TableCell>
														<TableCell>{username}</TableCell>
														<TableCell>{email}</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									component="div"
									count={count}
									page={page}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[
										5, 10,
									]}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									labelRowsPerPage={
										<div className="mt-3">Customers per page</div>
									}
									labelDisplayedRows={({ from, to, count }) => (
										<div className="mt-3">
											{from}-{to} of{" "}
											{count !== -1
												? count
												: `more than ${to}`}
										</div>
									)}
								/>
							</Paper>
							</div>
						) :  ( (showtable=="2")? (
							<div>
							<Paper elevation={2}>
								<TableContainer sx={{ maxHeight: 350 }}>
									<Table stickyHeader>
										<TableHead>
											<TableRow>
												<StyledTableCell><b>Index</b></StyledTableCell>
												<StyledTableCell><b>User Type</b></StyledTableCell>
												<StyledTableCell><b>User Name</b></StyledTableCell>
												<StyledTableCell><b>Email</b></StyledTableCell>	
											</TableRow>
										</TableHead>
										<TableBody>
										{users?.map(
												({userType,username,email},index) => (
													<TableRow key={username} hover>
														<TableCell>{index + 1}</TableCell>
														<TableCell>Driver</TableCell>
														<TableCell>{username}</TableCell>
														<TableCell>{email}</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									component="div"
									count={count}
									page={page}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[
										5, 10,
									]}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									labelRowsPerPage={
										<div className="mt-3">Drivers per page</div>
									}
									labelDisplayedRows={({ from, to, count }) => (
										<div className="mt-3">
											{from}-{to} of{" "}
											{count !== -1
												? count
												: `more than ${to}`}
										</div>
									)}
								/>
							</Paper>
							<div className="container mt-5 pt-3 mb-5">
							<div className="text-center mb-2 alert ">
								<label htmlFor="" className="h6" style={{fontWeight:"bold"}}>
									Update Drivers Database
								</label>
							</div>
							<div className="form-group">
								<TextField
									sx={{mb:3}}
									size="small"
									variant="standard"
									className="form-control"
									label="Driver's Email"
									value={addDriver}
									onChange={(e) => setaddDriver(e.target.value)}
								/>
							</div>
							<Button sx={{mx:13}} variant="contained" size="medium" disabled= {!addDriver} onClick={handleAddDriver}>
							Add Driver
							</Button>
							<div style={{paddingBottom:10}}/>
							</div>
				    </div>
						) : ((showtable=="3")? (
						<div>
							<Paper elevation={2}>
								<TableContainer sx={{ maxHeight: 350 }}>
									<Table stickyHeader>
										<TableHead>
											<TableRow>
												<StyledTableCell><b>Index</b></StyledTableCell>
												<StyledTableCell><b>User Type</b></StyledTableCell>
												<StyledTableCell><b>User Name</b></StyledTableCell>
												<StyledTableCell><b>Email</b></StyledTableCell>	
											</TableRow>
										</TableHead>
										<TableBody>
										{users?.map(
												({userType,username,email},index) => (
													<TableRow key={username} hover>
														<TableCell>{index + 1}</TableCell>
														<TableCell>Manager</TableCell>
														<TableCell>{username}</TableCell>
														<TableCell>{email}</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									component="div"
									count={count}
									page={page}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[
										5, 10,
									]}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									labelRowsPerPage={
										<div className="mt-3">Managers per page</div>
									}
									labelDisplayedRows={({ from, to, count }) => (
										<div className="mt-3">
											{from}-{to} of{" "}
											{count !== -1
												? count
												: `more than ${to}`}
										</div>
									)}
								/>
							</Paper>
							<div className="container mt-5 pt-2 mb-2">
							<div className="text-center mb-2 alert ">
								<label htmlFor="" className="h6" style={{fontWeight:"bold"}}>
									Update Managers Database
								</label>
							</div>
							<div className="form-group">
								<TextField
									sx={{mb:2}}
									size="small"
									variant="standard"
									className="form-control"
									label="Manager's Email"
									value={addManager}
									onChange={(e) => setaddManager(e.target.value)}
								/>
							</div>
							<Button sx={{mx:13}} variant="contained" size="medium" disabled= {!addManager} onClick={handleAddManager}>
							Add Manager
							
							</Button>
							<div style={{paddingBottom:10}}/>
							
							</div>
		
							</div>
							
						) : (
							<div>
							<Paper elevation={2}>
								<TableContainer sx={{ maxHeight: 350 }}>
									<Table stickyHeader>
										<TableHead>
											<TableRow>
												<StyledTableCell><b>Index</b></StyledTableCell>
												<StyledTableCell><b>Tracking ID</b></StyledTableCell>
												<StyledTableCell><b>Customer</b></StyledTableCell>
												<StyledTableCell><b>From Address</b></StyledTableCell>
												<StyledTableCell><b>To Address</b></StyledTableCell>
												<StyledTableCell><b>Driver</b></StyledTableCell>
												<StyledTableCell><b>Order Status</b></StyledTableCell>
												<StyledTableCell><b>Present location</b></StyledTableCell>		
											</TableRow>
										</TableHead>
										<TableBody>
										{users?.map(
												({TrackingID,Customer,Address_f,Address_t,Driver,OrderStatus,Location},index) => (
													<TableRow key={TrackingID} hover>
														<TableCell>{index + 1}</TableCell>
														<TableCell>{TrackingID}</TableCell>
														<TableCell>{Customer}</TableCell>
														<TableCell>{Address_f}</TableCell>
														<TableCell>{Address_t}</TableCell>
														<TableCell>{Driver}</TableCell>
														<TableCell>{OrderStatus}</TableCell>
														<TableCell>{Location}</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									component="div"
									count={count}
									page={page}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[
										5, 10,
									]}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									labelRowsPerPage={
										<div className="mt-3">Orders per page</div>
									}
									labelDisplayedRows={({ from, to, count }) => (
										<div className="mt-3">
											{from}-{to} of{" "}
											{count !== -1
												? count
												: `more than ${to}`}
										</div>
									)}
								/>
							</Paper>
							<div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-3">
							<div className="text-center mb-2 alert ">
								<label htmlFor="" className="h6" style={{fontWeight:"bold"}} >
									Update Order Details
								</label>
							</div>
							<div className="form-group">
								<TextField
									sx={{mb:1}}
									size="small"
									variant="standard"
									className="form-control"
									label="TrackingID"
									value={TrackingID_u}
									onChange={(e) => setTrackingID_u(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<TextField
									sx={{mb:1}}
									size="small"
									variant="standard"
									className="form-control"
									label="Add Driver"
									value={Driver_u}
									onChange={(e) => setDriver_u(e.target.value)}
								/>
							</div>
							<div className="form-group">
							<FormControl variant="standard" sx={{ mb: 1}} fullWidth>
								<InputLabel id="demo-simple-select-label">Order Status</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={OrderStatus_u}
									label="Order Status"
									type="text"
									onChange={(e) => setOrderStatus_u(e.target.value)}
								>	
									<MenuItem value = {undefined} >--Select--</MenuItem>
									<MenuItem value={'Order placed'}>Order placed</MenuItem>
									<MenuItem value={'Driver assigned'}>Driver assigned</MenuItem>
									<MenuItem value={'Order picked up'}>Order picked up</MenuItem>
									<MenuItem value={'In transit'}>In transit</MenuItem>
									<MenuItem value={'Out for delivery'}>Out for delivery</MenuItem>
									<MenuItem value={'Order delivered'}>Order delivered</MenuItem>
								</Select>
							</FormControl>
							</div>
							<div className="form-group">
								<TextField
									sx={{mb:3}}
									size="small"
									variant="standard"
									className="form-control"
									label="Location Update"
									value={Location_u}
									onChange={(e) => setLocation_u(e.target.value)}
								/>
							</div>
							<Button sx={{mx:12}} variant="contained" size="medium" disabled= {!TrackingID_u || (!OrderStatus_u && !Driver_u && !Location_u)} onClick={handleOrderUpdate}>
							Update order
							</Button>
							<div style={{paddingBottom:10}}/>
							</div>
							</div>
						))
						)}
				
				<Snackbar
					open={snackbarOpen}
					onClose={() => setSnackbarOpen(false)}
					autoHideDuration={2000}
					message={snackbarMessage}
				/>
				</div>
		</div>
		</>
	);
}
else{
	return (
		<div className="container mt-5 mb-5 col-10 col-sm-8 col-md-2 col-lg-10">
			<div className="text-center mb-5 alert">
				<label htmlFor="" className="h2">
					You don't have access to this page, please go back to home
				</label>
			</div>
		</div>
	);
}

return null;
};
//{user && <span className="text-success">{user}'s</span>}{" "}
export default ManagerHome;