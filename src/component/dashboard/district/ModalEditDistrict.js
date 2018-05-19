import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { Form, Input, Modal } from 'antd';

import Fetch from '../../../core/services/fetch';

const initialState = {
    district: {
        _id: null,
        name: null,
        code: null,
    },
    isUpdate: false,
    visible: false,
}

class ModalEditDistrict extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = initialState;
        this.handleOpen = this.handleOpen.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    handleOpen(district, isUpdate = false) {
        this.setState({ district, isUpdate, visible: true })
    }

    toggle() {
        if (this.state.visible) this.setState(initialState);
        this.setState({ visible: !this.state.visible });
    }

    handleChange(prop, value) {
        this.setState({ district: { ...this.state.district, [prop]: value } })
    }

    async handleOk() {
        const { isUpdate, district } = this.state;
        let response;
        if (isUpdate) response = await Fetch.put('district', district)
        if (!isUpdate) response = await Fetch.post('district', omit(district), '_id')
        if (response) {
            if (isUpdate) this.props.updateDistrict(response);
            if (!isUpdate) this.props.addDistrict(response);
            this.setState(initialState)
        }
    }

    render() {
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { visible, isUpdate, district } = this.state;
        const { name, code } = district;
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
                        label="Code"
                    >
                        <Input
                            onChange={(event) => this.handleChange('code', event.target.value)}
                            placeholder="Code"
                            value={code || ''}
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

ModalEditDistrict.propTypes = {
    updateDistrict: PropTypes.func,
    addDistrict: PropTypes.func,
};

export default ModalEditDistrict;