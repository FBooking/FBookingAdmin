import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Table, Icon, Divider, Switch, Button, Tooltip } from 'antd';

import ModalEditChildStadium from './ModalEditChildStadium';
import ModalEditSession from '../session/ModalEditSession';
import UploadImage from '../../common/UploadImage';
import Fetch from '../../../core/services/fetch';

class TableChildStadiums extends Component {
    constructor(props, context) {
        super(props, context);
        this.changeActive = this.changeActive.bind(this);
        this.addChildStadium = this.addChildStadium.bind(this);
        this.updateChildStadium = this.updateChildStadium.bind(this);
        this.addSession = this.addSession.bind(this);
        this.goToSessionManager = this.goToSessionManager.bind(this);
    }

    async changeActive(childStadium, value) {
        const childStadiumData = { ...childStadium, isActive: value };
        const response = await Fetch.put('/child-stadium', childStadiumData);
        if (childStadium) this.props.updateChildStadium(response);
        // console.log(childStadium, value);
    }

    addChildStadium() {
        const defaultDataChildStadium = {
            _id: null,
            stadiumId: this.props.stadiumId,
            numberOfS: null,
            isActive: null,
            thumbnail: null,
        }
        this.childStadiumModal.open(defaultDataChildStadium);
    }

    updateChildStadium(childStadium) {
        this.childStadiumModal.open(childStadium, true);
    }

    async deleteChildStadium(childStadium) {
        const response = await Fetch.Delete(`/child-stadium/${childStadium._id}`);
        if (response.ok) {
            this.props.deleteChildStaditum(childStadium);
        }
    }

    addSession(childStadium) {
        const defaultDataSession = {
            name: null,
            startedAt: null,
            finishedAt: null,
            childStadiumId: childStadium._id,
            price: null,
            duration: null,
            description: null,
            isActive: false,
        }
        this.modalSession.open(defaultDataSession)
    }

    goToSessionManager(childStadium) {
        this.props.history.push(`/dashboard/session?childStadiumId=${childStadium._id}`);
    }

    render() {
        const { data, addChildStadium, updateChildStadium } = this.props;
        const columns = [{
            title: 'Name',
            dataIndex: 'numberOfS',
            key: 'numberOfS',
        }, {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (value, childStadium) => {
                return (
                    <Switch
                        checked={value}
                        onChange={(checked) => this.changeActive(childStadium, checked)}
                    />)
            },
        }, {
            title: 'Action',
            key: 'action',
            render: (value, childStadium) => (
                <React.Fragment>
                    <Tooltip title="Thêm session">
                        <Button onClick={() => this.addSession(childStadium)} icon="file-add" style={{ marginLeft: 5 }} />
                    </Tooltip>
                    <Tooltip title="Quản lý các session">
                        <Button onClick={() => this.goToSessionManager(childStadium)} icon="menu-fold" style={{ marginLeft: 5 }} />
                    </Tooltip>
                    <Tooltip title="Sửa sân con">
                        <Button onClick={() => this.updateChildStadium(childStadium)} icon="edit" style={{ marginLeft: 5 }} />
                    </Tooltip>
                    <Tooltip title="Xóa sân con">
                        <Button onClick={() => this.deleteChildStadium(childStadium)} icon="delete" style={{ marginLeft: 5 }} />
                    </Tooltip>
                </React.Fragment>
            ),
        }];
        return (
            <React.Fragment>
                <ModalEditChildStadium
                    ref={(instance) => { this.childStadiumModal = instance }}
                    addChildStadium={addChildStadium}
                    updateChildStadium={updateChildStadium}
                />
                <ModalEditSession
                    ref={(instance) => { this.modalSession = instance }}
                    addSession={() => this.modalSession.toggle()}
                />
                <Button onClick={this.addChildStadium} type="primary" style={{ marginBottom: 10 }}>Thêm sân con</Button>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    expandedRowRender={record =>
                        <UploadImage
                            changeFile={async (thumbnail) => {
                                const childStadium = { ...record, thumbnail };
                                const response = Fetch.put('/child-stadium', childStadium);
                                if (response) this.props.updateChildStadium(response)
                            }}
                            fileList={record.thumbnail || []}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

TableChildStadiums.propTypes = {
    history: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    addChildStadium: PropTypes.func,
    updateChildStadium: PropTypes.func,
    deleteChildStaditum: PropTypes.func,
    stadiumId: PropTypes.string.isRequired,
};

export default withRouter(TableChildStadiums);