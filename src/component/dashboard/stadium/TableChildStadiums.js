import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Divider, Switch, Button } from 'antd';

import ModalEditChildStadium from './ModalEditChildStadium';
import UploadImage from '../../common/UploadImage';

class TableChildStadiums extends Component {
    constructor(props, context) {
        super(props, context);
        this.confirmPayed = this.confirmPayed.bind(this);
        this.addChildStadium = this.addChildStadium.bind(this);
        this.updateChildStadium = this.updateChildStadium.bind(this);
    }

    confirmPayed(childStadium, value) {
        console.log(childStadium, value);
    }

    addChildStadium() {
        this.childStadiumModal.toggle();
    }

    updateChildStadium(childStadium) {
        console.log(childStadium);
        this.childStadiumModal.open(childStadium, true);
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
                        onChange={(checked) => this.confirmPayed(childStadium, checked)}
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
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    expandedRowRender={record =>
                        <UploadImage
                            changeFile={(imagesUrl) => this.handleChange('thumbnail', imagesUrl)}
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
};

export default TableChildStadiums;