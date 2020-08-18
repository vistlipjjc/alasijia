<template>
    <CheckboxGroup v-model="defaultValue" :size="size" @on-change="onChange">
        <Checkbox v-for="item in list" :key="item.value" :label="item.value" :disabled="disabled">{{item.name}}</Checkbox>
    </CheckboxGroup>
</template>

<script>
export default {
    name: 'jCheckbox',
    props: {
        value: Array, //指定选中项目的集合，可以使用 v-model 双向绑定数据
        size: { //多选框组的尺寸，可选值为 large、small、default 或者不设置
            type: String,
            default: 'default'
        },
        url: String, //查询地址
        disabled: { //是否禁用
            type:Boolean,
            default: false
        },
        trueValue	: { //选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
            type: [String, Number, Boolean],
            default: true
        },
        falseValue	: { //没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
            type: [String, Number, Boolean],
            default: false
        }
    },
    data () {
        return{
            defaultValue: this.value,
            list: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(){
            if(this.value){
                this.defaultValue = this.value;
            }
            if (/^fixedDict\:(\w+)/g.test(this.url))  //fixedDict
            {
                /^fixedDict\:(\w+)@(\w+)/g.test(this.url);
                let $class = RegExp.$1;
                let $service = RegExp.$2;
                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: $class, service: $service})
                    .then(data => {
                        this.list = data;
                    });
            }
            else if (/^dict\:(\w+)/g.test(this.url)) //dict
            {
                /^dict\:(\w+)@(\w+)/g.test(this.url);
                let $class = RegExp.$1;
                let $service = RegExp.$2;
                this.$store.dispatch('cache/cacheDict', {type: 'dict', url: $class, service: $service})
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
        /**
         * @augments data
         * 在选项状态发生改变时触发，返回当前状态。
         * 通过修改外部的数据改变时不会触发
         */
        onChange (data) {
            this.$emit('on-change', data);
        },
        getSelect(){
            return this.defaultValue;
        }
    },
    watch: {
        value (data) {
            this.defaultValue = data;
        }
    }
}
</script>

