import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Switch, Input } from 'antd';

import UploadImage from '../../common/UploadImage'

class ModalEditChildStadium extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            isUpdate: false,
            childStadium: {
                _id: null,
                numberOfS: null,
                isActive: null,
                thumbnail: null,
            }
        };
        this.open = this.open.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    open(childStadium, isUpdate = false) {
        this.setState({ childStadium, isUpdate, visible: true });
    }

    toggle() {
        this.setState({ visible: !this.state.visible });
    }

    handleChange(prop, value) {
        this.setState({
            childStadium: {
                ...this.state.childStadium,
                [prop]: value,
            }
        });
    }

    handleOk() {
        if (this.state.isUpdate) {
            this.props.updateChildStadium(this.state.childStadium)
        } else {
            this.props.addChildStadium(this.state.childStadium)
        }
        this.setState({ visible: false });
    }

    render() {
        const { numberOfS, isActive, thumbnail } = this.state.childStadium
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const FormItem = Form.Item;
        return (
            <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.toggle}
            >
                <Form onSubmit={this.handleOk}>
                    <FormItem
                        {...formItemLayout}
                        label="Name"
                    >
                        <Input
                            onChange={(event) => this.handleChange('numberOfS', event.target.value)}
                            placeholder="Name"
                            value={numberOfS || ''}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Name"
                    >
                        <Switch
                            checked={isActive}
                            onChange={(checked) => this.handleChange('isActive', checked)}
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
                </Form>
            </Modal>
        );
    }
}

ModalEditChildStadium.propTypes = {
    addChildStadium: PropTypes.func,
    updateChildStadium: PropTypes.func,
};

export default ModalEditChildStadium;