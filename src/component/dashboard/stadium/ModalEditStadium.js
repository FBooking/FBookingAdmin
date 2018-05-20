import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Form, Select, InputNumber, Switch, Radio, Input, DatePicker,
    Slider, Button, Upload, Icon, Rate, Modal,
} from 'antd';

import UploadImage from '../../common/UploadImage'
import GoogleMaps from '../../common/GoogleMaps';
import Fetch from '../../../core/services/fetch'

const initialState = {
    visible: false,
    districtDisplay: null,
    stadium: {
        name: null,
        address: null,
        districtId: null,
        location: null,
        isActive: false,
    },
}

class ModalEditStadium extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = initialState;
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    toggle() {
        if (this.state.visible) this.setState(initialState)
        this.setState({ visible: !this.state.visible });
    }

    handleChange(prop, value) {
        if (prop === 'districtId') {
            this.setState({
                stadium: { ...this.state.stadium, [prop]: value.districtId },
                districtDisplay: value.districtDisplay,
            });
        } else {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    stadium: {
                        ...this.state.stadium,
                        [prop]: value
                    }
                };
            });
        }
    }

    async handleOk() {
        const { isUpdate, stadium } = this.state;
        let response = await Fetch.post('stadium', stadium)
        if (response) {
            this.props.addStadium(response)
            this.setState(initialState)
        }
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
        const { visible, districtDisplay, stadium } = this.state;
        const { name, address, districtId, isActive, location } = stadium;
        return (
            <Modal
                title={'Thêm sân'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.toggle}
                width={800}
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
                                style={{ width: '100%' }}
                                placeholder="Chọn khu vực"
                                value={districtDisplay}
                                onChange={(value, option) => {
                                    this.handleChange('districtId', { districtId: value, districtDisplay: option.props.children })
                                }}
                            >
                                {(districts.map((district, idx) => {
                                    return (<Option key={district._id}>{district.name}</Option>)
                                }))}
                            </Select>
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Vị trí"
                    >
                        <GoogleMaps
                            onMarkerChange={this.changeLocation}
                            onMarkerChange={(lat, lng) => {
                                const lct = location || {
                                    latitude: lat,
                                    longtitude: lng
                                }
                                this.handleChange('location', lct)
                            }}
                            position={location || {}}
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