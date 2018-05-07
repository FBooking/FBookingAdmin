import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, Input, Modal } from 'antd';

import UploadImage from '../../common/UploadImage';
import Fetch from '../../../core/services/fetch';

const initialState = {
    visible: false,
    isUpdate: false,
    amenitie: {
        _id: null,
        name: null,
        isActive: false,
        thumbnail: [],
    },
}
class ModalEditAmenitie extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = initialState;
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleOpen(amenitie, isUpdate = false) {
        this.setState({ amenitie, isUpdate, visible: true })
    }

    handleChange(prop, value) {
        this.setState({ amenitie: { ...this.state.amenitie, [prop]: value } })
    }

    async handleOk() {
        const { isUpdate, amenitie } = this.state;
        let response;
        if (isUpdate) response = await Fetch.put('amenitie', amenitie)
        if (!isUpdate) response = await Fetch.post('amenitie', amenitie)
        if (response) {
            if (isUpdate) this.props.updateAmenitie(response);
            if (!isUpdate) this.props.addAmenitie(response);
            this.setState(initialState)
        }
    }

    toggle() {
        if (this.state.visible) this.setState(initialState);
        this.setState({ visible: !this.state.visible });
    }
    render() {
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { visible, isUpdate, amenitie } = this.state;
        const { name, thumbnail, isActive } = amenitie;
        return (
            <Modal
                title={(isUpdate) ? 'Cập nhật thông tin sân' : 'Thêm sân'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.toggle}
            >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="Name"
                    >
                        <Input
                            onChange={(event) => this.handleChange('name', event.target.value)}
                            placeholder="Name"
                            value={name || ''}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Ảnh"
                    >
                        <UploadImage
                            changeFile={(imagesUrl) => this.handleChange('thumbnail', imagesUrl)}
                            fileList={thumbnail || []}
                        />
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
                </Form>
            </Modal>
        );
    }
}

ModalEditAmenitie.propTypes = {
    addAmenitie: PropTypes.func,
    updateAmenitie: PropTypes.func,
};

export default ModalEditAmenitie;