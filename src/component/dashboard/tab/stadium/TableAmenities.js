import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';

import UploadImage from '../../../common/UploadImage';

class TableAmenities extends Component {
    render() {
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (value, category) => {
                    return (
                        <Switch
                            checked={value}
                        // onChange={(checked) => this.handleChange('isActive', checked)}
                        />
                    )
                }
            },
            { title: 'Action', dataIndex: '', key: 'x', render: () => <a href="javascript:;">Delete</a> },
        ];

        const data = [
            { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
            { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
            { key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
        ];
        return (
            <Table
                columns={columns}
                expandedRowRender={record =>
                    <UploadImage
                        changeFile={(imagesUrl) => this.handleChange('thumbnail', imagesUrl)}
                        fileList={record.thumbnail || []}
                    />}
                dataSource={this.props.data}
            />
        );
    }
}

TableAmenities.propTypes = {

};

export default TableAmenities;