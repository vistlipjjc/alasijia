<template>
    <div>
        <span class="keyLabel" v-if="!fullLine">{{labelName}}：</span>
        <span class="keyValue" v-if="!fullLine">{{labelValue}}</span>
        <span class="keyLabelLong" v-if="fullLine">{{labelName}}：</span>
        <span class="keyValueLong" v-if="fullLine">{{labelValue}}</span>
    </div>
</template>

<script>
export default {
    name: 'jLabel',
    props: {
        name: String,
        value: String,
        default: String,
        fullLine: {
            type: Boolean,
            default: false
        }
    },
    created () {
        this.init();
    },
    data () {
        return {
            labelName: this.name,
            labelValue: '',
            _class: '',
            _column: '',
            _server: ''
        };
    },
    methods: {
        init () {
            var row = this.$route.query.row;

            if (/^fixedDict\:(\w+)/g.test(this.value)) // fixedDict
            {
                /^fixedDict\:(\w+).(\w+)@(\w+)/g.test(this.value);
                this._class = RegExp.$1;
                this._column = RegExp.$2;
                this._server = RegExp.$3;

                this.$store.dispatch('cache/cacheDict', {type: 'fixedDict', url: this._class, service: this._server})
                    .then(data => {
                        this.labelValue = this.$store.getters['cache/getCacheDictName'](this._class, row[ this._column]);
                    });
            } else if (/^dict\:(\w+)/g.test(this.value)) // dict
            {
                /^dict\:(\w+).(\w+)@(\w+)/g.test(this.value);
                this._class = RegExp.$1;
                this._column = RegExp.$2;
                this._server = RegExp.$3;

                this.$store.dispatch('cache/cacheDict', {type: 'dict', url: this._class, service: this._server})
                    .then(data => {
                        this.labelValue = this.$store.getters['cache/getCacheDictName'](this._class, row[ this._column]);
                    });
            } else if (/^custom\:(.+)/g.test(this.value)) // 自定义
            {
                /^custom\:([\w\/]*).(\w+)@(\w+)/g.test(this.value);
                this._class = RegExp.$1;
                this._column = RegExp.$2;
                this._server = RegExp.$3;

                this.$store.dispatch('cache/cacheDict', {type: 'custom', url: this._class, service: this._server})
                    .then(data => {
                        this.labelValue = this.$store.getters['cache/getCacheDictName'](this._class, row[ this._column]);
                    });
            } else if (this.default) {
                this.labelValue = this.default;
            } else {
                this.labelValue = row['' + this.value + ''];
            }
        }
    },
    watch: {
        default (val) {
            this.labelValue = val;
        }
    }
};
</script>
