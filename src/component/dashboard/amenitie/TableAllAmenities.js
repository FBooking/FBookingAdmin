import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Switch, notification } from 'antd';

import ModalEditAmenitie from './ModalEditAmenitie';
import UploadImage from '../../common/UploadImage';
import Fetch from '../../../core/services/fetch';

class TableAllAmenities extends Component {
    constructor(props, context) {
        super(props, context);
        this.deleteAmentitie = this.deleteAmentitie.bind(this);
        this.openModalAddAmenitie = this.openModalAddAmenitie.bind(this);
    }

    openModalAddAmenitie() {
        this.modalEditAmenitie.toggle();
    }

    updateAmentitie(amenitie) {
        this.modalEditAmenitie.handleOpen(amenitie, true);
    }

    async deleteAmentitie(amenitie) {
        const response = await Fetch.Delete(`amenitie/${amenitie._id}`);
        if (response.ok) {
            notification.success({
                message: 'Thành công!',
                description: 'Xóa thông tin dịch vụ thành công.',
            })
            this.props.deleteAmentitie(amenitie)
        }
    }

    render() {
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (value, amenitie) => {
                    return (
                        <Switch
                            checked={value}
                            onChange={async (checked) => {
                                amenitie.isActive = checked;
                                const response = await Fetch.put('amenitie', amenitie)
                                if (response) this.props.updateAmenitie(amenitie);
                            }}
                        />
                    )
                }
            },
            {
                title: 'Action', dataIndex: '', key: 'x', render: (value, amenitie) => {
                    return (
                        <React.Fragment>
                            <Button onClick={() => this.updateAmentitie(amenitie)} icon="edit" style={{ marginLeft: 5 }} />
                            <Button onClick={() => this.deleteAmentitie(amenitie)} icon="delete" style={{ marginLeft: 5 }} />
                        </React.Fragment>
                    )
                }
            },
        ];

        return (
            <React.Fragment>
                <Button onClick={this.openModalAddAmenitie} type="primary" style={{ marginBottom: 10 }}>Thêm dịch vụ</Button>
                <ModalEditAmenitie
                    ref={(instance) => this.modalEditAmenitie = instance}
                    addAmenitie={this.props.addAmenitie}
                    updateAmenitie={this.props.updateAmenitie}
                />
                <Table
                    columns={columns}
                    expandedRowRender={record =>
                        <UploadImage
                            changeFile={async (thumbnail) => {
                                const amenitie = { ...record, thumbnail }
                                const response = await Fetch.put('amenitie', amenitie)
                                if (response) this.props.updateAmenitie(response);
                            }}
                            fileList={record.thumbnail || []}
                        />}
                    dataSource={this.props.data}
                />
            </React.Fragment>
        );
    }
}

TableAllAmenities.propTypes = {
    addAmenitie: PropTypes.func,
    updateAmenitie: PropTypes.func,
    deleteAmentitie: PropTypes.func,
};

export default TableAllAmenities;