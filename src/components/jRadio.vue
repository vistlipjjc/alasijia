<template>
    <Radio-group v-model="defaultValue" :type="type" :size="size" :vertical="vertical" @on-change="onChange">
        <Radio v-for="item in list" :key="item.value" :label="item.value" :disabled="disabled"> {{item.name}} </Radio>
    </Radio-group>
</template>

<script>
export default {
    name: 'jRadio',
    props: {
        value: [String, Number], //指定当前选中的项目数据。可以使用 v-model 双向绑定数据
        type: String, //可选值为 button 或不填，为 button 时使用按钮样式
        size: {
            type: String,
            default: 'default'
        },
        vertical: { //是否垂直排列，按钮样式下无效
            type:Boolean,
            default: false
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
            if (/^fixedDict\:(\w+)/g.test(this.url))  //fixedDict
            {
                /^fixedDict\:(\w+)@(\w+)/g.test(this.url);
                let $class = RegExp.$1;
                let $service = RegExp.$2;
                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: $class, service: $service})
                    .then(data => {
                        this.list = data;
                        if(this.value){
                            this.defaultValue = this.value;
                        }else{
                            this.defaultValue = this.list[0].value;
                            this.onChange(this.defaultValue);
                        }
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
                        if(this.value){
                            this.defaultValue = this.value;
                        }else{
                            this.defaultValue = this.list[0].value;
                            this.onChange(this.defaultValue);
                        }
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
                        if(this.value){
                            this.defaultValue = this.value;
                        }else{
                            this.defaultValue = this.list[0].value;
                            this.onChange(this.defaultValue);
                        }
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
            return this.getValue();
        },
        getValue(){
            let obj = {value: this.defaultValue, name: ''};
            if(this.list.length > 0 && this.defaultValue)
            {
                obj = this.list.find((item) => {
                    return item.value === this.defaultValue;
                });
            }
            return obj;
        }
    },
    watch: {
        value (data) {
            this.defaultValue = data;
        }
    }
}
</script>

