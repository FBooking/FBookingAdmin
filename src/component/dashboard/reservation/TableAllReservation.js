import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';

import Fetch from '../../../core/services/fetch';

class TableAllReservation extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reservations: [],
        }
        this.confirmPayed = this.confirmPayed.bind(this);
    }

    async componentDidMount() {
        const reservations = await Fetch.get('reservations');
        this.setState({ reservations });
        console.log(reservations);
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
                console.log(selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
        const { reservations } = this.state;
        return (
            <Table
                columns={columns}
                dataSource={reservations}
                scroll={{ x: 1300 }}
                rowSelection={rowSelection}
            />
        );
    }
}

TableAllReservation.propTypes = {

};

export default TableAllReservation;