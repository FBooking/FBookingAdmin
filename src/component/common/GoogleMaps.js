import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat: props.position.lat, lng: props.position.lng }}
    >
        <Marker
            draggable
            position={{ lat: props.position.lat, lng: props.position.lng }}
            setDraggable={false}
            onDragEnd={(event) => {
                props.onMarkerClick(event.latLng.lat(), event.latLng.lng())
            }}
        />
    </GoogleMap>
)

class MyFancyComponent extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            lat: this.props.position.latitude || 20.844911,
            lng: this.props.position.longtitude || 106.688084,
        }
        this.handleMarkerChange = this.handleMarkerChange.bind(this);
    }

    handleMarkerChange(lat, lng) {
        this.setState({ lat, lng })
        this.props.onMarkerChange(lat, lng);
    }

    render() {
        return (
            <MyMapComponent
                position={this.state}
                onMarkerClick={this.handleMarkerChange}
            />
        )
    }
}

export default MyFancyComponent;