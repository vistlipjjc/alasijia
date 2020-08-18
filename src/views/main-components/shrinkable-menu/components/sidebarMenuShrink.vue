<template>
    <div>
        <template v-for="(item, index) in menuList">
            <!--<div style="text-align: center;" :key="index">-->

                <!--存在子菜单：二级菜单-->
                <Dropdown trigger="click" transfer v-if="item.children" placement="right-start" :key="index">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <img style="width: 18px; margin-top: -2px; margin-right: 8px;" :src="item.icon || item.children[0].icon" />
                        <div style="font-size: 11px;">{{ itemTitle(item) }}</div>
                    </Button>
                    <DropdownMenu style="width: 130px;" slot="list">
                        <template v-for="(child, i) in item.children">

                            <!--存在子菜单：三级菜单-->
                            <Dropdown trigger="click" transfer v-if="child.children" placement="right-start" :key="i">
                                <DropdownItem :name="child.name" :key="i"><span style="padding-right:10px;">{{ itemTitle(child) }}</span><Icon type="ios-arrow-right"></Icon></DropdownItem>
                                <template v-for="(thirdChild, thirdIndex) in child.children">
                                    <DropdownMenu style="width: 130px;" slot="list">
                                        <DropdownItem :name="thirdChild.name" :key="thirdIndex"><Icon :type="thirdChild.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(thirdChild) }}</span></DropdownItem>
                                    </DropdownMenu>
                                </template>
                            </Dropdown>

                            <!--不存在子菜单-->
                            <DropdownItem v-else :name="child.name" :key="i"><span style="padding-right:10px;">{{ itemTitle(child) }}</span><Icon :type="child.icon"></Icon></DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>

                <!--不存在子菜单-->
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
                    <Button @click="changeMenu(item.name)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon || item.icon"></Icon> -->
                        <img style="width: 18px; margin-top: -2px; margin-right: 8px;" :src="item.icon" />
                    </Button>
                    <DropdownMenu style="width: 130px;" slot="list">
                        <DropdownItem :name="item.name" :key="'d' + index"><Icon :type="item.icon || item.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(item) }}</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            <!--</div>-->
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
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
    }
};
</script>
