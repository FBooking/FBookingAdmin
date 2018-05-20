import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import TableAllStadiums from '../../component/dashboard/stadium/TableAllStadiums'
import DetailStadium from '../../component/dashboard/stadium/DetailStadium'
import TableAllCategories from '../../component/dashboard/category/TableAllCategories'
import TableAllAmenities from '../../component/dashboard/amenitie/TableAllAmenities'
import TableAllDistrict from '../../component/dashboard/district/TableAllDistrict'
import TableAllReservation from '../../component/dashboard/reservation/TableAllReservation'
import Fetch from '../../core/services/fetch';

class Dashboard extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            categories: [],
            districts: [],
            amenities: [],
        }
        this.addAmenitie = this.addAmenitie.bind(this);
        this.updateAmenitie = this.updateAmenitie.bind(this);
        this.deleteAmentitie = this.deleteAmentitie.bind(this);
        this.addDistrict = this.addDistrict.bind(this);
        this.updateDistrict = this.updateDistrict.bind(this);
        this.deleteDistrict = this.deleteDistrict.bind(this);
    }

    async componentDidMount() {
        const categories = await Fetch.get('categories');
        const districts = await Fetch.get('districts');
        const amenities = await Fetch.get('amenities');
        this.setState({ categories, districts, amenities });
    }

    addAmenitie(amentitie) {
        console.log('on here', amentitie);
        const { amenities } = this.state;
        const newAmenitie = [amentitie, ...amenities];
        this.setState({ amenities: newAmenitie });
    }

    updateAmenitie(amenitie) {
        const { amenities } = this.state;
        const newAmenitie = amenities.map((a) => {
            if (a._id === amenitie._id) {
                return amenitie;
            }
            return a;
        })
        this.setState({ amenities: newAmenitie });
    }

    deleteAmentitie(amenitie) {
        const { amenities } = this.state;
        const newAmenitie = amenities.filter((a) => a !== amenitie)
        this.setState({ amenities: newAmenitie });
    }

    addDistrict(district) {
        const { districts } = this.state;
        const newDistricts = [...districts, district];
        this.setState({ districts: newDistricts });
    }

    updateDistrict(district) {
        const { districts } = this.state;
        const newDistricts = districts.map((d) => {
            if (d._id === district._id) {
                return district;
            }
            return d;
        })
        this.setState({ districts: newDistricts });
    }

    deleteDistrict(district) {
        const { districts } = this.state;
        const newDistricts = districts.filter((d) => d._id !== district._id);
        this.setState({ districts: newDistricts });
    }

    render() {
        const { search } = this.props.location;
        const { tab } = this.props.match.params;
        const showAllStadiums = (tab === 'stadium' && !search)
        const showDetailStadium = (tab === 'stadium' && search)
        return (
            <React.Fragment>
                {showAllStadiums &&
                    <TableAllStadiums />
                }
                {showDetailStadium &&
                    <DetailStadium
                        location={this.props.location}
                        categories={this.state.categories}
                        districts={this.state.districts}
                        amenities={this.state.amenities}
                    />
                }
                {tab === 'category' &&
                    <TableAllCategories />
                }
                {tab === 'amenitie' &&
                    <TableAllAmenities
                        data={this.state.amenities}
                        deleteAmentitie={this.deleteAmentitie}
                        addAmenitie={this.addAmenitie}
                        updateAmenitie={this.updateAmenitie}
                    />
                }
                {tab === 'district' &&
                    <TableAllDistrict
                        data={this.state.districts}
                        deleteDistrict={this.deleteDistrict}
                        addDistrict={this.addDistrict}
                        updateDistrict={this.updateDistrict}
                    />
                }
                {tab === 'reservation' &&
                    <TableAllReservation
                    // data={this.state.districts}
                    // deleteDistrict={this.deleteDistrict}
                    // addDistrict={this.addDistrict}
                    // updateDistrict={this.updateDistrict}
                    />
                }
            </React.Fragment>
        );
    }
}

Dashboard.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
};

export default Dashboard;