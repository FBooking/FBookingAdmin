import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Form, Input, Button, notification } from 'antd';

import Fetch from '../../core/services/fetch';

class index extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            email: null,
            userId: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange(prop, value) {
        this.setState({ [prop]: value });
    }

    async login() {
        if (this.state.email && this.state.userId) {
            const response = await Fetch.post('auth/login', this.state);
            if (response.error) {
                notification.error({
                    message: 'Thất bại!',
                    description: response.message || 'Có một lỗi không mong muốn đã xảy ra',
                })
            } else {
                this.props.history.push('/dashboard/reservation')
                console.log(response.user);
            }

        }
    }

    render() {
        const { Content } = Layout;
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { email, userId } = this.state
        return (
            <div
                id="login"
                style={{
                    backgroundImage: 'url("https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/5LTJsFT/football-stadium-background-animation_4kiej7gr__F0000.png")',
                    minWidth: '100%',
                    minHeight: '100%',
                }}
            >
                <Content style={{
                    top: '50%',
                    left: '50%',
                    width: 500,
                    height: 240,
                    marginTop: -120, /*set to a negative number 1/2 of your height*/
                    marginLeft: -250,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    position: 'fixed',
                    borderRadius: 15,
                }}>
                    <h3 style={{
                        textAlign: 'center',
                        color: '#fff',
                        marginTop: 15,
                        marginBottom: 15,
                    }}>
                        Đăng nhập
                    </h3>
                    <Form onSubmit={this.login}>
                        <FormItem
                            {...formItemLayout}
                            label="Email"
                        >
                            <Input
                                onChange={(event) => this.handleChange('email', event.target.value)}
                                placeholder="Email"
                                value={email || ''}
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="UserId"
                        >
                            <Input
                                onChange={(event) => this.handleChange('userId', event.target.value)}
                                type="password"
                                placeholder="UserId"
                                value={userId || ''}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            style={{
                                float: 'right'
                            }}
                        >
                            <Button
                                type="primary"
                                icon="login"
                                style={{ marginRight: 80 }}
                                onClick={this.login}
                                disabled={(!email || !userId)}
                            >
                                Đăng nhập
                            </Button>
                        </FormItem>
                    </Form>
                </Content>
            </div >
        );
    }
}

index.propTypes = {
    loginSuccess: PropTypes.func,
    history: PropTypes.object,
};

export default index;