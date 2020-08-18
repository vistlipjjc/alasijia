<template>
    <Select v-model="defaultValue":transfer="transfer" :disabled="disabled" :placeholder="placeholder"
            :clearable="clearable" :filterable="filterable" :multiple="multiple" :labelInValue="labelInValue"
            @on-change="onSelect">
        <Option v-for="(item, index) in list" :value="item.value" :key="index">{{ item.name }}</Option>
    </Select>
</template>

<script>
import { RTYPE } from '@/util/common';

export default {
    name: 'jSelect',
    props: {
        value: [String, Number, Array], //字段值
        optionList: Array, //选相列表
        param: Object, //查询参数
        url: String, //查询地址
        default: String, //默认值
        placeholder: String, //默认显示文字
        multiple: { //是否支持多选
            type: Boolean,
            default: false
        },
        disabled: { //是否禁用
            type: Boolean,
            default: false
        },
        clearable: { //是否可以清空选项，只在单选时有效
            type: Boolean,
            default: false
        },
        filterable: { //是否支持搜索
            type: Boolean,
            default: false
        },
        transfer: { //是否将弹层放置于 body 内, 带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
            type: Boolean,
            default: false
        },
        labelInValue:  { //在返回选项时，是否将 label 和 value 一并返回，默认只返回 value
            type: Boolean,
            default: false
        },
    },
    data () {
        return {
            defaultValue: this.value,
            list: this.optionList,
        }
    },
    created () {
        this.init();
    },
    methods:{
        init(){
            if(this.default){
                this.defaultValue = this.default
            }

            if (/^fixedDict\:(\w+)/g.test(this.url))  //fixedDict
            {
                /^fixedDict\:(\w+)@(\w+)/g.test(this.url);
                let $class = RegExp.$1;
                let $service = RegExp.$2;
                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: $class, service: $service, param: this.param})
                    .then(data => {
                        this.list = data;
                    });
            }
            else if (/^dict\:(\w+)/g.test(this.url)) //dict
            {
                /^dict\:(\w+)@(\w+)/g.test(this.url);
                let $class = RegExp.$1;
                let $service = RegExp.$2;
                this.$store.dispatch('cache/cacheDict', {type: 'dict', url: $class, service: $service, param: this.param})
                    .then(data => {
                        this.list = data;
                    });
            }
            else if (/^custom\:(.+)/g.test(this.url)) //自定义
            {
                /^custom\:([\w\/]*)@(\w+)/g.test(this.url);
                let $class = RegExp.$1;
                let $service = RegExp.$2;
                this.$store.dispatch('cache/cacheDict', {type: 'custom', url: $class, service: $service, param: this.param})
                    .then(data => {
                        this.list = data;
                    });
            }
        },
        onSelect(val){
            this.$emit('on-change', val);
        },
        getSelect(){
            let obj = {value: this.defaultValue, name: ''};
            if(this.list.length > 0 && this.defaultValue){
                obj = this.list.find((item) => {
                    return item.value === this.defaultValue;
                });
            }
            return obj;
        },
        load(){
            this.init();
        },
        clear(){
            this.list = [];
        },
        clearSelect(){
          this.defaultValue = ''
        }
    },
    watch: {
        value (data) {
            if(data){
                let arr = data.split(",");
                this.defaultValue = arr;
            }
            else this.defaultValue = data;
        },
        optionList (val){
            this.list = val;
        }
    }
}
</script>
