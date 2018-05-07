import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import TableAllStadiums from '../../component/dashboard/stadium/TableAllStadiums'
import DetailStadium from '../../component/dashboard/stadium/DetailStadium'
import TableAllCategories from '../../component/dashboard/category/TableAllCategories'
import TableAllAmenities from '../../component/dashboard/amenitie/TableAllAmenities'
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
    }

    async componentDidMount() {
        const categories = await Fetch.get('categories');
        const districts = await Fetch.get('districts');
        const amenities = await Fetch.get('amenities');
        this.setState({ categories, districts, amenities });
    }

    addAmenitie(amentitie) {
        const { amenities } = this.state;
        const newAmenitie = [...amenities, amentitie];
        this.setState({ amenitie: newAmenitie });
    }

    updateAmenitie(amenitie) {
        console.log('amenitie', amenitie);
        const { amenities } = this.state;
        const newAmenitie = amenities.map((a) => {
            if (a._id === amenitie._id) {
                console.log('on here');
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
            </React.Fragment>
        );
    }
}

Dashboard.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
};

export default Dashboard;