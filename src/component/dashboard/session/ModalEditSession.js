import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { omit } from 'lodash';
import { Modal, Button, Form, DatePicker, Input, TimePicker, notification, Switch } from 'antd';

import Fetch from '../../../core/services/fetch';

const initialState = {
    visible: false,
    isUpdate: false,
    date: '2018-05-22',
    startH: false,
    endH: false,
    session: {
        _id: null,
        name: null,
        startedAt: null,
        finishedAt: null,
        childStadiumId: null,
        price: null,
        duration: null,
        description: null,
        isActive: false,
    }
}

class ModalEditSession extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = initialState;
        this.open = this.open.bind(this);
        this.setData = this.setData.bind(this);
        this.toggle = this.toggle.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.session.startedAt !== this.state.session.startedAt || prevState.session.finishedAt !== this.state.session.finishedAt) {
            const durationValue = new Date(this.state.session.finishedAt) - new Date(this.state.session.startedAt)
            const minutes = Math.floor((durationValue / 1000) / 60);
            if (minutes < 0) {
                this.handleChange('duration', 0);
                if (this.state.session.finishedAt && this.state.session.startedAt) {
                    notification.warning({
                        message: 'Thời gian không hợp lệ',
                        description: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.',
                    })
                }
            } else {
                this.handleChange('duration', minutes);
            }
        }
    }

    open(session, isUpdate = false) {
        this.setState({ session, isUpdate, visible: true });
    }

    setData(date, startH, endH) {
        this.setState({ date, startH, endH });
    }

    toggle() {
        this.setState(initialState);
    }

    changeDate(date) {
        this.setState({ date });
        const { startedAt, finishedAt } = this.state.session;
        if (startedAt) {
            const oldTime = startedAt.split('T');
            oldTime[0] = date;
            this.handleChange('startedAt', oldTime.join('T'));
        }
        if (finishedAt) {
            const oldTime = finishedAt.split('T');
            oldTime[0] = date;
            this.handleChange('finishedAt', oldTime.join('T'));
        }
    }

    handleChange(prop, value) {
        this.setState({
            session: {
                ...this.state.session,
                [prop]: value,
            }
        }, () => {
            console.log(this.state.session);
        });
    }

    async handleSubmit() {
        if (!this.state.isUpdate) {
            const session = await Fetch.post('/session', omit(this.state.session, '_id'))
            if (session) {
                this.props.addSession(session)
            };
        } else {
            const session = await Fetch.put('/session', this.state.session)
            if (session) {
                this.props.updateSession(session)
            };
        }
    }

    render() {
        const { visible, session, date, startH, endH } = this.state;
        const { name, startedAt, finishedAt, childStadiumId, price, duration, description, isActive } = session
        const FormItem = Form.Item;
        const { TextArea } = Input;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Modal
                visible={visible}
                title="Title"
                // onOk={this.handleOk}
                onCancel={this.toggle}
                footer={[
                    <Button key="back" onClick={this.toggle}>Hủy bỏ</Button>,
                    <Button key="submit" type="primary" onClick={this.handleSubmit}>
                        Thêm session
                    </Button>,
                ]}
            >
                <Form onSubmit={this.handleSubmit}>
                    <React.Fragment>
                        <FormItem
                            {...formItemLayout}
                            label="Tên session"
                        >
                            <Input
                                onChange={(event) => this.handleChange('name', event.target.value)}
                                placeholder="Tên session"
                                value={name || ''}
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="Ngày"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày"
                                value={moment(date || '2018-05-22', 'YYYY/MM/DD')}
                                onChange={(time, timeString) => {
                                    const date = timeString.replace(/[/]/g, '-');
                                    this.changeDate(date);
                                }}
                                format={'YYYY/MM/DD'}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Giờ bắt đầu"
                        >
                            <TimePicker
                                value={startH}
                                onChange={(event, value) => {
                                    const startedAt = `${date}T${value}.000+07:00`
                                    this.setState({ startH: event });
                                    this.handleChange('startedAt', startedAt)
                                }}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Giờ kết thúc"
                        >
                            <TimePicker
                                value={endH}
                                onChange={(event, value) => {
                                    const finishedAt = `${date}T${value}.000+07:00`
                                    this.setState({ endH: event });
                                    this.handleChange('finishedAt', finishedAt)
                                }}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Giá"
                        >
                            <Input
                                onChange={(event) => this.handleChange('price', event.target.value)}
                                placeholder="Giá"
                                type="number"
                                value={price || ''}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Thời gian (phút)"
                        >
                            <Input
                                disabled
                                placeholder="Thời gian"
                                type="number"
                                value={duration || ''}
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
                            label="Active"
                        >
                            <Switch
                                checked={isActive}
                                onChange={(checked) => this.handleChange('isActive', checked)}
                            />
                        </FormItem>
                    </React.Fragment>

                </Form>
            </Modal>
        );
    }
}

ModalEditSession.propTypes = {
    addSession: PropTypes.func,
    updateSession: PropTypes.func,
};

export default ModalEditSession;