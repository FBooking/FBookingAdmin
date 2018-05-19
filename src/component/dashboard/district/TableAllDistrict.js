import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, notification } from 'antd';

import ModalEditDistrict from './ModalEditDistrict';
import Fetch from '../../../core/services/fetch';

class TableAllDistrict extends Component {
    constructor(props, context) {
        super(props, context);
        this.addDistrict = this.addDistrict.bind(this);
        this.updateDistrict = this.updateDistrict.bind(this);
    }

    addDistrict() {
        this.districtModal.toggle();
    }

    updateDistrict(district) {
        this.districtModal.handleOpen(district, true);
    }

    async deleteDistrict(district) {
        const response = await Fetch.Delete(`district/${district._id}`);
        if (response.ok) {
            notification.success({
                message: 'Thành công!',
                description: 'Xóa thông tin district thành công.',
            })
            this.props.deleteDistrict(district)
        }
    }

    render() {
        const { data } = this.props;
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Code', dataIndex: 'code', key: 'code' },
            {
                title: 'Action', dataIndex: '', key: 'x', render: (district) => {
                    return (
                        <React.Fragment>
                            <Button onClick={() => this.updateDistrict(district)} icon="edit" style={{ marginLeft: 5 }} />
                            <Button onClick={() => this.deleteDistrict(district)} icon="delete" style={{ marginLeft: 5 }} />
                        </React.Fragment>
                    )
                }
            },
        ];
        return (
            <React.Fragment>
                <ModalEditDistrict
                    ref={(instance) => { this.districtModal = instance }}
                    addDistrict={(district) => this.props.addDistrict(district)}
                    updateDistrict={(district) => this.props.updateDistrict(district)}
                />
                <Button
                    onClick={this.addDistrict}
                    icon="file-add"
                    type="primary"
                    style={{ marginBottom: 10 }}
                >
                    Add District
                </Button>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </React.Fragment>
        );
    }
}

TableAllDistrict.propTypes = {
    addDistrict: PropTypes.func,
    updateDistrict: PropTypes.func,
    deleteDistrict: PropTypes.func,
};

export default TableAllDistrict;