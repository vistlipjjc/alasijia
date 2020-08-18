<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <!-- <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu" accordion> -->
    <!-- 把:open-names="openNames"去掉，解决菜单有时候展开多个的问题 -->
    <Menu ref="sideMenu" :active-name="$route.name" :theme="menuTheme" width="auto" @on-select="changeMenu" accordion>
        <template v-for="item in menuList">
            <!-- 一级菜单没有子菜单，点击跳转页面 -->
            <MenuItem v-if="item.name === 'actionRouter'" :name="item.children[0].name"
              :key="'menuitem' + item.children[0].name">
                <img style="width: 18px; margin-top: -2px; margin-right: 8px;" :src="item.children[0].icon" />
                <span class="layout-text">{{ itemTitle(item.children[0]) }}</span>
            </MenuItem>

            <!-- 一级菜单有子菜单的 -->
            <Submenu :name="item.name" :key="item.name" v-else>
                <template slot="title">
                    <img style="width: 18px; margin-top: -2px; margin-right: 8px;" :src="item.icon" />
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>

                <template v-for="child in item.children">
                    <MenuItem v-if="!child.children" :name="child.name" :key="'menuitem' + child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>

                    <Submenu v-else :name="child.name" :key="child.name">
                        <template slot="title">
                            <Icon :type="child.icon" :size="iconSize"></Icon>
                            <span class="layout-text">{{ itemTitle(child) }}</span>
                        </template>
                        <template v-for="third in child.children">
                            <MenuItem :name="third.name" :key="'menuitemthird' + third.name">
                                <Icon :type="third.icon" :size="iconSize" :key="'icon' + third.name"></Icon>
                                <span class="layout-text" :key="'title' + third.name">{{ itemTitle(third) }}</span>
                            </MenuItem>
                        </template>
                    </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
