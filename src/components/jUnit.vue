<template>
    <Row>
        <Input v-model="unitName" @on-focus="open" @on-click="open" icon="ios-search" :placeholder="placeholder"></Input>
        <Modal v-model="visible" title="选择机构" @on-ok="ok" @on-cancel="cancel" :mask-closable="false" width="600" :transfer="false">
            <Row style="height: 300px;">
                <Tree ref="simpleTreeRef" v-if="!multiple" :data="treeNode" style="height: 300px; overflow: auto;"></Tree>
                <Tree ref="multiTreeRef" v-else show-checkbox :data="treeNode" style="height: 300px; overflow: auto;"></Tree>
            </Row>
        </Modal>
    </Row>
</template>

<script>
    export default {
        name: 'jUnit',
        props:{
            value: [String, Number, Array], //数据
            placeholder: String,  //默认提示文字
            multiple: {type: Boolean, default: false}
        },
        data () {
            return {
                unitCode:'', //机构编码
                unitName: this.value, //机构名称，用户输入框内显示使用
                visible: false, //是否打开 Modal 框的标志
                treeNode: [], //机构树数据
                selectedNode: [] //选中的机构树节点
            }
        },
        methods: {
            open(){
                this.visible = true;

                // 打开 Modal 时加载机构树数据
                if(this.treeNode.length == 0)
                {
                    this.$net.send({
                        server: this.$services.sysService.unitRestController.load
                    }).then((data)=>{
                        this.treeNode = data;
                    });
                }
            },
            ok () { //点击 Modal 框确认按钮
                let data = this.getChooseNodes();
                console.log(data); //数组对象，节点的所有数据
                this.$emit('on-select', data);
            },
            cancel () { //点击 Modal 框取消按钮
                this.unitCode = '';
                this.unitName = '';
                this.$emit('on-select', '');
            },
            // 获取机构树所有选中的节点
            getChooseNodes(){
                if (this.multiple) return this.$refs.multiTreeRef.getCheckedNodes();
                else return this.$refs.simpleTreeRef.getSelectedNodes();
            }
        },
        watch: {
            value(val){
                this.unitName = val;
            }
        }
    }
</script>

