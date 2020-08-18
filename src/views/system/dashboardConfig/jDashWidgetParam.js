
var currOption = '';
var option  = ''  ;
var TABS_CHART = 'container';
var echarts = '';

/*定义一个全局变量，标志图表参数是否更新*/
var updateFlag = false;
/*定义全局变量，用于存放选择的Axis、yAxis、series*/
var checkedAxis = 0, checkedyAxis = 0, checkedSeries = 0;
/*图表类型: 折线图、柱形图、面积图、饼图、雷达图、油量图*/
var TYPE_LINE = 'line', TYPE_BAR = 'bar', TYPE_STACK = 'stack', TYPE_PIE = 'pie', TYPE_RADAR = 'radar',
    TYPE_GAUGE = 'gauge';
function animationCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj,false)
        var val = obj.value;
        animationFn(val);
    }
    else {
        disabledChildrens(obj,false)
        option['animation'] = currOption['animation'];
        commonFn(option);
    }
}


function animationFn(val) {
    if (val == 'Y')
        option['animation'] = true;
    else if (val == 'N')
        option['animation'] = false;
    commonFn(option);
}

/!*更新脚本通用方法*!/

function commonFn(optionScript) {
    updateFlag = true;
    var tmpOption = JSON.stringify(optionScript);
    initchart(TABS_CHART, tmpOption);
}

/!* 此方法主要用于初始化图形，传入显示ID和配置 *!/

function initchart(id, chartOptions) {

    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);

    var option = null;
    option = $.parseJSON(chartOptions);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    $(window).resize(myChart.resize);
}

function chartsBgColorCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        option['backgroundColor'] = obj.value;
    }
    else
    {
        obj.disabled = true;
        option['backgroundColor'] = '';
    }
    commonFn(option);
}

function chartsBgColorChange(val){
    option['backgroundColor'] = val;
    commonFn(option);
}


function animationChange(val){
    animationFn(val);
}


function symbolSizeCheckChange(obj,isChecked) {
    var seriesArr = option['series'];
    if (isChecked == 'Y') {
        obj.disabled = false;
        var val = obj.e;
        $.each(seriesArr, function (i, v) {
            v.symbolSize = val;
        });
    }
    else {
        obj.disabled = true;
        var currSeriesArr = currOption['series'];
        $.each(currSeriesArr, function (i, v) {
            seriesArr[i].symbolSize = v.symbolSize;
        });
    }
    option['series'] = seriesArr;
    commonFn(option);
}
function symbolSizeChange(val){
    var seriesArr = option['series'];
    $.each(seriesArr, function(i, v){
        v.symbolSize = val;
    });
    option['series'] = seriesArr;
    commonFn(option);
}
/!*折线转为平滑曲线*!/

function line2SmoothCurveChange(obj,isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj,false);
        var val = obj.value;
        smoothChange(val);
    }
    else {
        disabledChildrens(obj,true);
        var seriesArr = option['series'];
        var currSeriesArr = currOption['series'];
        $.each(currSeriesArr, function (i, v) {
            seriesArr[i].smooth = v.smooth;
        });
        option['series'] = seriesArr;
        commonFn(option);
    }
}
function line2SmoothChange(val){
    smoothChange(val);
}

function smoothChange(val) {
    var seriesArr = option['series'];
    if (val == 'Y') {
        $.each(seriesArr, function (i, v) {
            v.smooth = true;
        });
    }
    else {
        $.each(seriesArr, function (i, v) {
            v.smooth = false;
        });
    }
    option['series'] = seriesArr;
    commonFn(option);
}

/!*系列的图形类型 type*!/

function seriesChartsType(val, target) {
    updateCurrSeries(target, val);
}

/!*线条宽度*!/

function lineWidthCheckChange(obj, isChecked, status, target1, target2) {
    var val;
    if (isChecked == 'Y') {
        obj.disabled = false;
        val = obj.value;
    }
    else {
        obj.disabled = false;
        val = getDefaultSeriesValForth(status, target1, target2);
    }
    updateCurrSeriesForth(status, target1, target2, val);
}

function getDefaultSeriesValForth(status, target1, target2) {
    var tmp = undefined;
    var _currSeries = currOption['series'][checkedSeries];
    if (_currSeries) {
        var _currItemStyle = _currSeries['itemStyle'];
        if (_currItemStyle) {
            var _currStatus = _currItemStyle[status];
            if (_currStatus) {
                var _target1 = _currStatus[target1];
                if (_target1) tmp = _target1[target2];
            }
        }
    }
    return tmp;
}

/!*更新第四级属性的值-通用方法。如：series{itemStyle：{normal：{label：{position: "right",show: true}}}}*!/

function updateCurrSeriesForth(status, target1, target2, val) {
    var _series = option['series'][checkedSeries];
    var _itemStyle = _series['itemStyle'];
    if (!_itemStyle) _itemStyle = {};

    var _status = _itemStyle[status];
    if (!_status) _status = {};

    var _target1 = _status[target1];
    if (!_target1) _target1 = {};

    _target1[target2] = val;

    /!*更新图表*!/
    _status[target1] = _target1;
    _itemStyle[status] = _status;
    _series['itemStyle'] = _itemStyle;
    option['series'][checkedSeries] = _series;
    commonFn(option);
}

/!*更新第一级属性的值-通用方法*!/

function updateCurrSeries(target, val) {

    /!*取出属性，并赋值*!/
    var _series = option['series'][checkedSeries];
    _series[target] = val;

    /!*更新图表*!/
    option['series'][checkedSeries] = _series;
    commonFn(option);
}

/!*起始角度 startAngle, 饼图最小角度 minAngle, 选中时扇区偏移量 selectedOffset*!/

function seriesSingleSliderChange(obj, isChecked, target) {
    var val;
    if (isChecked == 'Y') {
        disabledChildrens(obj,false);
        val = obj.value;
        if (val == 'Y') val = true;
        else if (val == 'N' || val == 'none') val = false;
    }
    else {
        disabledChildrens(obj,true);
        val = getDefaultSeriesVal(target);
    }
    updateCurrSeries(target, val);
}

function inputSeriesSingleSliderChange(obj,target){
    let val = obj.value;
    if(target == 'radius')
        val = val + '%';
    updateCurrSeries(target, val);
}

function getDefaultSeriesVal(target) {
    var _currSeries = currOption['series'][checkedSeries];
    if (_currSeries) return _currSeries[target];
    return undefined;
}

/!*系列特定颜色、边框颜色*!/

function seriesColorChange(obj, isChecked, target, target1, target2) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        var val = obj.value;
        updateCurrSeriesThird(target, target1, target2, val);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultSeriesValThird(target, target1, target2);
        updateCurrSeriesThird(target, target1, target2, val);
    }
}

function inputSeriesColorChange(val,target, target1, target2){
    updateCurrSeriesThird(target, target1, target2, val);
}

/*油量图字体样式*/
function gaugeStyleCheckChange(obj, boldObj,isChecked, target, target1, target2){
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        boldObj.disabled = false;
        var isChecked = boldObj.value;
        if(isChecked == 'Y') updateCurrSeriesThird(target, target1, 'fontWeight', 'bold');
        else updateCurrSeriesThird(target, target1, 'fontWeight', 'normal');

        var val = obj.value;
        updateCurrSeriesThird(target, target1, target2, val);
    }
    else
    {
        disabledChildrens(obj,true);
        boldObj.disabled = true;
        var val1 = getDefaultSeriesValThird(target, target1, 'fontWeight');
        updateCurrSeriesThird(target, target1, 'fontWeight', val1);

        var val2 = getDefaultSeriesValThird(target, target1, target2);
        updateCurrSeriesThird(target, target1, target2, val2);
    }
}

function gaugeStyleBoldChange(isChecked, target, target1, target2){
    if(isChecked == 'Y') updateCurrSeriesThird(target, target1, target2, 'bold');
    else updateCurrSeriesThird(target, target1, target2, 'normal');
}



/*油量图数据描述颜色调整*/
function seriesGaugeColorChange(obj, isChecked, target, target1){
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        var val = obj.value;
        updateCurrSeriesSec(target, target1, val);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultSeriesValSec(target, target1);
        updateCurrSeriesSec(target, target1, val);
    }
}
function seriesGaugeChange(val, target, target1){
    if(target == 'pointer' && target1 == 'length')
        val = val + '%';
    updateCurrSeriesSec(target, target1, val);
}

/*油量图宽度及长度设置*/
function seriesGaugeCheckChange(obj,isChecked , target, target1){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        val = obj.value;
        if(target == 'pointer' && target1 == 'length')
            val = val + '%';
    }
    else
    {
        obj.disabled = true;
        val = getDefaultSeriesValSec(target, target1);
    }
    updateCurrSeriesSec(target, target1, val);
}

function inputSeriesGaugeColorChange(val,target, target1){
    updateCurrSeriesSec(target, target1, val);
}


function getDefaultSeriesValThird(target, target1, target2) {
    var tmp = undefined;
    var _currSeries = currOption['series'][checkedSeries];
    if (_currSeries) {
        var _targetcurrSeries = _currSeries[target];
        if (_targetcurrSeries) {
            var _currStyle = _targetcurrSeries[target1];
            if (_currStyle) tmp = _currStyle[target2];
        }
    }

    return tmp;
}


function updateCurrSeriesThird(target, target1, target2, val) {

    var _series = option['series'][checkedSeries];
    var _targetSeries = _series[target];
    if (!_targetSeries) _targetSeries = {};
    var _style = _targetSeries[target1];
    if (!_style) _style = {};

    _style[target2] = val;

    /!*更新图表*!/
    _targetSeries[target1] = _style;
    _series[target] = _targetSeries
    option['series'][checkedSeries] = _series;
    commonFn(option);
}

/!*系列线条颜色 lineStyle: color*!/

function lineColorChange(obj, isChecked, status, target1, target2) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        var val = obj.value;
        updateCurrSeriesForth(status, target1, target2, val);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultSeriesValForth(status, target1, target2);
        updateCurrSeriesForth(status, target1, target2, val);
    }
}

function inputLineColorChange(val,status, target1, target2){
    updateCurrSeriesForth(status, target1, target2, val);
}
function lineWidthChange(val, status, target1, target2){
    updateCurrSeriesForth(status, target1, target2, val);
}
/!*边框宽度*!/

function seriesBorderWthCheckChange(obj, isChecked, target, target1, target2) {
    var val;
    if (isChecked == 'Y') {
        obj.disabled = false;
        val = obj.value;
    }
    else {
        obj.disabled = true;
        val = getDefaultSeriesValThird(target, target1, target2);
    }
    updateCurrSeriesThird(target, target1, target2, val);
}

function seriesBorderWthChange(obj, target, target1, target2) {
    var val = obj.value;
    updateCurrSeriesThird(target, target1, target2, val);
}

/!*是否显示数据项标签 label true、项标签显示位置 position*!/

function labelForthCheckChange(obj, isChecked, status, target1, target2) {
    var val;
    if (isChecked == 'Y') {
        if (obj.childrens) {
            disabledChildrens(obj, false);
        } else {
            obj.disabled = false;
        }

        val = obj.value;
        if (val == 'Y') val = true;
        else if (val == 'N') val = false;
    }
    else {
        if (obj.childrens) {
            disabledChildrens(obj, true);
        } else {
            obj.disabled = true;
        }

        val = getDefaultSeriesValForth(status, target1, target2);
    }
    updateCurrSeriesForth(status, target1, target2, val);
}

/!*系列文本颜色 label: color*!/

function labelColorChange(obj, isChecked, status, target) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        updateCurrSeriesFifth(status, target, val);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultSeriesValFifth(status, target);
        updateCurrSeriesFifth(status, target, val);
    }
}

function inputLabelColorChange(val,status, target){
    updateCurrSeriesFifth(status, target, val);
}

function getDefaultSeriesValFifth(status, target) {
    var tmp = undefined;
    var _currSeries = currOption['series'][checkedSeries];
    if (_currSeries) {
        var _currItemStyle = _currSeries['itemStyle'];
        if (_currItemStyle) {
            var _currStatus = _currItemStyle[status];
            if (_currStatus) {
                var _currLabel = _currStatus['label'];
                if (_currLabel) {
                    var _currStyle = _currLabel['textStyle'];
                    if (_currStyle) tmp = _currStyle[target];
                }
            }
        }
    }
    return tmp;
}

/!*更新第五级属性的值-通用方法。如：series{itemStyle：{normal：{label：{textStyle: {fontSize: 12}}}}}*!/

function updateCurrSeriesFifth(status, target, val) {

    var _series = option['series'][checkedSeries];
    var _itemStyle = _series['itemStyle'];
    if (!_itemStyle) _itemStyle = {};

    var _status = _itemStyle[status];
    if (!_status) _status = {};

    var _label = _status['label'];
    if (!_label) _label = {};

    var _style = _label['textStyle'];
    if (!_style) _style = {};

    _style[target] = val;

    /!*更新图表*!/
    _label['textStyle'] = _style;
    _status['label'] = _label;
    _itemStyle[status] = _status;
    _series['itemStyle'] = _itemStyle;
    option['series'][checkedSeries] = _series;
    commonFn(option);
}

/!*字体大小*!/

function labelSizeCheckChange(obj, isChecked, status, target) {
    var val;
    if (isChecked == 'Y') {
        obj.disabled = false;
        val = obj.value;
    }
    else {
        obj.disabled = true;
        val = getDefaultSeriesValFifth(status, target);
    }
    updateCurrSeriesFifth(status, target, val);
}

/!*字体样式 fontStyle、fontWeight*!/

function labelStyleCheckChange(obj, objBold, isChecked, status, target) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        objBold.disabled = false;
        if (objBold.currentValue) {
            updateCurrSeriesFifth(status, 'fontWeight', 'bold');
        } else {
            updateCurrSeriesFifth(status, 'fontWeight', 'normal');
        }
        var val = obj.value;
        updateCurrSeriesFifth(status, target, val);
    }
    else {
        disabledChildrens(obj, true);
        objBold.disabled = true;
        var val1 = getDefaultSeriesValFifth(status, 'fontWeight');
        updateCurrSeriesFifth(status, 'fontWeight', val1);

        var val2 = getDefaultSeriesValFifth(status, target);
        updateCurrSeriesFifth(status, target, val2);
    }
}


function labelStyleBoldChange(isChecked, status, target){
    if(isChecked == 'Y') updateCurrSeriesFifth(status, target, 'bold');
    else updateCurrSeriesFifth(status, target, 'normal');

}

function labelStyleChange(val, status, target) {
    updateCurrSeriesFifth(status, target, val);
}

function labelForthChange(val, status, target1, target2) {
    if (val == 'Y') val = true;
    else if (val == 'N') val = false;
    updateCurrSeriesForth(status, target1, target2, val);
}


function labelSizeChange(val, status, target) {
    updateCurrSeriesFifth(status, target, val);
}

/!*堆积名称 stack*!/

function stackCheckChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        var val = obj.value;
        updateCurrSeries(target, val);
    }
    else {
        obj.disabled = true;
        var val = getDefaultSeriesVal(target);
        updateCurrSeries(target, val);
    }
}

function inputStackCheckChange(val,target){
    updateCurrSeries(target, val);
}


/!*折线转为平滑曲线 smooth*!/

function seriesFirstPCheckChange(obj, isChecked, target) {
    var val;
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        val = obj.value;
        if (val == 'Y') val = true;
        else if (val == 'N' || val == 'none') val = false;
    }
    else {
        disabledChildrens(obj, true);
        val = getDefaultSeriesVal(target);
    }
    updateCurrSeries(target, val);
}

function seriesFirstPChange(val, target) {
    if (val == 'Y') val = true;
    else if (val == 'N' || val == 'none') val = false;
    updateCurrSeries(target, val);
}

/!*小标志大小*!/

function aSymbolSizeCheckChange(obj, isChecked, target) {
    var val;
    if (isChecked == 'Y') {
        obj.disabled = false;
        val = obj.value;
    }
    else {
        obj.disabled = true;
        val = getDefaultSeriesVal(target);
    }
    updateCurrSeries(target, val);
}

function aSymbolSizeChange(val, target){
    updateCurrSeries(target, val);
}



/!*旋转角度*!/

function symbolRotateCheck(obj, isChecked, target) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        let val = obj.value;
        updateCurrSeries(target, val);
    }
    else {
        obj.disabled = true;
        var val = getDefaultSeriesVal(target);
        updateCurrSeries(target, val);
    }
}

function inputSymbolRotateCheck(val, target){
    updateCurrSeries(target, val);
}


/!*主标题文本 text*!/

function titleCheckChange(obj, isChecked) {

    if (isChecked == 'Y') {
        obj.disabled = false;
        var _title = currOption['title'].text;
        obj.value = _title;
    }
    else {
        obj.disabled = true;
        option['title'].text = currOption['title'].text;

    }
    commonFn(option);
}

function titleCheckBlur(value) {
    option['title'].text = value;
    commonFn(option);

}


function subTitleCheckBlur(value) {
    option['title'].subtext = value;
    commonFn(option);

}

/!*副标题文本 subtext*!/

function subTitleCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        var _subtext = option['title'].subtext;
        obj.value = _subtext;
    }
    else {
        obj.disabled = true;
        option['title'].subtext = currOption['title'].subtext;
    }
    commonFn(option);
}

/!*水平安放位置 x*!/

function positionHCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        option['title'].x = val;
    }
    else {
        disabledChildrens(obj, true);
        option['title'].x = currOption['title'].x;
    }
    commonFn(option);
}

function positionHChange(value) {
    option['title'].x = value;
    commonFn(option);
}

/!*垂直安放位置 y*!/

function positionVCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        option['title'].y = val;
    }
    else {
        disabledChildrens(obj, true);
        option['title'].y = currOption['title'].y;
    }
    commonFn(option);
}

function positionVChange(value) {
    option['title'].y = value;
    commonFn(option);
}

/!*标题对齐方式 textAlign*!/

function titleAlignTypeCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        option['title'].textAlign = val;
    }
    else {
        disabledChildrens(obj, true);
        option['title'].textAlign = currOption['title'].textAlign;
    }
    commonFn(option);
}

function titleAlignTypeChange(value) {
    option['title'].textAlign = value;
    commonFn(option);
}

/!*[主标题、提示]: 标题背景颜色 backgroundColor*!/

function bgColorChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        option[target].backgroundColor = obj.value;
    }
    else
    {
        obj.disabled = true;
        option[target].backgroundColor = currOption[target].backgroundColor;
    }
    commonFn(option);
}

function inputBgColorChange(val,target){
    option[target].backgroundColor = val;
    commonFn(option);
}

function colorActiveChange(value, target) {
    option[target].backgroundColor = value;
    commonFn(option);
}
function colorGridActiveChange(value, target) {
    var color = value;
    var _grid = option['grid'];
    if(!_grid) _grid = {show: true};
    _grid[target] = color;
    option['grid'] = _grid;
    commonFn(option);
}


/!*[主标题、提示]: 边框线宽 borderWidth*!/

function borderWidthCheckChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        option[target].borderWidth = obj.value;
    }
    else {
        obj.disabled = true;
        option[target].borderWidth = currOption[target].borderWidth;
    }
    commonFn(option);
}

function borderWidthChange(value, target) {
    option[target].borderWidth = value;
    commonFn(option);
}

/!*[主标题、提示]: 边框颜色 borderColor*!/

function borderColorChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        obj.disabled = false;
        option[target].borderColor = obj.value;
    }
    else
    {
        obj.disabled = true;
        option[target].borderColor = currOption[target].borderColor;
    }
    commonFn(option);
}
function inputBorderColorChange(val,target){
    option[target].borderColor = val;
    commonFn(option);
}


/!*[主标题、图例、提示]: 文本颜色 textStyle: color*!/

function fontColorChange(obj, isChecked, target) {

    if (option === undefined) {
        option = currOption;
    }

    var _textStyle = option[target].textStyle; //取出当前字体颜色属性值
    if (!_textStyle) _textStyle = {};

    var _currColor = undefined; //获取默认字体大小属性值
    var _currTextStyle = currOption[target].textStyle;
    if (_currTextStyle) _currColor = _currTextStyle['color'];
    if (isChecked == 'Y') {
        obj.disabled = false;
        _textStyle['color'] = obj.value;
    }
    else
    {
        obj.disabled = true;
        _textStyle['color'] = _currColor; //恢复默认设置
    }
    option[target].textStyle = _textStyle;
    commonFn(option);
}

function inputFontColorChange(val,target){
    var _textStyle = option[target].textStyle; //取出当前字体颜色属性值
    if (!_textStyle) _textStyle = {};
    _textStyle['color'] = val;
    option[target].textStyle = _textStyle;
    commonFn(option);
}



/!*[主标题、图例、提示]: 字体大小 textStyle: fontSize*!/

function fontSizeCheckChange(obj, isChecked, target) {

    /!*取出当前字体大小属性值*!/
    var _textStyle = option[target].textStyle;

    if (!_textStyle) _textStyle = {};

    /!*获取默认字体大小属性值*!/
    var _fontSize = undefined;
    var _currTextStyle = currOption[target].textStyle;
    if (_currTextStyle) _fontSize = _currTextStyle['fontSize'];

    if (isChecked == 'Y') {
        obj.disabled = false;
        _textStyle['fontSize'] = obj.value;
    }
    else {
        obj.disabled = true;
        _textStyle['fontSize'] = _fontSize;
    }
    option[target].textStyle = _textStyle;
    commonFn(option);
}

function fontSizeChange(value, target) {
    var _textStyle = option[target].textStyle;
    if (!_textStyle) {
        _textStyle = {};
    }
    _textStyle['fontSize'] = value;
    option[target].textStyle = _textStyle;
    commonFn(option);
}

/!*[主标题、图例、提示]: 字体样式 textStyle: fontStyle*!/

function fontStyleCheckChange(obj, objBold, isChecked, target) {
    var _textStyle = option[target].textStyle;
    if (!_textStyle) _textStyle = {};

    var _currFontStyle = undefined;
    var _currFontWeight = undefined;
    var _currTextStyle = currOption[target].textStyle;
    if (_currTextStyle) {
        _currFontWeight = _currTextStyle['fontWeight'];
        _currFontStyle = _currTextStyle['fontStyle'];
    }

    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        objBold.disabled = false;
        var _bold = objBold.currentValue;
        if (_bold == 'Y') _textStyle['fontWeight'] = 'bold';
        else _textStyle['fontWeight'] = 'normal';

        var val = obj.value;
        _textStyle['fontStyle'] = val;
    }
    else {
        disabledChildrens(obj, true);
        objBold.disabled = true;
        _textStyle['fontWeight'] = _currFontWeight;
        _textStyle['fontStyle'] = _currFontStyle;
    }
    option[target].textStyle = _textStyle;
    commonFn(option);
}

function fontStyleBoldChange(value, target) {

    var _textStyle = option[target].textStyle;
    if (!_textStyle) _textStyle = {};

    var _bold = value;
    if (_bold == 'Y') _textStyle['fontWeight'] = 'bold';
    else _textStyle['fontWeight'] = 'normal';

    option[target].textStyle = _textStyle;
    commonFn(option);
}

function fontStyleChange(value, target) {
    var _textStyle = option[target].textStyle;
    if (!_textStyle) _textStyle = {};
    _textStyle['fontStyle'] = value;
    option[target].textStyle = _textStyle;
    commonFn(option);
}

/!*文本颜色 subtextStyle: color*!/

function subTitleTextCheckChange(obj, isChecked) {

    var _subtextStyle = option['title'].subtextStyle; //取出当前标题字体颜色属性值
    if (!_subtextStyle) _subtextStyle = {};

    var _currColor = undefined; //获取默认标题字体大小属性值
    var _currSubTextStyle = currOption['title'].subtextStyle;
    if (_currSubTextStyle) _currColor = _currSubTextStyle['color'];

    if (isChecked == 'Y') {
        obj.disabled = false;
        _subtextStyle['color'] = obj.value;
    }
    else
    {
        obj.disabled = true;
        _subtextStyle['color'] = _currColor;
    }
    option['title'].subtextStyle = _subtextStyle;
    commonFn(option);
}

function inputSubTitleTextCheckChange(val,target){
    var _subtextStyle = option[target].subtextStyle; //取出当前标题字体颜色属性值
    if (!_subtextStyle) _subtextStyle = {};
    _subtextStyle['color'] = val;
    option[target].subtextStyle = _subtextStyle;
    commonFn(option);
}



/!*字体大小 subtextStyle: fontSize*!/

function subTitleSizeCheckChange(obj, isChecked) {

    /!*取出当前主标题字体大小属性值*!/
    var _subtextStyle = option['title'].subtextStyle;
    if (!_subtextStyle) _subtextStyle = {};

    /!*获取默认主标题字体大小属性值*!/
    var _fontSize = undefined;
    var _currSubTextStyle = currOption['title'].subtextStyle;
    if (_currSubTextStyle) _fontSize = _currSubTextStyle['fontSize'];

    if (isChecked == 'Y') {
        obj.disabled = false;
        _subtextStyle['fontSize'] = obj.value;
    }
    else {
        obj.disabled = true;
        _subtextStyle['fontSize'] = _fontSize;
    }
    option['title'].subtextStyle = _subtextStyle;
    commonFn(option);
}

function subTitleSizeTchPinChange(value) {
    var _subtextStyle = option['title'].subtextStyle;
    if (!_subtextStyle) {
        _subtextStyle = {};
    }
    _subtextStyle['fontSize'] = value;
    option['title'].subtextStyle = _subtextStyle;
    commonFn(option);
}

/!*字体样式 subtextStyle: fontStyle*!/

function subTitleStyleCheckChange(obj, bold, isChecked) {
    var _subtextStyle = option['title'].subtextStyle;
    if (!_subtextStyle) _subtextStyle = {};

    var _currFontStyle = undefined;
    var _currFontWeight = undefined;
    var _currSubTextStyle = currOption['title'].subtextStyle;
    if (_currSubTextStyle) {
        _currFontWeight = _currSubTextStyle['fontWeight'];
        _currFontStyle = _currSubTextStyle['fontStyle'];
    }

    if (isChecked == 'Y') {
        obj.disabled = false;
        var _bold = bold.currentValue;
        if (_bold == 'Y') _subtextStyle['fontWeight'] = 'bold';
        else _subtextStyle['fontWeight'] = 'normal';

        var val = obj.value;
        _subtextStyle['fontStyle'] = val;
    }
    else {
        obj.disabled = true;
        _subtextStyle['fontWeight'] = _currFontWeight;
        _subtextStyle['fontStyle'] = _currFontStyle;
    }
    option['title'].subtextStyle = _subtextStyle;
    commonFn(option);
}

function subTitleStyleBoldChange(value) {
    var _subtextStyle = option['title'].subtextStyle;
    if (!_subtextStyle) _subtextStyle = {};

    var _bold = value;
    if (_bold == 'Y') _subtextStyle['fontWeight'] = 'bold';
    else _subtextStyle['fontWeight'] = 'normal';

    option['title'].subtextStyle = _subtextStyle;
    commonFn(option);
}

function subTitleStyleChange(value) {
    var _subtextStyle = option['title'].subtextStyle;
    if (!_subtextStyle) _subtextStyle = {};
    _subtextStyle['fontStyle'] = value;
    option['title'].subtextStyle = _subtextStyle;
    commonFn(option);
}

/!*是否显示图例 legend*!/

function isShowLegendCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj,false);
        var val = obj.value;
        showLegendFn(val);
    }
    else {
        disabledChildrens(obj,true);
        option['legend'].data = currOption['legend'].data;
        commonFn(option);
    }
}


function showLegendChange(val){
    showLegendFn(val);
}
function showLegendFn(val) {
    if (val == 'Y') {
        var _data = option['legend'].data;
        if (!_data) //is empty
        {
            _data = [];
            var _seriesName = option['series'];
            if (_seriesName.length != 0) {
                for (var i = 0; i < _seriesName.length; i++) {
                    _data[i] = _seriesName[i].name;
                }
            }

            option['legend'].data = _data;
        }
    }
    else if (val == 'N') //不显示图例
    {
        delete option['legend'].data;
    }
    commonFn(option);
}

/!*图例选择模式 selectedMode*!/

function selectedModeChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        if (val == 'false') option['legend'].selectedMode = false;
        else option['legend'].selectedMode = val;
    }
    else {
        disabledChildrens(obj, true);
        option['legend'].selectedMode = currOption['legend'].selectedMode;
    }
    commonFn(option);
}

function legendChoiceType(val) {
    if (val == 'false') option['legend'].selectedMode = false;
    else option['legend'].selectedMode = val;
    commonFn(option);
}

/!*[图例、工具]： 水平安放位置 x*!/

function putHCheckChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        option[target].x = val;
    }
    else {
        disabledChildrens(obj, true);
        option[target].x = currOption[target].x;
    }
    commonFn(option);
}

function putH(val, target) {
    option[target].x = val;
    commonFn(option);
}

/!*[图例、工具]：垂直安放位置 y*!/

function putVCheckChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = $('input[name="' + id + '"]:checked').val();
        option[target].y = val;
    }
    else {
        disabledChildrens(obj, true);
        option[target].y = currOption[target].y;
    }
    commonFn(option);
}

function putV(val, target) {
    option[target].y = val;
    commonFn(option);
}

/!*[图例、工具]：图例放置方式 orient*!/

function putTypeCheckChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        option[target].orient = val;
    }
    else {
        disabledChildrens(obj, true);
        option[target].orient = currOption[target].orient;
    }
    commonFn(option);
}

function putType(val, target) {
    option[target].orient = val;
    commonFn(option);
}

/!*是否使用提示 show*!/

function toolCheckChange(obj, isChecked, target) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        toolFn(val, target);
    }
    else {
        disabledChildrens(obj, true);
        option[target].show = currOption[target].show;
        commonFn(option);
    }
}

function toolFn(val, target) {
    if (val == 'Y')
        option[target].show = true;
    else if (val == 'N')
        option[target].show = false;
    commonFn(option);
}

function toolChange(val, target) {
    toolFn(val, target);
}

/!*提示模板 formatter*!/

function tooltipFormatterChange(obj, isChecked) {
    if (isChecked == 'Y') {
        obj.disabled = false;

        option['tooltip'].formatter = obj.value;
        commonFn(option);
    }
    else
    {
        obj.disabled = true;
        option['tooltip'].formatter = currOption['tooltip'].formatter;
        commonFn(option);
    }
}
function inputTooltipFormatterChange(val){
    option['tooltip'].formatter = val;
    commonFn(option);
}



/!*文本水平对齐方式 textStyle: align*!/

function rmdTextAlignHCheckChange(obj, isChecked) {

    var _textStyle = option['tooltip'].textStyle;
    if (!_textStyle) _textStyle = {};

    var _align = undefined;
    var _currTextStyle = currOption['tooltip'].textStyle;
    if (_currTextStyle) _align = _currTextStyle['align'];

    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        _textStyle['align'] = obj.value;
    }
    else {
        disabledChildrens(obj, true);
        _textStyle['align'] = _align;
    }
    option['tooltip'].textStyle = _textStyle;
    commonFn(option);
}

function rmdTextAlignHChange(val) {
    var _textStyle = option['tooltip'].textStyle;
    if (!_textStyle) {
        _textStyle = {};
    }
    _textStyle['align'] = val;
    option['tooltip'].textStyle = _textStyle;
    commonFn(option);
}

/!*提示触发点 trigger*!/

function remindTiggerCheckChange(obj, isChecked) {
    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        var val = obj.value;
        option['tooltip'].trigger = val;
    }
    else {
        disabledChildrens(obj, true);
        option['tooltip'].trigger = currOption['tooltip'].trigger;
    }
    commonFn(option);
}

function remindTiggerChange(value) {
    if (option === undefined) {
        option = currOption;
    }
    option['tooltip'].trigger = value;
    commonFn(option);
}

/!*提示指示器类型  axisPointer: type*!/
function pointerTypeCheckChange(obj, isChecked) {

    var _axisPointer = option['tooltip'].axisPointer;
    if (!_axisPointer) _axisPointer = {};

    var _type = undefined;
    var _currAxisPointer = currOption['tooltip'].axisPointer;
    if (_currAxisPointer) _type = _currAxisPointer['type'];

    if (isChecked == 'Y') {
        disabledChildrens(obj, false);
        _axisPointer['type'] = obj.value;
    }
    else {
        disabledChildrens(obj, true);
        _axisPointer['type'] = _type;
    }
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}

function pointerTypeChange(val) {

    var _axisPointer = option['tooltip'].axisPointer;
    if (!_axisPointer) _axisPointer = {};

    _axisPointer['type'] = val;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}

/*线条颜色 axisPointer[lineStyle]: color*/
function pointerLineColorChange(obj, isChecked){

    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }

    var _color = undefined;
    var _currLineStyle = {};
    var _currAxisPointer = currOption['tooltip'].axisPointer;
    if(_currAxisPointer)
    {
        _currLineStyle = _currAxisPointer['lineStyle'];
        if(_currLineStyle)
            _color = _currLineStyle['color'];
    }

    if(isChecked == 'Y')
    {
        obj.disabled= false;
        _lineStyle['color'] = obj.value;
    }
    else
    {
        obj.disabled = true;
        _lineStyle['color'] = _color; //恢复默认设置
    }
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}

function inputPointerLineColorChange(val){
    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }

    _lineStyle['color'] = val;
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}



/!*控制多个组件是否可用*!/

function disabledChildrens(obj, flag) {
    for (let i = 0; i < obj.childrens.length; i++) {
        obj.childrens[i].disabled = flag;
    }
}
/*线条宽度 axisPointer[lineStyle]: width*/
function pointerLineWidthChange(obj,isChecked){

    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }

    var _width = undefined;
    var _currLineStyle = {};
    var _currAxisPointer = currOption['tooltip'].axisPointer;
    if(_currAxisPointer)
    {
        _currLineStyle = _currAxisPointer['lineStyle'];
        if(_currLineStyle)
            _width = _currLineStyle['width'];
    }

    if(isChecked == 'Y')
    {
        obj.disabled = false;
        _lineStyle['width'] = obj.value;

    }
    else
    {
        obj.disabled = true;
        _lineStyle['width'] = _width; //恢复默认设置
    }
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}

function pLineWidthChange(val){
    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }
    _lineStyle['width'] = val;
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}

function lineStyleColorActiveChange(val){
    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }

    _lineStyle['color'] = val;
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}
/*线条类型  axisPointer[lineStyle]: type*/
function pointerLineTypeCheckChange(obj, isChecked){

    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }

    var _type = undefined;
    var _currLineStyle = {};
    var _currAxisPointer = currOption['tooltip'].axisPointer;
    if(_currAxisPointer)
    {
        _currLineStyle = _currAxisPointer['lineStyle'];
        if(_currLineStyle)
            _type = _currLineStyle['type'];
    }

    if(isChecked == 'Y')
    {
        disabledChildrens(obj, false);
        _lineStyle['type'] = obj.value;
    }
    else
    {
        disabledChildrens(obj, true);
        _lineStyle['type'] = _type;
    }
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}


function pointerLineTypeChange(val){
    var _lineStyle = {};
    var _axisPointer = option['tooltip'].axisPointer;
    if(!_axisPointer)
        _axisPointer = {};
    else {
        _lineStyle = _axisPointer['lineStyle'];
        if(!_lineStyle) _lineStyle = {};
    }

    _lineStyle['type'] = val;
    _axisPointer['lineStyle'] = _lineStyle;
    option['tooltip'].axisPointer = _axisPointer;
    commonFn(option);
}

/*是否使用提示 show*/
function toolCheckChange(obj, isChecked, target){
    if(isChecked == 'Y')
    {
        disabledChildrens(obj, false);
        var val = obj.value;
        toolFn(val, target);
    }
    else
    {
        disabledChildrens(obj, true);
        option[target].show = currOption[target].show;
        commonFn(option);
    }
}


/*选择显示的工具 feature*/
function choiceToolCheckChange(obj, isChecked){
    if(isChecked == 'Y')
    {
        disabledChildrens(obj, false);
        var _tmpArr = [], _unTmpArr = [];
        var tmpArr = obj.value;
        var unTmpArr=[];
        for (let i = 0; i < obj.childrens.length; i++) {
            if(obj.value!=obj.childrens[i].value){
                unTmpArr[i] = obj.childrens[i].value;
            }
        }
        getFeature(_tmpArr, _unTmpArr);
    }
    else
    {
        disabledChildrens(obj, true);
        option['toolbox'].feature = currOption['toolbox'].feature;
        commonFn(option);
    }
}


/*坐标边缘宽度 grid: x,y,x2,y2*/
function gridPositionCheck(obj, isChecked, target){
    var _grid = option['grid'];
    if(!_grid) _grid = {};

    var _x = undefined; //获取默认字体大小属性值
    var _currGrid = currOption['grid'];
    if(_currGrid) _x = _currGrid[target];

    if(isChecked == 'Y')
    {
        obj.disabled = false

        /*   $('#'+id).slider("enable");
           $('#'+id).on("slide", function(slideEvt) {
               var value = slideEvt.value;
               $('#' + id +'Val').text(value);

               var _grid = option['grid'];
               if(!_grid) _grid = {};
               _grid[target] = value;
               option['grid'] = _grid;
               commonFn(option);
           });
   */
        _grid[target] = obj.value;
    }
    else
    {
        obj.disabled = true
        _grid[target] = _x;
    }

    option['grid'] = _grid;
    commonFn(option);
}

function inputGridPositionCheck(value,target){
    var _grid = option['grid'];
    if(!_grid) _grid = {};
    _grid[target] = value;
    option['grid'] = _grid;
    commonFn(option);
}



/*绘图区域外观背景色  grid: backgroundColor borderColor*/
function gridColorCheck(obj, isChecked, target){
    var _grid = option['grid'];
    if(!_grid) _grid = {show: true};
    else _grid['show'] = true;

    var _tmp = undefined; //获取默认字体大小属性值
    var _currGrid = currOption['grid'];
    if(_currGrid) _tmp = _currGrid[target];
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        /*        $("#" + clrpkrId).ColorPickerSliders({ //初始化颜色选择器
                    size: 'sm',
                    placement: 'right',
                    sliders: false,
                    swatches: false,
                    hsvpanel: true,
                    onchange: function(container, color) {
                        var color = color.tiny.toRgbString();
                        var _grid = option['grid'];
                        if(!_grid) _grid = {show: true};
                        _grid[target] = color;
                        option['grid'] = _grid;
                        commonFn(option);
                    }
                });*/
        _grid[target] = obj.value;
    }
    else
    {
        obj.disabled = true;
        _grid[target] = _tmp;
    }

    option['grid'] = _grid;
    commonFn(option);
}

/*绘图区域外观边框  grid: borderWidth*/
function gridBorderWidthCheck(obj, isChecked){
    var _grid = option['grid'];
    if(!_grid) _grid = {show: true};
    else _grid['show'] = true;

    var _tmp = undefined; //获取默认字体大小属性值
    var _currGrid = currOption['grid'];
    if(_currGrid) _tmp = _currGrid['borderWidth'];

    if(isChecked == 'Y')
    {
        obj.disabled = false;
        _grid['borderWidth'] = obj.value;
    }
    else
    {
        obj.disabled = true;
        _grid['borderWidth'] = _tmp;
    }

    option['grid'] = _grid;
    commonFn(option);
}

/*类目两端空白策略 boundaryGap、坐标轴位置  position、 坐标轴名称位置 nameLocation*/
function axisCheckChange(obj, isChecked, axis, target){
    var val;
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        val = obj.value;
        if(val == 'Y') val = true;
        else if(val == 'N') val = false;
    }
    else
    {
        disabledChildrens(obj,true);
        val = getDefaultAxisVal(axis, target);
    }
    updateCurrAxis(axis, target, val);
}

/*坐标轴名称  name*/
function axisNameCheckChange(obj, isChecked, axis, target){
    if(isChecked == 'Y')
    {
        obj.disabled = false;; //启用输入框
        var defaultVal = obj.value; //获取当前默认值
        if(!defaultVal)
        {
            var tmp = getDefaultAxisVal(axis, target);
            updateCurrAxis(axis, target, tmp);
            if(tmp) obj.value = tmp;
        }
        else{
            updateCurrAxis(axis, target, defaultVal);
        }


    }
    else
    {
        obj.disabled = true;
        var val = getDefaultAxisVal(axis, target);
        updateCurrAxis(axis, target, val);
    }
}

function axisChange(val, axis, target){
    if(val == 'Y') val = true;
    else if(val == 'N') val = false;
    updateCurrAxis(axis, target, val);
}

function  axisNameBlur(val,axis, target) {
    updateCurrAxis(axis, target, val);
}

function inputSeriesSliderXChange(objx,objy,target){
    let val = objx.value;
    let valy = objy.value
    if(target == 'center')
        val = val + '%';
    var arr = [val, valy];
    updateCurrSeries(target, arr);
}

function inputSeriesSliderYChange(objx,objy,target){
    let val = objy.value;
    let valx = objx.value
    if(target == 'center')
        val = val + '%';
    var arr = [valx,val];
    updateCurrSeries(target, arr);
}


/*饼图圆心坐标 center, 饼图半径 radius*/
function seriesSliderXYChange(isChecked, objx, objy, target){
    if(isChecked == 'Y')
    {
        objx.disabled = false;
        objy.disabled = false;
        var arr = [objx.value, objy.value];
        updateCurrSeries(target, arr);
    }
    else
    {
        objx.disabled = true;
        objy.disabled = true;
        var val = getDefaultSeriesVal(target);
        updateCurrSeries(target, val);
    }
}
/*标签内容模板 formatter*/
function axisLabelFormatterChange(obj, isChecked, axis, target, target1){
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        let val = obj.value;
        updateCurrAxisSec(axis, target, target1, val);
    }
    else
    {
        obj.disabled = true;
        let val = getDefaultAxisValSec(axis, target, target1);
        updateCurrAxisSec(axis, target, target1, val);
    }
}

function inputAxisLabelFormatterChange(val,axis, target, target1){
    updateCurrAxisSec(axis, target, target1, val);
}

/*是否显示隔区 splitArea、是否显示轴线 axisLine、是否显示文本标签 axisLabel*/
function axisShowCheckChange(obj, isChecked, axis, target, target1){
    var val;
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        val = obj.value;
        if(val == 'Y') val = true;
        else val = false;
    }
    else
    {
        disabledChildrens(obj,true);
        val = getDefaultAxisValSec(axis, target, target1);
    }
    updateCurrAxisSec(axis, target, target1, val);
}

/*轴线宽度 width、标签字体大小、隔线线宽*/
function axisPXCheckChange(obj, isChecked, axis, target, target1, target2){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        val = obj.value;
    }
    else
    {
        obj.disabled = true;
        val = getDefaultAxisValThird(axis, target, target1, target2);
    }
    updateCurrAxisThird(axis, target, target1, target2, val);
}

function axisPXChange(val, axis, target, target1, target2){
    updateCurrAxisThird(axis, target, target1, target2, val);
}

function axisShowChange(val, axis, target, target1){
    if(val == 'Y') val = true;
    else val = false;
    updateCurrAxisSec(axis, target, target1, val);
}

/*坐标轴线颜色 axisLine: lineStyle: color、标签文字颜色、隔线颜色*/
function axisColorChange(obj, isChecked, axis, target, target1, target2){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        val = obj.value;
    }
    else
    {
        obj.disabled = true;
        val = getDefaultAxisValThird(axis, target, target1, target2);
    }
    updateCurrAxisThird(axis, target, target1, target2, val);
}

function inputAxisColorChange(val,axis, target, target1, target2){
    updateCurrAxisThird(axis, target, target1, target2, val);
}


/*文本标签旋转角度、文本标签与坐标轴间距*/
function axisSliderCheckChange(obj, isChecked, axis, target, target1){
    if(isChecked == 'Y')
    {
        obj.disabled = false;

        let val = obj.value;
        updateCurrAxisSec(axis, target, target1, val);
    }
    else
    {
        obj.disabled = true;
        let val = getDefaultAxisValSec(axis, target, target1);
        updateCurrAxisSec(axis, target, target1, val);
    }
}

function inputAxisSliderCheckChange(val,axis, target, target1){
    updateCurrAxisSec(axis, target, target1, val);
}

/*轴线线条类型、隔线线条类型*/
function axisLineTypeCheckChange(obj, isChecked, axis, target, target1, target2){
    var val;
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        val = obj.value;
    }
    else
    {
        disabledChildrens(obj,true);
        val = getDefaultAxisValThird(axis, target, target1, target2);
    }
    updateCurrAxisThird(axis, target, target1, target2, val);
}

function axisLineTypeChange(val, axis, target, target1, target2){
    updateCurrAxisThird(axis, target, target1, target2, val);
}

/*更新第三级属性的值-通用方法*/
function updateCurrAxisThird(axis, target, target1, target2, val){
    var index = 0; //获取当前具体的轴
    if(axis == 'xAxis')
        index = checkedAxis;
    else
        index = checkedyAxis;

    /*取出对应属性赋值*/
    var axisArr = option[axis];
    var _axis = axisArr[index];
    var _targetAxis = _axis[target]; //axisLine
    if(!_targetAxis) _targetAxis = {show: true};

    var _style = _targetAxis[target1]; //lineStyle
    if(!_style) _style = {};

    _style[target2] = val; //color

    /*更新图表*/
    _targetAxis[target1] = _style;
    _axis[target] = _targetAxis
    axisArr[index] = _axis;
    option[axis] = axisArr;
    commonFn(option);
}

function getDefaultAxisValThird(axis, target, target1, target2){
    var tmp = undefined;
    var currAxisArr = currOption[axis];

    if(axis == 'xAxis')
        var _currAxis = currAxisArr[checkedAxis];
    else
        var _currAxis = currAxisArr[checkedyAxis];

    var _targetcurrAxis = _currAxis[target];
    if(_targetcurrAxis)
    {
        var _currStyle = _targetcurrAxis[target1];
        if(_currStyle)  tmp = _currStyle[target2];
    }
    return tmp;
}
function getDefaultAxisVal(axis, target){
    var tmp = undefined;
    var currAxisArr = currOption[axis];

    if(axis == 'xAxis')
        var _currAxis = currAxisArr[checkedAxis];
    else
        var _currAxis = currAxisArr[checkedyAxis];

    tmp = _currAxis[target];
    return tmp;
}
/*更新第一级属性的值-通用方法*/
function updateCurrAxis(axis, target, val){
    var index = 0; //获取具体属性下标
    if(axis == 'xAxis')
        index = checkedAxis;
    else
        index = checkedyAxis;

    /*给具体属性赋值*/
    var axisArr = option[axis];
    var _axis = axisArr[index];
    _axis[target] = val;

    /*更新图表*/
    axisArr[index] = _axis;
    option[axis] = axisArr;
    commonFn(option);
}
/*坐标轴文本颜色 nameTextStyle: color*/
function axisNameColorChange(obj, isChecked, axis, target, target1){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        /*        $("#" + clrpkrId).ColorPickerSliders({ //初始化颜色选择器
                    size: 'sm',
                    placement: 'right',
                    sliders: false,
                    swatches: false,
                    hsvpanel: true,
                    onchange: function(container, color) {
                        let val = color.tiny.toRgbString();
                        updateCurrAxisSec(axis, target, target1, val);
                    }
                });*/
        val = obj.value;
    }
    else
    {
        obj.disabled = false;
        val = getDefaultAxisValSec(axis, target, target1);
    }
    updateCurrAxisSec(axis, target, target1, val);
}

function axisNameColorActiveChange(val,axis, target, target1){
    updateCurrAxisSec(axis, target, target1, val);
}
function axisFontSizeChange(val, axis, target, target1){
    updateCurrAxisSec(axis, target, target1, val);
}

/*坐标轴文字大小 fontSize*/
function axisFontSizeCheckChange(obj, isChecked, axis, target, target1){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        val = obj.value;
    }
    else
    {
        obj.disabled = true;
        val = getDefaultAxisValSec(axis, target, target1);
    }
    updateCurrAxisSec(axis, target, target1, val);
}

/*底盘形状：shape*/
function shapeCheckChange(obj, isChecked, target){
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        var val = obj.value;
        updateCurrRadar(target, val);
    }
    else
    {
        disabledChildrens(obj,false);
        var val = getDefaultRadarVal(target);
        updateCurrRadar(target, val);
    }
}
function shapeChange(val, target){
    updateCurrRadar(target, val);
}

/*圆心位置：center*/
function radarCenterChange(isChecked, objx, objy){
    var _radar = option['radar'][0];
    var _centerArr = _radar['center'];
    if(!_centerArr) _centerArr = [];

    if(isChecked == 'Y')
    {
        objx.disabled = false;
        objy.disabled = false;

        _radar['center'] = _centerArr;
    }
    else
    {
        objx.disabled = true;
        objy.disabled = true;
        var _currRadar = currOption['radar'][0];
        _radar['center'] = _currRadar['center'];
    }

    option['radar'][0] = _radar;
    commonFn(option);
}


function inputRadarCenterChange(obj,i){
    let val = obj.value;
    var _radar = option['radar'][0];
    var _centerArr = _radar['center'];
    if(!_centerArr) _centerArr = [];
    _centerArr[i] = val + '%';
    _radar['center'] = _centerArr;
    option['radar'][0] = _radar;
    commonFn(option);
}

/*半径长度：radius、起始角度 startAngle*/
function radarFirstChange(obj, isChecked, target){
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        let val = obj.value;
        if(target == 'radius')
            val = val + '%';
        updateCurrRadar(target, val);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultRadarVal(target);
        updateCurrRadar(target, val);
    }
}
function inputRadarFirstChange(val,target){
    if(target == 'radius')
        val = val + '%';
    updateCurrRadar(target, val);
}

/*环形分割数: splitNumber*/
function radarSplitNumberCheckChange(obj, isChecked, target){
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        var val = $('#'+ id).val();
        updateCurrRadar(target, val);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultRadarVal(target);
        updateCurrRadar(target, val);
    }
}
function radarSplitNumberChange(val, target){
    updateCurrRadar(target, val);
}

/*是否显示隔区 splitArea、是否显示轴线 axisLine、是否显示文本标签 axisLabel、是否显示隔线 splitLine*/
function radarShowCheckChange(obj, isChecked, target, target1){
    var val;
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        val = obj.value;
        if(val == 'Y') val = true;
        else val = false;
    }
    else
    {
        disabledChildrens(obj,true);
        val = getDefaultRadarValSec(target, target1);
    }
    updateCurrRadarSec(target, target1, val);
}

function radarShowChange(val, target, target1){
    if(val == 'Y') val = true;
    else val = false;
    updateCurrRadarSec(target, target1, val);
}

/*坐标轴线颜色 axisLine、网格线颜色 splitLine*/
function radarColorChange(obj, isChecked, target, target1, target2){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        val = obj.value;
    }
    else
    {
        obj.disabled = true;
        val = getDefaultRadarValThird(target, target1, target2);
    }
    updateCurrRadarThird(target, target1, target2, val);
}

function radarColorActiveChange(val,target, target1, target2){
    updateCurrRadarThird(target, target1, target2, val);
}

/*轴线宽度 width、标签字体大小、隔线线宽*/
function radarPXCheckChange(obj, isChecked, target, target1, target2){
    var val;
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        val = obj.value;
    }
    else
    {
        obj.disabled = true;
        val = getDefaultRadarValThird(target, target1, target2);
    }
    updateCurrRadarThird(target, target1, target2, val);
}

function radarChange(val, target, target1, target2){
    var val = val;
    updateCurrRadarThird(target, target1, target2, val);
}
/*轴线线条类型 axisLine.type、网格线条类型 splitLine.type*/
function radarLineTypeCheckChange(obj, isChecked, target, target1, target2){
    var val;
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        val = obj.value;
    }
    else
    {
        disabledChildrens(obj,true);
        val = getDefaultRadarValThird(target, target1, target2);
    }
    updateCurrRadarThird(target, target1, target2, val);
}

/*--------------油量图[系列]--------------*/
/*值域范围 min max*/
function gaugeRangeCheckChange(obj, isChecked, min, max){
    if(isChecked == 'Y')
    {
        obj.disabled = false;
        let val = obj.value;
        var tmpArr = val.split(',');
        updateCurrSeries(min, tmpArr[0]);
        updateCurrSeries(max, tmpArr[1]);
    }
    else
    {
        obj.disabled = true;
        var val = getDefaultSeriesVal(min);
        updateCurrSeries(min, val);
        var val = getDefaultSeriesVal(max);
        updateCurrSeries(max, val);
    }
}


function inputGaugeRangeCheckChange(val,min,max){
    updateCurrSeries(min, val[0]);
    updateCurrSeries(max, val[1]);
}


/*油量图颜色: axisLine: lineStyle: color*/
function gaugeColorChange(el, inputId, clrpkrId, target, target1, target2){
    var _color = [];
    var arrayDiv = $('#gaugeColorDiv').children('div .gauge-color-fg');
    var array = [];
    for(var i = 0; i < arrayDiv.length; i++)
    {
        array[i] = i;
    }

    var isChecked = $(el).prop("checked");
    if(isChecked)
    {
        $('#addGaugeColor').attr('disabled',false);
        $('#delGaugeColor').attr('disabled',false);

        $.each(array, function(i, v){
            var inputObj = $("#" + inputId + i);
            var clrObj = $("#" + clrpkrId + i);

            inputObj.attr('disabled',false);
            clrObj.attr('disabled', false);

            let num = inputObj.val();
            let rgb = clrObj.css('background-color');
            _color[i] = [num, rgb];

            inputObj.blur(function(){ //初始化失焦事件
                let num = $(this).val();
                let rgb = clrObj.css('background-color');
                _color[i] = [num, rgb];
                updateCurrSeriesThird(target, target1, target2, _color);
            });

            clrObj.ColorPickerSliders({ //初始化颜色选择器
                size: 'sm',
                placement: 'right',
                sliders: false,
                swatches: false,
                hsvpanel: true,
                onchange: function(container, color) {
                    let num = inputObj.val();
                    let rgb = color.tiny.toRgbString();
                    _color[i] = [num, rgb];
                    clrObj.css('background-color', rgb);
                    updateCurrSeriesThird(target, target1, target2, _color);
                }
            });
        });
    }
    else
    {
        $('#addGaugeColor').attr('disabled',true);
        $('#delGaugeColor').attr('disabled',true);
        $.each(array, function(i, v){
            $("#" + clrpkrId + i).attr('disabled', true);
            $('#' + inputId + i).attr('disabled',true);
        });
        _color = getDefaultSeriesValThird(target, target1, target2);
    }
    updateCurrSeriesThird(target, target1, target2, _color);
}


/*添加油量图颜色*/
function gaugeShowCheckChange(obj, isChecked, target, target1){
    var val;
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        val = obj.value;
        if(val == 'Y') val = true;
        else val = false;
    }
    else
    {
        disabledChildrens(obj,true);
        val = getDefaultSeriesValSec(target, target1);
    }
    updateCurrSeriesSec(target, target1, val);
}

/*系列的图形类型*/
function seriesChartsTypeNormal(val){
    var seriesArr = option['series'];
    $.each(seriesArr, function(i, v){
        v.type = val;
    });
    option['series'] = seriesArr;
    commonFn(option);
}


function gaugeShowChange(val, target, target1){
    if(val == 'Y') val = true;
    else val = false;
    updateCurrSeriesSec(target, target1, val);
}

function gaugeStyleChange(val, target, target1, target2){
    updateCurrSeriesThird(target, target1, target2, val);
}

/*坐标轴字体样式 fontStyle、fontWeight*/
function axisNameStyleCheckChange(obj,objBold, isChecked, axis, target, target1){
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        objBold.disabled = false;
        var _bold = objBold.value;
        if(_bold) updateCurrAxisSec(axis, target, 'fontWeight', 'bold');
        else updateCurrAxisSec(axis, target, 'fontWeight', 'normal');

        var val = obj.value;
        updateCurrAxisSec(axis, target, target1, val);
    }
    else
    {
        disabledChildrens(obj,true);
        objBold.disabled = true;
        var val1 = getDefaultAxisValSec(axis, target, 'fontWeight');
        updateCurrAxisSec(axis, target, 'fontWeight', val1);

        var val2 = getDefaultAxisValSec(axis, target, target1);
        updateCurrAxisSec(axis, target, target1, val2);
    }
}

function axisNameStyleChange(val, axis, target, target1){
    updateCurrAxisSec(axis, target, target1, val);
}
function axisNameStyleBoldChange(val, axis, target){
    var _bold = val;
    if(_bold == 'Y') updateCurrAxisSec(axis, target, 'fontWeight', 'bold');
    else updateCurrAxisSec(axis, target, 'fontWeight', 'normal');
}


/*轴标签字体样式 fontStyle、fontWeight*/
function axisLabelCheckChange(obj, boldObj,isChecked, axis, target, target1, target2){
    if(isChecked == 'Y')
    {
        disabledChildrens(obj,false);
        boldObj.disabled = false;
        var _bold = boldObj.value
        if(_bold == 'Y') updateCurrAxisThird(axis, target, target1, 'fontWeight', 'bold');
        else updateCurrAxisThird(axis, target, target1, 'fontWeight', 'normal');

        var val = obj.value;
        updateCurrAxisThird(axis, target, target1, target2, val);
    }
    else
    {
        disabledChildrens(obj,true);
        boldObj.disabled = true;
        var val1 = getDefaultAxisValThird(axis, target, target1, 'fontWeight');
        updateCurrAxisThird(axis, target, target1, 'fontWeight', val1);

        var val2 = getDefaultAxisValThird(axis, target, target1, target2);
        updateCurrAxisThird(axis, target, target1, target2, val2);
    }
}

function axisLabelBoldChange(_bold, axis, target, target1){
    if(_bold == 'Y') updateCurrAxisThird(axis, target, target1, 'fontWeight', 'bold');
    else updateCurrAxisThird(axis, target, target1, 'fontWeight', 'normal');
}

function axisLabelChange(val, axis, target, target1, target2){
    updateCurrAxisThird(axis, target, target1, target2, val);
}


/*更新第二级属性的值-通用方法*/
function updateCurrSeriesSec(target, target1, val){

    /*给对应属性赋值*/
    var _series = option['series'][checkedSeries];
    var _targetSeries = _series[target];
    if(!_targetSeries) _targetSeries = {};

    _targetSeries[target1] = val;

    /*更新图表*/
    _series[target] = _targetSeries
    option['series'][checkedSeries] = _series;
    commonFn(option);
}

function getDefaultSeriesValSec(target, target1){
    var tmp = undefined;
    var _currSeries = currOption['series'][checkedSeries];
    if(_currSeries)
    {
        var _targetcurrSeries = _currSeries[target];
        if(_targetcurrSeries) tmp = _targetcurrSeries[target1];
    }
    return tmp;
}

/*更新第二级属性的值-通用方法*/
function updateCurrRadarSec(target, target1, val){

    /*给对应属性赋值*/
    var _radar = option['radar'][0];
    var _targetRadar = _radar[target];
    if(!_targetRadar) _targetRadar = {show: true};

    _targetRadar[target1] = val;

    /*更新图表*/
    _radar[target] = _targetRadar
    option['radar'][0] = _radar;
    commonFn(option);
}
function getDefaultRadarValSec(target, target1){
    var tmp = undefined;
    var _currRadar = currOption['radar'][0];
    var _targetcurrRadar = _currRadar[target];
    if(_targetcurrRadar) tmp = _targetcurrRadar[target1];
    return tmp;
}

/*--------------雷达[radar]--------------*/
/*更新第一级属性的值-通用方法*/
function updateCurrRadar(target, val){
    /*给具体属性赋值*/
    var _radar = option['radar'][0];
    _radar[target] = val;

    /*更新图表*/
    option['radar'][0] = _radar;
    commonFn(option);
}
function getDefaultRadarVal(target){
    var tmp = undefined;
    var _currRadar = currOption['radar'][0];
    tmp = _currRadar[target];
    return tmp;
}

function getDefaultRadarValThird(axis, target, target1, target2){
    var tmp = undefined;
    var _currRadar = currOption['radar'][0];
    var _targetcurrRadar = _currRadar[target];
    if(_targetcurrRadar)
    {
        var _currStyle = _targetcurrRadar[target1];
        if(_currStyle)  tmp = _currStyle[target2];
    }
    return tmp;
}

/*更新第三级属性的值-通用方法
 * target：一级属性。如：axisLine
 * target1：二级属性。如：lineStyle
 * target2： 三级属性。如：color*/
function updateCurrRadarThird(target, target1, target2, val){

    var _radar = option['radar'][0];
    var _targetRadar = _radar[target];
    if(!_targetRadar) _targetRadar = {show: true};
    var _style = _targetRadar[target1];

    _style[target2] = val;

    /*更新图表*/
    _targetRadar[target1] = _style;
    _radar[target] = _targetRadar
    option['radar'][0] = _radar;
    commonFn(option);
}
/*更新第二级属性的值-通用方法*/
function updateCurrAxisSec(axis, target, target1, val){
    var index = 0; //获得具体的属性下标
    if(axis == 'xAxis')
        index = checkedAxis;
    else
        index = checkedyAxis;

    /*给对应属性赋值*/
    var axisArr = option[axis];
    var _axis = axisArr[index];
    var _targetAxis = _axis[target];
    if(!_targetAxis) _targetAxis = {show: true};

    _targetAxis[target1] = val;

    /*更新图表*/
    _axis[target] = _targetAxis
    axisArr[index] = _axis;
    option[axis] = axisArr;
    commonFn(option);
}
function getDefaultAxisValSec(axis, target, target1){
    var tmp = undefined;
    var currAxisArr = currOption[axis];

    if(axis == 'xAxis')
        var _currAxis = currAxisArr[checkedAxis];
    else
        var _currAxis = currAxisArr[checkedyAxis];

    var _targetcurrAxis = _currAxis[target];
    if(_targetcurrAxis) tmp = _targetcurrAxis[target1];
    return tmp;
}

function gridBorderWidthChange(val){
    option['grid'].borderWidth = val;
    commonFn(option);
}
function choiceToolChange(obj,isChecked){
    var arr = [];
    arr[0] = obj.value;
    if(isChecked == 'Y')
        getFeature(arr, null);
    else
        getFeature(null, arr);
}
function setCurrOption(val){
    currOption = val;
    option = val;
}
function setEcharts(val){
    echarts = val;
}
function getFeature(_tmpArr, _unTmpArr){
    var _feature = option['toolbox'].feature;
    if(!_feature) _feature = {};

    var _contentTrue = {show: true};
    var _contentFalse = {show: false};
    for(var i = 0;_tmpArr != null && i<_tmpArr.length;i++){
        if(_tmpArr[i] == 'dataView'){
            _contentTrue = {
                readOnly: true,
                show: true
            }
        }else if(_tmpArr[i] == 'magicType'){
            _contentTrue = {
                show: true,
                type: ["line", "bar"]
            }
        }else if(_tmpArr[i] == 'brush'){
            _contentTrue = {
                show: true,
                type: ['lineX','lineY','clear']
            }
        }
        _feature[i] = _contentTrue;
    }
    for(var i = 0;_unTmpArr!=null&&i<_unTmpArr.length;i++){
        _unTmpArr[i] = _contentFalse;
    }
    option['toolbox'].feature = _feature;
    commonFn(option);
}

function updateWidgetConfig(widgetConfig){
        var chartType = widgetConfig['chart-type'];
        var tmpWidgetConfig = option;
        if(chartType == TYPE_LINE || chartType == TYPE_BAR || chartType == TYPE_STACK)
        {
            /*更改后的脚本存入 widgetConfig 脚本中*/
            tmpWidgetConfig['category-def'] = widgetConfig['category-def'];
            tmpWidgetConfig['x-change-y'] = widgetConfig['x-change-y'];
        }
        else if(chartType == TYPE_PIE || chartType == TYPE_RADAR)
        {
            /*更改后的脚本存入 widgetConfig 脚本中*/
            tmpWidgetConfig['category-def'] = widgetConfig['category-def'];
        }

        /*更改后的脚本存入 widgetConfig 脚本中*/
        tmpWidgetConfig['provider'] = widgetConfig['provider'];
        tmpWidgetConfig['chart-type'] = widgetConfig['chart-type'];
        tmpWidgetConfig['series-def'] = widgetConfig['series-def'];
        widgetConfig = tmpWidgetConfig;
        return widgetConfig;
}
export {
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
    pointerLineTypeChange,
    choiceToolChange,
    choiceToolCheckChange,
    gridPositionCheck,
    colorGridActiveChange,
    gridBorderWidthCheck,
    gridColorCheck,
    gridBorderWidthChange,
    axisCheckChange,
    axisChange,
    axisNameCheckChange,
    axisNameBlur,
    axisNameColorChange,
    axisNameColorActiveChange,
    axisFontSizeChange,
    axisFontSizeCheckChange,
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
    inputSubTitleTextCheckChange,
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
    updateWidgetConfig,
    setCurrOption,
    setEcharts,

}
