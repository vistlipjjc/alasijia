<template>
    <div>
        <div v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <div v-if="imageTypes.indexOf(item.response.files[0].fileFormat) > -1" style="display:table;margin-top:3px">
                    <!-- 首先是一个展示格式的icon -->
                    <Icon type="image" style="font-size: 20px;display:table-cell;vertical-align:middle"/>&nbsp;&nbsp;
                    <span style="display:table-cell;vertical-align:middle">{{item.name}}</span>&nbsp;&nbsp;
                    <a href="#" @click="onPreviewInternal(item)" style="display:table-cell;vertical-align:middle">预览</a>&nbsp;&nbsp;
                    <a href="#" @click="handleDownload(item)" style="display:table-cell;vertical-align:middle">下载</a>&nbsp;&nbsp;
                    <a href="#" @click="onRemoveInternal(item, uploadList)" style="display:table-cell;vertical-align:middle">删除</a>
                </div>
                <div v-else style="display:table;margin-top:3px">
                    <Icon type="document" style="font-size:23px;display:table-cell;vertical-align:middle"/>&nbsp;&nbsp;
                    <span style="display:table-cell;vertical-align:middle">{{item.name}}</span>&nbsp;&nbsp;
                    <a href="#" @click="handleDownload(item)" style="display:table-cell;vertical-align:middle">下载</a>&nbsp;&nbsp;
                    <a href="#" @click="onRemoveInternal(item, uploadList)" style="display:table-cell;vertical-align:middle">删除</a>
                </div>
            </template>
            <!-- 上传的时候显示百分比 -->
            <template v-else>
                <Progress :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload ref="upload"
                :type="type"
                :show-upload-list="false"
                :multiple="multiple"
                :headers="defaultHeaders"
                :data="params"
                :action="action"
                :name="name"
                :format="format"
                :maxSize="maxSize"
                :before-upload="beforeUpload"
                :on-progress="onProgress"
                :on-success="onSuccessInternal"
                :on-error="onError"
                :on-preview="onPreviewInternal"
                :on-remove="onRemoveInternal"
                :on-format-error="onFormatError"
                :on-exceeded-size="onExceededSize">
            <slot></slot>
            <div v-if="type === 'drag'" style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或拖拽文件到此处上传</p>
            </div>
            <Button v-else type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
            <slot name="tip"></slot>
        </Upload>
        <Modal v-model="canPreview" title="查看图片">
            <img :src="previewData" style="width:100%"/>
            <div slot="footer">
                <Button type="info" size="large" @click="closeImg">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<style>
    .outer {
        display: table
    }
    .middle {
        display: table-cell;
        vertical-align: middle;
    }
</style>
<script>
    import app from '@/config/app';
    import store from '@/store';
    import util from '@/libs/util.js';
    import net from '@/util/net.js'

    export default {
        name: 'jUpload',
        props: {
            entityType: String, //附件上传类型，绑定的附件类型编码
            entityId: String, //附件上传绑定的实体编码
            uploadSession: String, //上传会话码
            uploadPath: {type: String, default: ''}, //上传地址，必填项
            headers: Object, //设置上传的请求头部
            multiple: {type: Boolean, default: true}, //是否支持多选文件
            data: Object, //上传时附带的额外参数
            name: {type: String, default: 'file'}, //上传的文件字段名
            type: {type: String, default: 'drag'}, //上传控件的类型，可选值为 select（点击选择），drag（支持拖拽）
            format: Array, //支持的文件后缀类型
            maxSize: Number, //文件大小限制，单位 kb
            beforeUpload: {type: Function}, //上传文件之前，参数为上传的文件，若返回 false 或者 Promise 则停止上传
            onProgress: {type: Function}, //文件上传中，返回字段为 event, file, fileList
            onSuccess: {type: Function}, //文件上传成功，返回字段为 response, file, fileList
            onError: {type: Function}, //文件上传失败，返回字段为 error, file, fileList
            onPreview: {type: Function}, //查看上传后的文件，返回字段为 file， 可以通过 file.response 拿到服务端返回数据
            onRemove: {type: Function}, //删除文件，返回字段为 file, fileList
            onFormatError: {type: Function}, //文件格式验证失败，返回字段为 file, fileList
            onExceededSize: {type: Function}, //文件超出指定大小限制，返回字段为 file, fileList

            /*
            *默认已上传的文件列表，例如：
            * [{
            *   name: 'img1.jpg'
            *   url: 'http://www.xxx.com/img1.jpg'
            * }]
            * */
            defaultFileList: Array,
        },
        data() {
            return {
                imageTypes: ['JPG', 'JPEG', 'PNG', 'GIF', 'jpg', 'jpeg', 'png', 'gif'],
                defaultHeaders: {},
                sessionUP: '',
                params: {},
                action: app.url.server + (this.uploadPath || '/attachment/attachment/upload'),
                // 附件图片预览的id
                previewId: '', 
                canPreview: false,
                // 预览图片的base64码
                previewData: '',
                uploadList: [],
                // 对图片进行缓存，简单实现了lru功能
                picCache: {
                    keys: [],
                    obj: {},
                    limit: 10,
                    count: 0,           
                    put: function(key, value) {
                        // 首先判断是否有缓存
                        if (this.obj.hasOwnProperty(key)) {
                            // 只有在缓存值不等于新值的时候才更新缓存
                            if (this.obj[key] !== value) {
                                this.obj[key] = value;
                            }
                            // 然后将key移动至最前面
                            let pos = this.keys.indexOf(key);
                            if (pos !== -1) {
                                this.keys.splice(pos, 1);
                                this.keys.unshift(key);
                            }
                        } else {
                            // 如果count < limit，那么首先把计数+1
                            if (this.count < this.limit) {
                                this.count ++;
                            } else {
                                // 否则首先删除key和value
                                let removedKey =this. keys.pop();
                                delete this.obj[removedKey];
                            }
                            // 然后保存key和value
                            this.keys.unshift(key);
                            this.obj[key] = value;
                        }
                    },
                    get: function(key) {
                        if (this.obj.hasOwnProperty(key)) {
                            let result = this.obj[key];
                            // 将get拿到的key放在keys的第一位去
                            let pos = this.keys.indexOf(key);
                            if (pos !== -1) {
                                this.keys.splice(pos, 1);
                                this.keys.unshift(key);
                            }
                            return result;
                        } else {
                            return undefined;
                        }
                    },
                    contains: function(key) {
                        return this.obj.hasOwnProperty(key);
                    },
                    remove: function(key) {
                        if (this.obj.hasOwnProperty(key)) {
                            // 首先删除原数据
                            delete this.obj[key];
                            let pos = this.keys.indexOf(key);
                            if (pos !== -1) {
                                this.keys.splice(pos, 1);
                            }
                            this.count --;
                        }
                    }
                }
            }
        },
        mounted(){
            let userToken = store.getters.userToken;
            this.defaultHeaders = Object.assign({'x-user-token': userToken} || {}, this.headers);

            let sessionUP = this.uploadSession || util.uuid();
            this.params = Object.assign({'attachTypeCode': this.entityType, 'uploadSession': sessionUP} || {}, this.data);

            // 初始化文件上传列表
            this.uploadList = this.$refs.upload?this.$refs.upload.fileList.slice(0):[];
        },
        computed: {
        },
        methods: {
            //清空已上传的文件列表
            clear(){
                this.$refs.upload.clearFiles();
            },
            // 返回文件上传会话码
            getSession(){
                return this.uploadSession
            }, 
            // 文件上传成功回调
            onSuccessInternal(response, file, fileList) {
                if (this.onSuccess !== undefined) {
                    this.onSuccess(response, file, fileList);
                } else {
                    // 如果文件上传成功，那么将其添加进uploadList中
                    if (response.success) {
                        this.uploadList.push(file);
                    } else {
                        // 否则不添加进uploadList中并从fileList中删除此file
                        let index = fileList.indexOf(file);
                        if (index > -1) {
                            fileList.splice(index, 1);
                        }
                    }
                }
            },
            onPreviewInternal(file) {
                this.canPreview = false;
                if (this.onPreview !== undefined) {
                    this.onPreview(file);
                } else {
                    if (file.status !== "finished") {
                        // 如果是没有完成上传，那么不进行任何操作
                        return;
                    }
                    // 首先获取附件对象
                    let attachment = file.response["files"][0];
                    let fileFormat = attachment.fileFormat;
                    // 如果没有拿到文件格式，直接返回
                    if (fileFormat === undefined) {
                        return;
                    }
                    // 对文件格式进行判断，目前只支持对图片文件的预览
                    let picFormats = ["PNG", "JPG", "JPEG", "GIF", "png", "jpg", "jpeg", "gif"];
                    let formatString = "." + picFormats.join(",") + ",";
                    if (formatString.indexOf(fileFormat)) {
                        let attachmentId = attachment.id;
                        if (this.picCache.contains(attachmentId)) {
                            this.previewData = this.picCache.get(attachmentId);
                            this.canPreview = true;
                        } else {
                            // 获取图片预览的路径
                            let previewUrl = app.url.server + '/attachment/attachment/preview/img/' + attachmentId;
                            // 然后发起ajax请求获取到图片的base码并显示
                            net.ajax({
                                url: previewUrl,
                                type: "POST"
                            }).then((response) => {

                                if (response.success) {
                                    let data = response.data;
                                    if (data !== undefined && data.slice(0, 11) === "data:image/") {
                                        this.previewData = data;
                                        this.canPreview = true;
                                        this.picCache.put(attachmentId, data);
                                    } else {
                                        console.log("响应数据为空!");
                                    }
                                } else {

                                }
                            }).catch((error) => {
                                console.log("预览异常");
                                console.log(error);
                            })
                        }
                    } else {
                        // 除了图片类型都不能预览，此时应当弹出提示
                    }
                }
            },
            // 获取到的fileList是已经将file移除了的
            onRemoveInternal: function(file, fileList) {
                if (this.onRemove !== undefined) {
                    this.onRemove(file, fileList);
                } else {
                    // 首先获取附件对象
                    let attachment = file.response["files"][0];
                    // 然后获取到attachment的id
                    let attachmentId = attachment.id;
                    // 首先请求删除接口
                    let removeUrl = app.url.server + '/attachment/attachment/remove/' + attachmentId;
                    net.ajax({
                        url: removeUrl,
                        type: "POST"
                    }).then((response) => {
                        // 如果删除成功，那么将其从uploadList中删除
                        if (response.success) {
                            let index = this.uploadList.indexOf(file);
                            if (index > -1) {
                                this.uploadList.splice(index, 1);
                            }
                        } 
                    }).catch ((error) => {
                        // 删除出现异常的话给一个“删除失败”的提醒
                    });
                }
            }, 
            // 处理下载
            handleDownload: function(file) {
                console.log("准备处理下载。。。");
                let attachment = file.response.files[0];
                let id = attachment.id;
                if (id !== undefined) {
                    let token = sessionStorage.getItem("userToken");
                    // 没有token的话就不处理
                    if (token === undefined) {
                        return;
                    }
                    let url = app.url.server + '/attachment/attachment/download/' + id + "?token=" + token;
                    // 使用url创建一个<a />
                    let link = document.createElement("a");
                    link.setAttribute("target", "_blank");
                    link.setAttribute("href", url);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
            },
            closeImg(){
                this.canPreview = false;
            }
        }
    }
</script>
