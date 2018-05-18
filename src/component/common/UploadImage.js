import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal } from 'antd';
import { flatMapDeep, valuesIn, pick } from 'lodash'

import Fetch from '../../core/services/fetch'

class UploadImage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: this.props.fileList || [],
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { fileList } = nextProps;
        const oldFileList = this.props.findIndex;
        if (fileList !== oldFileList) {
            this.setState({ fileList });
        }
    }


    handleCancel() {
        this.setState({ previewVisible: false })
    }

    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange({ file }) {
        const { fileList } = this.state
        const newFileList = [...fileList, file];
        this.setState({ fileList: newFileList })
    }

    handleDelete(file) {
        const { fileList } = this.state;
        const fileIdx = fileList.findIndex((f, idb) => {
            return f === file;
        })
        fileList.splice(fileIdx, 1);
        this.setState({ fileList });
    }

    async onUpload(req) {
        const bodyFormData = new FormData();
        bodyFormData.set('file', req.file);
        const res = await Fetch.post('upload', bodyFormData, 1000000);
        if (res) {
            res.uid = res.public_id
            res.name = res.original_filename
            res.status = 'done'
            res.response = { status: "success" }
            const { fileList } = this.state
            fileList.splice(fileList.length - 1, 1, res)
            this.setState({ fileList }, () => {
                this.props.changeFile(fileList)
            })
        }
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    customRequest={this.onUpload}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.handleDelete}
                >
                    {uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

UploadImage.propTypes = {
    changeFile: PropTypes.func.isRequired,
    fileList: PropTypes.array.isRequired,
};

export default UploadImage;