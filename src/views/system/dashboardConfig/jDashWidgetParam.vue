<template>
    <Collapse active-key="collapse1" accordion>
        <Panel key="collapse1">
            基础
            <p slot="content">
                <Tabs active-key="baseTabs1">
                    <Tab-pane label="通用" key="baseTabs1">
                        <Card>
                            <Row>
                                <Col span="11">
                                <Checkbox ref="animationCheck" v-model="editForm.animationCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="animationCheckChange($refs.animation,editForm.animationCheck)"></Checkbox>
                                动画(建议IE8关闭)
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.animation" ref="animation"
                                            @on-change="animationChange(editForm.animation)">
                                    <Radio label="Y" :disabled="editForm.animationCheck == 'N'">
                                        是
                                    </Radio>
                                    <Radio label="N" :disabled="editForm.animationCheck == 'N'">
                                        否
                                    </Radio>
                                </RadioGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.chartsBgColorCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="chartsBgColorCheckChange($refs.chartsBgColor,editForm.chartsBgColorCheck)"></Checkbox>
                                图整体背景颜色
                                </Col>
                                <Col span="11">
                                <ColorPicker ref="chartsBgColor" v-model="editForm.chartsBgColor" :disabled="editForm.chartsBgColorCheck == 'N'"
                                             @on-change="chartsBgColorChange(editForm.chartsBgColor)"/>
                                </Col>

                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.seriesChartsTypeNormalCheck"
                                          true-value="Y" false-value="N"
                                ></Checkbox>
                                系列的图形类型
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.line2SmoothCurveN"
                                            @on-change="seriesChartsTypeNormal(editForm.line2SmoothCurveN)">
                                    <Radio label="bar" :disabled="editForm.seriesChartsTypeNormalCheck == 'N'">
                                        柱
                                    </Radio>
                                    <Radio label="line" :disabled="editForm.seriesChartsTypeNormalCheck == 'N'">
                                        折线
                                    </Radio>
                                </RadioGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.line2SmoothCurveCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesFirstPCheckChange($refs.line2SmoothCurve,editForm.line2SmoothCurveCheck,'smooth')"></Checkbox>
                                折线转为平滑曲线
                                </Col>
                                <Col span="11">
                                <RadioGroup ref="line2SmoothCurve" v-model="editForm.line2SmoothCurve"
                                            @on-change="seriesFirstPChange(editForm.line2SmoothCurve,'smooth')">
                                    <Radio label="Y" :disabled="editForm.line2SmoothCurveCheck == 'N'">
                                        是
                                    </Radio>
                                    <Radio label="N" :disabled="editForm.line2SmoothCurveCheck == 'N'">
                                        否
                                    </Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'radar'">
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.symbolSizeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="symbolSizeCheckChange($refs.symbolSize,editForm.symbolSizeCheck)"></Checkbox>
                                小标志大小
                                </Col>
                                <Col span="11">
                                <Input-number ref="symbolSize" :max="20" :min="2"
                                              style="width: 100%"
                                              v-model="editForm.symbolSize" :disabled="editForm.symbolSizeCheck == 'N'"
                                              @on-change="symbolSizeChange(editForm.symbolSize)"></Input-number>
                                </Col>

                            </Row>
                        </Card>
                    </Tab-pane>
                    <Tab-pane label="统计项" key="baseTabs2">

                        <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.seriesChartsTypeCheck" true-value="Y" disabled
                                          false-value="N"
                                ></Checkbox>
                                系列的图形类型
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.seriesTypeValue" @on-change="seriesChartsType(editForm.seriesTypeValue,'type')">
                                    <Radio label="bar">柱
                                    </Radio>
                                    <Radio label="line">
                                        折线
                                    </Radio>
                                </RadioGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.smoothCurveCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.smoothCurve,editForm.smoothCurveCheck,'smooth')"></Checkbox>
                                折线转为平滑曲线
                                </Col>
                                <Col span="11">
                                <RadioGroup ref="smoothCurve" v-model="editForm.smoothCurve"
                                            @on-change="seriesFirstPChange(editForm.smoothCurve,'smooth')">
                                    <Radio label="Y" :disabled="editForm.smoothCurveCheck == 'N'">
                                        是
                                    </Radio>
                                    <Radio label="N" :disabled="editForm.smoothCurveCheck == 'N'">
                                        否
                                    </Radio>
                                </RadioGroup>
                                </Col>

                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'gauge'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图数值设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeRangeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="gaugeRangeCheckChange($refs.gaugeRange,editForm.gaugeRangeCheck,'min','max')"
                                ></Checkbox>
                                值域范围
                                </Col>
                                <Col span="11">
                                <Slider ref="gaugeRange" v-model="editForm.gaugeRange" range
                                        :min="0" :max="150" show-input show-tip="always"
                                        :disabled="editForm.gaugeRangeCheck == 'N'"
                                        @on-input="inputGaugeRangeCheckChange(editForm.gaugeRange,'min','max')"></Slider>
                                </Col>

                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.splitNumberCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.splitNumber,editForm.splitNumberCheck,'splitNumber')"></Checkbox>
                                分割段数
                                </Col>
                                <Col span="11">
                                <Slider ref="splitNumber" v-model="editForm.splitNumber"
                                        :min="0" :max="100" show-input
                                        :disabled="editForm.splitNumberCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.splitNumber,'splitNumber')"></Slider>
                                </Col>

                            </Row>
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图基础设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeColorCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.splitNumber,editForm.gaugeColorCheck,'splitNumber')"></Checkbox>
                                油量图颜色
                                </Col>
                                <Col span="11">
                                </Col>

                            </Row>
                            <Row>
                                <Col span="4">
                                <Checkbox v-model="editForm.gaugeCenterCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSliderXYChange($refs.splitNumber,editForm.gaugeColorCheck,'splitNumber')"></Checkbox>
                                圆心坐标
                                </Col>
                                <Col span="1">
                                <span>x:</span>
                                </Col>
                                <Col span="8">

                                <Slider ref="gaugeCenterX" v-model="editForm.gaugeCenterX"
                                        :min="0" :max="100" show-input input-size="small"
                                        :disabled="editForm.gaugeCenterCheck == 'N'"
                                        @on-input="inputSeriesSliderXChange($refs.gaugeCenterX,$refs.gaugeCenterY,'center')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> %</span>
                                </Col>
                                <Col span="1">
                                <span>y:</span>
                                </Col>
                                <Col span="8">
                                <Slider ref="gaugeCenterY" v-model="editForm.gaugeCenterY"
                                        :min="0" :max="100" show-input input-size="small"
                                        :disabled="editForm.chartsBgColorCheck == 'N'"
                                        @on-input="inputSeriesSliderYChange($refs.gaugeCenterX,$refs.gaugeCenterY,'center')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> %</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeRadiusCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.splitNumber,editForm.gaugeColorCheck,'radius')"></Checkbox>
                                半径
                                </Col>
                                <Col span="11">

                                <Slider ref="gaugeRadius" v-model="editForm.gaugeRadius"
                                        :min="0" :max="100" show-input input-size="small"
                                        :disabled="editForm.gaugeRadiusCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.gaugeRadius,'radius')"></Slider>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeStartAngleCheck" true-value="Y" false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.gaugeStartAngle, editForm.gaugeStartAngleCheck, 'startAngle')"
                                ></Checkbox>
                                起始角度
                                </Col>
                                <Col span="11">
                                <Slider ref="gaugeStartAngle" v-model="editForm.gaugeStartAngle"
                                        :min="-90" :max="270" show-input input-size="small"
                                        :disabled="editForm.gaugeStartAngleCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.gaugeStartAngle,'startAngle')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> °</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeEndAngleCheck" true-value="Y" false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.gaugeEndAngle, editForm.gaugeEndAngleCheck, 'endAngle')"
                                ></Checkbox>
                                结束角度
                                </Col>
                                <Col span="11">
                                <Slider ref="gaugeEndAngle" v-model="editForm.gaugeEndAngle"
                                        :min="-90" :max="270" show-input input-size="small"
                                        :disabled="editForm.gaugeEndAngleCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.gaugeEndAngle,'endAngle')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> °</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'gauge'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图内标题</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeTitleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="gaugeShowCheckChange($refs.gaugeTitle,editForm.gaugeTitleCheck,'title','show')"></Checkbox>
                                是否显示内标题
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.gaugeTitle" ref="gaugeTitle"
                                            @on-change="gaugeShowChange(editForm.gaugeTitle,'title','show')">
                                    <Radio label="Y" :disabled="editForm.gaugeTitleCheck == 'N'">是</Radio>
                                    <Radio label="N" :disabled="editForm.gaugeTitleCheck == 'N'">否</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeTitleSizeCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="seriesBorderWthCheckChange( $refs.gaugeTitleSizeTchPin,editForm.gaugeTitleSizeCheck,'title','textStyle','fontSize')"></Checkbox>
                                字体大小
                                </Col>
                                <Col span="11">
                                <Input-number ref="gaugeTitleSizeTchPin" :max="30" :min="10"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.gaugeTitleSizeTchPin"
                                              :disabled="editForm.gaugeTitleSizeCheck == 'N'"
                                              @on-change="seriesBorderWthChange($refs.gaugeTitleSizeTchPin,'title','textStyle','fontSize')"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeTitleStyleCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="gaugeStyleCheckChange($refs.gaugeTitleStyle,$refs.gaugeTitleStyleBold,editForm.gaugeTitleStyleCheck,'fontStyle','gaugeTitleStyleBold')"></Checkbox>
                                字体样式
                                </Col>
                                <Col span="5">
                                <Checkbox v-model="editForm.gaugeTitleStyleBold"
                                          true-value="Y" false-value="N"
                                          ref="gaugeTitleStyleBold"
                                          :disabled="editForm.gaugeTitleStyleCheck == 'N'"
                                          @on-change="gaugeStyleBoldChange(editForm.gaugeTitleStyleBold, 'title','textStyle','fontWeight')"></Checkbox>
                                加粗
                                </Col>
                                <Col span="6">
                                <RadioGroup v-model="editForm.gaugeTitleStyle" ref="gaugeTitleStyle"
                                            @on-change="gaugeStyleChange(editForm.gaugeTitleStyle, 'title','textStyle','fontStyle')">
                                    <Radio label="normal" :disabled="editForm.gaugeTitleStyleCheck == 'N'">普通</Radio>
                                    <Radio label="italic" :disabled="editForm.gaugeTitleStyleCheck == 'N'">斜体</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'gauge'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图内数据描述设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeDataCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="gaugeShowCheckChange($refs.gaugeData,editForm.gaugeDataCheck,'detail','show')"></Checkbox>
                                是否显示数据描述
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.gaugeData" ref="gaugeData"
                                            @on-change="gaugeShowChange(editForm.gaugeData,'detail','show')">
                                    <Radio label="Y" :disabled="editForm.gaugeDataCheck == 'N'">是</Radio>
                                    <Radio label="N" :disabled="editForm.gaugeDataCheck == 'N'">否</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeTitleBgColor" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeColorChange($refs.gaugeTitleBgClrpkr,editForm.gaugeTitleBgColor,'detail','backgroundColor')"></Checkbox>
                                数据描述背景颜色
                                </Col>
                                <Col span="11">
                                <ColorPicker ref="gaugeTitleBgClrpkr" v-model="editForm.gaugeTitleBgClrpkr"
                                             @on-change="inputSeriesGaugeColorChange(editForm.gaugeTitleBgClrpkr,'detail','backgroundColor')"
                                             :disabled="editForm.gaugeTitleBgColor == 'N'"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeFormatterCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeColorChange($refs.remindTmpNormal,editForm.gaugeFormatterCheck,'detail','formatter')"></Checkbox>
                                数据描述内容模板
                                </Col>
                                <Col span="11">
                                <Input ref="remindTmpNormal" v-model="editForm.remindTmpNormal"
                                       @on-keyup="inputSeriesGaugeColorChange(editForm.remindTmpNormal,'detail','formatter')"
                                       :disabled="editForm.gaugeFormatterCheck == 'N'"/>

                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeTitleBorderWidthCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeCheckChange($refs.gaugeTitleBorderWidth,editForm.gaugeTitleBorderWidthCheck,'detail','borderWidth')"></Checkbox>
                                数据描述边框线宽
                                </Col>
                                <Col span="11">
                                <Slider ref="gaugeTitleBorderWidth" v-model="editForm.gaugeTitleBorderWidth"
                                        :min="0" :max="3" show-input input-size="small"
                                        @on-input="seriesGaugeChange(editForm.gaugeTitleBorderWidth,'detail','borderWidth')"
                                        :disabled="editForm.gaugeTitleBorderWidthCheck == 'N'"></Slider>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeTitleBorderColorCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeColorChange($refs.gaugeTitleBorderColorClrpkr,editForm.gaugeTitleBorderColorCheck,'detail','borderColor')"></Checkbox>
                                数据描述边框颜色
                                </Col>
                                <Col span="11">
                                <ColorPicker ref="gaugeTitleBorderColorClrpkr"
                                             v-model="editForm.gaugeTitleBorderColorClrpkr"
                                             @on-change="inputSeriesGaugeColorChange(editForm.gaugeTitleBorderColorClrpkr,'detail','borderColor')"
                                             :disabled="editForm.gaugeTitleBorderColorCheck == 'N'"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeDataSizeCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="seriesBorderWthCheckChange( $refs.gaugeDataSizeTchPin,editForm.gaugeDataSizeCheck,'detail','textStyle','fontSize')"></Checkbox>
                                字体大小
                                </Col>
                                <Col span="11">
                                <Input-number ref="gaugeDataSizeTchPin" :max="30" :min="10"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.gaugeDataSizeTchPin"
                                              @on-change="seriesBorderWthChange($refs.gaugeDataSizeTchPin,'detail','textStyle','fontSize')"
                                              :disabled="editForm.gaugeDataSizeCheck == 'N'"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeDataStyleCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="gaugeStyleCheckChange($refs.gaugeDataStyle,$refs.gaugeDataStyleBold,editForm.gaugeDataStyleCheck,'textStyle','fontStyle','gaugeDataStyleBold')"></Checkbox>
                                字体样式
                                </Col>
                                <Col span="5">
                                <Checkbox v-model="editForm.gaugeDataStyleBold"
                                          true-value="Y" false-value="N"
                                          ref="gaugeDataStyleBold"
                                          @on-change="gaugeStyleBoldChange(editForm.gaugeDataStyleBold, 'detail','textStyle','fontStyle')"></Checkbox>
                                加粗
                                </Col>
                                <Col span="6">
                                <RadioGroup v-model="editForm.gaugeDataStyle" ref="gaugeDataStyle"
                                            @on-change="gaugeStyleChange(editForm.gaugeDataStyle, 'detail','textStyle','fontStyle')">
                                    <Radio label="normal" :disabled="editForm.gaugeDataStyleCheck == 'N'">普通</Radio>
                                    <Radio label="italic" :disabled="editForm.gaugeDataStyleCheck == 'N'">斜体</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'gauge'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图轮廓线设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeAxisWidthCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesBorderWthCheckChange($refs.gaugeAxisWidthTchPin,editForm.gaugeAxisWidthCheck, 'axisLine','lineStyle','width')"></Checkbox>
                                轮廓宽度
                                </Col>
                                <Col span="11">
                                <Input-number ref="gaugeAxisWidthTchPin" :max="30" :min="5"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.gaugeAxisWidthTchPin"
                                              :disabled="editForm.gaugeAxisWidthCheck == 'N'"
                                              @on-change="seriesBorderWthChange($refs.gaugeAxisWidthTchPin,'axisLine','lineStyle','width')"></Input-number>
                                </Col>
                            </Row>
                            <Row v-show="editForm.seriesTypeValue == 'gauge'">
                                <Col span="11">
                                <Checkbox v-model="editForm.lineSizeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeCheckChange($refs.lineSizeTchPin,editForm.lineSizeCheck,'splitLine','length')"></Checkbox>
                                主分隔线长度
                                </Col>
                                <Col span="11">
                                <Input-number ref="lineSizeTchPin" :max="100" :min="0"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.lineSizeTchPin"
                                              :disabled="editForm.lineSizeCheck == 'N'"
                                              @on-change="seriesGaugeChange(editForm.lineSizeTchPin,'splitLine','length')"></Input-number>
                                </Col>
                            </Row>
                            <Row v-show="editForm.seriesTypeValue == 'gauge'">
                                <Col span="11">
                                <Checkbox v-model="editForm.subLineSizeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeCheckChange($refs.subLineSizeTchPin,editForm.subLineSizeCheck,'axisTick','length')"></Checkbox>
                                刻度线长度
                                </Col>
                                <Col span="11">
                                <Input-number ref="subLineSizeTchPin" :max="20" :min="0"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.subLineSizeTchPin"
                                              :disabled="editForm.subLineSizeCheck == 'N'"
                                              @on-change="seriesGaugeChange(editForm.subLineSizeTchPin,'axisTick','length')"></Input-number>
                                </Col>
                            </Row>
                            <Row v-show="editForm.seriesTypeValue == 'gauge'">
                                <Col span="11">
                                <Checkbox v-model="editForm.splitNumCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeCheckChange($refs.splitNumTchPin,editForm.splitNumCheck,'axisTick','splitNumber')"></Checkbox>
                                刻度线分隔段数
                                </Col>
                                <Col span="11">
                                <Input-number ref="splitNumTchPin" :max="20" :min="0"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.splitNumTchPin"
                                              :disabled="editForm.splitNumCheck == 'N'"
                                              @on-change="seriesGaugeChange(editForm.splitNumTchPin,'axisTick','splitNumber')"></Input-number>
                                </Col>
                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'gauge'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图刻度文字设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeFontContentCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesGaugeColorChange($refs.gaugeFontTmpNormal,editForm.gaugeFontContentCheck,'axisLabel','formatter')"></Checkbox>
                                刻度文字内容模板
                                </Col>
                                <Col span="11">
                                <Input ref="gaugeFontTmpNormal" v-model="editForm.gaugeFontTmpNormal"
                                       :disabled="editForm.gaugeFontContentCheck == 'N'"
                                       @on-keyup="inputSeriesGaugeColorChange(editForm.gaugeFontTmpNormal,'axisLabel','formatter')"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeFontSizeCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="seriesBorderWthCheckChange( $refs.gaugeFontSizeTchPin,editForm.gaugeFontSizeCheck,'axisLabel','textStyle','fontSize')"></Checkbox>
                                字体大小
                                </Col>
                                <Col span="11">
                                <Input-number ref="gaugeFontSizeTchPin" :max="20" :min="10"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.gaugeFontSizeTchPin"
                                              :disabled="editForm.gaugeFontSizeCheck == 'N'"
                                              @on-change="seriesBorderWthChange($refs.gaugeFontSizeTchPin,'axisLabel','textStyle','fontSize')"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugeFontStyleCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="gaugeStyleCheckChange($refs.gaugeFontStyle,$refs.gaugeFontStyleBold,editForm.gaugeFontStyleCheck,'textStyle','fontStyle','gaugeStyleBold')"></Checkbox>
                                字体样式
                                </Col>
                                <Col span="5">
                                <Checkbox v-model="editForm.gaugeFontStyleBold"
                                          true-value="Y" false-value="N"
                                          ref="gaugeFontStyleBold"
                                          @on-change="gaugeStyleBoldChange(editForm.gaugeFontStyleBold, 'axisLabel','textStyle','fontWeight')"></Checkbox>
                                加粗
                                </Col>
                                <Col span="6">
                                <RadioGroup v-model="editForm.gaugeFontStyle" ref="gaugeDataStyle"
                                            @on-change="gaugeStyleChange(editForm.gaugeFontStyle, 'axisLabel','textStyle','fontStyle')">
                                    <Radio label="normal" :disabled="editForm.gaugeFontStyleBold == 'N'">普通</Radio>
                                    <Radio label="italic" :disabled="editForm.gaugeFontStyleBold == 'N'">斜体</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'gauge'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">油量图指针设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugePointerLengthCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="seriesGaugeCheckChange( $refs.gaugePointerLength,editForm.gaugePointerLengthCheck,'pointer','length')"></Checkbox>
                                指针长度
                                </Col>
                                <Col span="11">
                                <Input-number ref="gaugePointerLength" :max="100" :min="0"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.gaugePointerLength"
                                              :disabled="editForm.gaugePointerLengthCheck == 'N'"
                                              @on-change="seriesGaugeChange(editForm.gaugePointerLength,'pointer','length')"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.gaugePointerWithCheck"
                                          true-value="Y" false-value="N"
                                          @on-change="seriesGaugeCheckChange( $refs.gaugePointerWithTchPin,editForm.gaugePointerWithCheck,'pointer','width')"></Checkbox>
                                指针宽度
                                </Col>
                                <Col span="11">
                                <Input-number ref="gaugePointerWithTchPin" :max="30" :min="3"
                                              style="width: 100%" input-size="small"
                                              v-model="editForm.gaugePointerWithTchPin"
                                              :disabled="editForm.gaugePointerWithCheck == 'N'"
                                              @on-change="seriesGaugeChange(editForm.gaugePointerWithTchPin,'pointer','width')"></Input-number>
                                </Col>
                            </Row>

                        </Card>
                        <Card v-show="editForm.seriesTypeValue == 'pie'">
                            <Row>
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">饼图设置</span></Col>
                                </Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.pieRoseTypeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesFirstPCheckChange($refs.pieRoseType,editForm.pieRoseTypeCheck, 'roseType')"></Checkbox>
                                南丁格尔玫瑰图模式
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.pieRoseType" ref="pieRoseType"
                                            @on-change="seriesFirstPChange(editForm.pieRoseType,'roseType')">
                                    <Radio label="radius" :disabled="editForm.pieRoseTypeCheck == 'N'">半径模式</Radio>
                                    <Radio label="area" :disabled="editForm.pieRoseTypeCheck == 'N'">面积模式</Radio>
                                </RadioGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col span="5">
                                <Checkbox v-model="editForm.pieCenterCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSliderXYChange(editForm.pieCenterCheck,$refs.pieCenterX,$refs.pieCenterY,'center')"></Checkbox>
                                饼图圆心坐标
                                </Col>
                                <Col span="1">
                                <span>x:</span>
                                </Col>
                                <Col span="7">

                                <Slider ref="pieCenterX" v-model="editForm.pieCenterX"
                                        :min="0" :max="100" show-input  show-tip="always"
                                        :disabled="editForm.pieCenterCheck == 'N'"
                                        @on-input="inputSeriesSliderXChange($refs.pieCenterX,$refs.pieCenterY,'center')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> %</span>
                                </Col>
                                <Col span="1">
                                <span>y:</span>
                                </Col>
                                <Col span="7">
                                <Slider ref="pieCenterY" v-model="editForm.pieCenterY"
                                        :min="0" :max="100" show-input
                                        :disabled="editForm.pieCenterCheck == 'N'"
                                        @on-input="inputSeriesSliderYChange($refs.pieCenterX,$refs.pieCenterY,'center')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> %</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.pieRadiusCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.pieRadius,editForm.pieRadiusCheck,'radius')"></Checkbox>
                                饼图半径
                                </Col>
                                <Col span="10">
                                <Slider ref="pieRadius" v-model="editForm.pieRadius"
                                        :min="0" :max="100" show-input
                                        :disabled="editForm.pieRadiusCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.pieRadius,'radius')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> %</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.startAngleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.startAngle,editForm.startAngleCheck,'startAngle')"></Checkbox>
                                饼图起始角度
                                </Col>
                                <Col span="10">
                                <Slider ref="startAngle" v-model="editForm.startAngle"
                                        :min="0" :max="180" show-input
                                        :disabled="editForm.startAngleCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.startAngle,'startAngle')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> °</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.minAngleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.minAngle,editForm.minAngleCheck,'minAngle')"></Checkbox>
                                饼图最小角度
                                </Col>
                                <Col span="10">
                                <Slider ref="minAngle" v-model="editForm.minAngle"
                                        :min="0" :max="180" show-input
                                        :disabled="editForm.minAngleCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.minAngle,'minAngle')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> °</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.selectedModeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesFirstPCheckChange($refs.selectedMode,editForm.selectedModeCheck,'selectedMode')"></Checkbox>
                                鼠标点选模式
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.selectedMode" ref="selectedMode"
                                            @on-change="seriesFirstPChange(editForm.selectedMode, 'selectedMode')">
                                    <Radio label="none" :disabled="editForm.selectedModeCheck == 'N'">不可选</Radio>
                                    <Radio label="single" :disabled="editForm.selectedModeCheck == 'N'">单选</Radio>
                                    <Radio label="multiple" :disabled="editForm.selectedModeCheck == 'N'">多选</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.selectedOffsetCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="seriesSingleSliderChange($refs.selectedOffset,editForm.selectedOffsetCheck,'selectedOffset')"></Checkbox>
                                选中时扇区偏移量
                                </Col>
                                <Col span="10">
                                <Slider ref="selectedOffset" v-model="editForm.selectedOffset"
                                        :min="0" :max="180" show-input
                                        :disabled="editForm.selectedOffsetCheck == 'N'"
                                        @on-input="inputSeriesSingleSliderChange($refs.selectedOffset,'selectedOffset')"></Slider>
                                </Col>
                                <Col span="1">
                                <span> °</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <Tabs active-key="normalTab"
                                  v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' ||  editForm.seriesTypeValue == 'radar' || editForm.seriesTypeValue == 'pie'">
                                <Tab-pane label="普通状态（normal）" key="normalTab">
                                    <Card>
                                        <Row style="z-index:999" v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' ||  editForm.seriesTypeValue == 'radar' || editForm.seriesTypeValue == 'pie'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.color4ASeries"
                                                      true-value="Y" false-value="N"
                                                      @on-change="seriesColorChange($refs.aSeriesClrpkr,editForm.color4ASeries,'itemStyle','normal','color')"></Checkbox>
                                            系列特定颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="aSeriesClrpkr" v-model="editForm.aSeriesClrpkr"
                                                         :disabled="editForm.color4ASeries == 'N'"
                                                         @on-change="inputSeriesColorChange(editForm.aSeriesClrpkr,'itemStyle','normal','color')"/>
                                            </Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.lineColor" true-value="Y"
                                                      false-value="N"
                                                      @on-change="lineColorChange($refs.lineClrpkr,editForm.lineColor,'normal','lineStyle','color')"></Checkbox>
                                            线条颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="lineClrpkr" v-model="editForm.lineClrpkr"
                                                         :disabled="editForm.lineColor == 'N'"
                                                         @on-change="inputLineColorChange(editForm.lineClrpkr,'normal','lineStyle','color')"/>
                                            </Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.lineWidthCheck" true-value="Y"
                                                      false-value="N"
                                                      @on-change="lineWidthCheckChange($refs.lineWidth,editForm.lineWidthCheck,'normal','lineStyle','width')"></Checkbox>
                                            线条宽度
                                            </Col>
                                            <Col span="11">
                                            <Input-number ref="lineWidth" :max="20" :min="2"
                                                          style="width: 100%"
                                                          v-model="editForm.lineWidth"
                                                          :disabled="editForm.lineWidthCheck == 'N'"
                                                          @on-change="lineWidthChange(editForm.lineWidth,'normal','lineStyle','width')"></Input-number>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'redar'">
                                            <Row>
                                                <Col>
                                                <span style="font-weight:bold">小标志边框属性</span></Col>
                                            </Row>
                                            <Row v-show="editForm.seriesTypeValue == 'bar'">
                                                <Col>
                                                <span style="font-weight:bold">边框属性</span></Col>
                                            </Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.borderColor" true-value="Y"
                                                      false-value="N"
                                                      @on-change="seriesColorChange($refs.borderClrpkr,editForm.borderColor,'itemStyle','normal','borderColor' )"></Checkbox>
                                            边框颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="borderClrpkr" v-model="editForm.borderClrpkr"
                                                         :disabled="editForm.borderColor == 'N'"
                                                         @on-change="inputSeriesColorChange(editForm.borderClrpkr,'itemStyle','normal','borderColor')"/>
                                            </Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'pie'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.borderWidthCheck"
                                                      true-value="Y" false-value="N"
                                                      @on-change="seriesBorderWthCheckChange($refs.borderWidth, editForm.borderWidthCheck,'itemStyle','normal','borderWidth')"></Checkbox>
                                            边框宽度
                                            </Col>
                                            <Col span="11">
                                            <Input-number ref="borderWidth" :max="20" :min="2"
                                                          style="width: 100%"
                                                          v-model="editForm.borderWidth"
                                                          :disabled="editForm.borderWidthCheck == 'N'"
                                                          @on-change="seriesBorderWthChange($refs.borderWidth,'itemStyle','normal','borderWidth')"></Input-number>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'  || editForm.seriesTypeValue == 'pie'">
                                        <Row>
                                            <Col>
                                            <span style="font-weight:bold">数据项标签</span></Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.showLabelCheck"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelForthCheckChange($refs.showLabel,editForm.showLabelCheck,'normal','label','show')"></Checkbox>
                                            是否显示数据项标签
                                            </Col>
                                            <Col span="11">
                                            <RadioGroup v-model="editForm.showLabel" ref="showLabel"
                                                        @on-change="labelForthChange(editForm.showLabel,'normal','label','show')">
                                                <Radio label="Y" :disabled="editForm.showLabelCheck == 'N'">是</Radio>
                                                <Radio label="N" :disabled="editForm.showLabelCheck == 'N'">否</Radio>
                                            </RadioGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelPositionCheck"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelForthCheckChange($refs.labelPosition,editForm.labelPositionCheck,'normal','label','position')"></Checkbox>
                                            项标签显示位置
                                            </Col>
                                            <Col span="11">
                                            <RadioGroup v-model="editForm.labelPosition" ref="labelPosition" @on-change="labelForthChange(editForm.labelPosition,'normal','label','position')">
                                                <Radio label="bottom" :disabled="editForm.labelPositionCheck == 'N'">居下</Radio>
                                                <Radio label="top" :disabled="editForm.labelPositionCheck == 'N'">居上</Radio>
                                                <Radio label="left" :disabled="editForm.labelPositionCheck == 'N'">居左</Radio>
                                                <Radio label="right" :disabled="editForm.labelPositionCheck == 'N'">居右</Radio>
                                                <Radio label="inside" :disabled="editForm.labelPositionCheck == 'N'">内部</Radio>
                                            </RadioGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelColor" true-value="Y"
                                                      false-value="N"
                                                      @on-change="labelColorChange($refs.labelClrpkr, editForm.labelColor,'normal','color')"></Checkbox>
                                            文本颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="labelClrpkr" v-model="editForm.labelClrpkr"
                                                         :disabled="editForm.labelColor == 'N'"
                                                         @on-change="inputLabelColorChange(editForm.labelClrpkr,'normal','color')"/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelSizeCheck"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelSizeCheckChange( $refs.labelSize,editForm.labelSizeCheck,'normal','fontSize')"></Checkbox>
                                            字体大小
                                            </Col>
                                            <Col span="11">
                                            <Input-number ref="labelSize" :max="20" :min="10"
                                                          style="width: 100%" :disabled="editForm.labelSizeCheck == 'N'"
                                                          v-model="editForm.labelSize" @on-change="labelSizeChange(editForm.labelSize,'normal','fontSize')"></Input-number>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelStyleCheck"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelStyleCheckChange($refs.labelStyle,$refs.labelStyleBold,editForm.labelStyleCheck,'normal','fontStyle')"></Checkbox>
                                            字体样式
                                            </Col>
                                            <Col span="5">
                                            <Checkbox v-model="editForm.labelStyleBold"
                                                      true-value="Y" false-value="N"
                                                      ref="labelStyleBold"  :disabled="editForm.labelStyleCheck == 'N'"
                                                      @on-change="labelStyleBoldChange(editForm.labelStyleBold,'normal','fontWeight')"></Checkbox>
                                            加粗
                                            </Col>
                                            <Col span="6">
                                            <RadioGroup v-model="editForm.labelStyle" ref="labelStyle"
                                                        @on-change="labelStyleChange(editForm.labelStyle,'normal','fontStyle')">
                                                <Radio label="normal" :disabled="editForm.labelStyleCheck == 'N'">普通</Radio>
                                                <Radio label="italic" :disabled="editForm.labelStyleCheck == 'N'">斜体</Radio>
                                            </RadioGroup>
                                            </Col>
                                        </Row>
                                    </Card>

                                </Tab-pane>
                                <Tab-pane label="高亮状态（emphasis）" key="emphasisTab">
                                    <Card>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'radar' || editForm.seriesTypeValue == 'pie'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.color4ASeriesEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="seriesColorChange($refs.aSeriesClrpkrEmph,editForm.color4ASeriesEmph,'itemStyle','emphasis','color')"></Checkbox>
                                            系列特定颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="aSeriesClrpkrEmph" v-model="editForm.aSeriesClrpkrEmph"
                                                         :disabled="editForm.color4ASeriesEmph == 'N'"
                                                         @on-change="inputSeriesColorChange(editForm.aSeriesClrpkrEmph,'itemStyle','emphasis','color')"/>
                                            </Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.lineColorEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="lineColorChange($refs.lineClrpkrEmph,editForm.lineColorEmph,'emphasis','lineStyle','color')"></Checkbox>
                                            线条颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="lineClrpkrEmph" v-model="editForm.lineClrpkrEmph"
                                                         :disabled="editForm.lineColorEmph == 'N'"
                                                         @on-change="inputLineColorChange(editForm.lineClrpkrEmph,'emphasis','lineStyle','color')"/>
                                            </Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.lineWidthCheckEmph" true-value="Y"
                                                      false-value="N"
                                                      @on-change="lineWidthCheckChange($refs.lineWidthEmph,editForm.lineWidthCheckEmph,'emphasis','lineStyle','width')"></Checkbox>
                                            线条宽度
                                            </Col>
                                            <Col span="11">
                                            <Input-number ref="lineWidthEmph" :max="20" :min="2"
                                                          style="width: 100%" :disabled="editForm.lineWidthCheckEmph == 'N'"
                                                          v-model="editForm.lineWidthEmph" @on-change="lineWidthChange(editForm.lineWidthEmph,'emphasis','lineStyle','width')"></Input-number>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                                            <Col>
                                            <span style="font-weight:bold">小标志边框属性</span></Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'pie'">
                                            <Col>
                                            <span style="font-weight:bold">边框属性</span></Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'pie'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.borderColorEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="seriesColorChange($refs.borderClrpkrEmph,editForm.borderColorEmph,'itemStyle','emphasis','borderColor')"></Checkbox>
                                            边框颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="borderClrpkrEmph" v-model="editForm.borderClrpkrEmph"
                                                         :disabled="editForm.borderColorEmph == 'N'"
                                                         @on-change="inputSeriesColorChange('itemStyle','emphasis','borderColor')"/>
                                            </Col>
                                        </Row>
                                        <Row v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'pie'">
                                            <Col span="11">
                                            <Checkbox v-model="editForm.borderWidthCheckEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="seriesBorderWthCheckChange($refs.borderWidthEmph,editForm.borderWidthCheckEmph,'itemStyle','emphasis','borderWidth')"></Checkbox>
                                            边框宽度
                                            </Col>
                                            <Col span="11">
                                            <Input-number ref="borderWidthEmph" :max="20" :min="2"
                                                          style="width: 100%"
                                                          v-model="editForm.borderWidthEmph"
                                                          :disabled="editForm.borderWidthCheckEmph == 'N'"
                                                          @on-change="seriesBorderWthChange($refs.borderWidthEmph,'itemStyle','emphasis','borderWidth')"></Input-number>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'pie'">
                                        <Row>
                                            <Col>
                                            <span style="font-weight:bold">数据项标签</span></Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.showLabelCheckEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelForthCheckChange($refs.showLabelEmph,editForm.showLabelCheckEmph,'emphasis','label','show')"></Checkbox>
                                            是否显示数据项标签
                                            </Col>
                                            <Col span="11">
                                            <RadioGroup v-model="editForm.showLabelEmph" ref="showLabelEmph"
                                                        @on-change="labelForthChange(editForm.showLabel,'emphasis','label','show')">
                                                <Radio label="Y" :disabled="editForm.showLabelCheckEmph == 'N'">是</Radio>
                                                <Radio label="N" :disabled="editForm.showLabelCheckEmph == 'N'">否</Radio>
                                            </RadioGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelPositionCheckEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelForthCheckChange($refs.labelPositionEmph ,editForm.labelPositionCheckEmph,'emphasis','label','position')"></Checkbox>
                                            项标签显示位置
                                            </Col>
                                            <Col span="11">
                                            <RadioGroup v-model="editForm.labelPositionEmph" ref="labelPositionEmph" @on-change="labelForthChange(editForm.labelPositionEmph,'emphasis','label','position')">
                                                <Radio label="bottom" :disabled="editForm.labelPositionCheckEmph == 'N'">居下
                                                </Radio>
                                                <Radio label="top" :disabled="editForm.labelPositionCheckEmph == 'N'">居上
                                                </Radio>
                                                <Radio label="left" :disabled="editForm.labelPositionCheckEmph == 'N'">居左
                                                </Radio>
                                                <Radio label="right" :disabled="editForm.labelPositionCheckEmph == 'N'">居右
                                                </Radio>
                                                <Radio label="inside" :disabled="editForm.labelPositionCheckEmph == 'N'">内部
                                                </Radio>
                                            </RadioGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelColorEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelColorChange($refs.labelClrpkrEmph,editForm.labelColorEmph,'emphasis','color')"></Checkbox>
                                            文本颜色
                                            </Col>
                                            <Col span="11">
                                            <ColorPicker ref="labelClrpkrEmph" v-model="editForm.labelClrpkrEmph"
                                                         :disabled="editForm.labelColorEmph == 'N'"
                                                         @on-change="inputLabelColorChange(editForm.labelClrpkrEmph,'emphasis','label','position')"/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelSizeCheckEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelSizeCheckChange($refs.labelSizeEmph,editForm.labelSizeCheckEmph,'emphasis','fontSize')"></Checkbox>
                                            字体大小
                                            </Col>
                                            <Col span="11">
                                            <Input-number ref="labelSizeEmph" :max="20" :min="10"
                                                          style="width: 100%"
                                                          v-model="editForm.labelSizeEmph"
                                                          :disabled="editForm.labelSizeCheckEmph == 'N'"
                                                          @on-change="labelSizeChange(editForm.labelSizeEmph,'emphasis','fontSize')"></Input-number>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="11">
                                            <Checkbox v-model="editForm.labelStyleCheckEmph"
                                                      true-value="Y" false-value="N"
                                                      @on-change="labelStyleCheckChange($refs.labelStyleEmph,$refs.labelStyleEmphBold,editForm.labelStyleCheckEmph,'emphasis','fontStyle')"></Checkbox>
                                            字体样式
                                            </Col>
                                            <Col span="5">
                                            <Checkbox v-model="editForm.labelStyleEmphBold"
                                                      true-value="Y" false-value="N"
                                                      ref="labelStyleEmphBold"
                                                      :disabled="editForm.labelStyleCheckEmph == 'N'"
                                                      @on-change="labelStyleBoldChange(editForm.labelStyleEmphBold,'emphasis','fontWeight')"></Checkbox>
                                            加粗
                                            </Col>
                                            <Col span="6">
                                            <RadioGroup v-model="editForm.labelStyleEmph" ref="labelStyleEmph" @on-change="labelStyleChange(editForm.labelStyleEmph,'emphasis','fontStyle')">
                                                <Radio label="normal" :disabled="editForm.labelStyleCheckEmph == 'N'">普通</Radio>
                                                <Radio label="italic" :disabled="editForm.labelStyleCheckEmph == 'N'">斜体</Radio>
                                            </RadioGroup>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Tab-pane>
                            </Tabs>
                            <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
                                <Row>
                                    <Col span="11">
                                    <Checkbox v-model="editForm.stackCheck" true-value="Y"
                                              false-value="N"
                                              @on-change="stackCheckChange($refs.stack,editForm.stackCheck,'stack')"></Checkbox>
                                    堆积名称
                                    </Col>
                                    <Col span="11">
                                    <Input ref="stack" v-model="editForm.stack"
                                           :disabled="editForm.stackCheck == 'N'"
                                           @on-keyup="inputStackCheckChange(editForm.stack,'stack')"></Input>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="16" align="right">
                                    同名系列会被堆积
                                    </Col>
                                </Row>
                            </Card>
                            <Card v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack' || editForm.seriesTypeValue == 'radar'">
                                <Row>
                                    <Col>
                                    <span style="font-weight:bold">小标志设置</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                    <Checkbox v-model="editForm.symbolCheck" true-value="Y"
                                              false-value="N"
                                              @on-change="seriesFirstPCheckChange($refs.symbol,editForm.symbolCheck,'symbol')"></Checkbox>
                                    小标志图形
                                    </Col>
                                    <Col span="11">
                                    <RadioGroup v-model="editForm.symbol" ref="symbol"
                                                @on-change="seriesFirstPChange(editForm.symbol,'symbol')">
                                        <Radio label="pin" :disabled="editForm.symbolCheck == 'N'">标注</Radio>
                                        <Radio label="arrow" :disabled="editForm.symbolCheck == 'N'">箭头</Radio>
                                        <Radio label="diamond" :disabled="editForm.symbolCheck == 'N'">菱形</Radio>
                                        <Radio label="circle" :disabled="editForm.symbolCheck == 'N'">圆形</Radio>
                                        <Radio label="rect" :disabled="editForm.symbolCheck == 'N'">矩形</Radio>
                                        <Radio label="roundRect" :disabled="editForm.symbolCheck == 'N'">圆角矩形</Radio>
                                        <Radio label="triangle" :disabled="editForm.symbolCheck == 'N'">三角形</Radio>
                                        <Radio label="emptyCircle" :disabled="editForm.symbolCheck == 'N'">空心圆</Radio>
                                        <Radio label="emptyRectangle" :disabled="editForm.symbolCheck == 'N'">空心矩形</Radio>
                                        <Radio label="emptyTriangle" :disabled="editForm.symbolCheck == 'N'">空心三角</Radio>
                                        <Radio label="emptyDiamond" :disabled="editForm.symbolCheck == 'N'">空心菱形</Radio>
                                    </RadioGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                    <Checkbox v-model="editForm.aSymbolSizeCheck" true-value="Y"
                                              false-value="N"
                                              @on-change="aSymbolSizeCheckChange($refs.aSymbolSize,editForm.aSymbolSizeCheck,'symbolSize')"></Checkbox>
                                    小标志大小
                                    </Col>
                                    <Col span="11">
                                    <Input-number ref="aSymbolSize" :max="20" :min="2"
                                                  style="width: 100%" :disabled="editForm.aSymbolSizeCheck == 'N'"
                                                  v-model="editForm.aSymbolSize" @on-change="aSymbolSizeChange(editForm.aSymbolSize,'symbolSize')"></Input-number>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                    <Checkbox v-model="editForm.symbolRotateCheck" true-value="Y"
                                              false-value="N"
                                              @on-change="symbolRotateCheck($refs.symbolRotate,editForm.symbolRotateCheck,'symbolRotate')"></Checkbox>
                                    旋转角度
                                    </Col>
                                    <Col span="10">
                                    <Slider ref="symbolRotate" v-model="editForm.symbolRotate"
                                            :min="-180" :max="180" show-input
                                            :disabled="editForm.symbolRotateCheck == 'N'"
                                            @on-change="inputSymbolRotateCheck(editForm.symbolRotate,'symbolRotate')"></Slider>
                                    </Col>
                                    <Col span="1">
                                    <span> °</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Card>
                    </Tab-pane>
                </Tabs>
            </p>

        </Panel>
        <Panel key="collapse2">
            标题
            <p slot="content">
                <Tabs active-key="titleTab1">
                    <Tab-pane label="内容" key="titleTab1">
                        <Card>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="titleCheckChange($refs.titleInput,editForm.titleCheck)"></Checkbox>
                                主标题文本
                                </Col>
                                <Col span="11">
                                <Input ref="titleInput" v-model="editForm.titleInput"
                                       @on-keyup="titleCheckBlur(editForm.titleInput)"
                                       :disabled="editForm.titleCheck == 'N'"></Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.subTitleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="subTitleCheckChange($refs.subTitleInput,editForm.subTitleCheck)"></Checkbox>
                                副标题文本
                                </Col>
                                <Col span="11">
                                <Input ref="subTitleInput"
                                       v-model="editForm.subTitleInput"
                                       :disabled="editForm.subTitleCheck == 'N'"
                                       @on-keyup="subTitleCheckBlur(editForm.subTitleInput)"></Input>
                                </Col>
                            </Row>
                        </Card>
                    </Tab-pane>
                    <Tab-pane label="样式" key="titleTab2">
                        <Card>
                            <Row>
                                <Col>
                                <span style="font-weight:bold">标题块位置</span></Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.positionHCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="positionHCheckChange($refs.positionH,editForm.positionHCheck)"></Checkbox>
                                水平安放位置
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.positionH"
                                            @on-change="positionHChange(editForm.positionH)" ref="positionH">
                                    <Radio label="left" :disabled="editForm.positionHCheck == 'N'">居左</Radio>
                                    <Radio label="center" :disabled="editForm.positionHCheck == 'N'">居中</Radio>
                                    <Radio label="right" :disabled="editForm.positionHCheck == 'N'">居右</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.positionVCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="positionVCheckChange($refs.positionV,editForm.positionVCheck)"></Checkbox>
                                垂直安放位置
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.positionV" ref="positionV"
                                            @on-change="positionVChange(editForm.positionV)">
                                    <Radio label="top" :disabled="editForm.positionVCheck == 'N'">居上</Radio>
                                    <Radio label="center" :disabled="editForm.positionVCheck == 'N'">居中</Radio>
                                    <Radio label="bottom" :disabled="editForm.positionVCheck == 'N'">居下</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleAlignTypeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="titleAlignTypeCheckChange($refs.titleAlignType,editForm.titleAlignTypeCheck)"></Checkbox>
                                标题对齐方式
                                </Col>
                                <Col span="11">
                                <RadioGroup v-model="editForm.titleAlignType" ref="titleAlignType"
                                            @on-change="titleAlignTypeChange(editForm.titleAlignType)">
                                    <Radio label="left" :disabled="editForm.titleAlignTypeCheck == 'N'">居左</Radio>
                                    <Radio label="center" :disabled="editForm.titleAlignTypeCheck == 'N'">居中</Radio>
                                    <Radio label="right" :disabled="editForm.titleAlignTypeCheck == 'N'">居右</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <Row>
                                <Col>
                                <span style="font-weight:bold">标题块样式</span></Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleBgColor" true-value="Y"
                                          false-value="N"
                                          @on-change="bgColorChange($refs.titleBgClrpkr,editForm.titleBgColor,'title')"></Checkbox>
                                标题背景颜色
                                </Col>
                                <Col span="11">
                                <ColorPicker ref="titleBgClrpkr" v-model="editForm.titleBgClrpkr"
                                             :disabled="editForm.titleBgColor == 'N'"
                                             @on-active-change="inputBgColorChange(editForm.titleBgClrpkr, 'title')"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleBorderWidthCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="borderWidthCheckChange($refs.titleBorderWidth,editForm.titleBorderWidthCheck,'title')"></Checkbox>
                                标题边框线宽
                                </Col>
                                <Col span="11">
                                <Input-number ref="titleBorderWidth" :max="10" :min="0"
                                              style="width: 100%"
                                              v-model="editForm.titleBorderWidth"
                                              :disabled="editForm.titleBorderWidthCheck == 'N'"
                                              @on-change="borderWidthChange(editForm.titleBorderWidth,'title')"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleBorderColorCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="borderColorChange($refs.titleBorderColorClrpkr,editForm.titleBorderColorCheck,'title')"></Checkbox>
                                标题边框颜色
                                </Col>
                                <Col span="11">
                                <ColorPicker ref="titleBorderColorClrpkr" v-model="editForm.titleBorderColorClrpkr"
                                             :disabled="editForm.titleBorderColorCheck == 'N'"
                                             @on-change="inputBorderColorChange(editForm.titleBorderColorClrpkr,'title')"/>
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <Row>
                                <Col>
                                <span style="font-weight:bold">主标题文字样式</span></Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                    <Checkbox v-model="editForm.titleTextColor" true-value="Y"
                                              false-value="N"
                                              @on-change="fontColorChange($refs.titleTextClrpkr,editForm.titleTextColor,'title')"></Checkbox>
                                    文本颜色
                                </Col>
                                <Col span="11">
                                    <ColorPicker ref="titleTextClrpkr" v-model="editForm.titleTextClrpkr"
                                                 :disabled="editForm.titleTextColor == 'N'"
                                                 @on-change="inputFontColorChange(editForm.titleTextClrpkr,'title')"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleSizeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="fontSizeCheckChange($refs.titleSizeTchPin,editForm.titleSizeCheck,'title')"></Checkbox>
                                字体大小
                                </Col>
                                <Col span="11">
                                <Input-number ref="titleSizeTchPin" :max="25" :min="10" :value="15"
                                              style="width: 100%"
                                              v-model="editForm.titleSizeTchPin"
                                              :disabled="editForm.titleSizeCheck == 'N'"
                                              @on-change="fontSizeChange(editForm.titleSizeTchPin,'title')"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.titleStyleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="fontStyleCheckChange($refs.titleStyle,$refs.titleStyleBold,editForm.titleStyleCheck, 'titleStyleBold')"></Checkbox>
                                字体样式
                                </Col>
                                <Col span="5">
                                <Checkbox v-model="editForm.titleStyleBold" true-value="Y"
                                          false-value="N" ref="titleStyleBold"
                                          :disabled="editForm.titleStyleCheck == 'N'"
                                          @on-change="fontStyleBoldChange(editForm.titleStyleBold,'title')"></Checkbox>
                                加粗
                                </Col>
                                <Col span="6">
                                <RadioGroup v-model="editForm.titleStyle" ref="titleStyle"
                                            @on-change="fontStyleChange(editForm.titleStyle,'title')">
                                    <Radio label="normal" :disabled="editForm.titleStyleCheck == 'N'">普通</Radio>
                                    <Radio label="italic" :disabled="editForm.titleStyleCheck == 'N'">斜体</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <Row>
                                <Col>
                                <span style="font-weight:bold">副标题文字样式</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.subTitleTextCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="subTitleTextCheckChange($refs.subTitleTextClrpkr,editForm.subTitleTextCheck)"></Checkbox>
                                文本颜色
                                </Col>
                                <Col span="11">
                                <ColorPicker ref="subTitleTextClrpkr" v-model="editForm.subTitleTextClrpkr"
                                             :disabled="editForm.subTitleTextCheck == 'N'"
                                             @on-change="inputSubTitleTextCheckChange(editForm.subTitleTextClrpkr,'title')"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.subTitleSizeCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="subTitleSizeCheckChange($refs.subTitleSizeTchPin,editForm.subTitleSizeCheck)"></Checkbox>
                                字体大小
                                </Col>
                                <Col span="11">
                                <Input-number ref="subTitleSizeTchPin" :max="25" :min="10"
                                              style="width: 100%" :disabled="editForm.subTitleSizeCheck == 'N'"
                                              v-model="editForm.subTitleSizeTchPin"
                                              @on-change="subTitleSizeTchPinChange(editForm.subTitleSizeTchPin)"></Input-number>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                <Checkbox v-model="editForm.subTitleStyleCheck" true-value="Y"
                                          false-value="N"
                                          @on-change="subTitleStyleCheckChange($refs.subTitleStyle,$refs.subTitleStyleBold,editForm.subTitleStyleCheck)"></Checkbox>
                                字体样式
                                </Col>
                                <Col span="5">
                                <Checkbox v-model="editForm.subTitleStyleBold" true-value="Y"
                                          false-value="N" ref="subTitleStyleBold"
                                          :disabled="editForm.subTitleStyleCheck == 'N'"
                                          @on-change="subTitleStyleBoldChange(editForm.subTitleStyleBold)"></Checkbox>
                                加粗
                                </Col>
                                <Col span="6">
                                <RadioGroup v-model="editForm.subTitleStyle" ref="subTitleStyle"
                                            @on-change="subTitleStyleChange(editForm.subTitleStyle)">
                                    <Radio label="normal" :disabled="editForm.subTitleStyleCheck == 'N'">普通</Radio>
                                    <Radio label="italic" :disabled="editForm.subTitleStyleCheck == 'N'">斜体</Radio>
                                </RadioGroup>
                                </Col>
                            </Row>
                        </Card>
                    </Tab-pane>
                </Tabs>

            </p>
        </Panel>
        <Panel key="collapse3">
            图例
            <p slot="content">
                <Card>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.isShowLegendCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="isShowLegendCheckChange($refs.showLegend,editForm.isShowLegendCheck)"></Checkbox>
                        是否显示图例
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.showLegend" ref="showLegend"
                                    @on-change="showLegendChange(editForm.showLegend)">
                            <Radio label="Y" :disabled="editForm.isShowLegendCheck == 'N'">是</Radio>
                            <Radio label="N" :disabled="editForm.isShowLegendCheck == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendChoiceTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="selectedModeChange($refs.legendChoiceType,editForm.legendChoiceTypeCheck)"></Checkbox>
                        图例选择模式
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.legendChoiceType" ref="legendChoiceType"
                                    @on-change="legendChoiceType(editForm.legendChoiceType)">
                            <Radio label="false" :disabled="editForm.legendChoiceTypeCheck == 'N'">不可选</Radio>
                            <Radio label="single" :disabled="editForm.legendChoiceTypeCheck == 'N'">单选</Radio>
                            <Radio label="multiple" :disabled="editForm.legendChoiceTypeCheck == 'N'">多选</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">图例位置</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendPositionHCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="putHCheckChange($refs.legendPositionH,editForm.legendPositionHCheck)"></Checkbox>
                        水平安放位置
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.legendPositionH"
                                    @on-change="putH(editForm.legendPositionH,'legend')" ref="legendPositionH">
                            <Radio label="left" :disabled="editForm.legendPositionHCheck == 'N'">居左</Radio>
                            <Radio label="center" :disabled="editForm.legendPositionHCheck == 'N'">居中</Radio>
                            <Radio label="right" :disabled="editForm.legendPositionHCheck == 'N'">居右</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendPositionVCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="putVCheckChange($refs.legendPositionV,editForm.legendPositionVCheck,'legend')"></Checkbox>
                        垂直安放位置
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.legendPositionV" ref="legendPositionV"
                                    @on-change="putV(editForm.legendPositionV, 'legend')">
                            <Radio label="top" :disabled="editForm.legendPositionVCheck == 'N'">居上</Radio>
                            <Radio label="center" :disabled="editForm.legendPositionVCheck == 'N'">居中</Radio>
                            <Radio label="bottom" :disabled="editForm.legendPositionVCheck == 'N'">居下</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendPositionTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="putTypeCheckChange($refs.legendPstType,editForm.legendPositionTypeCheck,'legend')"></Checkbox>
                        图例放置方式
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.legendPstType" ref="legendPstType"
                                    @on-change="putType(editForm.legendPstType,'legend')">
                            <Radio label="horizontal" :disabled="editForm.legendPositionTypeCheck == 'N'">水平放置</Radio>
                            <Radio label="vertical" :disabled="editForm.legendPositionTypeCheck == 'N'">垂直放置</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">图例文字样式</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendTextColor" true-value="Y" false-value="N"
                                  @on-change="fontColorChange($refs.legendTextClrpkr,editForm.legendTextColor,'legend')"></Checkbox>
                        文本颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="legendTextClrpkr" v-model="editForm.legendTextClrpkr"
                                     :disabled="editForm.legendTextColor == 'N'"
                                     @on-change="inputFontColorChange(editForm.legendTextClrpkr,'legend')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendSizeCheck" true-value="Y" false-value="N"
                                  @on-change="fontSizeCheckChange($refs.legendSizeTchPin,editForm.legendSizeCheck,'legend')"></Checkbox>
                        字体大小
                        </Col>
                        <Col span="11">
                        <Input-number ref="legendSizeTchPin" :max="25" :min="10" style="width: 100%"
                                      v-model="editForm.legendSizeTchPin"
                                      :disabled="editForm.legendSizeCheck == 'N'"
                                      @on-change="fontSizeChange(editForm.legendSizeTchPin,'legend')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.legendStyleCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="fontStyleCheckChange($refs.legendStyle, $refs.legendStyleBold, editForm.legendStyleCheck, 'legend')"></Checkbox>
                        字体样式
                        </Col>
                        <Col span="5">
                        <Checkbox v-model="editForm.legendStyleBold" true-value="Y"
                                  false-value="N" ref="legendStyleBold"
                                  :disabled="editForm.legendStyleCheck == 'N'"
                                  @on-change="fontStyleBoldChange(editForm.legendStyleBold,'legend')"></Checkbox>
                        加粗
                        </Col>
                        <Col span="6">
                        <RadioGroup v-model="editForm.legendStyle" ref="legendStyle"
                                    @on-change="fontStyleChange(editForm.legendStyle,'legend')">
                            <Radio label="normal" :disabled="editForm.legendStyleCheck == 'N'">普通</Radio>
                            <Radio label="italic" :disabled="editForm.legendStyleCheck == 'N'">斜体</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
        <Panel key="collapse4">
            提示
            <p slot="content">
                <Card>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.usingRemindCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="toolCheckChange($refs.usingRemind,editForm.usingRemindCheck,'tooltip')"></Checkbox>
                        是否使用提示
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.usingRemind"
                                    @on-change="toolChange(editForm.usingRemind,'tooltip')" ref="usingRemind">
                            <Radio label="Y" :disabled="editForm.usingRemindCheck == 'N'">是</Radio>
                            <Radio label="N" :disabled="editForm.usingRemindCheck == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">格式模板</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.tooltipFormatterCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="tooltipFormatterChange($refs.tooltipFormatter,editForm.tooltipFormatterCheck)"></Checkbox>
                        提示模板
                        </Col>
                        <Col span="11">
                        <Input ref="tooltipFormatter" v-model="editForm.tooltipFormatter"
                               :disabled="editForm.tooltipFormatterCheck == 'N'"
                               @on-keyup="inputTooltipFormatterChange(editForm.tooltipFormatter)"></Input>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">提示外观</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindBgColor" true-value="Y" false-value="N"
                                  @on-change="bgColorChange($refs.remindBgClrpkr,editForm.remindBgColor,'tooltip')"></Checkbox>
                        背景颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="remindBgClrpkr" v-model="editForm.remindBgClrpkr"
                                     :disabled="editForm.remindBgColor == 'N'"
                                     @on-change="inputBgColorChange(editForm.remindBgClrpkr,'tooltip')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindBorderWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="borderWidthCheckChange($refs.remindBorderWidth,editForm.remindBorderWidthCheck,'tooltip')"></Checkbox>
                        边框粗细
                        </Col>
                        <Col span="11">
                        <Input-number ref="remindBorderWidth" :max="25" :min="10"
                                      style="width: 100%"
                                      v-model="editForm.remindBorderWidth"
                                      :disabled="editForm.remindBorderWidthCheck == 'N'"
                                      @on-change="borderWidthChange(editForm.remindBorderWidth,'tooltip')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindBorderColor" true-value="Y"
                                  false-value="N"
                                  @on-change="borderColorChange($refs.remindBorderClrpkr,editForm.remindBorderColor,'tooltip')"></Checkbox>
                        边框颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="remindBorderClrpkr" v-model="editForm.remindBorderClrpkr"
                                     :disabled="editForm.remindBorderColor == 'N'"
                                     @on-change="inputBorderColorChange(editForm.remindBorderClrpkr,'tooltip')"/>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">提示文本样式</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindTextColor" true-value="Y" false-value="N"
                                  @on-change="fontColorChange($refs.remindTextClrpkr,editForm.remindTextColor,'tooltip')"></Checkbox>
                        字体颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="remindTextClrpkr" v-model="editForm.remindTextClrpkr"
                                     :disabled="editForm.remindTextColor == 'N'"
                                     @on-change="inputFontColorChange(editForm.remindTextClrpkr,'tooltip')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindTextSizeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="fontSizeCheckChange($refs.remindTextSize,editForm.remindTextSizeCheck,'tooltip')"></Checkbox>
                        字体大小
                        </Col>
                        <Col span="11">
                        <Input-number ref="remindTextSize" :max="20" :min="5" style="width: 100%"
                                      v-model="editForm.remindTextSize"
                                      :disabled="editForm.remindTextSizeCheck == 'N'"
                                      @on-change="fontSizeChange(editForm.remindTextSize,'tooltip')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindTextStyleCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="fontStyleCheckChange($refs.remindTextStyle,$refs.remindTextStyleBold,editForm.remindTextStyleCheck,'tooltip')"></Checkbox>
                        字体样式
                        </Col>
                        <Col span="5">
                        <Checkbox v-model="editForm.remindTextStyleBold" true-value="Y"
                                  false-value="N" ref="remindTextStyleBold"
                                  :disabled="editForm.remindTextStyleCheck == 'N'"
                                  @on-change="fontStyleBoldChange(editForm.remindTextStyleBold,'tooltip')"></Checkbox>
                        加粗
                        </Col>
                        <Col span="6">
                        <RadioGroup v-model="editForm.remindTextStyle"
                                    @on-change="fontStyleChange(editForm.remindTextStyle,'tooltip')"
                                    ref="remindTextStyle">
                            <Radio label="normal" :disabled="editForm.remindTextStyleCheck == 'N'">普通</Radio>
                            <Radio label="italic" :disabled="editForm.remindTextStyleCheck == 'N'">斜体</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.rmdTextAlignHCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="rmdTextAlignHCheckChange($refs.rmdTextAlignH,editForm.rmdTextAlignHCheck)"></Checkbox>
                        文本水平对齐方式
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.rmdTextAlignH" ref="rmdTextAlignH"
                                    @on-change="rmdTextAlignHChange(editForm.rmdTextAlignH)">
                            <Radio label="left" :disabled="editForm.rmdTextAlignHCheck == 'N'">居左</Radio>
                            <Radio label="center" :disabled="editForm.rmdTextAlignHCheck == 'N'">居中</Radio>
                            <Radio label="right" :disabled="editForm.rmdTextAlignHCheck == 'N'">居右</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">提示的指示器设置</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindTiggerCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="remindTiggerCheckChange($refs.remindTigger,editForm.remindTiggerCheck)"></Checkbox>
                        提示触发点
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.remindTigger" ref="remindTigger"
                                    @on-change="remindTiggerChange(editForm.remindTigger)">
                            <Radio label="item" :disabled="editForm.remindTiggerCheck == 'N'">项上触发(item)</Radio>
                            <Radio label="axis" :disabled="editForm.remindTiggerCheck == 'N'">轴上触发(axis)</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.remindPointerTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="pointerTypeCheckChange($refs.remindPointerType,editForm.remindPointerTypeCheck)"></Checkbox>
                        提示指示器类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.remindPointerType" ref="remindPointerType"
                                    @on-change="pointerTypeChange(editForm.remindPointerType)">
                            <Radio label="line" :disabled="editForm.remindPointerTypeCheck == 'N'">提示线</Radio>
                            <Radio label="cross" :disabled="editForm.remindPointerTypeCheck == 'N'">交叉线</Radio>
                            <Radio label="shadow" :disabled="editForm.remindPointerTypeCheck == 'N'">提示阴影</Radio>
                            <Radio label="none" :disabled="editForm.remindPointerTypeCheck == 'N'">无</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.pointerLineColor" true-value="Y"
                                  false-value="N"
                                  @on-change="pointerLineColorChange($refs.remindTextClrpkr,editForm.pointerLineColor)"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="remindTextClrpkr" v-model="editForm.remindTextClrpkr"
                                     :disabled="editForm.pointerLineColor == 'N'"
                                     @on-change="inputPointerLineColorChange(editForm.remindTextClrpkr)"/>

                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.pointerLineWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="pointerLineWidthChange($refs.pointerLineWidth,editForm.pointerLineWidthCheck)"
                        ></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="11">
                        <Input-number ref="pointerLineWidth" :max="10" :min="2" style="width: 100%"
                                      v-model="editForm.pointerLineWidth"
                                      :disabled="editForm.pointerLineWidthCheck == 'N'"
                                      @on-change="pLineWidthChange(editForm.pointerLineWidth,)"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.pointerLineTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="pointerLineTypeCheckChange($refs.pointerLineType, editForm.pointerLineTypeCheck)"
                        ></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.pointerLineType" ref="pointerLineType"
                                    @on-change="pointerLineTypeChange(editForm.pointerLineType)">
                            <Radio label="solid" :disabled="editForm.pointerLineTypeCheck == 'N'">实线</Radio>
                            <Radio label="dotted" :disabled="editForm.pointerLineTypeCheck == 'N'">点状线</Radio>
                            <Radio label="dashed" :disabled="editForm.pointerLineTypeCheck == 'N'">虚线</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
        <Panel key="collapse5">
            工具
            <p slot="content">
                <Card>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.isShowToolCheck" true-value="Y" false-value="N"
                                  @on-change="toolCheckChange($refs.isShowTool, editForm.isShowToolCheck, 'toolbox')"
                        ></Checkbox>
                        是否显示工具箱
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.isShowTool" ref="isShowTool"
                                    @on-change="toolChange(editForm.isShowTool,'toolbox')">
                            <Radio label="Y" :disabled="editForm.isShowToolCheck == 'N'">是</Radio>
                            <Radio label="N" :disabled="editForm.isShowToolCheck == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Row>
                            <Col>
                            <span style="font-weight:bold">工具箱位置</span></Col>
                        </Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.toolPositionHCheck" true-value="Y"
                                  @on-change="putHCheckChange($refs.toolPositionH,editForm.toolPositionHCheck, 'toolbox')"
                                  false-value="N"
                        ></Checkbox>
                        水平安放位置
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.toolPositionH" ref="toolPositionH"
                                    @on-change="putH(editForm.toolPositionH, 'toolbox')">
                            <Radio label="left" :disabled="editForm.toolPositionHCheck == 'N'">居左</Radio>
                            <Radio label="center" :disabled="editForm.toolPositionHCheck == 'N'">居中</Radio>
                            <Radio label="right" :disabled="editForm.toolPositionHCheck == 'N'">居右</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.toolPositionVCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="putVCheckChange($refs.toolPositionV ,editForm.toolPositionVCheck, 'toolbox')"></Checkbox>
                        垂直安放位置
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.toolPositionV" ref="toolPositionV"
                                    @on-change="putV(editForm.toolPositionV, 'toolbox')">
                            <Radio label="top" :disabled="editForm.toolPositionVCheck == 'N'">居上</Radio>
                            <Radio label="center" :disabled="editForm.toolPositionVCheck == 'N'">居中</Radio>
                            <Radio label="bottom" :disabled="editForm.toolPositionVCheck == 'N'">居下</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.toolPositionTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="putTypeCheckChange($refs.toolPstType, editForm.toolPositionTypeCheck, 'toolbox')"></Checkbox>
                        工具箱放置方式
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.toolPstType" ref="toolPstType"
                                    @on-change="putType(editForm.toolPstType, 'toolbox')">
                            <Radio label="horizontal" :disabled="editForm.toolPositionTypeCheck == 'N'">水平放置</Radio>
                            <Radio label="vertical" :disabled="editForm.toolPositionTypeCheck == 'N'">垂直放置</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>

                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">功能按钮设定</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.choiceToolCheck" true-value="Y" false-value="N"
                                  @on-change="choiceToolCheckChange($refs.choiceTool, editForm.choiceToolCheck)"></Checkbox>
                        选择显示的工具
                        </Col>
                        <Col span="11">
                        <CheckboxGroup v-model="editForm.choiceTool" ref="choiceTool"
                                       @on-change="choiceToolChange($refs.choiceTool,editForm.choiceTool)">
                            <Checkbox label="brush" :disabled="editForm.choiceToolCheck == 'N'">区域框</Checkbox>
                            <Checkbox label="dataView" :disabled="editForm.choiceToolCheck == 'N'">数据视图</Checkbox>
                            <Checkbox label="dataZoom" :disabled="editForm.choiceToolCheck == 'N'">缩放</Checkbox>
                            <Checkbox label="restore" :disabled="editForm.choiceToolCheck == 'N'">还原</Checkbox>
                            <Checkbox label="saveAsImage" :disabled="editForm.choiceToolCheck == 'N'">另存为</Checkbox>
                            <Checkbox label="magicType" :disabled="editForm.choiceToolCheck == 'N'">折柱切换</Checkbox>
                        </CheckboxGroup>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
        <Panel key="collapse6" v-show="editForm.seriesTypeValue == 'radar'">
            雷达
            <p slot="content">
                <Card>
                    <Row>
                        <Row>
                            <Col>
                            <span style="font-weight:bold">功能按钮设定</span>
                            </Col>
                        </Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.shapeCheck" true-value="Y" false-value="N"
                                  @on-change="shapeCheckChange($refs.shape, editForm.shapeCheck, 'shape')"
                        ></Checkbox>
                        底盘形状
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.shape" ref="shape"
                                    @on-change="shapeChange(editForm.shape,'shape')">
                            <Radio label="polygon" :disabled="editForm.shapeCheck == 'N'">棱角型</Radio>
                            <Radio label="circle" :disabled="editForm.shapeCheck == 'N'">圆环形</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                        <Checkbox v-model="editForm.radarCenterCheck" true-value="Y" false-value="N"
                                  @on-change="radarCenterChange(editForm.radarCenterCheck,$refs.radarCenterX, $refs.radarCenterY)"
                        ></Checkbox>
                        圆心位置
                        </Col>
                        <Col span="1">
                        <span>x:</span>
                        </Col>
                        <Col span="8">

                        <Slider ref="radarCenterX" v-model="editForm.radarCenterX"
                                :min="0" :max="100" show-input
                                :disabled="editForm.radarCenterCheck == 'N'"
                                @on-input="inputRadarCenterChange($refs.radarCenterX,0)"></Slider>
                        </Col>
                        <Col span="1">
                        <span> %</span>
                        </Col>
                        <Col span="1">
                        <span>y:</span>
                        </Col>
                        <Col span="8">
                        <Slider ref="radarCenterY" v-model="editForm.radarCenterY"
                                :min="0" :max="100" show-input
                                :disabled="editForm.radarCenterCheck == 'N'"
                                @on-input="inputRadarCenterChange($refs.radarCenterY,1)"></Slider>
                        </Col>
                        <Col span="1">
                        <span> %</span>
                        </Col>
                    </Row>


                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarRadiusCheck" true-value="Y" false-value="N"
                                  @on-change="radarFirstChange($refs.radarRadius, editForm.radarRadiusCheck, 'radius')"
                        ></Checkbox>
                        半径长度
                        </Col>
                        <Col span="10">
                        <Slider ref="radarRadius" v-model="editForm.radarRadius"
                                :min="0" :max="100" show-input
                                :disabled="editForm.chartsBgColorCheck == 'N'"
                                @on-input="inputRadarFirstChange(editForm.radarRadius,'radius')"></Slider>
                        </Col>
                        <Col span="1">
                        <span> %</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarStartAngleCheck" true-value="Y" false-value="N"
                                  @on-change="radarFirstChange($refs.radarStartAngle, editForm.radarStartAngleCheck, 'startAngle')"
                        ></Checkbox>
                        起始角度
                        </Col>
                        <Col span="10">
                        <Slider ref="radarStartAngle" v-model="editForm.radarStartAngle"
                                :min="0" :max="100" show-input
                                :disabled="editForm.radarStartAngleCheck == 'N'"
                                @on-input="inputRadarFirstChange(editForm.radarStartAngle,'startAngle')"></Slider>
                        </Col>
                        <Col span="1">
                        <span> %</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarSplitNumberCheck" true-value="Y" false-value="N"
                                  @on-change="radarSplitNumberCheckChange($refs.radarSplitNumber, editForm.radarSplitNumberCheck, 'splitNumber')"
                        ></Checkbox>
                        环形分割数
                        </Col>
                        <Col span="10">
                        <Input-number ref="radarSplitNumber" :max="30" :min="1" style="width: 100%"
                                      v-model="editForm.radarSplitNumber"
                                      :disabled="editForm.radarSplitNumberCheck == 'N'"
                                      @on-change="radarSplitNumberChange(editForm.radarSplitNumber,'splitNumber')"></Input-number>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">轴线</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarAxisLineShow" true-value="Y"
                                  false-value="N"
                                  @on-change="radarShowCheckChange($refs.radarAxisLine,editForm.radarAxisLineShow,'axisLine','show')"></Checkbox>
                        是否显示轴线
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.radarAxisLine"
                                    @on-change="radarShowChange(editForm.radarAxisLine,'axisLine','show')"
                                    ref="radarAxisLine">
                            <Radio :disabled="editForm.radarAxisLineShow == 'N'" label="Y">
                                是
                            </Radio>
                            <Radio :disabled="editForm.radarAxisLineShow == 'N'" label="N">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarAxisLineColor" true-value="Y" false-value="N"
                                  @on-change="radarColorChange($refs.radarAxisLineClrpkr, editForm.radarAxisLineColor,'axisLine','lineStyle','color')"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="radarAxisLineClrpkr" v-model="editForm.radarAxisLineClrpkr"
                                     :disabled="editForm.radarAxisLineColor == 'N'"
                                     @on-change="radarColorActiveChange(editForm.radarAxisLineClrpkr,'axisLine','lineStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarAxisLineWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="radarPXCheckChange($refs.radarAxisLineWidth, editForm.radarAxisLineWidthCheck,'axisLine','lineStyle','width')"></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="10">
                        <Input-number ref="radarAxisLineWidth" :max="20" :min="2" style="width: 100%"
                                      :disabled="editForm.radarAxisLineWidthCheck == 'N'"
                                      v-model="editForm.radarAxisLineWidth"
                                      @on-change="radarChange(editForm.radarAxisLineWidth,'axisLine','lineStyle','width')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarAxisLineTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="radarLineTypeCheckChange($refs.radarAxisLineType, editForm.radarAxisLineTypeCheck,'axisLine','lineStyle','type')"></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.radarAxisLineType" ref="radarAxisLineType"
                                    @on-change="radarChange(editForm.radarAxisLineType,'axisLine','lineStyle','type')">
                            <Radio label="solid" :disabled="editForm.radarAxisLineTypeCheck == 'N'">
                                实线
                            </Radio>
                            <Radio label="dotted" :disabled="editForm.radarAxisLineTypeCheck == 'N'">
                                点状线
                            </Radio>
                            <Radio label="dashed" :disabled="editForm.radarAxisLineTypeCheck == 'N'">
                                虚线
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">隔线</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarSplitLineShow" true-value="Y"
                                  false-value="N"
                                  @on-change="radarShowCheckChange($refs.radarSplitLine,editForm.radarSplitLineShow,'splitLine','show')"></Checkbox>
                        是否显示网格线
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.radarSplitLine"
                                    @on-change="radarShowChange(editForm.radarSplitLine,'splitLine','show')"
                                    ref="radarSplitLine">
                            <Radio label="Y" :disabled="editForm.radarSplitLineShow == 'N'">
                                是
                            </Radio>
                            <Radio label="N" :disabled="editForm.radarSplitLineShow == 'N'">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarSplitLineColor" true-value="Y" false-value="N"
                                  @on-change="radarColorChange($refs.radarSplitLineClrpkr, editForm.radarSplitLineColor,'splitLine','lineStyle','color')"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="radarSplitLineClrpkr" v-model="editForm.radarSplitLineClrpkr"
                                     :disabled="editForm.radarSplitLineColor == 'N'"
                                     @on-change="radarColorActiveChange(editForm.radarSplitLineClrpkr,'splitLine','lineStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarSTWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="radarPXCheckChange($refs.radarSTWidth, editForm.radarSTWidthCheck,'splitLine','lineStyle','width')"></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="10">
                        <Input-number ref="radarSTWidth" :max="20" :min="2" style="width: 100%"
                                      v-model="editForm.radarSTWidth"
                                      :disabled="editForm.radarSTWidthCheck == 'N'"
                                      @on-change="radarChange(editForm.radarSTWidth,'splitLine','lineStyle','width')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarSTTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="radarLineTypeCheckChange($refs.radarSTType, editForm.radarSTTypeCheck,'splitLine','lineStyle','type')"></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.radarSTType" ref="radarSTType"
                                    @on-change="radarChange(editForm.radarSTType,'splitLine','lineStyle','type')">
                            <Radio label="solid" :disabled="editForm.radarSTTypeCheck == 'N'">
                                实线
                            </Radio>
                            <Radio label="dotted" :disabled="editForm.radarSTTypeCheck == 'N'">
                                点状线
                            </Radio>
                            <Radio label="dashed" :disabled="editForm.radarSTTypeCheck == 'N'">
                                虚线
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarSplitAreaShow" true-value="Y"
                                  false-value="N"
                                  @on-change="radarShowCheckChange($refs.radarSplitArea,editForm.radarSplitAreaShow,'splitArea','show')"></Checkbox>
                        是否显示网格区域
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.radarSplitArea"
                                    @on-change="radarShowChange(editForm.radarSplitArea,'splitArea','show')"
                                    :disabled="editForm.radarSplitAreaShow == 'N'"
                                    ref="radarSplitArea">
                            <Radio label="Y" :disabled="editForm.radarSplitAreaShow == 'N'">
                                是
                            </Radio>
                            <Radio label="N" :disabled="editForm.radarSplitAreaShow == 'N'">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.radarAxisLabelShow" true-value="Y"
                                  false-value="N"
                                  @on-change="radarShowCheckChange($refs.radarAxisLabel,editForm.radarAxisLabelShow,'axisLabel','show')"></Checkbox>
                        是否显示坐标轴文本标签
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.radarAxisLabel"
                                    @on-change="radarShowChange(editForm.radarAxisLabel,'axisLabel','show')"
                                    ref="radarAxisLabel">
                            <Radio label="Y" :disabled="editForm.radarAxisLabelShow == 'N'">
                                是
                            </Radio>
                            <Radio label="N" :disabled="editForm.radarAxisLabelShow == 'N'">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
        <Panel key="collapse7"
               v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
            视区
            <p slot="content">
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">绘图区域位置</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridX1Check" true-value="Y" false-value="N"
                                  @on-change="gridPositionCheck($refs.gridX1, editForm.gridX1Check, 'x')"></Checkbox>
                        横坐标距图左侧边缘宽度
                        </Col>
                        <Col span="10">
                        <Slider ref="gridX1" v-model="editForm.gridX1" :min="0" :max="150"
                                :disabled="editForm.gridX1Check == 'N'"
                                show-input @on-change="inputGridPositionCheck(editForm.gridX1,'x')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;px</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridX2Check" true-value="Y" false-value="N"
                                  @on-change="gridPositionCheck($refs.gridX2, editForm.gridX2Check, 'x2')"></Checkbox>
                        横坐标距图右侧边缘宽度
                        </Col>
                        <Col span="10">
                        <Slider ref="gridX2" v-model="editForm.gridX2" :min="0" :max="150"
                                :disabled="editForm.gridX2Check == 'N'"
                                show-input @on-change="inputGridPositionCheck(editForm.gridX2,'x2')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;px</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridY1Check" true-value="Y" false-value="N"
                                  @on-change="gridPositionCheck($refs.gridY1, editForm.gridY1Check, 'y')"></Checkbox>
                        纵坐标距图左侧边缘宽度
                        </Col>
                        <Col span="10">
                        <Slider ref="gridY1" v-model="editForm.gridY1" :min="0" :max="150"
                                :disabled="editForm.gridY1Check == 'N'"
                                show-input @on-change="inputGridPositionCheck(editForm.gridY1,'y')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;px</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridY2Check" true-value="Y" false-value="N"
                                  @on-change="gridPositionCheck($refs.gridY2, editForm.gridY2Check, 'y2')"></Checkbox>
                        纵坐标距图右侧边缘宽度
                        </Col>
                        <Col span="10">
                        <Slider ref="gridY2" v-model="editForm.gridY2" :min="0" :max="150"
                                :disabled="editForm.gridY2Check == 'N'"
                                show-input @on-change="inputGridPositionCheck(editForm.gridY2,'y2')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;px</span>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">绘图区域外观</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridBgColor" true-value="Y" false-value="N"
                                  @on-change="gridColorCheck($refs.gridBgClrpkr,editForm.gridBgColor, 'backgroundColor')"></Checkbox>
                        背景颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="gridBgClrpkr" v-model="editForm.gridBgClrpkr"
                                     :disabled="editForm.gridBgColor == 'N'"
                                     @on-change="colorGridActiveChange(editForm.gridBgClrpkr,'backgroundColor')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridBorderWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="gridBorderWidthCheck($refs.gridBorderWidth,editForm.gridBorderWidthCheck)"></Checkbox>
                        边框线宽
                        </Col>
                        <Col span="10">
                        <Input-number ref="gridBorderWidth" :max="10" :min="2" style="width: 100%"
                                      v-model="editForm.gridBorderWidth"
                                      :disabled="editForm.gridBorderWidthCheck == 'N'"
                                      @on-change="gridBorderWidthChange(editForm.gridBorderWidth)"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.gridBorderColor" true-value="Y" false-value="N"
                                  @on-change="gridColorCheck($refs.gridBorderClrpkr,editForm.gridBorderColor,'borderColor')"></Checkbox>
                        边框颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="gridBorderClrpkr" v-model="editForm.gridBorderClrpkr"
                                     :disabled="editForm.gridBorderColor == 'N'"
                                     @on-change="colorGridActiveChange(editForm.gridBorderClrpkr,'borderColor')"/>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
        <Panel key="collapse8"
               v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
            X轴
            <p slot="content">
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">基础</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisPositionCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisCheckChange($refs.axisPosition,editForm.axisPositionCheck,'xAxis', 'position')"></Checkbox>
                        坐标轴位置
                        </Col>
                        <Col span="10">
                        <RadioGroup v-model="editForm.axisPosition" ref="axisPosition"
                                    @on-change="axisChange(editForm.axisPosition, 'xAxis', 'position')">
                            <Radio  label="top"  :disabled="editForm.axisPositionCheck == 'N'">居上</Radio>
                            <Radio  label="bottom"  :disabled="editForm.axisPositionCheck == 'N'">居下</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameCheck" true-value="Y" false-value="N"
                                  @on-change="axisNameCheckChange($refs.axisName,editForm.axisNameCheck,'xAxis', 'name')"></Checkbox>
                        坐标轴名称
                        </Col>
                        <Col span="10">
                        <Input ref="axisName" v-model="editForm.axisName"
                               :disabled="editForm.axisNameCheck == 'N'"
                               @on-keyup="axisNameBlur(editForm.axisName,'xAxis', 'name')"></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNamePositionCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisCheckChange($refs.axisNamePosition, editForm.axisNamePositionCheck, 'xAxis', 'nameLocation')"></Checkbox>
                        坐标轴名称位置
                        </Col>
                        <Col span="10">
                        <RadioGroup v-model="editForm.axisNamePosition" ref="axisNamePosition"
                                    @on-change="axisChange(editForm.axisNamePosition, 'xAxis', 'nameLocation')">
                            <Radio  :disabled="editForm.axisNamePositionCheck == 'N'" label="start">位于开端</Radio>
                            <Radio  :disabled="editForm.axisNamePositionCheck == 'N'" label="end">位于末端</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameColor" true-value="Y" false-value="N"
                                  @on-change="axisNameColorChange($refs.axisNameClrpkr,editForm.axisNameColor,'xAxis','nameTextStyle','color')"></Checkbox>
                        文本颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="axisNameClrpkr" v-model="editForm.axisNameClrpkr"
                                     :disabled="editForm.axisNameColor == 'N'"
                                     @on-change="axisNameColorActiveChange(editForm.axisNameClrpkr,'xAxis','nameTextStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameSizeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisFontSizeCheckChange($refs.axisNameSize,'xAxis','nameTextStyle','fontSize')"
                        ></Checkbox>
                        字体大小
                        </Col>
                        <Col span="10">
                        <Input-number ref="axisNameSize" :max="25" :min="10" style="width: 100%"
                                      v-model="editForm.axisNameSize"
                                      :disabled="editForm.axisNameSizeCheck == 'N'"
                                      @on-change="axisFontSizeChange(editForm.axisNameSize,'xAxis','nameTextStyle','fontSize')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameStyleCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisNameStyleCheckChange($refs.axisNameStyle,$refs.axisNameStyleBold,editForm.axisNameStyleCheck,'xAxis','nameTextStyle','fontStyle','axisNameStylebold')"></Checkbox>
                        字体样式
                        </Col>
                        <Col span="5">
                        <Checkbox v-model="editForm.axisNameStyleBold" true-value="Y"
                                  false-value="N" ref="axisNameStyleBold"
                                  :disabled="editForm.axisNameStyleCheck == 'N'"
                                  @on-change="axisNameStyleBoldChange(editForm.axisNameStyleBold,'xAxis','nameTextStyle')">
                        </Checkbox>
                        加粗
                        </Col>
                        <Col span="6">
                        <RadioGroup v-model="editForm.axisNameStyle" ref="axisNameStyle" @on-change="axisNameStyleChange(editForm.axisNameStyle,'xAxis','nameTextStyle','fontStyle')">
                            <Radio :disabled="editForm.axisNameStyleCheck == 'N'" label="normal">普通</Radio>
                            <Radio :disabled="editForm.axisNameStyleCheck == 'N'" label="italic">斜体</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.boundaryGapCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisCheckChange($refs.boundaryGap, editForm.boundaryGapCheck, 'xAxis', 'boundaryGap')"></Checkbox>
                        类目两端空白策略
                        </Col>
                        <Col span="10">
                        <RadioGroup v-model="editForm.boundaryGap" ref="boundaryGap" @on-change="axisChange(editForm.boundaryGap, 'xAxis', 'boundaryGap')">
                            <Radio  label="Y"  :disabled="editForm.boundaryGapCheck == 'N'">留空</Radio>
                            <Radio  label="N"  :disabled="editForm.boundaryGapCheck == 'N'">顶头</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">轴标签</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineShowCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisShowCheckChange($refs.axisLineShow,editForm.axisLineShowCheck,'xAxis','axisLine','show')"></Checkbox>
                        是否显示轴线
                        </Col>
                        <Col span="10">
                        <RadioGroup v-model="editForm.axisLineShow" ref="axisLineShow" @on-change="axisShowChange(editForm.axisLineShow,'xAxis','axisLine','show')">
                            <Radio  label="Y"  :disabled="editForm.axisLineShowCheck == 'N'">是</Radio>
                            <Radio  label="N"  :disabled="editForm.axisLineShowCheck == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineColor" true-value="Y" false-value="N"
                                  @on-change="axisColorChange($refs.axisLineClrpkr,editForm.axisLineColor,'xAxis','axisLine','lineStyle','color')"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="axisLineClrpkr" v-model="editForm.axisLineClrpkr"
                                     :disabled="editForm.axisLineColor == 'N'"
                                     @on-change="inputAxisColorChange(editForm.axisLineClrpkr,'xAxis','axisLine','lineStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisPXCheckChange($refs.axisLineWidth,editForm.axisLineWidthCheck,'xAxis','axisLine','lineStyle','width')"></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="10">
                        <Input-number ref="axisLineWidth" :max="20" :min="2" :value="2"
                                      style="width: 100%"
                                      v-model="editForm.axisLineWidth"
                                      :disabled="editForm.axisLineWidthCheck == 'N'"
                                      @on-change="axisPXChange(editForm.axisLineWidth,'xAxis','axisLine','lineStyle','width')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLineTypeCheckChange($refs.axisLineType,editForm.axisLineTypeCheck,'xAxis','axisLine','lineStyle','type')"></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.axisLineType" ref="axisLineType" @on-change="axisLineTypeChange(editForm.axisLineType,'xAxis','axisLine','lineStyle','type')">
                            <Radio  label="solid"  :disabled="editForm.axisLineTypeCheck == 'N'">实线</Radio>
                            <Radio  label="dotted"  :disabled="editForm.axisLineTypeCheck == 'N'">点状线</Radio>
                            <Radio  label="dashed"  :disabled="editForm.axisLineTypeCheck == 'N'">虚线</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">轴标签</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelShowCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisShowCheckChange($refs.axisLabelShow,editForm.axisLabelShowCheck,'xAxis','axisLabel','show')"></Checkbox>
                        是否显示文本标签
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.axisLabelShow" ref="axisLineType" @on-change="axisShowChange(editForm.axisLabelShow, 'xAxis','axisLabel','show')">
                            <Radio  label="Y"  :disabled="editForm.axisLabelShowCheck == 'N'">是</Radio>
                            <Radio  label="N"  :disabled="editForm.axisLabelShowCheck == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisRotateCheck" true-value="Y" false-value="N"
                                  @on-change="axisSliderCheckChange($refs.axisRotate,editForm.axisRotateCheck,'xAxis','axisLabel','rotate')"></Checkbox>
                        文本标签旋转角度
                        </Col>
                        <Col span="10">
                        <Slider ref="axisRotate" v-model="editForm.axisRotate" :min="-180"
                                :disabled="editForm.axisRotateCheck == 'N'"
                                :max="180" show-input @on-change="inputAxisSliderCheckChange(editForm.axisRotate,'xAxis','axisLabel','rotate')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;°</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelIntervalCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisSliderCheckChange($refs.axisLabelInterval,editForm.axisLabelIntervalCheck,'xAxis','axisLabel','interval')"></Checkbox>
                        文本标签与坐标轴间距
                        </Col>
                        <Col span="10">
                        <Slider ref="axisLabelInterval" v-model="editForm.axisLabelInterval"
                                :min="-180" :max="180" show-input
                                :disabled="editForm.axisLabelIntervalCheck == 'N'"
                                @on-change="inputAxisSliderCheckChange(editForm.axisLabelInterval,'xAxis','axisLabel','interval')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;°</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelFormatCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLabelFormatterChange($refs.axisLabelFormat,editForm.axisLabelFormatCheck,'xAxis','axisLabel','formatter')"></Checkbox>
                        标签内容模板
                        </Col>
                        <Col span="11">
                        <Input ref="axisLabelFormat" v-model="editForm.axisLabelFormat"
                               :disabled="editForm.axisLabelFormatCheck == 'N'"
                               @on-change="inputAxisLabelFormatterChange(editForm.axisLabelFormat,'xAxis','axisLabel','formatter')"  ></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" align="right">
                        模板中可以使用“{value}”获得当前量值
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelColor" true-value="Y" false-value="N"
                                  @on-change="axisColorChange($refs.axisLabelClrpkr,editForm.axisLabelColor,'xAxis','axisLabel','textStyle','color')"></Checkbox>
                        文本颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="axisLabelClrpkr" v-model="editForm.axisLabelClrpkr"
                                     :disabled="editForm.axisLabelColor == 'N'"
                                     @on-change="inputAxisColorChange(editForm.axisLabelClrpkr,'xAxis','axisLabel','textStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelSizeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisPXCheckChange($refs.axisLabelSize,editForm.axisLabelSizeCheck,'xAxis','axisLabel','textStyle','fontSize')"></Checkbox>
                        字体大小
                        </Col>
                        <Col span="11">
                        <Input-number ref="axisLabelSize" :max="25" :min="10" style="width: 100%"
                                      v-model="editForm.axisLabelSize"
                                      :disabled="editForm.axisLabelSizeCheck == 'N'"
                                      @on-change="axisPXChange(editForm.axisLabelSize,'xAxis','axisLabel','textStyle','fontSize')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelStyleCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLabelCheckChange($refs.axisLabelStyle,$refs.axisLabelStyleBold,editForm.axisLabelStyleCheck,'xAxis','axisLabel','textStyle','fontStyle')"></Checkbox>
                        字体样式
                        </Col>
                        <Col span="5">
                        <Checkbox v-model="editForm.axisLabelStyleBold" true-value="Y"
                                  false-value="N" ref="axisLabelStyleBold"
                                  :disabled="editForm.axisLabelStyleCheck == 'N'"
                                  @on-change="axisLabelBoldChange(editForm.axisLabelStyleBold,'xAxis','axisLabel','textStyle')">
                        </Checkbox>
                        加粗
                        </Col>
                        <Col span="6">
                        <RadioGroup ref="axisLabelStyle" v-model="editForm.axisLabelStyle" @on-change="axisLabelChange(editForm.axisLabelStyle,'xAxis','axisLabel','textStyle','fontStyle')">
                            <Radio :disabled="editForm.axisLabelStyleCheck == 'N'" label="normal">普通</Radio>
                            <Radio :disabled="editForm.axisLabelStyleCheck == 'N'" label="italic">斜体</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">隔线</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineShow" true-value="Y" false-value="N"
                                  @on-change="axisShowCheckChange($refs.splitLine,editForm.splitLineShow,'xAxis','splitLine','show')"></Checkbox>
                        是否显示隔线
                        </Col>
                        <Col span="11">
                        <RadioGroup ref="splitLine" v-model="editForm.splitLine" @on-change="axisShowChange(editForm.splitLine,'xAxis','splitLine','show')">
                            <Radio  label="Y"  :disabled="editForm.splitLineShow == 'N'">是</Radio>
                            <Radio  label="N"  :disabled="editForm.splitLineShow == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineColor" true-value="Y" false-value="N"
                                  @on-change="axisColorChange($refs.splitLineClrpkr,editForm.splitLineColor,'xAxis','splitLine','lineStyle','color')"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="splitLineClrpkr" v-model="editForm.splitLineClrpkr"
                                     :disabled="editForm.splitLineColor == 'N'"
                                     @on-change="inputAxisColorChange(editForm.splitLineClrpkr,'xAxis','splitLine','lineStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineWidthCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisPXCheckChange($refs.splitLineWidth,editForm.splitLineWidthCheck,'xAxis','splitLine','lineStyle','width')"></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="11">
                        <Input-number ref="splitLineWidth" :max="20" :min="2" style="width: 100%"
                                      :disabled="editForm.splitLineWidthCheck == 'N'"
                                      v-model="editForm.splitLineWidth" @on-change="axisPXChange(editForm.splitLineWidth,'xAxis','splitLine','lineStyle','width')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineTypeCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLineTypeCheckChange($refs.splitLineType,editForm.splitLineTypeCheck,'xAxis','splitLine','lineStyle','type')"></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.splitLineType" ref="splitLineType" @on-change="axisLineTypeChange(editForm.splitLineType,'xAxis','splitLine','lineStyle','type')">
                            <Radio label="solid"  :disabled="editForm.splitLineTypeCheck == 'N'">实线</Radio>
                            <Radio label="dotted"  :disabled="editForm.splitLineTypeCheck == 'N'">点状线</Radio>
                            <Radio label="dashed"  :disabled="editForm.splitLineTypeCheck == 'N'">虚线</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">隔区</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitAreaShow" true-value="Y" false-value="N"
                                  @on-change="axisShowCheckChange($refs.splitArea,editForm.splitAreaShow,'xAxis','splitArea','show')"></Checkbox>
                        是否显示隔区
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.splitArea" ref="splitArea" @on-change="axisShowChange(editForm.splitArea, 'xAxis','splitArea','show')">
                            <Radio label="Y"  :disabled="editForm.splitAreaShow == 'N'">是</Radio>
                            <Radio label="N"  :disabled="editForm.splitAreaShow == 'N'">否</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
        <Panel key="collapse9"
               v-show="editForm.seriesTypeValue == 'line' || editForm.seriesTypeValue == 'bar' || editForm.seriesTypeValue == 'stack'">
            Y轴
            <p slot="content">
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">基础</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisPositionYCheck" true-value="Y"
                                  false-value="N" @on-change="axisCheckChange($refs.axisPositionY, editForm.axisPositionYCheck, 'yAxis', 'position')"></Checkbox>
                        坐标轴位置
                        </Col>
                        <Col span="10">
                        <RadioGroup v-model="editForm.axisPositionY" ref="axisPositionY" @on-change="axisChange(editForm.axisPositionY, 'yAxis', 'position')">
                            <Radio label="left"  :disabled="editForm.axisPositionYCheck == 'N'">
                                居左
                            </Radio>
                            <Radio label="right"  :disabled="editForm.axisPositionYCheck == 'N'">
                                居右
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameYCheck" true-value="Y" false-value="N"
                                  @on-change="axisNameCheckChange($refs.axisNameY,editForm.axisNameYCheck, 'yAxis', 'name')"></Checkbox>
                        坐标轴名称
                        </Col>
                        <Col span="10">
                        <Input ref="axisNameY" v-model="editForm.axisNameY"
                               :disabled="editForm.axisNameYCheck == 'N'"
                               @on-keyup="axisNameBlur(editForm.axisNameY,'yAxis', 'name')"></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNamePositionYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisCheckChange($refs.axisNamePositionY, editForm.axisNamePositionYCheck, 'yAxis', 'nameLocation')"></Checkbox>
                        坐标轴名称位置
                        </Col>
                        <Col span="10">
                        <RadioGroup v-model="editForm.axisNamePositionY" ref="axisNamePositionY" @on-change="axisChange(editForm.axisNamePositionY, 'yAxis', 'nameLocation')">
                            <Radio  :disabled="editForm.axisNamePositionYCheck == 'N'" label="start">
                                位于开端
                            </Radio>
                            <Radio  :disabled="editForm.axisNamePositionYCheck == 'N'" label="end">
                                位于末端
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameYColor" true-value="Y" false-value="N"
                                  @on-change="axisNameColorChange($refs.axisNameYClrpkr,editForm.axisNameYColor,'yAxis','nameTextStyle','color')"></Checkbox>
                        文本颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="axisNameYClrpkr" v-model="editForm.axisNameYClrpkr"
                                     :disabled="editForm.axisNameYColor == 'N'"
                                     @on-change="axisNameColorActiveChange(editForm.axisNameYClrpkr,'yAxis','nameTextStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameSizeYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisFontSizeCheckChange($refs.axisNameSizeY,editForm.axisNameSizeYCheck,'yAxis','nameTextStyle','fontSize')"></Checkbox>
                        字体大小
                        </Col>
                        <Col span="10">
                        <Input-number ref="axisNameSizeY" :max="25" :min="10" style="width: 100%"
                                      v-model="editForm.axisNameSizeY"
                                      :disabled="editForm.axisNameSizeYCheck == 'N'"
                                      @on-change="axisFontSizeChange(editForm.axisNameSizeY,'yAxis','nameTextStyle','fontSize')">
                        </Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisNameStyleYCheck" true-value="Y" false-value="N"
                                  @on-change="axisNameStyleCheckChange($refs.axisNameStyleY,$refs.axisNameStyleYbold,editForm.axisNameStyleY,'yAxis','nameTextStyle','fontStyle')"></Checkbox>
                        字体样式
                        </Col>
                        <Col span="5">
                        <Checkbox ref="axisNameStyleYbold" v-model="editForm.axisNameStyleYbold" true-value="Y"
                                  :disabled="editForm.axisNameStyleYCheck == 'N'"
                                  false-value="N" @on-change="axisNameStyleBoldChange(editForm.axisNameStyleYbold,'yAxis','nameTextStyle')">
                        </Checkbox>
                        加粗
                        </Col>
                        <Col span="6">
                        <RadioGroup ref="axisNameStyleY" v-model="editForm.axisNameStyleY" @on-change="axisNameStyleChange(editForm.axisNameStyleY,'yAxis','nameTextStyle','fontStyle')">
                            <Radio label="normal" :disabled="editForm.axisNameStyleYCheck == 'N'">
                                普通
                            </Radio>
                            <Radio label="italic" :disabled="editForm.axisNameStyleYCheck == 'N'">
                                斜体
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">轴线</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineShowYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisShowCheckChange($refs.axisLineShowY,editForm.axisLineShowYCheck,'yAxis','axisLine','show')"></Checkbox>
                        是否显示轴线
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.axisLineShowY" ref="axisLineShowY" @on-change="axisShowChange(editForm.axisLineShowY,'yAxis','axisLine','show')">
                            <Radio  label="Y"  :disabled="editForm.axisLineShowYCheck == 'N'">
                                是
                            </Radio>
                            <Radio  label="N"  :disabled="editForm.axisLineShowYCheck == 'N'">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineYColor" true-value="Y" false-value="N"
                                  @on-change="axisColorChange($refs.axisLineYClrpkr,editForm.axisLineYColor,'yAxis','axisLine','lineStyle','color')"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="10">
                        <ColorPicker ref="axisLineYClrpkr" v-model="editForm.axisLineYClrpkr"
                                     :disabled="editForm.axisLineYColor == 'N'"
                                     @on-change="inputAxisColorChange(editForm.axisLineYClrpkr,'yAxis','axisLine','lineStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineWidthYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisPXCheckChange($refs.axisLineWidthY,editForm.axisLineWidthYCheck,'yAxis','axisLine','lineStyle','width')"></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="10">
                        <Input-number ref="axisLineWidthY" :max="20" :min="2" style="width: 100%"
                                      v-model="editForm.axisLineWidthY"
                                      :disabled="editForm.axisLineWidthYCheck == 'N'"
                                      @on-change="axisPXChange(editForm.axisLineWidthY,'yAxis','axisLine','lineStyle','width')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLineTypeYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLineTypeCheckChange($refs.axisLineTypeY,editForm.axisLineTypeYCheck,'yAxis','axisLine','lineStyle','type')"></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.axisLineTypeY" ref="axisLineTypeY" @on-change="axisLineTypeChange(editForm.axisLineTypeY,'yAxis','axisLine','lineStyle','type')">
                            <Radio label="solid"  :disabled="editForm.axisLineTypeYCheck == 'N'">
                                实线
                            </Radio>
                            <Radio label="dotted"  :disabled="editForm.axisLineTypeYCheck == 'N'">
                                点状线
                            </Radio>
                            <Radio label="dashed"  :disabled="editForm.axisLineTypeYCheck == 'N'">
                                虚线
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">轴标签</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelShowYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisShowCheckChange($refs.axisLabelShowY,editForm.axisLabelShowYCheck,'yAxis','axisLabel','show')">
                        </Checkbox>
                        是否显示文本标签
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.axisLabelShowY" ref="axisLabelShowY" @on-change="axisShowChange(editForm.axisLabelShowY,'yAxis','axisLabel','show')">
                            <Radio label="Y"  :disabled="editForm.axisLabelShowYCheck == 'N'">
                                是
                            </Radio>
                            <Radio label="N"  :disabled="editForm.axisLabelShowYCheck == 'N'">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisRotateYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisSliderCheckChange($refs.axisRotateY,editForm.axisRotateYCheck,'yAxis','axisLabel','rotate')"></Checkbox>
                        文本标签旋转角度
                        </Col>
                        <Col span="10">
                        <Slider ref="axisRotateY" v-model="editForm.axisRotateY" :min="-180"
                                :disabled="editForm.axisRotateYCheck == 'N'"
                                :max="180" show-input @on-change="inputAxisSliderCheckChange(editForm.axisRotateY,'yAxis','axisLabel','rotate')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;°</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelIntervalYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisSliderCheckChange($refs.axisLabelIntervalY,editForm.axisLabelIntervalYCheck,'yAxis','axisLabel','interval')"></Checkbox>
                        文本标签与坐标轴间距
                        </Col>
                        <Col span="10">
                        <Slider ref="axisLabelIntervalY" v-model="editForm.axisLabelIntervalY"
                                :disabled="editForm.axisLabelIntervalYCheck == 'N'"
                                :min="0" :max="50" show-input @on-change="inputAxisSliderCheckChange(editForm.axisLabelIntervalY,'yAxis','axisLabel','interval')"></Slider>
                        </Col>
                        <Col span="1">
                        <span>&nbsp;px</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelFormatYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLabelFormatterChange($refs.axisLabelFormatY, editForm.axisLabelFormatYCheck,'yAxis','axisLabel','formatter')"></Checkbox>
                        标签内容模板
                        </Col>
                        <Col span="11">
                        <Input ref="axisLabelFormatY" v-model="editForm.axisLabelFormatY"
                               :disabled="editForm.axisLabelFormatYCheck == 'N'"
                               @on-keyup="inputAxisLabelFormatterChange(editForm.axisLabelFormatY,'yAxis','axisLabel','formatter')"></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" align="right">
                        模板中可以使用“{value}”获得当前量值
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelYColor" true-value="Y" false-value="N"
                                  @on-change="axisColorChange($refs.axisLabelYClrpkr,editForm.axisLabelYColor,'yAxis','axisLabel','textStyle','color')"></Checkbox>
                        文本颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="axisLabelYClrpkr" v-model="editForm.axisLabelYClrpkr"
                                     :disabled="editForm.axisLabelYColor == 'N'"
                                     @on-change="inputAxisColorChange(editForm.axisLabelYClrpkr,'yAxis','axisLabel','textStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelSizeYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisPXCheckChange($refs.axisLabelSizeY,editForm.axisLabelSizeYCheck,'yAxis','axisLabel','textStyle','fontSize')"></Checkbox>
                        字体大小
                        </Col>
                        <Col span="11">
                        <Input-number ref="axisLabelSizeY" :max="25" :min="10" style="width: 100%"
                                      v-model="editForm.axisLabelSizeY"
                                      :disabled="editForm.axisLabelSizeYCheck == 'N'"
                                      @on-change="axisPXChange(editForm.axisLabelSizeY,'yAxis','axisLabel','textStyle','fontSize')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.axisLabelStyleYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLabelCheckChange($refs.axisLabelStyleY,$refs.axisLabelStyleYBold,editForm.axisLabelStyleYCheck,'yAxis','axisLabel','textStyle','fontStyle','axisLabelStyleBoldY')"></Checkbox>
                        字体样式
                        </Col>
                        <Col span="5">
                        <Checkbox v-model="editForm.axisLabelStyleYBold" true-value="Y"
                                  false-value="N" ref="axisLabelStyleYBold"
                                  :disabled="editForm.axisLabelStyleYCheck == 'N'"
                                  @on-change="axisLabelBoldChange(editForm.axisLabelStyleYBold,'yAxis','axisLabel','textStyle')">
                        </Checkbox>
                        加粗
                        </Col>
                        <Col span="6">
                        <RadioGroup v-model="editForm.axisLabelStyleY" ref="axisLabelStyleY" @on-change="axisLabelChange(editForm.axisLabelStyleY,'yAxis','axisLabel','textStyle','fontStyle')">
                            <Radio :disabled="editForm.axisLabelStyleYCheck == 'N'" label="normal">
                                普通
                            </Radio>
                            <Radio :disabled="editForm.axisLabelStyleYCheck == 'N'" label="italic">
                                斜体
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">隔线</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineYShow" true-value="Y" false-value="N"
                                  @on-change="axisShowCheckChange($refs.splitLineY,editForm.splitLineYShow,'yAxis','splitLine','show')"></Checkbox>
                        是否显示隔线
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.splitLineY"  ref="splitLineY" @on-change="axisShowChange(editForm.splitLineY,'yAxis','splitLine','show')">
                            <Radio  :disabled="editForm.splitLineYShow == 'N'" label="Y">
                                是
                            </Radio>
                            <Radio  :disabled="editForm.splitLineYShow == 'N'" label="N">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineYColor" true-value="Y" false-value="N"
                                  @on-change="axisColorChange(this,'splitLineYClrpkr','yAxis','splitLine','lineStyle','color')"></Checkbox>
                        线条颜色
                        </Col>
                        <Col span="11">
                        <ColorPicker ref="splitLineYClrpkr" v-model="editForm.splitLineYClrpkr"
                                     :disabled="editForm.splitLineYColor == 'N'"
                                     @on-change="inputAxisColorChange(editForm.splitLineYClrpkr,'yAxis','splitLine','lineStyle','color')"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineWidthYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisPXCheckChange($refs.splitLineWidthY,editForm.splitLineWidthYCheck,'yAxis','splitLine','lineStyle','width')"></Checkbox>
                        线条宽度
                        </Col>
                        <Col span="11">
                        <Input-number ref="splitLineWidthY" :max="20" :min="2" style="width: 100%"
                                      v-model="editForm.splitLineWidthY"
                                      :disabled="editForm.splitLineWidthYCheck == 'N'"
                                      @on-change="axisPXChange(editForm.splitLineWidthY,'yAxis','splitLine','lineStyle','width')"></Input-number>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitLineTypeYCheck" true-value="Y"
                                  false-value="N"
                                  @on-change="axisLineTypeCheckChange($refs.splitLineTypeY,editForm.splitLineTypeYCheck,'yAxis','splitLine','lineStyle','type')"></Checkbox>
                        线条类型
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.splitLineTypeY" ref="splitLineTypeY" @on-change="axisLineTypeChange(editForm.splitLineTypeY,'yAxis','splitLine','lineStyle','type')">
                            <Radio label="solid"  :disabled="editForm.splitLineTypeYCheck == 'N'">
                                实线
                            </Radio>
                            <Radio label="dotted"  :disabled="editForm.splitLineTypeYCheck == 'N'">
                                点状线
                            </Radio>
                            <Radio label="dashed"  :disabled="editForm.splitLineTypeYCheck == 'N'">
                                虚线
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                        <Col>
                        <span style="font-weight:bold">隔区</span></Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Checkbox v-model="editForm.splitAreaYShow" true-value="Y" false-value="N"
                                  @on-change="axisShowCheckChange($refs.splitAreaY,editForm.splitAreaYShow,'yAxis','splitArea','show')"></Checkbox>
                        是否显示隔区
                        </Col>
                        <Col span="11">
                        <RadioGroup v-model="editForm.splitAreaY"  ref="splitAreaY" @on-change="axisShowChange(editForm.splitAreaY, 'yAxis','splitArea','show')">
                            <Radio  label="Y"  :disabled="editForm.splitAreaYShow == 'N'">
                                是
                            </Radio>
                            <Radio label="N"  :disabled="editForm.splitAreaYShow == 'N'">
                                否
                            </Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                </Card>
            </p>
        </Panel>
    </Collapse>
</template>
<script>
    import {
        pointerTypeChange,
        pointerTypeCheckChange,
        remindTiggerChange,
        remindTiggerCheckChange,
        rmdTextAlignHChange,
        rmdTextAlignHCheckChange,
        tooltipFormatterChange,
        toolChange,
        toolFn,
        toolCheckChange,
        putType,
        putTypeCheckChange,
        putV,
        putVCheckChange,
        putH,
        putHCheckChange,
        legendChoiceType,
        selectedModeChange,
        showLegendFn,
        isShowLegendCheckChange,
        subTitleStyleChange,
        subTitleStyleBoldChange,
        subTitleStyleCheckChange,
        subTitleSizeTchPinChange,
        subTitleSizeCheckChange,
        subTitleTextCheckChange,
        inputSubTitleTextCheckChange,
        fontStyleChange,
        fontStyleBoldChange,
        fontStyleCheckChange,
        fontSizeChange,
        fontColorChange,
        borderColorChange,
        borderWidthChange,
        borderWidthCheckChange,
        colorActiveChange,
        bgColorChange,
        titleAlignTypeChange,
        titleAlignTypeCheckChange,
        positionVChange,
        positionVCheckChange,
        positionHChange,
        positionHCheckChange,
        subTitleCheckChange,
        subTitleCheckBlur,
        titleCheckBlur,
        titleCheckChange,
        symbolRotateCheck,
        aSymbolSizeCheckChange,
        seriesFirstPChange,
        seriesFirstPCheckChange,
        stackCheckChange,
        labelSizeChange,
        labelForthChange,
        labelStyleChange,
        labelStyleCheckChange,
        labelSizeCheckChange,
        labelColorChange,
        labelForthCheckChange,
        seriesBorderWthChange,
        seriesBorderWthCheckChange,
        lineColorChange,
        seriesColorChange,
        seriesSingleSliderChange,
        lineWidthCheckChange,
        seriesChartsType,
        line2SmoothCurveChange,
        symbolSizeCheckChange,
        seriesChartsTypeNormal,
        chartsBgColorCheckChange,
        animationCheckChange,
        pointerLineColorChange,
        pointerLineWidthChange,
        pLineWidthChange,
        lineStyleColorActiveChange,
        pointerLineTypeCheckChange,
        choiceToolCheckChange,
        choiceToolChange,
        gridPositionCheck,
        gridColorCheck,
        gridBorderWidthChange,
        gridBorderWidthCheck,
        colorGridActiveChange,
        axisChange,
        axisCheckChange,
        axisNameCheckChange,
        axisNameBlur,
        axisNameColorChange,
        axisFontSizeChange,
        axisNameColorActiveChange,
        seriesSliderXYChange,
        inputSeriesSliderXChange,
        inputSeriesSliderYChange,
        inputSeriesSingleSliderChange,
        symbolSizeChange,
        shapeCheckChange,
        shapeChange,
        radarCenterChange,
        inputRadarCenterChange,
        radarFirstChange,
        inputRadarFirstChange,
        radarSplitNumberCheckChange,
        radarSplitNumberChange,
        radarShowCheckChange,
        radarShowChange,
        radarColorChange,
        radarColorActiveChange,
        radarPXCheckChange,
        radarChange,
        radarLineTypeCheckChange,
        gaugeRangeCheckChange,
        inputGaugeRangeCheckChange,
        gaugeShowCheckChange,
        gaugeShowChange,
        gaugeStyleCheckChange,
        gaugeStyleBoldChange,
        gaugeStyleChange,
        seriesGaugeColorChange,
        inputSeriesGaugeColorChange,
        seriesGaugeCheckChange,
        seriesGaugeChange,
        chartsBgColorChange,
        line2SmoothChange,
        inputSeriesColorChange,
        inputLineColorChange,
        lineWidthChange,
        inputLabelColorChange,
        labelStyleBoldChange,
        aSymbolSizeChange,
        inputSymbolRotateCheck,
        inputBgColorChange,
        inputBorderColorChange,
        inputFontColorChange,
        showLegendChange,
        inputTooltipFormatterChange,
        inputGridPositionCheck,
        axisNameStyleCheckChange,
        axisNameStyleBoldChange,
        axisNameStyleChange,
        axisShowCheckChange,
        axisShowChange,
        axisColorChange,
        inputAxisColorChange,
        axisPXCheckChange,
        axisPXChange,
        axisLineTypeCheckChange,
        axisLineTypeChange,
        axisSliderCheckChange,
        inputAxisSliderCheckChange,
        axisLabelFormatterChange,
        inputAxisLabelFormatterChange,
        axisLabelCheckChange,
        axisLabelBoldChange,
        axisLabelChange,
        animationChange,
        inputStackCheckChange,
        inputPointerLineColorChange,
        updateWidgetConfig
    } from './jDashWidgetParam.js';

    export default {
        name: "dashwidgetParam",
        data() {
            return {
                editForm: {
                    animation: 'Y',
                    animationCheck: 'N',
                    chartsBgColorCheck: 'N',
                    seriesChartsTypeNormalCheck: 'N',
                    seriesChartsTypeCheck: 'Y',
                    symbolSizeCheck: 'N',
                    chartsBgColor: '#BE1919',
                    seriesTypeValue: 'line',
                    smoothCurve: 'N',
                    smoothCurveCheck: 'N',
                    color4ASeries: 'N',
                    lineColor: 'N',
                    lineClrpkr: '#BE1919',
                    borderWidth: 2,
                    borderWidthCheck: 'N',
                    borderClrpkr: '#BE1919',
                    borderColor: 'N',
                    showLabelCheck: 'N',
                    showLabel: 'N',
                    labelPositionCheck: 'N',
                    labelPosition: 'top',
                    labelColor: 'N',
                    labelSizeCheck: 'N',
                    labelSize: 12,
                    labelClrpkr: '#BE1919',
                    labelStyleCheck: 'N',
                    labelStyleBold: '',
                    labelStyle: 'normal',
                    stackCheck: 'N',
                    stack: '',
                    symbol: 'circle',
                    symbolCheck: 'N',
                    aSymbolSizeCheck: 'N',
                    aSymbolSize: 12,
                    symbolRotate: 0,
                    symbolRotateCheck: 'N',
                    lineColorEmph: 'N',
                    lineClrpkrEmph: '#BE1919',
                    borderColorEmph: 'N',
                    borderClrpkrEmph: '#BE1919',
                    borderWidthCheckEmph: 'N',
                    borderWidthEmph: 2,
                    showLabelCheckEmph: 'N',
                    showLabelEmph: 'N',
                    labelPositionCheckEmph: 'N',
                    labelPositionEmph: 'top',
                    labelColorEmph: 'N',
                    labelClrpkrEmph: '#BE1919',
                    labelSizeCheckEmph: 'N',
                    labelSizeEmph: 12,
                    labelStyleCheckEmph: 'N',
                    labelStyleEmphBold: '',
                    labelStyleEmph: 'normal',
                    color4ASeriesEmph: 'N',
                    aSeriesClrpkrEmph: '#BE1919',
                    titleInput: '',
                    titleCheck: 'N',
                    titleLinkCheck: '',
                    titleLinkInput: '',
                    subTitleCheck: 'N',
                    subTitleInput: '',
                    subTitleLinkCheck: '',
                    subTitleLinkInput: '',
                    positionHCheck: 'N',
                    positionH: 'center',
                    positionVCheck: 'N',
                    positionV: 'top',
                    titleAlignType: 'center',
                    titleAlignTypeCheck: 'N',
                    titleBgColor: 'N',
                    titleBgClrpkr: '#BE1919',
                    titleBorderWidthCheck: 'N',
                    titleBorderWidth: 0,
                    titleBorderColorCheck: 'N',
                    titleBorderColorClrpkr: '#BE1919',
                    titleTextColor: 'N',
                    titleTextClrpkr: '#BE1919',
                    titleStyleCheck: 'N',
                    titleStyleBold: '',
                    titleSizeCheck: 'N',
                    titleSizeTchPin: 15,
                    subTitleTextCheck: 'N',
                    subTitleTextClrpkr: '#BE1919',
                    subTitleSizeCheck: 'N',
                    subTitleSizeTchPin: 15,
                    subTitleStyleCheck: 'N',
                    subTitleStyle: '',
                    isShowLegendCheck: 'N',
                    showLegend: 'Y',
                    legendChoiceTypeCheck: 'N',
                    legendChoiceType: 'multiple',
                    legendPositionHCheck: 'N',
                    legendPositionH: 'center',
                    legendPositionVCheck: 'N',
                    legendPositionV: 'bottom',
                    legendPositionTypeCheck: 'N',
                    legendPstType: 'horizontal',
                    legendTextColor: 'N',
                    legendTextClrpkr: '#BE1919',
                    legendSizeCheck: 'N',
                    legendSizeTchPin: 15,
                    usingRemindCheck: 'N',
                    usingRemind: 'Y',
                    tooltipFormatterCheck: 'N',
                    tooltipFormatter: '{a} <br>{b}:{c}',
                    remindBgColor: 'N',
                    remindBgClrpkr: '#BE1919',
                    remindBorderWidthCheck: 'N',
                    remindBorderWidth: 15,
                    remindBorderColor: 'N',
                    remindBorderClrpkr: '#BE1919',
                    remindTextColor: 'N',
                    remindTextClrpkr: '#BE1919',
                    remindTextSizeCheck: 'N',
                    remindTextSize: 13,
                    remindTextStyleCheck: 'N',
                    remindTextStyleBold: '',
                    remindTextStyle: 'normal',
                    rmdTextAlignHCheck: 'N',
                    rmdTextAlignH: 'left',
                    remindTiggerCheck: 'N',
                    remindTigger: 'axis',
                    remindPointerTypeCheck: 'N',
                    remindPointerType: 'line',
                    pointerLineColor: 'N',
                    pointerLineClrpkr: '#BE1919',
                    pointerLineWidthCheck: 'N',
                    pointerLineWidth: 2,
                    pointerLineTypeCheck: 'N',
                    pointerLineType: 'solid',
                    isShowToolCheck: 'N',
                    isShowTool: 'Y',
                    toolPositionHCheck: 'N',
                    toolPositionH: 'right',
                    toolPositionVCheck: 'N',
                    toolPositionV: 'top',
                    toolPositionTypeCheck: 'N',
                    toolPstType: 'horizontal',
                    choiceToolCheck: 'N',
                    choiceTool: [],
                    gridX1Check: 'N',
                    gridX1: 50,
                    gridX2Check: 'N',
                    gridX2: 50,
                    gridY1Check: 'N',
                    gridY1: 50,
                    gridY2Check: 'N',
                    gridY2: 50,
                    gridBgColor: 'N',
                    gridBgClrpkr: '#BE1919',
                    gridBorderWidthCheck: 'N',
                    gridBorderWidth: 2,
                    gridBorderColor: 'N',
                    gridBorderClrpkr: '#BE1919',
                    axisPositionCheck: 'N',
                    axisPosition: 'bottom',
                    axisNameCheck: 'N',
                    axisNamePositionCheck: 'N',
                    axisNamePosition: 'end',
                    axisNameColor: '#BE1919',
                    axisNameClrpkr: '#BE1919',
                    axisNameSizeCheck: 'N',
                    axisNameSize: 12,
                    axisNameStyleCheck: 'N',
                    axisNameStyleBold: '',
                    axisNameStyle: 'normal',
                    boundaryGapCheck: 'N',
                    boundaryGap: 'N',
                    axisLineShowCheck: 'N',
                    axisLineShow: 'Y',
                    axisLineColor: 'N',
                    axisLineWidthCheck: 'N',
                    axisLineWidth: 2,
                    axisLineTypeCheck: 'N',
                    axisLineType: 'solid',
                    axisLabelShowCheck: 'N',
                    axisLabelShow: 'Y',
                    axisRotateCheck: 'N',
                    axisLabelIntervalCheck: 'N',
                    axisLabelInterval: 0,
                    axisLabelFormatCheck: 'N',
                    axisLabelFormat: '{value}',
                    axisLabelColor: 'N',
                    axisLabelClrpkr: '#BE1919',
                    axisLabelSizeCheck: 'N',
                    axisLabelSize: 12,
                    axisLabelStyleCheck: 'N',
                    axisLabelStyleBold: '',
                    axisLabelStyle: 'normal',
                    splitLineShow: 'N',
                    splitLine: 'Y',
                    splitLineColor: 'N',
                    splitLineClrpkr: '#BE1919',
                    splitLineWidthCheck: 'N',
                    splitLineWidth: 12,
                    splitLineTypeCheck: 'N',
                    splitLineType: 'solid',
                    splitAreaShow: 'N',
                    splitArea: 'Y',
                    axisPositionYCheck: 'N',
                    axisPositionY: 'left',
                    axisNameYCheck: 'N',
                    axisNameY: '',
                    axisNamePositionYCheck: 'N',
                    axisNamePositionY: '',
                    axisNameYColor: 'N',
                    axisNameYClrpkr: '#BE1919',
                    axisNameSizeYCheck: 'N',
                    axisNameSizeY: 12,
                    axisNameStyleYCheck: 'N',
                    axisNameStyleY: 'normal',
                    axisNameStyleYbold: '',
                    axisLineShowYCheck: 'N',
                    axisLineShowY: 'Y',
                    axisLineYColor: 'N',
                    axisLineYClrpkr: '#BE1919',
                    axisLineWidthYCheck: 'N',
                    axisLineWidthY: 2,
                    axisLineTypeYCheck: 'N',
                    axisLineTypeY: 'solid',
                    axisLabelShowYCheck: 'N',
                    axisLabelShowY: 'Y',
                    axisRotateYCheck: 'N',
                    axisRotateY: 0,
                    axisLabelIntervalYCheck: 'N',
                    axisLabelIntervalY: 0,
                    axisLabelFormatYCheck: 'N',
                    axisLabelFormatY: '',
                    axisLabelYColor: 'N',
                    axisLabelYClrpkr: '#BE1919',
                    axisLabelSizeYCheck: 'N',
                    axisLabelSizeY: 12,
                    axisLabelStyleYCheck: 'N',
                    axisLabelStyleYBold: '',
                    splitLineYShow: 'N',
                    splitLineY: 'Y',
                    splitLineYColor: 'N',
                    splitLineYClrpkr: '#BE1919',
                    splitLineWidthYCheck: 'N',
                    splitLineWidthY: 2,
                    splitLineTypeYCheck: 'N',
                    splitLineTypeY: 'solid',
                    splitAreaYShow: 'N',
                    splitAreaY: 'Y',
                    axisRotate: 0,
                    line2SmoothCurveCheck: 'N',
                    line2SmoothCurve: 'N',
                    symbolSize: 2,
                    lineWidthCheck: 'N',
                    lineWidth: 2,
                    lineWidthCheckEmph: 'N',
                    lineWidthEmph: 2,
                    aSeriesClrpkr: '#BE1919',
                    subTitleStyleBold: '',
                    titleStyle: 'normal',
                    pieRoseTypeCheck: 'N',
                    pieRoseType: 'radius',
                    pieCenterCheck: 'N',
                    pieCenterX: 50,
                    pieCenterY: 50,
                    pieRadiusCheck: 'N',
                    pieRadius: 60,
                    startAngleCheck: 'N',
                    startAngle: 90,
                    minAngleCheck: 'N',
                    minAngle: 50,
                    selectedModeCheck: 'N',
                    selectedMode: 'none',
                    selectedOffsetCheck: 'N',
                    selectedOffset: 10,
                    legendStyleCheck: 'N',
                    legendStyle: 'normal',
                    legendStyleBold: '',
                    shapeCheck: 'N',
                    shape: 'circle',
                    radarCenterCheck: 'N',
                    radarCenterX: 50,
                    radarCenterY: 50,
                    radarRadiusCheck: '',
                    radarRadius: 75,
                    radarStartAngleCheck: 'N',
                    radarStartAngle: 90,
                    radarSplitNumberCheck: 'N',
                    radarSplitNumber: 5,
                    radarAxisLineShow: 'N',
                    radarAxisLine: '',
                    radarAxisLineColor: 'N',
                    radarAxisLineClrpkr: '#BE1919',
                    radarAxisLineWidthCheck: 'N',
                    radarAxisLineWidth: 2,
                    radarAxisLineTypeCheck: 'N',
                    radarAxisLineType: 'solid',
                    radarSplitLineShow: 'N',
                    radarSplitLine: 'Y',
                    radarSplitLineColor: 'N',
                    radarSplitLineClrpkr: '#BE1919',
                    radarSTWidthCheck: 'N',
                    radarSTWidth: 2,
                    radarSTTypeCheck: '',
                    radarSTType: 'solid',
                    radarSplitAreaShow: 'N',
                    radarSplitArea: 'Y',
                    radarAxisLabelShow: 'N',
                    radarAxisLabel: 'Y',
                    gaugeRangeCheck: 'N',
                    gaugeRange: [0, 100],
                    splitNumberCheck: 'N',
                    splitNumber: 10,
                    gaugeColorCheck: '',
                    addGaugeColor: '',
                    gaugeCenterCheck: 'N',
                    gaugeCenterX: 50,
                    gaugeCenterY: 50,
                    gaugeRadiusCheck: 'N',
                    gaugeRadius: 75,
                    gaugeStartAngleCheck: 'N',
                    gaugeStartAngle: 230,
                    gaugeEndAngleCheck: '',
                    gaugeEndAngle: -45,
                    gaugeTitleCheck: 'N',
                    gaugeTitle: 'Y',
                    gaugeTitleSizeCheck: 'N',
                    gaugeTitleSizeTchPin: 10,
                    gaugeTitleStyleCheck: '',
                    gaugeTitleStyleBold: 'N',
                    gaugeTitleStyle: 'normal',
                    gaugeDataCheck: 'N',
                    gaugeData: 'Y',
                    gaugeTitleBgColor: 'N',
                    gaugeTitleBgClrpkr: '#BE1919',
                    gaugeTitleBorderWidthCheck: '',
                    remindTmpNormal: '{value}%',
                    gaugeFormatterCheck: 'N',
                    gaugeTitleBorderWidth: 0,
                    gaugeTitleBorderColorCheck: 'N',
                    gaugeTitleBorderColorClrpkr: '#BE1919',
                    gaugeDataSizeCheck: 'N',
                    gaugeDataSizeTchPin: 10,
                    gaugeDataStyleCheck: 'N',
                    gaugeDataStyleBold: '',
                    gaugeDataStyle: 'normal',
                    gaugeAxisWidthCheck: 'N',
                    gaugeAxisWidthTchPin: 10,
                    lineSizeCheck: 'N',
                    lineSizeTchPin: 30,
                    subLineSizeCheck: 'N',
                    subLineSizeTchPin: 10,
                    splitNumCheck: 'N',
                    splitNumTchPin: 10,
                    gaugeFontContentCheck: 'N',
                    gaugeFontTmpNormal: '{value}',
                    gaugeFontSizeCheck: 'N',
                    gaugeFontSizeTchPin: 12,
                    gaugeFontStyleCheck: '',
                    gaugeFontStyleBold: 'N',
                    gaugeFontStyle: 'normal',
                    gaugePointerLengthCheck: 'N',
                    gaugePointerLength: 80,
                    gaugePointerWithCheck: 'N',
                    gaugePointerWithTchPin: 10,
                    line2SmoothCurveN: 'line',
                    axisLineClrpkr: '#BE1919',
                    axisLabelStyleY:'normal',
                    widgetConfig :'',


                },
                /*定义全局变量，用于存放选择的Axis、yAxis、series*/
                checkedAxis: 0,
                checkedyAxis: 0,
                checkedSeries: 0,
            }
        },
        methods: {
            animationCheckChange(obj, isChecked) {
                animationCheckChange(obj, isChecked)
            },
            animationFn(val) {
                animationFn(val);
            },
            chartsBgColorCheckChange(obj, isChecked) {
                chartsBgColorCheckChange(obj, isChecked);
            },
            /*系列的图形类型*/
            seriesChartsTypeNormal(val) {
                seriesChartsTypeNormal(val)
            },
            symbolSizeCheckChange(obj, isChecked) {
                symbolSizeCheckChange(obj, isChecked);
            },
            /*折线转为平滑曲线*/
            line2SmoothCurveChange(obj, isChecked) {
                line2SmoothCurveChange(obj, isChecked);
            },
            line2SmoothChange(val) {
                line2SmoothChange(val)
            },
            smoothChange(val) {
                smoothChange(val);
            },
            /*系列的图形类型 type*/
            seriesChartsType(val, target) {
                seriesChartsType(val, target);
            },
            /*线条宽度*/
            lineWidthCheckChange(obj, isChecked, status, target1, target2) {
                lineWidthCheckChange(obj, isChecked, status, target1, target2)
            },
            /*起始角度 startAngle, 饼图最小角度 minAngle, 选中时扇区偏移量 selectedOffset*/
            seriesSingleSliderChange(obj, isChecked, target) {
                seriesSingleSliderChange(obj, isChecked, target);
            },
            /*系列特定颜色、边框颜色*/
            seriesColorChange(obj, isChecked, target, target1, target2) {
                seriesColorChange(obj, isChecked, target, target1, target2);
            },
            /*系列特定颜色、边框颜色*/
            inputSeriesColorChange(val, target, target1, target2) {
                inputSeriesColorChange(val, target, target1, target2);
            },
            /*系列线条颜色 lineStyle: color*/
            lineColorChange(obj, isChecked, status, target1, target2) {
                lineColorChange(obj, isChecked, status, target1, target2)
            },

            /*边框宽度*/
            seriesBorderWthCheckChange(obj, isChecked, target, target1, target2) {
                seriesBorderWthCheckChange(obj, isChecked, target, target1, target2)
            },
            seriesBorderWthChange(obj, target, target1, target2) {
                seriesBorderWthChange(obj, target, target1, target2);
            },
            /*是否显示数据项标签 label true、项标签显示位置 position*/
            labelForthCheckChange(obj, isChecked, status, target1, target2) {
                labelForthCheckChange(obj, isChecked, status, target1, target2)
            },

            /*系列文本颜色 label: color*/
            labelColorChange(obj, isChecked, status, target) {
                labelColorChange(obj, isChecked, status, target)
            },
            /*字体大小*/
            labelSizeCheckChange(obj, isChecked, status, target) {
                labelSizeCheckChange(obj, isChecked, status, target);
            },
            /*字体样式 fontStyle、fontWeight*/
            labelStyleCheckChange(obj, objBold, isChecked, status, target) {
                labelStyleCheckChange(obj, objBold, isChecked, status, target);
            },

            labelStyleChange(val, status, target) {
                labelStyleChange(val, status, target);
            },
            labelForthChange(val, status, target1, target2) {
                labelForthChange(val, status, target1, target2);
            },

            labelSizeChange(val, status, target) {
                labelSizeChange(val, status, target);
            },

            /*堆积名称 stack*/
            stackCheckChange(obj, isChecked, target) {
                stackCheckChange(obj, isChecked, target);
            },

            /*折线转为平滑曲线 smooth*/
            seriesFirstPCheckChange(obj, isChecked, target) {
                seriesFirstPCheckChange(obj, isChecked, target)
            },

            seriesFirstPChange(val, target) {
                seriesFirstPChange(val, target)
            },
            /*小标志大小*/
            aSymbolSizeCheckChange(obj, isChecked, target) {
                aSymbolSizeCheckChange(obj, isChecked, target)
            },

            /*旋转角度*/
            symbolRotateCheck(obj, isChecked, target) {
                symbolRotateCheck(obj, isChecked, target)
            },
            /*主标题文本 text*/
            titleCheckChange(obj, isChecked) {
                titleCheckChange(obj, isChecked)
            },
            titleCheckBlur(value) {
                titleCheckBlur(value);
            },
            subTitleCheckBlur(value) {
                subTitleCheckBlur(value);
            },

            /*副标题文本 subtext*/
            subTitleCheckChange(obj, isChecked) {
                subTitleCheckChange(obj, isChecked);
            },

            /*水平安放位置 x*/
            positionHCheckChange(obj, isChecked) {
                positionHCheckChange(obj, isChecked);
            },

            positionHChange(value) {
                positionHChange(value);
            },
            /*垂直安放位置 y*/
            positionVCheckChange(obj, isChecked) {
                positionVCheckChange(obj, isChecked);
            },

            positionVChange(value) {
                positionVChange(value);
            },

            /*标题对齐方式 textAlign*/
            titleAlignTypeCheckChange(obj, isChecked) {
                titleAlignTypeCheckChange(obj, isChecked);
            },

            titleAlignTypeChange(value) {
                titleAlignTypeChange(value);
            },

            /*[主标题、提示]: 标题背景颜色 backgroundColor*/
            bgColorChange(obj, isChecked, target) {
                bgColorChange(obj, isChecked, target);
            },
            colorActiveChange(value, target) {
                colorActiveChange(value, target);
            },
            lineStyleColorActiveChange(value) {
                lineStyleColorActiveChange(value);
            },


            /*[主标题、提示]: 边框线宽 borderWidth*/
            borderWidthCheckChange(obj, isChecked, target) {
                borderWidthCheckChange(obj, isChecked, target);
            },
            borderWidthChange(value, target) {
                borderWidthChange(value, target);
            },
            /*[主标题、提示]: 边框颜色 borderColor*/
            borderColorChange(obj, isChecked, target) {
                borderColorChange(obj, isChecked, target);
            },


            /*[主标题、图例、提示]: 文本颜色 textStyle: color*/
            fontColorChange(obj, isChecked, target) {

                fontColorChange(obj, isChecked, target);
            },
            /*[主标题、图例、提示]: 字体大小 textStyle: fontSize*/
            fontSizeCheckChange(obj, isChecked, target) {

                fontSizeCheckChange(obj, isChecked, target);
            },

            fontSizeChange(value, target) {
                fontSizeChange(value, target);
            },
            /*[主标题、图例、提示]: 字体样式 textStyle: fontStyle*/
            fontStyleCheckChange(obj, objBold, isChecked, target) {
                fontStyleCheckChange(obj, objBold, isChecked, target);
            },

            fontStyleBoldChange(value, target) {
                fontStyleBoldChange(value, target);
            },
            fontStyleChange(value, target) {
                fontStyleChange(value, target);
            },
            /*文本颜色 subtextStyle: color*/
            subTitleTextCheckChange(obj, isChecked) {
                subTitleTextCheckChange(obj, isChecked);
            },

            /*字体大小 subtextStyle: fontSize*/
            subTitleSizeCheckChange(obj, isChecked) {
                subTitleSizeCheckChange(obj, isChecked);
            },

            subTitleSizeTchPinChange(value) {
                subTitleSizeTchPinChange(value);
            },

            /*字体样式 subtextStyle: fontStyle*/
            subTitleStyleCheckChange(obj, bold, isChecked) {
                subTitleStyleCheckChange(obj, bold, isChecked);
            },
            subTitleStyleBoldChange(value) {
                subTitleStyleBoldChange(value);
            },
            subTitleStyleChange(value) {
                subTitleStyleChange(value);
            },

            /*是否显示图例 legend*/
            isShowLegendCheckChange(obj, isChecked) {
                isShowLegendCheckChange(obj, isChecked);
            },

            showLegendFn(val) {
                showLegendFn(val);
            },

            /*图例选择模式 selectedMode*/
            selectedModeChange(obj, isChecked) {
                selectedModeChange(obj, isChecked);
            },
            legendChoiceType(val) {
                legendChoiceType(val);
            },

            /*[图例、工具]： 水平安放位置 x*/
            putHCheckChange(obj, isChecked, target) {
                putHCheckChange(obj, isChecked, target);
            },
            putH(val, target) {
                putH(val, target);
            },
            /*[图例、工具]：垂直安放位置 y*/
            putVCheckChange(obj, isChecked, target) {
                putVCheckChange(obj, isChecked, target);
            },
            putV(val, target) {
                putV(val, target);
            },

            /*[图例、工具]：图例放置方式 orient*/
            putTypeCheckChange(obj, isChecked, target) {
                putTypeCheckChange(obj, isChecked, target);
            },
            putType(val, target) {
                putType(val, target);
            },
            /*是否使用提示 show*/
            toolCheckChange(obj, isChecked, target) {
                toolCheckChange(obj, isChecked, target);
            },

            toolFn(val, target) {
                toolFn(val, target);
            },

            toolChange(val, target) {
                toolChange(val, target);
            },

            /*提示模板 formatter*/
            tooltipFormatterChange(obj, isChecked) {
                tooltipFormatterChange(obj, isChecked)
            },

            /*文本水平对齐方式 textStyle: align*/
            rmdTextAlignHCheckChange(obj, isChecked) {
                rmdTextAlignHCheckChange(obj, isChecked);
            },

            rmdTextAlignHChange(val) {
                rmdTextAlignHChange(val);
            },

            /*提示触发点 trigger*/
            remindTiggerCheckChange(obj, isChecked) {
                remindTiggerCheckChange(obj, isChecked);
            },

            remindTiggerChange(value) {
                remindTiggerChange(value);
            },
            pointerTypeCheckChange(obj, isChecked) {

                pointerTypeCheckChange(obj, isChecked)
            },
            pointerTypeChange(val) {
                pointerTypeChange(val);
            },
            pointerLineColorChange(obj, isChecked) {
                pointerLineColorChange(obj, isChecked);
            },
            inputLineColorChange(val, status, target1, target2) {
                inputLineColorChange(val, status, target1, target2);
            },
            pointerLineWidthChange(obj, isChecked) {
                pointerLineWidthChange(obj, isChecked);
            },
            pLineWidthChange(val) {
                pLineWidthChange(val);
            },
            pointerLineTypeCheckChange(obj, isChecked) {
                pointerLineTypeCheckChange(obj, isChecked);
            },
            pointerLineTypeChange(val) {
                pointerLineTypeChange(val);
            },
            choiceToolCheckChange(obj, isChecked) {
                choiceToolCheckChange(obj, isChecked);
            },
            choiceToolChange(obj,isChecked) {
                choiceToolChange(obj,isChecked);
            },
            gridPositionCheck(obj, isChecked, target) {
                gridPositionCheck(obj, isChecked, target);
            },
            gridColorCheck(obj, isChecked, target) {
                gridColorCheck(obj, isChecked, target);
            },
            colorGridActiveChange(val, target) {
                colorGridActiveChange(val, target);
            },
            gridBorderWidthCheck(obj, isChecked) {
                gridBorderWidthCheck(obj, isChecked);
            },
            gridBorderWidthChange(val) {
                gridBorderWidthChange(val);
            },
            axisCheckChange(obj, isChecked, axis, target) {
                axisCheckChange(obj, isChecked, axis, target);
            },
            axisChange(val, axis, target) {
                axisChange(val, axis, target);
            },
            axisNameCheckChange(obj, isChecked, axis, target) {
                axisNameCheckChange(obj, isChecked, axis, target);
            },
            axisNameBlur(val,axis, target) {
                axisNameBlur(val,axis, target);
            },
            axisNameColorChange(obj, isChecked, axis, target, target1) {
                axisNameColorChange(obj, isChecked, axis, target, target1);
            },
            axisFontSizeCheckChange(obj, isChecked, axis, target, target1) {
                axisFontSizeCheckChange(obj, isChecked, axis, target, target1)
            },
            axisFontSizeChange(val, axis, target, target1) {
                axisFontSizeChange(val, axis, target, target1);
            },
            axisNameColorActiveChange(val,axis, target, target1,)  {
                axisNameColorActiveChange(val,axis, target, target1);
            },
            seriesSliderXYChange(isChecked, objx, objy, target) {
                seriesSliderXYChange(isChecked, objx, objy, target);
            },
            inputSeriesSliderXChange(valx, objx, objy, target) {
                inputSeriesSliderXChange(valx, objx, objy, target);
            },
            inputSeriesSliderYChange(valy, objx, objy, target) {
                inputSeriesSliderYChange(valy, objx, objy, target);
            },
            inputSeriesSingleSliderChange(obj, target) {
                inputSeriesSingleSliderChange(obj, target)
            },
            symbolSizeChange(val) {
                symbolSizeChange(val);
            },
            shapeCheckChange(obj, isChecked, target) {
                shapeCheckChange(obj, isChecked, target);
            },
            shapeChange(val, target) {
                shapeChange(val, target);
            },
            radarCenterChange(isChecked, objx, objy) {
                radarCenterChange(isChecked, objx, objy);
            },
            inputRadarCenterChange(obj, i) {
                inputRadarCenterChange(obj, i);
            },
            radarFirstChange(obj, isChecked, target) {
                radarFirstChange(obj, isChecked, target);
            },
            inputRadarFirstChange(val, target) {
                inputRadarFirstChange(val, target);
            },
            radarSplitNumberCheckChange(obj, isChecked, target) {
                radarSplitNumberCheckChange(obj, isChecked, target);
            },
            radarSplitNumberChange(val, target) {
                radarSplitNumberChange(val, target);
            },
            radarShowCheckChange(obj, isChecked, target, target1) {
                radarShowCheckChange(obj, isChecked, target, target1);
            },
            radarShowChange(val, target, target1) {
                radarShowChange(val, target, target1);
            },
            radarColorChange(obj, isChecked, target, target1, target2) {
                radarColorChange(obj, isChecked, target, target1, target2);
            },
            radarColorActiveChange(val, target, target1, target2) {
                radarColorActiveChange(val, target, target1, target2);
            },
            radarPXCheckChange(obj, isChecked, target, target1, target2) {
                radarPXCheckChange(obj, isChecked, target, target1, target2);
            },
            radarChange(val, target, target1, target2) {
                radarChange(val, target, target1, target2);
            },
            radarLineTypeCheckChange(obj, isChecked, target, target1, target2) {
                radarLineTypeCheckChange(obj, isChecked, target, target1, target2);
            },
            gaugeRangeCheckChange(obj, isChecked, min, max) {
                gaugeRangeCheckChange(obj, isChecked, min, max)
            },
            inputGaugeRangeCheckChange(val, min, max) {
                inputGaugeRangeCheckChange(val, min, max)
            },
            gaugeShowCheckChange(obj, isChecked, target, target1) {
                gaugeShowCheckChange(obj, isChecked, target, target1);
            },
            gaugeShowChange(val, target, target1) {
                gaugeShowChange(val, target, target1);
            },
            gaugeStyleCheckChange(obj, boldObj, isChecked, target, target1, target2) {
                gaugeStyleCheckChange(obj, boldObj, isChecked, target, target1, target2);
            },
            gaugeStyleBoldChange(isChecked, target, target1, target2) {
                gaugeStyleBoldChange(isChecked, target, target1, target2);
            },
            gaugeStyleChange(val, target, target1, target2) {
                gaugeStyleChange(val, target, target1, target2);
            },
            seriesGaugeColorChange(obj, isChecked, target, target1) {
                seriesGaugeColorChange(obj, isChecked, target, target1);
            },
            inputSeriesGaugeColorChange(val, target, target1) {
                inputSeriesGaugeColorChange(val, target, target1);
            },
            seriesGaugeCheckChange(obj, isChecked, target, target1) {
                seriesGaugeCheckChange(obj, isChecked, target, target1);
            },
            seriesGaugeChange(val, target, target1) {
                seriesGaugeChange(val, target, target1);
            },
            chartsBgColorChange(val) {
                chartsBgColorChange(val);
            },
            lineWidthChange(val, status, target1, target2) {
                lineWidthChange(val, status, target1, target2);
            },
            inputLabelColorChange(val,status, target){
                inputLabelColorChange(val,status, target);
            },
            labelStyleBoldChange(isChecked, status, target){
                labelStyleBoldChange(isChecked, status, target);
            },
            aSymbolSizeChange(val, target){
                aSymbolSizeChange(val, target);
            },
            inputSymbolRotateCheck(val, target){
                inputSymbolRotateCheck(val, target);
            },
            inputBgColorChange(val,target){
                inputBgColorChange(val,target);
            },
            inputBorderColorChange(val, target){
                inputBorderColorChange(val, target);
            },
            inputFontColorChange(val,target){
                inputFontColorChange(val,target);
            },
            inputSubTitleTextCheckChange(val,target){
                inputSubTitleTextCheckChange(val,target);
            },
            showLegendChange(val){
                showLegendChange(val);
            },
            inputTooltipFormatterChange(val){
                inputTooltipFormatterChange(val);
            },
            inputGridPositionCheck(val,target){
                inputGridPositionCheck(val,target);
            },
            axisNameStyleCheckChange(obj,objBold, isChecked, axis, target, target1){
                axisNameStyleCheckChange(obj,objBold, isChecked, axis, target, target1);
            },
            axisNameStyleBoldChange(val, axis, target){
                axisNameStyleBoldChange(val, axis, target);
            },
            axisNameStyleChange(val, axis, target, target1){
                axisNameStyleChange(val, axis, target, target1);
            },
            axisShowCheckChange(obj, isChecked, axis, target, target1){
                axisShowCheckChange(obj, isChecked, axis, target, target1);
            },
            axisShowChange(val, axis, target, target1){
                axisShowChange(val, axis, target, target1);
            },
            axisColorChange(obj, isChecked, axis, target, target1, target2){
                axisColorChange(obj, isChecked, axis, target, target1, target2);
            },
            inputAxisColorChange(val,axis, target, target1, target2){
                inputAxisColorChange(val,axis, target, target1, target2);
            },
            axisPXCheckChange(obj, isChecked, axis, target, target1, target2){
                axisPXCheckChange(obj, isChecked, axis, target, target1, target2);
            },
            axisPXChange(val, axis, target, target1, target2){
                axisPXChange(val, axis, target, target1, target2);
            },
            axisLineTypeCheckChange(obj, isChecked, axis, target, target1, target2){
                axisLineTypeCheckChange(obj, isChecked, axis, target, target1, target2);
            },
            axisLineTypeChange(val, axis, target, target1, target2){
                axisLineTypeChange(val, axis, target, target1, target2);
            },
            axisSliderCheckChange(obj, isChecked, axis, target, target1){
                axisSliderCheckChange(obj, isChecked, axis, target, target1);
            },
            inputAxisSliderCheckChange(val,axis, target, target1){
                inputAxisSliderCheckChange(val,axis, target, target1);
            },
            axisLabelFormatterChange(obj, isChecked, axis, target, target1){
                axisLabelFormatterChange(obj, isChecked, axis, target, target1);
            },
            inputAxisLabelFormatterChange(val,axis, target, target1){
                inputAxisLabelFormatterChange(val,axis, target, target1);
            },
            axisLabelCheckChange(obj, boldObj,isChecked, axis, target, target1, target2){
                axisLabelCheckChange(obj, boldObj,isChecked, axis, target, target1, target2);
            },
            axisLabelBoldChange(_bold, axis, target, target1){
                axisLabelBoldChange(_bold, axis, target, target1);
            },
            axisLabelChange(val, axis, target, target1, target2){
                axisLabelChange(val, axis, target, target1, target2)
            },
            animationChange(val){
                animationChange(val);
            },
            inputStackCheckChange(val,target){
                inputStackCheckChange(val,target);
            },
            inputPointerLineColorChange(val){
                inputPointerLineColorChange(val);
            },
            updateWidgetConfig(widgetConfig){
                this.widgetConfig = updateWidgetConfig(widgetConfig);
            }
        }
    }

</script>