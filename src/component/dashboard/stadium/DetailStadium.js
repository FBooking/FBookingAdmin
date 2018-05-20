import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Form, Select, InputNumber, Switch, Radio, Input, DatePicker,
    Slider, Button, Upload, Icon, Rate, Modal, Checkbox, Row, Col
} from 'antd';

import TableChildStadiums from './TableChildStadiums';
// import TableAmenities from './TableAmenities';

import UploadImage from '../../common/UploadImage';
import GoogleMaps from '../../common/GoogleMaps';
import Fetch from '../../../core/services/fetch';

class DetailStadium extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            stadium: {
                _id: null,
                name: null,
                address: null,
                districtId: null,
                categoryIds: null,
                location: null,
                dealDate: null,
                description: null,
                amenitieIds: null,
                thumbnail: null,
                isActive: false,
                childStadiums: [],
            },
            districtSelect: null,
            categoriesSelect: [],
            amenitiesSelect: [],
            fetched: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.addChildStadiumSuccess = this.addChildStadiumSuccess.bind(this);
        this.updateChildStadiumSuccess = this.updateChildStadiumSuccess.bind(this);
        this.updateStadium = this.updateStadium.bind(this);
    }

    async componentWillMount() {
        const stadiumId = this.props.location.search.split('=').pop();
        const stadium = await Fetch.get(`stadium/${stadiumId}`);
        console.log('stadium', stadium);
        const { districtId, categoryIds, amenitieIds } = stadium;
        const newStadium = {
            ...stadium,
            districtId: districtId._id,
            categoryIds: categoryIds.map((c) => c._id),
            amenitieIds: amenitieIds.map((a) => a._id)
        };
        // console.log(newStadium);
        this.setState({
            stadium: newStadium,
            districtSelect: districtId.name,
            categoriesSelect: categoryIds.map((c) => c.name),
            amenitiesSelect: amenitieIds.map((c) => c.name),
            fetched: true,
        });
    }


    handleChange(prop, value) {
        if (prop === 'districtId') {
            const district = this.props.districts.find((d) => d._id === value);
            this.setState({ districtSelect: district.name });
        }
        this.setState({ stadium: { ...this.state.stadium, [prop]: value } });
    }

    addChildStadiumSuccess(childStadium) {
        const { stadium } = this.state;
        const { childStadiums } = stadium;
        const newChildStadiums = [childStadium, ...childStadiums];
        this.setState({
            stadium: {
                ...this.state.stadium,
                childStadiums: newChildStadiums
            }
        });
    }

    updateChildStadiumSuccess(childStadium) {
        const { stadium } = this.state;
        const { childStadiums } = stadium;
        const newChildStadiums = childStadiums.map((cs) => {
            if (cs._id === childStadium._id) {
                return childStadium
            }
            return cs;
        })
        this.setState({
            stadium: {
                ...this.state.stadium,
                childStadiums: newChildStadiums
            }
        });
    }

    async updateStadium() {
        const stadium = await Fetch.put('/stadium', this.state.stadium);
        this.props.history.push('/dashboard/stadium')
        console.log('updateStadium', stadium);
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const { TextArea } = Input;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { districtSelect, categoriesSelect, stadium, fetched } = this.state;
        const { _id, name, address, districtId, categoryIds, location, dealDate, description, amenitieIds, thumbnail, isActive, childStadiums } = stadium;
        const { districts, categories, amenities } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                {fetched &&
                    <React.Fragment>
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
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn khu vực"
                                value={districtSelect}
                                onChange={(value) => this.handleChange('districtId', value)}
                            >
                                {(districts.map((district, idx) => {
                                    return (<Option key={district._id}>{district.name}</Option>)
                                }))}
                            </Select>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Danh mục"
                        >
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                onChange={(value) => this.handleChange('categoryIds', value)}
                                value={categoryIds}
                            >
                                <Row>
                                    {(categories.map((category, idx) => {
                                        if (category.isActive) {
                                            return (<Col span={8} key={idx}>
                                                <Checkbox
                                                    value={category._id}
                                                >
                                                    {category.name}
                                                </Checkbox>
                                            </Col>)
                                        }
                                        return null;
                                    }))}
                                </Row>
                            </Checkbox.Group>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Dịch vụ"
                        >
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                onChange={(value) => this.handleChange('amenitieIds', value)}
                                value={amenitieIds}
                            >
                                <Row>
                                    {(amenities.map((amenitie, idx) => {
                                        if (amenitie.isActive) {
                                            return (<Col span={8} key={idx}>
                                                <Checkbox
                                                    value={amenitie._id}
                                                >
                                                    {amenitie.name}
                                                </Checkbox>
                                            </Col>)
                                        }
                                        return null;
                                    }))}
                                </Row>
                            </Checkbox.Group>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Ngày ký hợp đồng"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày"
                                defaultValue={moment(dealDate || '2018-05-12', 'YYYY/MM/DD')}
                                onChange={(time, timeString) => {
                                    console.log(timeString);
                                    this.handleChange('dealDate', timeString)
                                }}
                                format={'YYYY/MM/DD'}
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
                            label="Vị trí"
                        >
                            <GoogleMaps
                                onMarkerChange={(lat, lng) => {
                                    const lct = {
                                        latitude: lat,
                                        longtitude: lng
                                    }
                                    this.handleChange('location', lct)
                                }}
                                position={location || {}}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Ảnh"
                        >
                            <div className="dropbox">
                                <UploadImage
                                    changeFile={(imagesUrl) => this.handleChange('thumbnail', imagesUrl)}
                                    fileList={thumbnail || []}
                                />
                            </div>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Active"
                        >
                            <Switch
                                checked={isActive}
                                onChange={(checked) => this.handleChange('isActive', checked)}
                            />
                        </FormItem>
                        <hr />
                        <FormItem
                            {...formItemLayout}
                            label="Sân con"
                        >
                            <TableChildStadiums
                                data={childStadiums}
                                stadiumId={_id}
                                addChildStadium={this.addChildStadiumSuccess}
                                updateChildStadium={this.updateChildStadiumSuccess}
                            />
                        </FormItem>
                        <Button onClick={this.updateStadium} type="primary">Save</Button>
                    </React.Fragment>
                }

            </Form>
        );
    }
}

DetailStadium.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    amenities: PropTypes.array.isRequired,
    districts: PropTypes.array.isRequired,
};

export default withRouter(DetailStadium);