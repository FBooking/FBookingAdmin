import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Form, Select, InputNumber, Switch, Radio, Input, DatePicker,
    Slider, Button, Upload, Icon, Rate, Modal,
} from 'antd';

import UploadImage from '../../../common/UploadImage'
import Fetch from '../../../../core/services/fetch'

class ModalEditStadium extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            isUpdate: false,
            stadium: {
                _id: null,
                name: null,
                address: null,
                categoryId: null,
                districtId: null,
                dealDate: null,
                description: null,
                thumbnail: null,
                isActive: false,
            }
        }
        this.toggle = this.toggle.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    handleOpen(stadium, isUpdate = false) {
        this.setState({ stadium, visible: true, isUpdate });
    }

    toggle() {
        this.setState({ visible: !this.state.visible });
    }

    handleChange(prop, value) {
        this.setState({
            stadium: { ...this.state.stadium, [prop]: value }
        });
    }

    async handleOk() {
        const { isUpdate, stadium } = this.state;
        let response
        if (!isUpdate) response = await Fetch.post('stadium', stadium)
        if (isUpdate) response = await Fetch.put('stadium', stadium)
        if (response) {
            if (!isUpdate) this.props.addStadium(response)
            if (isUpdate) this.props.updateStadium(response)
            this.setState({ visible: false })
        }
        console.log(this.state.stadium)
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const { TextArea } = Input;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { categories, districts } = this.props;
        const { name, address, categoryId, districtId, dealDate, description, thumbnail, isActive } = this.state.stadium
        return (
            <Modal
                title={(this.state.isUpdate) ? 'Cập nhật thông tin sân' : 'Thêm sân'}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.toggle}
            >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="Tên sân"
                    >
                        <Input
                            onChange={(event) => this.handleChange('name', event.target.value)}
                            placeholder="Tên sân"
                            value={name || ''}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Địa chỉ"
                    >
                        <Input
                            onChange={(event) => this.handleChange('address', event.target.value)}
                            placeholder="Địa chỉ"
                            value={address || ''}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Khu vực"
                    >
                        {this.state.visible &&
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Chọn khu vực"
                                // defaultValue={['a10', 'c12']}
                                onChange={(value) => this.handleChange('districtId', value)}
                            >
                                {(districts.map((district, idx) => {
                                    return (<Option key={district._id}>{district.name}</Option>)
                                }))}
                            </Select>
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Danh mục"
                    >
                        {this.state.visible &&
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Chọn danh mục"
                                onChange={(value) => this.handleChange('categoryId', value)}
                            >
                                {(categories.map((category, idx) => {
                                    return (<Option key={category._id}>{category.name}</Option>)
                                }))}
                            </Select>
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Ngày ký hợp đồng"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày"
                            onChange={(time, timeString) => {
                                console.log(timeString);
                                this.handleChange('dealDate', timeString)
                            }}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Mô tả"
                    >
                        <TextArea
                            rows={4}
                            value={description || ''}
                            onChange={(event) => this.handleChange('description', event.target.value)}
                        />
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="Ảnh"
                    >
                        <div className="dropbox">
                            <UploadImage
                                changeFile={(imagesUrl) => this.handleChange('thumbnail', imagesUrl)}
                            />
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Active"
                    >
                        <Switch
                            onChange={(checked) => this.handleChange('isActive', checked)}
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

ModalEditStadium.propTypes = {
    categories: PropTypes.array.isRequired,
    districts: PropTypes.array.isRequired,
    addStadium: PropTypes.func,
    updateStadium: PropTypes.func,
};

export default ModalEditStadium;