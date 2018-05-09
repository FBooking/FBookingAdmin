import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { capitalize } from 'lodash';

import TableAllStadiums from '../../component/dashboard/stadium/TableAllStadiums'
import TableAllCategories from '../../component/dashboard/category/TableAllCategories'


class LayoutDashboard extends Component {
    constructor(props, context) {
        super(props);
        const tabActive = this.props.location.pathname.split('/').pop();
        console.log(tabActive);
        this.state = {
            collapsed: false,
            tabActive: tabActive || 'stadium',
        }
        this.toggleCollapsed = this.toggleCollapsed.bind(this);
        this.changeTab = this.changeTab.bind(this);
    }

    toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    changeTab(event) {

        this.setState({ tabActive: event.key })
        this.props.history.push(`/dashboard/${event.key}`)
    }

    render() {
        const { SubMenu } = Menu;
        const { Header, Content, Sider } = Layout;
        const { tabActive } = this.state;
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            onClick={this.changeTab}
                            defaultSelectedKeys={['stadium']}
                            selectedKeys={[tabActive]}
                            defaultOpenKeys={['stadium']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="reservation"><span><Icon type="shopping-cart" />Reservation</span></Menu.Item>
                            <Menu.Item key="stadium"><span><Icon type="bar-chart" />Stadium</span></Menu.Item>
                            <Menu.Item key="amenitie"><span><Icon type="solution" />Amenitie</span></Menu.Item>
                            <Menu.Item key="category"><span><Icon type="switcher" />Category</span></Menu.Item>
                            <Menu.Item key="district"><span><Icon type="environment" />District</span></Menu.Item>

                            {/* <SubMenu key="session" title={<span><Icon type="book" />Lịch đặt</span>}>
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu> */}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            <Breadcrumb.Item>{capitalize(this.state.tabActive)}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

        );
    }
}

LayoutDashboard.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(LayoutDashboard);
