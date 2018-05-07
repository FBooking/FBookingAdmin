import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, notification, Switch } from 'antd';

import ModalEditCategory from './ModalEditCategory';
import Fetch from '../../../../core/services/fetch';

class TableAllStadiums extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            categories: [],
            categorySelect: {},
        }
        this.addCategory = this.addCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.addCategorySuccess = this.addCategorySuccess.bind(this);
        this.updateCategorySuccess = this.updateCategorySuccess.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
    }

    async componentDidMount() {
        const categories = await Fetch.get('categories');
        this.setState({ categories })
    }

    addCategory() {
        this.categoryModal.toggle();
    }

    updateCategory(category) {
        this.setState({ categorySelect: category })
        this.categoryModal.handleOpen(category, true);
    }

    async deleteCategory(category) {
        const { _id } = category;
        const categories = this.state.categories;
        let index;
        const newCategories = categories.filter((_, idx) => _ !== category);
        const req = await Fetch.Delete(`category/${_id}`);
        if (req.ok) {
            notification.success({
                message: 'Thành công!',
                description: 'Xóa thông tin category thành công.',
            })
            this.setState({ categories: newCategories });
        }
    }

    addCategorySuccess(category) {
        const { categories } = this.state
        const newCategories = [...categories, category];
        this.setState({ categories: newCategories });
    }

    updateCategorySuccess(category) {
        const { categories, categorySelect } = this.state;
        const newCategories = categories.map((_, idx) => {
            if (_ === categorySelect) {
                return category
            }
            return _;
        });
        this.setState({ categories: newCategories });
    }

    render() {
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
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
                title: 'Action', dataIndex: '', key: 'x', render: (category) => {
                    return (
                        <React.Fragment>
                            <Button onClick={() => this.updateCategory(category)} icon="edit" style={{ marginLeft: 5 }} />
                            <Button onClick={() => this.deleteCategory(category)} icon="delete" style={{ marginLeft: 5 }} />
                        </React.Fragment>
                    )
                }
            },
        ];

        return (
            <React.Fragment>
                <Button onClick={this.addCategory} type="primary" style={{ marginBottom: 10 }}>Thêm sân</Button>
                <ModalEditCategory
                    ref={(instance) => this.categoryModal = instance}
                    addCategory={this.addCategorySuccess}
                    updateCategory={this.updateCategorySuccess}
                />
                <Table
                    columns={columns}
                    dataSource={this.state.categories}
                />
            </React.Fragment>
        );
    }
}

TableAllStadiums.propTypes = {

};

export default TableAllStadiums;