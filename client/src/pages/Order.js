import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css"
import { UserContext } from "../UserContext";
import Select from '@mui/material/Select';

// design
import {
	TextField,
	InputAdornment,
	IconButton,
	OutlinedInput,
	FormControl,
	InputLabel,
	Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import Grow from '@mui/material/Grow';
import Input from '@mui/material/Input';
import L from 'leaflet';
import axios from 'axios';


// functions
import { createRazorpayOrder,OrderDetails, orderemail } from "../api/user";

// Geocoding API URL
const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/search';

// Function to get coordinates from address
const getCoordinates = async (address) => {
    try {
        const response = await axios.get(GEOCODING_API_URL, {
            params: {
                q: address,
                format: 'json',
                limit: 1
            }
        });
        const [location] = response.data;
        return location ? { lat: parseFloat(location.lat), lon: parseFloat(location.lon) } : null;
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};

// Function to calculate distance between two sets of coordinates
const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return null;
    const latlng1 = L.latLng(coord1.lat, coord1.lon);
    const latlng2 = L.latLng(coord2.lat, coord2.lon);
    return latlng1.distanceTo(latlng2)/ 1000; // Distance in meters
};

const Order = () => {
	const history = useNavigate();
	const { user, setUser } = useContext(UserContext);
	const { usertype, setUsertype } = useContext(UserContext);
	const { useremail, setUseremail } = useContext(UserContext);
	//var check = undefined;

	// form states
	const [Email_f, setEmail_f] = useState(useremail);
    const [Address_f, setAddress_f] = useState("");
	const [Street_f, setStreet_f] = useState("");
    const [Apt_f, setApt_f] = useState("");
    const [City_f, setCity_f] = useState("");
    const [State_f, setState_f] = useState("");
    const [Zip_f, setZip_f] = useState("");
    const [Address_t, setAddress_t] = useState("");
    const [Street_t, setStreet_t] = useState("");
    const [Apt_t, setApt_t] = useState("");
    const [City_t, setCity_t] = useState("");
    const [State_t, setState_t] = useState("");
    const [Zip_t, setZip_t] = useState("");
    const [Size, setSize] = useState("");
    const [Weight, setWeight] = useState("");
    const [Fedex, setFedex] = useState("");
    const [Ups, setUps] = useState("");
    const [Usps, setUsps] = useState("");
    const [Carrier, setCarrier] = useState("");
	const [CarrierSug, setCarrierSug] = useState("");
    const [Cost, setCost] = useState("");
    const [Userselection, setUserselection] = useState("You haven't selected any carrier yet");
    const [Priority, setPriority] = useState("");
    const [PriorityStatus, setPriorityStatus] = useState("");
	const [TrackingID, setTrackingID] = useState("");
	const [Paynow, setPaynow] = useState("");
	const [PaynowVisible, setPaynowVisible] = useState(false); // State variable to control visibility of Pay now button
	// Paypal
	const [show, setShow] = useState(false);
	const [success, setSuccess] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState("");
	const [orderID, setOrderID] = useState(false);
	
	if(user){
		var email_show = 'hidden';
	} else {
		var email_show = 'visible';
	}
    
	// 'You have slected '&{Carrier}&', which costs '&{Cost}
    //Functions
    function make_visible(div)
        {
            var divbox = document.getElementById(div);
            divbox.style.visibility = 'visible';

        }

	const handleQuotations = async (e) => {
    make_visible('Quotations');
	const fromAddress = `${Street_f}, ${Apt_f}, ${City_f}, ${State_f}, ${Zip_f}`;
    const toAddress = `${Street_t}, ${Apt_t}, ${City_t}, ${State_t}, ${Zip_t}`;
            
    const coordFrom = await getCoordinates(fromAddress);
    const coordTo = await getCoordinates(toAddress);

    if (!coordFrom || !coordTo) {
        toast.error("Could not get coordinates for one or both addresses.");
        return;
    }

    // Calculate distance
    const distance = calculateDistance(coordFrom, coordTo);
    if (!distance) {
        toast.error("Error calculating distance.");
         return;
    }
	console.log(distance)
	var Fed_cost = parseInt(distance*Priority*(distance*9));
	var Ups_cost = parseInt(distance*Priority*(distance*11));
	var Usps_cost = parseInt(distance*Priority*(distance*13));
	if(Fed_cost == Math.min(Fed_cost,Ups_cost,Usps_cost)){
		var carrie_coice = 'FedEx';
		var Fed_cost1 = Fed_cost;
		var Ups_cost1 = parseInt(Math.min(Fed_cost*1.27,Ups_cost));
		var Usps_cost1 = parseInt(Math.min(Fed_cost*1.5,Usps_cost));
	} else if(Ups_cost == Math.min(Fed_cost,Ups_cost,Usps_cost)){
		var carrie_coice = 'Ups';
		var Fed_cost1 = parseInt(Math.min(Ups_cost*1.5,Fed_cost));
		var Ups_cost1 = Ups_cost;
		var Usps_cost1 = parseInt(Math.min(Ups_cost*1.27,Usps_cost));
	} else{
		var carrie_coice = 'Usps';
		var Fed_cost1 = parseInt(Math.min(Usps_cost*1.27,Fed_cost));
		var Ups_cost1 = parseInt(Math.min(Usps_cost*1.5,Ups_cost));
		var Usps_cost1 = Usps_cost;
	}
	setUserselection("You haven't selected any carrier yet");
	setPaynowVisible(false);
	setCarrierSug(carrie_coice);
    setFedex(Fed_cost1);
    setUps(Ups_cost1);
    setUsps(Usps_cost1);
    setAddress_f(Street_f.concat(", ",Apt_f,", ",City_f,", ",State_f,", ",Zip_f));
    setAddress_t(Street_t.concat(", ",Apt_t,", ",City_t,", ",State_t,", ",Zip_t));
    if (Priority > 1){
        setPriorityStatus("Priority");
    }
    else{
        setPriorityStatus("Normal");
    }
    //console.log(Fedex,Ups,Usps,Carrier,Cost,Priority);
	};
    // useEffect(() => {
    //     setCarrier("FedEx");
    //     setCost(Fedex);
    // }, []);

    
    const handleFedex = async (e) => {
		make_visible('Paynow');
        setCarrier("FedEx");
        setCost(Fedex);
		setPaynowVisible(true); // Show the Pay now button
        setUserselection("You have selected".concat(" ",'FedEx'," ",PriorityStatus," which costs ",Fedex));
        //console.log(Address_f,Address_t);
        };

    const handleUps = async (e) => {
		make_visible('Paynow');
        setCarrier("Ups");
        setCost(Ups);
		setPaynowVisible(true); // Show the Pay now button
        setUserselection("You have selected".concat(" ",'Ups'," ",PriorityStatus," which costs ",Ups));
        // setUserselection("You have selected Ups");
        };
    const handleUsps = async (e) => {
		make_visible('Paynow');
        setCarrier("Usps");
        setCost(Usps);
		setPaynowVisible(true); // Show the Pay now button
        setUserselection("You have selected".concat(" ",'Usps'," ",PriorityStatus," which costs ",Usps));
        // setUserselection("You have selected Usps");
        };

		const handlePayment = async () => {
			// Check if the user is logged in
			if (!user) {
				toast.error("Please log in to place the order.");
				history("/login"); // Redirect to the login page
				return;
			}
			try {
				  // Generate a random TrackingID
				  const tracking_id  = Math.floor(Math.random() * 100000000);
				  setTrackingID(tracking_id );

				  // Wait for state to update before proceeding
    			  await new Promise((resolve) => setTimeout(resolve, 0));

				  console.log("tracking id",tracking_id )
				  

				  // Create a Razorpay order and handle payment initiation
				const response = await createRazorpayOrder({
					amount: Cost, // Amount should be in paisa (multiply by 100)
					currency: "INR", // Replace with your currency
				});
		
				// Log the response to ensure it's correctly formatted
				console.log('Razorpay Order Response:', response);
		
				// Check if the response contains the order_id
				if (response.id) {
					const { id: order_id } = response;
		
					const options = {
						key: "rzp_test_0oEHrygE3xxYjw", // Replace with your Razorpay key
						order_id: order_id,
						amount: Cost * 100, // Amount should be in paisa (multiply by 100)
						currency: "INR", // Replace with your currency
						name: "courierHub", // Your business name
						description: "courierHub Shipping Option", // Your description
						handler: function (response) {
							// Handle Razorpay success callback
							paymentUpdate(response,tracking_id);
						},
						prefill: {
							email: useremail || Email_f,
						},
						notes: {
							address_from: Address_f,
							address_to: Address_t,
							cost: Cost,
							tracking_id: tracking_id,
						},
					};
		
					const rzp1 = new window.Razorpay(options);
					rzp1.open();
				} else {
					toast.error("Failed to create Razorpay order. Please try again later.");
				}
			} catch (error) {
				console.error("Error in handling payment:", error);
				toast.error("An error occurred while processing payment.");
			}
		};
		

	// razor

	const paymentUpdate = async (response,tracking_id) => {
		try {
		   console.log('This is Traking ID',tracking_id);
		  // Update payment status in your database or backend
		  const PaymentStatus = "Paid";
		  const Customer = useremail || Email_f;
	
		  const res = await OrderDetails({
			TrackingID:tracking_id,
			Address_f,
			Address_t,
			Cost,
			Carrier,
			Size,
			Weight,
			PriorityStatus,
			PaymentStatus,
			Customer,
		  });
	
		  const res2 = await orderemail({ Customer, Cost, TrackingID:tracking_id  });
	
		  toast.success("Order has been successfully placed. Please check email for details");
		  console.log(usertype);

		  // Redirect based on user type
		  if (usertype === 10){
			history("/Customer");
		  } else if (usertype === 20) {
			history("/Driver");
		  } else if (usertype === 30) {
			history("/Manager");
		  } else {
			history(`/`);
		  }
		} catch (error) {
		  console.error("Error in payment update:", error);
		  toast.error("An error occurred while updating payment status.");
		}
	  };
	

	let navigate = useNavigate();
	return (
        <>
		<div style={{ padding: "25px " }} />
        <div className="wrapper" style={{ paddingLeft: "30px " }} >
        <div className="one">
        {/* <Grow in> */}
		<div className="container7 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-3" style={{padding:"5px"}}>
			<div className="text-center mb-2 alert ">
				<label htmlFor="" className="h5" style={{fontWeight:"bold"}}>
					From Address
				</label>
			</div>
			<div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Street"
					value={Street_f}
					onChange={(e) => setStreet_f(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Apt No."
					value={Apt_f}
					onChange={(e) => setApt_f(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="City"
					value={City_f}
					onChange={(e) => setCity_f(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="State"
					value={State_f}
					onChange={(e) => setState_f(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Pin Code"
					value={Zip_f}
					onChange={(e) => setZip_f(e.target.value)}
				/>
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					style={{visibility: email_show}}
					className="form-control"
					label="Email"
					// value={Email_f}
					onChange={(e) => setEmail_f(e.target.value)}
				/>
			</div>
			
            </div>
            {/* </Grow> */}
            </div>

            <div className="two">
            {/* <Grow in> */}
		    <div className="container7 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-3" style={{padding:"5px"}}>
            <div className="text-center mb-2 alert ml-5">
				<label htmlFor="" className="h5" style={{fontWeight:"bold"}}>
					To Address
				</label>
			</div>
			<div className="form-group" >
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Street"
					value={Street_t}
					onChange={(e) => setStreet_t(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Apt No."
					value={Apt_t}
					onChange={(e) => setApt_t(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="City"
					value={City_t}
					onChange={(e) => setCity_t(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="State"
					value={State_t}
					onChange={(e) => setState_t(e.target.value)}
				/>
			</div>
            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Pin Code"
					value={Zip_t}
					onChange={(e) => setZip_t(e.target.value)}
				/>
			</div>

            </div>
            {/* </Grow> */}
            </div>
            {/* <Grow in> */}
            <div className="three"  style={{padding:"5px"}}>
            <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-3">
            <div className="text-center mb-2 alert ">
				<label htmlFor="" className="h5" style={{fontWeight:"bold"}}>
					Delivery Product Details
				</label>
			</div>

            <div>
			<FormControl variant="standard" sx={{ mb: 1}} fullWidth>
				<InputLabel id="demo-simple-select-label">Size</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={Size}
					label="Size"
					type="text"
					onChange={(e) => setSize(e.target.value)}
				>
					<MenuItem value={'Small'}>Small</MenuItem>
					<MenuItem value={'Medium'}>Medium</MenuItem>
					<MenuItem value={'Large'}>Large</MenuItem>
				</Select>
			</FormControl>
			</div>

            <div className="form-group">
				<TextField
					sx={{mb:1}}
					size="small"
					variant="standard"
					className="form-control"
					label="Weight (in Kg)"
					value={Weight}
					onChange={(e) => setWeight(e.target.value)}
				/>
			</div>
            <div>
			<FormControl variant="standard" sx={{ mb: 1}} fullWidth>
				<InputLabel id="demo-simple-select-label">Priority</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={Priority}
					label="Size"
					type="text"
					onChange={(e) => setPriority(e.target.value)}
				>
					<MenuItem value={1}>Normal</MenuItem>
					<MenuItem value={1.5}>Priority</MenuItem>
				</Select>
			</FormControl>
			</div>
			
            <div className="text-center mt-4">
				<Button
					variant="contained"
					disabled={!Street_f || !City_f || !State_f || !Zip_f
							|| !Street_t || !City_t || !State_t || !Zip_t
							|| !Size || !Weight || !Priority || (!user && !Email_f )}
					onClick={handleQuotations}
				>
					Get Quotations
				</Button>
				
				
			</div>
			
            {/* </Grow> */}
            </div>
            </div>
            
            <div id= 'Quotations' style={{visibility: 'hidden'}} className="four">
            {/* <Grow in> */}
		    <div className="container5 mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-3">
            <div className="text-center mb-2 alert ">
				<label htmlFor="" className="h6" style={{fontWeight:"bold",fontSize:"1.3rem"}}>
                    Quotations
				</label>
			</div>
            <div className="wrapper2">
            <div className="one1">
			<div className="text-center mb-2 alert ">
				<label htmlFor="" className="h8">
                    FedEx {PriorityStatus}
				</label>
			</div>
            </div>
            <div className="two1">
            <div className="text-center mb-2 alert ">
				<label htmlFor="" className="h8">
                    {Fedex}
				</label>
			</div>
            </div>
            <div className="three1">
            <div className="text-center mt-4">
				<Button
					variant="contained"
					disabled={false}
					onClick={handleFedex}
				>
					select
				</Button>
			</div>
            </div>
            </div>


            <div className="wrapper2">
            <div className="one1">
			<div className="text-center mb-2 alert ">
				<label htmlFor="" className="h8">
                    Usps {PriorityStatus}
				</label>
			</div>
            </div>
            <div className="two1">
            <div className="text-center mb-2 alert ">
				<label htmlFor="" className="h8">
                    {Usps}
				</label>
			</div>
            </div>
            <div className="three1">
            <div className="text-center mt-4">
				<Button
					variant="contained"
					disabled={false}
					onClick={handleUsps}
				>
					select
				</Button>
			</div>
            </div>
            </div>
            <div className="wrapper2">
            <div className="one1">
			<div className="text-center mb-2 alert ">
				<label htmlFor="" className="h8">
                    Ups {PriorityStatus}
				</label>
			</div>
            </div>
            <div className="two1">
            <div className="text-center mb-2 alert ">
				<label htmlFor="" className="h8">
                    {Ups}
				</label>
			</div>
            </div>
            <div className="three1">
            <div className="text-center mt-4">
				<Button
					variant="contained"
					disabled={false}
					onClick={handleUps}
				>
					select
				</Button>
			</div>
            </div>
            </div>
            <div className="text-center mb-1 alert ">
				<label htmlFor="" className="h8">
                    We suggest to go with {CarrierSug}
				</label>
			</div>

            <div className="text-center mb-1 alert ">
				<label htmlFor="" className="h8">
                    {Userselection}
				</label>
			</div>

			<div id="Paynow" style={{ visibility: PaynowVisible ? "visible" : "hidden" }} className="text-center mt-1">
			<Button
			variant="contained"
			disabled={!PaynowVisible}
			onClick={handlePayment}
			>
          	Pay now with Razorpay
        	</Button>
      		</div>

            </div>
            
            </div>
            
		
        </div>
		</>
    )
};

export default Order;

