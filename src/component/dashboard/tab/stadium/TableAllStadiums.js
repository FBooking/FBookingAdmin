import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Table, Button, notification } from 'antd';

import ModalEditStadium from './ModalEditStadium';
import TableChildStadiums from './TableChildStadiums';
import Fetch from '../../../../core/services/fetch';

class TableAllStadiums extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            stadiums: [],
            categories: [],
            districts: [],
            searchOptions: {
                page: 1,
                perPage: 10,
                districtIds: null,
                categoryIds: null,
                name: null,
            }
        }
        this.addStadium = this.addStadium.bind(this);
        this.deleteStadium = this.deleteStadium.bind(this);
        this.addStadiumSuccess = this.addStadiumSuccess.bind(this);
        this.updateStadiumSuccess = this.updateStadiumSuccess.bind(this);
        this.updateStadium = this.updateStadium.bind(this);
    }

    async componentDidMount() {
        const { page, perPage } = this.state;
        const stadiums = await Fetch.get(`stadiums/?page=${page}&perPage=${perPage}`);
        console.log('stadiums', stadiums)
        const categories = await Fetch.get('categories');
        const districts = await Fetch.get('districts');
        this.setState({ stadiums, categories, districts })
    }

    addStadium() {
        this.stadiumModal.toggle();
    }

    updateStadium(stadium) {
        this.props.history.push(`/dashboard/stadium/?stadiumId=${stadium._id}`)
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
        const req = await Fetch.Delete(`stadium/${_id}`);
        if (req.ok) {
            notification.success({
                message: 'Thành công!',
                description: 'Xóa thông tin sân bóng thành công.',
            })
            this.setState({ stadiums: newStadiums });
        }
    }

    addStadiumSuccess(stadium) {
        const { stadiums } = this.state
        const newStadiums = [...stadiums, stadium];
        console.log('newStadiums', newStadiums)
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
                            <Button onClick={() => this.updateStadium(stadium)} icon="edit" style={{ marginLeft: 5 }} />
                            <Button onClick={() => this.deleteStadium(stadium)} icon="delete" style={{ marginLeft: 5 }} />
                        </React.Fragment>
                    )
                }
            },
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
                    // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    expandedRowRender={record => <TableChildStadiums />}
                    dataSource={this.state.stadiums}
                />
            </React.Fragment>
        );
    }
}

TableAllStadiums.propTypes = {
    history: PropTypes.object,
};

export default withRouter(TableAllStadiums);