import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, Input, Modal } from 'antd';

import Fetch from '../../../../core/services/fetch';

const initialState = {
    visible: false,
    isUpdate: false,
    category: {
        _id: null,
        name: null,
        isActive: false,
    },
}

class ModalEditCategory extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = initialState;
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleOpen(category, isUpdate = false) {
        this.setState({ category, isUpdate, visible: true })
    }

    handleChange(prop, value) {
        this.setState({ category: { ...this.state.category, [prop]: value } })
    }

    async handleOk() {
        const { isUpdate, category } = this.state;
        let response;
        if (isUpdate) response = await Fetch.put('category', category)
        if (!isUpdate) response = await Fetch.post('category', category)
        if (response) {
            if (isUpdate) this.props.updateCategory(response);
            if (!isUpdate) this.props.addCategory(response);
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
        const { visible, isUpdate, category } = this.state;
        const { name, isActive } = category;
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

ModalEditCategory.propTypes = {
    addCategory: PropTypes.func,
    updateCategory: PropTypes.func,
};

export default ModalEditCategory;