import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Button, notification, Switch } from 'antd';

import ModalEditSession from './ModalEditSession';
import Fetch from '../../../core/services/fetch';

class TableAllSession extends Component {
    constructor(props, context) {
        super(props, context);
        this.childStadiumId = this.props.location.search.split('=').pop(),
            this.state = {
                sessions: [],
            }
        this.openModalAddSession = this.openModalAddSession.bind(this);
        this.openModalUpdateSession = this.openModalUpdateSession.bind(this);
        this.addSession = this.addSession.bind(this);
        this.updateSession = this.updateSession.bind(this);
        this.deleteSession = this.deleteSession.bind(this);
    }

    async componentWillMount() {
        const sessions = await Fetch.get(`/all-sessions/${this.childStadiumId}`)
        this.setState({ sessions });
    }

    openModalAddSession() {
        const defaultDataSession = {
            name: null,
            startedAt: null,
            finishedAt: null,
            childStadiumId: this.childStadiumId,
            price: null,
            duration: null,
            description: null,
            isActive: false,
        }
        this.modalSession.open(defaultDataSession)
    }

    addSession(session) {
        const { sessions } = this.state;
        const newSessions = [session, ...sessions];
        this.setState({ sessions: newSessions }, () => {
            this.modalSession.toggle();
        });
    }

    openModalUpdateSession(session) {
        const { startedAt, finishedAt } = session;
        const [startedDate, startH] = startedAt.split('T');
        const [finishedDate, endH] = finishedAt.split('T');
        const [startHour] = startH.split('.');
        const [endHour] = endH.split('.');
        this.modalSession.setData(startedDate, moment(startHour, 'HH:mm:ss'), moment(endHour, 'HH:mm:ss'))
        this.modalSession.open(session, true)
    }

    updateSession(session) {
        const { sessions } = this.state;
        const newSessions = sessions.map((s) => {
            if (s._id === session._id) {
                return session;
            }
            return s;
        })
        this.setState({ sessions: newSessions }, () => {
            this.modalSession.toggle();
        });
    }

    async deleteSession(session) {
        const response = await Fetch.Delete(`/session/${session._id}`)
        if (response.ok) {
            const { sessions } = this.state;
            const newSessions = sessions.filter((s) => s._id !== session._id);
            this.setState({ sessions: newSessions });
        }
    }


    render() {
        const { sessions } = this.state;
        console.log('sessions', sessions)
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Thời gian bắt đầu', dataIndex: 'startedAt', key: 'startedAt' },
            { title: 'Thời gian kết thúc', dataIndex: 'finishedAt', key: 'finishedAt' },
            { title: 'Giá', dataIndex: 'price', key: 'price' },
            {
                title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (value, category) => {
                    return (
                        <Switch
                            checked={value}
                        // onChange={(checked) => this.handleChange('isActive', checked)}
                        />
                    )
                }
            },
            {
                title: 'Action', dataIndex: '', key: 'x', render: (session) => {
                    return (
                        <React.Fragment>
                            <Button onClick={() => this.openModalUpdateSession(session)} icon="edit" style={{ marginLeft: 5 }} />
                            <Button onClick={() => this.deleteSession(session)} icon="delete" style={{ marginLeft: 5 }} />
                        </React.Fragment>
                    )
                }
            },
        ];
        return (
            <React.Fragment>
                <Button
                    onClick={this.openModalAddSession}
                    icon="file-add"
                    type="primary"
                    style={{ marginBottom: 10 }}
                >
                    Thêm session
                </Button>
                <ModalEditSession
                    ref={(instance) => { this.modalSession = instance }}
                    addSession={this.addSession}
                    updateSession={this.updateSession}
                />
                <Table
                    columns={columns}
                    dataSource={sessions}
                />
            </React.Fragment>
        );
    }
}

TableAllSession.propTypes = {
    location: PropTypes.object.isRequired,
};

export default TableAllSession;