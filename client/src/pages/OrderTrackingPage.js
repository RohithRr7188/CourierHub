import React from "react";
import Geocode from "react-geocode";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { orderstatus } from "../api/user";
import moment from 'moment';
import '../styles/OrderTrackingPage.css';

Geocode.setApiKey("AIzaSyAKVV1sXGF9GELokvPav-U4xS0sSmRpoAo");

const containerStyle = {
    width: '40%',
    height: '40%',
};

export class OrderTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courier: '',
            status: '',
            eod: '',
            statusnum: 0,
            text: '',
            lat: 0,
            lng: 0,
            location: '',
            trackingID: ''
        };

        this.getLatLong = this.getLatLong.bind(this);
        this.handleOrderStatus = this.handleOrderStatus.bind(this);
    }

    async getLatLong() {
        try {
            const response = await Geocode.fromAddress(this.state.location);
            const { lat, lng } = response.results[0].geometry.location;
            this.setState({ lat, lng });
        } catch (error) {
            console.error("Error fetching coordinates: ", error);
        }
    }

    async handleOrderStatus() {
        this.setState({ statusnum: 0, text: 0 });
        const TrackingID = this.state.trackingID;
        const res = await orderstatus({ TrackingID });
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(res.message);
            this.setState({
                courier: res.Carrier,
                status: res.OrderStatus,
                location: res.Location
            });
            if (!this.state.location) {
                this.setState({ text: 1 });
            }
            const statusArray = ["order placed", "driver assigned", "order picked up", "in transit", "out for delivery", "order delivered"];
            for (let i = 0; i < statusArray.length; i++) {
                if (statusArray[i] === res.OrderStatus) {
                    this.setState({ statusnum: i + 1, eod: moment().add(6 - i, 'days').format('MMMM Do YYYY') });
                    break;
                }
            }
            this.getLatLong();
        }
    }

    render() {
        return (
            <><div style={{ padding: "25px " }} />
            <div className="mt-5 mx-5">
                <div className="container p-3">
                    <TextField
                        sx={{ mt: 1 }}
                        size="small"
                        className="form-control"
                        label="Enter Tracking Number"
                        value={this.state.trackingID}
                        onChange={(e) => this.setState({ trackingID: e.target.value })}
                    />
                    <Button
                        sx={{ mt: 1 }}
                        variant="contained"
                        className="form-control"
                        disabled={!this.state.trackingID}
                        onClick={this.handleOrderStatus}
                    >
                        Track my order
                    </Button>
                </div>

                <div className="card mb-3 mt-5">
                    <div className="p-4 text-center text-white text-lg bg-dark rounded-top">
                        <span className="text-uppercase">Tracking Order No - </span>
                        <span className="text-medium">
                            {this.state.trackingID}
                        </span>
                    </div>
                    <div className="d-flex flex-wrap flex-sm-nowrap justify-content-between py-3 px-2 bg-secondary">
                        <div className="w-100 text-center py-1 px-2">
                            <span className="text-large">Shipped Via:</span> {this.state.courier}
                        </div>
                        <div className="w-100 text-center py-1 px-2">
                            <span className="text-medium">Status:</span> {this.state.status}
                        </div>
                        <div className="w-100 text-center py-1 px-2">
                            <span className="text-medium">Expected Date:</span> {this.state.eod}
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                            {["Order Placed", "Driver Assigned", "Order Picked Up", "In Transit", "Out for Delivery", "Order Delivered"].map((step, index) => (
                                <div key={index} className={`step ${this.state.statusnum >= index + 1 ? "completed" : ""}`}>
                                    <div className="step-icon-wrap">
                                        <div className="step-icon"><i className={`pe-7s-${["cart", "user", "drawer", "car", "mail", "home"][index]}`}></i></div>
                                    </div>
                                    <h4 className="step-title">{step}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ align: "center", visibility: `${(!this.state.location) ? "hidden" : "visible"}` }}>
                    <div className='google-map'>
                        <h5 style={{ color: '#00000', display: 'inline-block' }}>Package is at: </h5>
                        <h5 style={{ color: 'black', display: 'inline-block' }}>{this.state.location}</h5>
                        <LoadScript googleMapsApiKey="AIzaSyAKVV1sXGF9GELokvPav-U4xS0sSmRpoAo">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={{ lat: this.state.lat, lng: this.state.lng }}
                                zoom={12}
                            >
                                <Marker position={{ lat: this.state.lat, lng: this.state.lng }} />
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>

                <div style={{ align: "center", visibility: `${(this.state.text === 1) ? "visible" : "hidden"}` }}>
                    <h5 style={{ color: 'black', display: 'inline-block' }}>Driver hasn't updated the location yet!</h5>
                </div>
            </div>
            </>
        );
    }
}

export default OrderTracking;
