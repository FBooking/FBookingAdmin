import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Table, Button, notification, Tooltip } from 'antd';

import ModalEditStadium from './ModalEditStadium';
import ModalEditChildStadium from './ModalEditChildStadium';
import TableChildStadiums from './TableChildStadiums';
import Fetch from '../../../core/services/fetch';

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
        this.openModalAddChildStadium = this.openModalAddChildStadium.bind(this);
        this.addChildStadiumSuccess = this.addChildStadiumSuccess.bind(this);
        this.updateChildStadiumSuccess = this.updateChildStadiumSuccess.bind(this);
        this.deleteChildStaditumSuccess = this.deleteChildStaditumSuccess.bind(this);
    }

    async componentDidMount() {
        const { page, perPage } = this.state;
        const stadiums = await Fetch.get(`stadiums/?page=${page}&perPage=${perPage}`);
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
        this.setState({ stadiums: newStadiums });
    }

    updateStadiumSuccess(stadium) {
        const { stadiums } = this.state
        stadiums.map
        const newStadiums = stadiums.map((s) => {
            if (s._id === stadium._id) {
                return stadium;
            }
            return s;
        })
        this.setState({ stadiums: newStadiums });
    }

    addChildStadiumSuccess(childStadium) {
        const { stadiums } = this.state;
        const newStadiums = stadiums.map((s) => {
            if (s._id === childStadium.stadiumId) {
                const newStadium = {
                    ...s,
                    childStadiums: [childStadium, ...s.childStadiums || []]
                };
                return newStadium;
            }
            return s;
        })
        this.setState({ stadiums: newStadiums });
    }

    updateChildStadiumSuccess(childStadium) {
        const { stadiums } = this.state;
        const newStadiums = stadiums.map((s) => {
            if (s._id === childStadium.stadiumId) {
                const newStadium = {
                    ...s,
                    childStadiums: s.childStadiums.map((cs) => {
                        if (cs._id === childStadium._id) {
                            return childStadium;
                        }
                        return cs;
                    })
                };
                return newStadium;
            }
            return s;
        })
        this.setState({ stadiums: newStadiums });
    }

    deleteChildStaditumSuccess(childStadium) {
        const { stadiums } = this.state;
        const newStadiums = stadiums.map((s) => {
            if (s._id === childStadium.stadiumId) {
                const newStadium = {
                    ...s,
                    childStadiums: s.childStadiums.filter((cs) => cs._id !== childStadium._id),
                };
                return newStadium;
            }
            return s;
        })
        this.setState({ stadiums: newStadiums });
    }

    openModalAddChildStadium(stadium) {
        const defaultDataStadium = {
            _id: null,
            stadiumId: stadium._id,
            numberOfS: null,
            isActive: null,
            thumbnail: null,
        };
        this.childStadiumModal.open(defaultDataStadium);
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
                            <Tooltip title="Thêm sân con">
                                <Button onClick={() => this.openModalAddChildStadium(stadium)} icon="file-add" />
                            </Tooltip>
                            <Tooltip title="Sửa sân">
                                <Button onClick={() => this.updateStadium(stadium)} icon="edit" style={{ marginLeft: 5 }} />
                            </Tooltip>
                            <Tooltip title="Xóa sân">
                                <Button onClick={() => this.deleteStadium(stadium)} icon="delete" style={{ marginLeft: 5 }} />
                            </Tooltip>
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
                <ModalEditChildStadium
                    ref={(instance) => this.childStadiumModal = instance}
                    addChildStadium={this.addChildStadiumSuccess}
                    updateChildStadium={this.updateChildStadiumSuccess}
                />
                <Table
                    columns={columns}
                    // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    expandedRowRender={record => {
                        return (
                            <TableChildStadiums
                                data={record.childStadiums}
                                addChildStadium={(childStadium) => this.addChildStadiumSuccess(childStadium)}
                                updateChildStadium={(childStadium) => this.updateChildStadiumSuccess(childStadium)}
                                deleteChildStaditum={(childStadium) => this.deleteChildStaditumSuccess(childStadium)}
                                stadiumId={record._id}
                            />
                        )
                    }}
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