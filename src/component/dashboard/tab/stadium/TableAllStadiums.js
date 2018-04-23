import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd';

import ModalEditStadium from './ModalEditStadium';
import Fetch from '../../../../core/services/fetch';

class TableAllStadiums extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            perPage: 10,
            stadiums: [],
            categories: [],
            districts: [],
        }
        this.addStadium = this.addStadium.bind(this);
        this.deleteStadium = this.deleteStadium.bind(this);
        this.addStadiumSuccess = this.addStadiumSuccess.bind(this);
        this.updateStadiumSuccess = this.updateStadiumSuccess.bind(this);
    }

    async componentDidMount() {
        const { page, perPage } = this.state;
        const stadiums = await Fetch.get(`stadiums?page=${page}&per_page=${perPage}`);
        const categories = await Fetch.get('categories');
        const districts = await Fetch.get('districts');
        this.setState({ stadiums, categories, districts })
    }

    addStadium() {
        this.stadiumModal.toggle();
    }

    async deleteStadium(stadium) {
        const { _id } = stadium;
        const stadiums = this.state.stadiums;
        let index;
        const newStadiums = stadiums.filter((_, idx) => {
            if (_ === stadium) {
                index = idx
            } else {
                return _;
            }
        });
        const status = await Fetch.Delete(`stadium/${_id}`);
        if (status.ok) {
            this.setState({ stadiums: newStadiums });
        }
    }

    addStadiumSuccess(stadium) {
        const { stadiums } = this.state
        const newStadiums = [...stadiums, stadium];
        this.setState({ stadiums: newStadiums });
    }

    updateStadiumSuccess(stadium) {

    }

    render() {
        const columns = [
            { title: 'Tên sân', dataIndex: 'name', key: 'name' },
            { title: 'Khu vực', dataIndex: 'districtId.name', key: 'districtId.name' },
            { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
            {
                title: 'Action', dataIndex: '', key: 'x', render: (stadium) => {
                    return (
                        <React.Fragment>
                            <Button icon="file-add" />
                            <Button icon="edit" style={{ marginLeft: 5 }} />
                            <Button onClick={() => this.deleteStadium(stadium)} icon="delete" style={{ marginLeft: 5 }} />
                        </React.Fragment>
                    )
                }
            },
        ];

        const data = [
            { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
            { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
            { key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
        ];

        return (
            <React.Fragment>
                <Button onClick={this.addStadium} type="primary" style={{ marginBottom: 10 }}>Thêm sân</Button>
                <ModalEditStadium
                    ref={(instance) => this.stadiumModal = instance}
                    categories={this.state.categories}
                    districts={this.state.districts}
                    addStadium={this.addStadiumSuccess}
                    updateStadium={this.updateStadiumSuccess}
                />
                <Table
                    columns={columns}
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={this.state.stadiums}
                />
            </React.Fragment>
        );
    }
}

TableAllStadiums.propTypes = {

};

export default TableAllStadiums;