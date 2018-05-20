import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Divider, Switch, Button } from 'antd';

import ModalEditChildStadium from './ModalEditChildStadium';
import UploadImage from '../../common/UploadImage';
import Fetch from '../../../core/services/fetch';

class TableChildStadiums extends Component {
    constructor(props, context) {
        super(props, context);
        this.changeActive = this.changeActive.bind(this);
        this.addChildStadium = this.addChildStadium.bind(this);
        this.updateChildStadium = this.updateChildStadium.bind(this);
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
                    <Button onClick={() => this.updateChildStadium(childStadium)} icon="edit" style={{ marginLeft: 5 }} />
                    <Button onClick={() => this.deleteChildStadium(childStadium)} icon="delete" style={{ marginLeft: 5 }} />
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
    data: PropTypes.array.isRequired,
    addChildStadium: PropTypes.func,
    updateChildStadium: PropTypes.func,
    deleteChildStaditum: PropTypes.func,
    stadiumId: PropTypes.string.isRequired,
};

export default TableChildStadiums;