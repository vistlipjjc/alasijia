<template>

    <Card>
        <Row style="height: 20px;">
            {{head}}
        </Row>
        <div style="border-top: 1px solid #E7EAEC; margin-top: 13px"></div>
        <Row style="text-align: right;height: 30px;line-height: 30px;font-size: 18px;color: #FF8C00;margin-top: 13px">
            {{content}}
        </Row>
        <div style="border-top: 1px solid #E7EAEC; margin-top: 13px"></div>
        <Row style="height: 50px; line-height: 50px;margin-top: 13px" type="flex" justify="space-around">
            <Col span="12" style="text-align: left;"><lable>{{left}}</lable><lable style="color: #EE4000;">{{leftValue}}</lable>{{unit}}</Col>
            <Col span="12" style="text-align: right;"><lable>{{right}}</lable><lable style="color: #71C671">{{rightValue}}</lable>{{unit}}</Col>
        </Row>
    </Card>

</template>

<script>
    export default {
        name: "rulesLogTotal",
        props: {
            head: String,
            content: String,
            left: {
                type: String,
                default: '环比：'
            },
            leftValue: String,
            right: {
                type: String,
                default: '同比：'
            },
            rightValue: String,
            unit: String
        }
    };
</script>
