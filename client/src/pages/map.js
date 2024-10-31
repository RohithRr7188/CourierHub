
import { orderstatus } from "../api/user";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define a custom icon if needed
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

class Mapview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromAddress: '',
            fromLat: 0,
            fromLng: 0,
            toAddress: '',
            toLat: 0,
            toLng: 0,
            distance: 0,
            trackingID: '',
            text: '0',
        };

        this.getLatLong = this.getLatLong.bind(this);
        this.handleOrderStatus = this.handleOrderStatus.bind(this);
    }

    getDistance(lat1, lon1, lat2, lon2) {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        } else {
            const radlat1 = Math.PI * lat1 / 180;
            const radlat2 = Math.PI * lat2 / 180;
            const theta = lon1 - lon2;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344; // Convert miles to kilometers
            return parseFloat(dist.toFixed(2));
        }
    }

    async handleOrderStatus() {
        const TrackingID = this.state.trackingID;
        this.setState({ text: '0' });
        const res = await orderstatus({ TrackingID });
        if (res.error) {
            toast.error(res.error);
            return;
        } else {
            console.log(res.Carrier, res.OrderStatus);
            toast.success(res.message);
        }
        console.log(res.Address_f, res.Address_t);
        this.setState({ fromAddress: res.Address_f, toAddress: res.Address_t, text: '1' });
        this.getLatLong();
    }

    async getLatLong() {
        try {
            // Fetch coordinates for fromAddress
            let response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: this.state.fromAddress,
                    format: 'json'
                }
            });

            if (response.data.length === 0) {
                throw new Error('No results found for fromAddress');
            }

            let { lat: fromLat, lon: fromLng } = response.data[0];
            this.setState({ fromLat: parseFloat(fromLat), fromLng: parseFloat(fromLng) });

            // Fetch coordinates for toAddress
            response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: this.state.toAddress,
                    format: 'json'
                }
            });

            if (response.data.length === 0) {
                throw new Error('No results found for toAddress');
            }

            let { lat: toLat, lon: toLng } = response.data[0];
            this.setState({ toLat: parseFloat(toLat), toLng: parseFloat(toLng) });

            const distance = this.getDistance(parseFloat(fromLat), parseFloat(fromLng), parseFloat(toLat), parseFloat(toLng));
            this.setState({ distance });
        } catch (error) {
            console.error("Error fetching coordinates: ", error.message);
            toast.error(`Error fetching coordinates: ${error.message}`);
        }
    }

    render() {
        const { fromLat, fromLng, toLat, toLng, distance, fromAddress, toAddress, text } = this.state;

        return (
            <>
                <div style={{ padding: "50px" }} />
                <div>
                    <div className="container mt-3 py-2 pl-2 pr-2 mb-5 col-10 col-sm-8 col-md-6 col-lg-3">
                        <div className="form-group">
                            <TextField
                                sx={{ mb: 1 }}
                                size="small"
                                variant="standard"
                                className="form-control"
                                label="TrackingID"
                                value={this.state.trackingID}
                                onChange={(e) => { this.setState({ trackingID: e.target.value }) }}
                            />
                        </div>
                        <Button sx={{ mx: 14 }} variant="contained" size="small"
                            disabled={!this.state.trackingID} onClick={this.handleOrderStatus}
                        >
                            View Locations
                        </Button>
                    </div>
                    <div style={{ visibility: `${(text === '1') ? "visible" : "hidden"}` }}>
                        <div>
                            <span style={{ display: 'inline' }}>
                                <h5 style={{ color: 'red', display: 'inline-block' }}>From address:  </h5>
                                <h5 style={{ color: 'black', display: 'inline-block' }}>{fromAddress}</h5>
                            </span>
                            <br />
                            <span style={{ display: 'inline' }}>
                                <h5 style={{ color: 'red', display: 'inline-block' }}>To address:</h5>
                                <h5 style={{ color: 'black', display: 'inline-block' }}>{toAddress}</h5>
                            </span>
                            <br />
                            <span style={{ display: 'inline' }}>
                                <h5 style={{ color: 'red', display: 'inline-block' }}>Distance:</h5>
                                <h5 style={{ color: 'black', display: 'inline-block' }}>{distance} Kilometre</h5>
                            </span>
                            <br />
                        </div>
                        <div className='leaflet-map'>
                        <MapContainer center={[fromLat, fromLng]} zoom={10} style={{ height: "60vh", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[fromLat, fromLng]} icon={customIcon}>
                                    <Popup>
                                        From: {fromAddress}
                                    </Popup>
                                </Marker>
                                <Marker position={[toLat, toLng]} icon={customIcon}>
                                    <Popup>
                                        To: {toAddress}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Mapview;
