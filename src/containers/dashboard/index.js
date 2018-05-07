import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import TableAllStadiums from '../../component/dashboard/tab/stadium/TableAllStadiums'
import DetailStadium from '../../component/dashboard/tab/stadium/DetailStadium'
import TableAllCategories from '../../component/dashboard/tab/category/TableAllCategories'
import Fetch from '../../core/services/fetch';

class Dashboard extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            categories: [],
            districts: [],
        }
    }

    async componentDidMount() {
        const categories = await Fetch.get('categories');
        const districts = await Fetch.get('districts');
        this.setState({ categories, districts });
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
            </React.Fragment>
        );
    }
}

Dashboard.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
};

export default Dashboard;