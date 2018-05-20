import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Form, Select, InputNumber, Switch, Radio, Input, DatePicker,
    Slider, Button, Upload, Icon, Rate, Modal,
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
            districtSelect: [],
            categoriesSelect: [],
            amenitiesSelect: [],
            fetched: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.addChildStadiumSuccess = this.addChildStadiumSuccess.bind(this);
        this.updateChildStadiumSuccess = this.updateChildStadiumSuccess.bind(this);
    }

    async componentWillMount() {
        const stadiumId = this.props.location.search.split('=').pop();
        const stadium = await Fetch.get(`stadium/${stadiumId}`);
        const { districtId, categoryIds, amenitieIds } = stadium;
        const newStadium = {
            ...stadium,
            districtId: districtId._id,
            categoryId: categoryIds.map((c) => c._id),
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
        } else if (prop === 'categoryId') {
            const categoryId = value.pop();
            const category = this.props.categories.find((c) => c._id === categoryId);
            const newCategoriesSelect = [...this.state.categoriesSelect, category.name];
            this.setState({ categoriesSelect: newCategoriesSelect });
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

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const { TextArea } = Input;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { districtSelect, categoriesSelect, stadium, fetched } = this.state;
        const { _id, name, address, dealDate, description, thumbnail, isActive, location, amentities, childStadiums } = stadium;
        const { districts, categories } = this.props;
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
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Danh mục"
                                defaultValue={categoriesSelect}
                                onChange={(value) => this.handleChange('categoryId', value)}
                            >
                                {(categories.map((category, idx) => {
                                    if (category.isActive) {
                                        return (<Option key={category._id}>{category.name}</Option>)
                                    }
                                    return null;
                                }))}
                            </Select>
                        </FormItem>
                        {/* <FormItem
                            {...formItemLayout}
                            label="Dịch vụ"
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Dịch vụ"
                                defaultValue={categoriesSelect}
                                onChange={(value) => this.handleChange('categoryId', value)}
                            >
                                {(amentities.map((amentitie, idx) => {
                                    return (<Option key={amentitie._id}>{amentitie.name}</Option>)
                                }))}
                            </Select>
                        </FormItem> */}

                        <FormItem
                            {...formItemLayout}
                            label="Ngày ký hợp đồng"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày"
                                defaultValue={moment('2018-05-12', 'YYYY/MM/DD')}
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
                                onMarkerChange={this.changeLocation}
                                onMarkerChange={(lat, lng) => {
                                    const lct = location || {
                                        latitude: lat,
                                        longtitude: lng
                                    }
                                    this.handleChange('location', lct)
                                }}
                                position={location}
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
                        {/* <hr />
                        <FormItem
                            {...formItemLayout}
                            label="Dịch vụ"
                        >
                            <TableAmenities
                                data={amentities}
                            />
                        </FormItem> */}
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
                        <Button type="primary">Save</Button>
                    </React.Fragment>
                }

            </Form>
        );
    }
}

DetailStadium.propTypes = {
    location: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    districts: PropTypes.array.isRequired,
};

export default DetailStadium;