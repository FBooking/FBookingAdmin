import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch, Button } from 'antd';
import { flatMapDeep, valuesIn, pick, includes, each } from 'lodash'

import Fetch from '../../../core/services/fetch';

class TableAllReservation extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reservations: [],
            reservationIds: [],
        }
        this.confirmPayed = this.confirmPayed.bind(this);
        this.deleteReservations = this.deleteReservations.bind(this);
    }

    async componentDidMount() {
        const reservations = await Fetch.get('reservations');
        this.setState({ reservations });
    }

    async deleteReservations() {
        const { reservationIds, reservations } = this.state;
        const response = await Fetch.post('delete-reservations', { ids: reservationIds })
        if (response.success) {
            const newReservations = [];
            each(reservations, (reservation) => {
                if (!includes(reservationIds, reservation._id)) {
                    newReservations.push(reservation);
                }
            })
            this.setState({ reservations: newReservations, reservationIds: [] });
        }
    }

    async confirmPayed(reservation, payed) {
        const response = await Fetch.put('confirm-payed', {
            _id: reservation._id,
            payed
        })
        if (response) {
            const { reservations } = this.state;
            const newReservations = reservations.map((r) => {
                if (r._id === reservation._id) {
                    return { ...reservation, payed }
                }
                return r;
            })
            this.setState({ reservations: newReservations });
            console.log(newReservations);
        }
    }


    render() {
        const columns = [
            { title: 'Tên người đặt', width: 200, dataIndex: 'userId.name', key: 'userId.name', fixed: 'left' },
            { title: 'Số điện thoại', width: 150, dataIndex: 'userId.phone', key: 'userId.phone', fixed: 'left' },
            {
                title: 'Sân', dataIndex: 'childStadiumId', key: 'childStadiumId', render: (childStadium, reservation) => {
                    const { numberOfS, stadiumId } = childStadium
                    return (
                        <span>{stadiumId.name} {numberOfS}</span>
                    )
                }
            },
            {
                title: 'Thời gian', dataIndex: 'sessionId', key: 'sessionId', render: (session, reservation) => {
                    const { startedAt, finishedAt } = session;
                    return (
                        <React.Fragment>
                            <span>Bắt đầu: {new Date(startedAt).toLocaleString()}</span><br />
                            <span>Kết thúc: {new Date(finishedAt).toLocaleString()}</span>
                        </React.Fragment>
                    )
                }
            },
            { title: 'Tên ngân hàng', dataIndex: 'bankName', key: 'bankName' },
            { title: 'Số thẻ', dataIndex: 'bankNumber', key: 'bankNumber' },
            {
                title: 'Thanh toán',
                dataIndex: 'payed',
                key: 'payed',
                fixed: 'right',
                width: 120,
                render: (value, reservation) => {
                    return (
                        < Switch
                            checked={value}
                            onChange={(payed) => this.confirmPayed(reservation, payed)}
                        />
                    )
                }
            },
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                const ids = flatMapDeep(selectedRows, ((reservation) => valuesIn(pick(reservation, '_id'))));
                this.setState({ reservationIds: ids });
            },
        };
        const { reservations, reservationIds } = this.state;
        return (
            <React.Fragment>
                <Button
                    onClick={this.deleteReservations}
                    icon="delete"
                    type="primary"
                    style={{ marginBottom: 10 }}
                    disabled={(reservationIds.length === 0)}
                >
                    Xóa Reservations
                </Button>
                <Table
                    columns={columns}
                    dataSource={reservations}
                    scroll={{ x: 1300 }}
                    rowSelection={rowSelection}
                />
            </React.Fragment>
        );
    }
}

TableAllReservation.propTypes = {

};

export default TableAllReservation;