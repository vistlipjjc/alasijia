/**
 * simple-calendar v1.0.0
 * (c) 2018 Pactera
 * @license MIT
 * @author Zhang Yan
 * @email yan.zhang44@pactera.com
 */

//定义容器，容器选项
var _container, _options;

//国际化，和一些节日数据，标记数据
var languageData = {
    feativals_CH: {
        '1-1': '元旦',
        '2-14': '情人节',
        '3-8': '妇女节',
        '3-12': '植树节',
        '4-1': '愚人节',
        '4-22': '地球日',
        '5-1': '劳动节',
        '5-4': '青年节',
        '6-1': '儿童节',
        '7-1': '建党节',
        '8-1': '建军节',
        '9-10': '教师节',
        '10-1': '国庆节',
        '12-25': '圣诞节'
    },
    feativals_EN: {
        '1-1': "new year’s day",
        '2-14': "Saint Valentine's Day",
        '3-8': 'international women’s day',
        '3-12': "Arbor Day",
        '4-1': "April Fool's Day",
        '4-22': "Earth Day",
        '5-1': "international labour day",
        '5-4': "Chinese Youth Day",
        '6-1': "Children's Day",
        '7-1': "The party's Day",
        '8-1': "the Army's Day",
        '9-10': "Teachers' Day",
        '10-1': 'National Day',
        '12-25': 'Christmas Day'
    },
    lunarFeatival_CH: {
        '1-1': '春节',
        '1-15': '元宵节',
        '1-17': '腊八节',
        '2-2': '龙头节',
        '4-4': '寒食节',
        '4-5': '清明节',
        '5-5': '端午节',
        '8-15': '中秋节',
        '9-9': '重阳节',
        '12-30': '除夕'
    },
    //节气
    solarTerm: {
        '1-6':  '小寒',
        '1-20': '大寒',
        '2-4':  '立春',
        '2-19': '雨水',
        '3-5':  '惊蛰',
        '3-20': '春分',
        '4-4':  '清明',
        '4-19': '谷雨',
        '5-5':  '立夏',
        '5-20': '小满',
        '6-5':  '芒种',
        '6-21': '夏至',
        '7-7':  '小暑',
        '7-22': '大暑',
        '8-7':  '立秋',
        '8-23': '处暑',
        '9-7':  '白露',
        '9-22': '秋分',
        '10-8': '寒露',
        '10-23':'霜降',
        '11-7': '立冬',
        '11-22':'小雪',
        '12-7': '大雪',
        '12-21':'冬至'
    },
    days_EN: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    days_CH: ["一", "二", "三", "四", "五", "六", "日"],
    months_EN: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    months_CH: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    vocation: {
        data_2018: ['1-1', '2-15', '2-16', '2-17', '2-18', '2-19', '2-20', '2-21', '4-5', '4-6', '4-7', '4-29', '4-30', '5-1', '6-16', '6-17', '6-18', '9-22', '9-23', '9-24','10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7']
    }
};

var tyear = new Date().getFullYear();
var tmonth = new Date().getMonth() + 1;
var tday = new Date().getDate();


//选择的日期
var _selectDay;

//设置请求相关参数
var _net, _code, _days, _include, _exclude, _msg;

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor))
    {
        throw new TypeError("Cannot call a class as a function");
    }
}

//配置阴历变量
var _lunarInfo = new Array(0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);
var _nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
var _nStr2 = new Array('初', '十', '廿', '三');
var _month, _day;

// 获取y年的总天数
function lYearDays(year) {
    var i,
        sum = 0;
    for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += _lunarInfo[year - 1900] & i ? 30 : 29;
    }return sum + leapDays(year); //最后在加上可能有的闰年的闰月
}

//获取闰年闰月的天数 闰大月还是小月
function leapDays(year) {
    if (leapMonth(year)) return _lunarInfo[year - 1900] & 0x10000 ? 30 : 29;else return 0;
}

//获取闰年闰哪个月1-12 ,没闰传回 0
function leapMonth(year) {
    return _lunarInfo[year - 1900] & 0xf;
}

//获取y年m月的总天数 正常月
function monthDays(year, month) {
    return _lunarInfo[year - 1900] & 0x10000 >> month ? 30 : 29;
}

//中文日期
function cDay(d) {
    var s;

    switch (d) {
        case 10:
            s = '初十';
            break;
        case 20:
            s = '二十';
            break;
        case 30:
            s = '三十';
            break;
        default:
            s = _nStr2[Math.floor(d / 10)];
            s += _nStr1[Math.floor(d % 10)];
    }
    return s;
}

//中文月份
function cMonth(m) {
    var s;
    switch (m) {
        case 1:
            s = '正月';
            break;
        case 2:
            s = '二月';
            break;
        case 3:
            s = '三月';
            break;
        case 4:
            s = '四月';
            break;
        case 5:
            s = '五月';
            break;
        case 6:
            s = '六月';
            break;
        case 7:
            s = '七月';
            break;
        case 8:
            s = '八月';
            break;
        case 9:
            s = '九月';
            break;
        case 10:
            s = '十月';
            break;
        case 11:
            s = '十一月';
            break;
        case 12:
            s = '十二月';
            break;
        default:
            break;
    }
    return s;
}

//获得阴历日期 字符串
function getLunarDay() {
    return cMonth(_month) + cDay(_day);
}

//获得阴历日期某一天的中文
function getLunarDayName() {
    if (_day == 1) return cMonth(_month);
    return cDay(_day);
}

//获取阴历日期的数字
function getLunarDayNum() {
    return {
        day: _day,
        month: _month
    };
}

var LunarHelp = function () {
    function LunarHelp(year, month, day) {
        // _classCallCheck(this, LunarHelp);

        var date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        var i,
            leap = 0,
            temp = 0; //天数

        var baseDate = new Date(1900, 0, 31);
        var offset = (date - baseDate) / 86400000;

        //计算年数
        for (i = 1900; i < 2050 && offset - lYearDays(i) > 0; i++) {
            offset -= lYearDays(i);
        }

        let isLeap = false;
        let _year = i;
        leap = leapMonth(i); //闰哪个月

        //计算月数
        for (i = 1; i < 13 && offset > 0; i++) {
            //闰月
            if (leap > 0 && i == leap + 1 && isLeap == false) {
                --i;
                temp = leapDays(_year);
            } else {
                temp = monthDays(_year, i);
            }

            //解除闰月
            if (isLeap == true && i == leap + 1) isLeap = false;

            offset -= temp;
        }

        //如果恰好减完了，不是闰月的话月数减1
        if (offset == 0 && leap > 0 && i == leap + 1) if (isLeap) {
            isLeap = false;
        } else {
            isLeap = true;
            --i;
        }

        if (offset < 0) {
            offset += temp;
            --i;
        }

        _month = i;
        //最后剩余的就是日期
        _day = offset + 1;
    }

    return LunarHelp;
}();

//初始化时间器， 并初始化头部
function init() {
    var root = _container;
    root.innerHTML = '<div ref="header" class="sc-header ivu-btn-primary"> </div> <div class="sc-body"> </div>';
    root.style.width = _options.width;
    root.style.height = _options.height;
    root.className = 'sc-calendar';

    var header = root.querySelector('.sc-header');

    //actions
    header.innerHTML = header.innerHTML + '<div class="sc-actions">' + '      <div class="sc-yleft">' + '        &lsaquo;</div>' + '      <select class="sc-select-year ivu-btn-primary" name="">' + '      </select>' + '      <div class="sc-yright">&rsaquo;</div>' + '  </div>';
    header.innerHTML = header.innerHTML + '<div class="sc-actions">' + '    <div class="sc-mleft">' + '      &lsaquo;</div>' + '    <select class="sc-select-month ivu-btn-primary" name="">' + '    </select>' + '    <div class="sc-mright">&rsaquo;</div>' + '</div>';
    header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-return-today ">返回今天</span></div>';
    header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-time"></span></div>';

    //添加下拉框数据
    updateSelect(tyear, tmonth);
    //刷新日历
    update();
    //时间刷新
    self.setInterval(timeupdate, 200);
}

//生成日历样式
function create(year, month) {
    //动态创建表格
    var root = _container;
    var scbody = root.querySelector('.sc-body');
    scbody.innerHTML = ' <div class="sc-week"> </div> <div class="sc-days"> </div>';
    var week = scbody.querySelector('.sc-week');
    var days = scbody.querySelector('.sc-days');

    //星期
    for (var i = 0; i < 7; i++)
    {
        week.innerHTML = week.innerHTML + ' <div class="sc-week-item"></div>';
    }
    //创建日期格子
    var day = new Date(year, month - 1, 1);
    var week = day.getDay();
    if (week == 0) week = 7;
    //计算当前月份应该显示多少行
    var count = 0;
    //当月份为二月时，根据闰年还是非闰年判断天数
    var $days = 0;
    if(month == 2) $days = year % 4 == 0 ? 29 : 28; //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
    else if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) $days= 31;
    else $days= 30;//其他月份，天数为：30.
    //计算最后一天是星期几
    var lastDay = new Date(year, month - 1, $days);
    var lastWeek = lastDay.getDay();
    if (lastWeek == 0) lastWeek = 7;
    count = (week -1) + $days + (7 - lastWeek);

    for (var i = 0; i < count; i++)
    {
        days.innerHTML = days.innerHTML + '<div class="sc-item"><div class="day"></div><div class="lunar-day"></div><div class="oper"></div></div>';
    }
    //动态修改页面大小
    if(count < 42) //小于42 相当于小于7行， 高度为600
    {
        _container.className = 'sc-calendar';
    }
    else
    {
        _container.className = 'sc-calendar7';
    }
}

//更新日历
function update() {
    var month = arguments.length <= 0 || arguments[0] === undefined ? tmonth : arguments[0];
    var year = arguments.length <= 1 || arguments[1] === undefined ? tyear : arguments[1];

    create(year, month);
    updateSize();
    updateWeek();
    addData(year, month);
    updateHoliday(year, month);
    updateMark(year, month);
    updateFestival(year, month);
    updateEvent();
    updateTheme(_options.theme);
}

//调整大小
function updateSize() {
    var width = arguments.length <= 0 || arguments[0] === undefined ? _options.width : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? _options.height : arguments[1];

    //将大小赋值给option
    _options.width = width;
    _options.height = height;

    _container.style.width = width;
    _container.style.height = height;

    //根据长度和宽度大小调整适合的样式
    if (parseInt(width) < 500) {
        var actions = arrayfrom(_container.querySelectorAll('.sc-actions'));
        actions.forEach(function (v, i) {
            v.classList.add('sc-actions-big');
        });
    } else {
        var actions = arrayfrom(_container.querySelectorAll('.sc-actions'));
        actions.forEach(function (v, i) {
            v.classList.remove('sc-actions-big');
        });
    }
    if (parseInt(height) < 400) {
        var items = arrayfrom(_container.querySelectorAll('.sc-item'));
        var weeks = arrayfrom(_container.querySelectorAll('.sc-week-item'));
        items.forEach(function (v, i) {
            v.querySelector('.day').classList.add('sc-item-small');
        });
        weeks.forEach(function (v, i) {
            v.classList.add('sc-item-small');
        });
    } else {
        var items = arrayfrom(_container.querySelectorAll('.sc-item'));
        var weeks = arrayfrom(_container.querySelectorAll('.sc-week-item'));
        items.forEach(function (v, i) {
            v.querySelector('.day').classList.remove('sc-item-small');
        });
        weeks.forEach(function (v, i) {
            v.classList.remove('sc-item-small');
        });
    }
}

//刷新下拉框 只有在初始化和设置语言后才会更新
function updateSelect(year, month) {
    //下拉框
    var selectYear = _container.querySelector('.sc-select-year');
    var selectMonth = _container.querySelector('.sc-select-month');
    selectYear.innerHTML = '';
    for (var i = _options.timeRange.startYear; i < _options.timeRange.endYear + 1; i++) {
        selectYear.innerHTML += '<option value="' + i + '">' + i + '</option>';
    }
    selectMonth.innerHTML = '';
    for (var i = 0; i < 12; i++) {
        var data = languageData['months_' + _options.language];
        selectMonth.innerHTML += '<option value="' + (i + 1) + '">' + data[i] + '</option>';
    }
    selectYear.value = year;
    selectMonth.value = month;
}

//刷新星期
function updateWeek() {
    var weeks = arrayfrom(_container.querySelectorAll('.sc-week-item'));
    var data = languageData['days_' + _options.language];
    if (!data) {
        console.error('language error!');
    }
    weeks.forEach(function (v, i) {
        v.innerHTML = data[i];
    });
}

//添加阳历阴历数据
function addData(year, month) {
    var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
    var day = new Date(year, month - 1, 1);
    var week = day.getDay();
    if (week == 0) week = 7;
    //计算得到第一个格子的日期
    var thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);

    //计算当前月份应该显示多少行
    var count = 0;
    //当月份为二月时，根据闰年还是非闰年判断天数
    var days = 0;
    if(month == 2) days = year % 4 == 0 ? 29 : 28; //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
    else if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) days= 31;
    else days= 30;//其他月份，天数为：30.
    //计算最后一天是星期几
    var lastDay = new Date(year, month - 1, days);
    var lastWeek = lastDay.getDay();
    if (lastWeek == 0) lastWeek = 7;
    count = (week -1) + days + (7 - lastWeek);
    //对每一个格子遍历
    for (var i = 0; i < count; i++)
    {
        daysElement[i].className = 'sc-item';
        var theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
        var writeyear = theday.getFullYear();
        var writeday = theday.getDate();
        var writemonth = theday.getMonth() + 1;
        if (writemonth != month) {
            daysElement[i].classList.add('sc-othermenth');
        }
        daysElement[i].querySelector('.day').innerHTML = writeday;
        //判断是否添加阴历
        if (_options.showLunarCalendar) {
            new LunarHelp(writeyear, writemonth, writeday);
            daysElement[i].querySelector('.lunar-day').innerHTML = getLunarDayName();
        } else {
            daysElement[i].querySelector('.lunar-day').innerHTML = '';
            daysElement[i].classList.add('item-nolunar');
        }

        //添加today样式
        if (tyear == writeyear && tday == writeday && tmonth == writemonth) {
            _selectDay = daysElement[i];
            daysElement[i].classList.add("sc-today");
        }
    }
}

//刷新标记日期
function updateMark(year, month) {
    var options = _options;
    if (options.showMark) {
        var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
        var currentmonth = month - 1;
        //取得节日数据
        var data = options.mark;
        if (data) {
            daysElement.forEach(function (v, i) {

                var day = +v.querySelector('.day').innerHTML;
                if (day == 1) currentmonth++;

                if (data[year + '-' + currentmonth + '-' + day]) {
                    v.classList.add('sc-mark');
                    v.title = data[year + '-' + currentmonth + '-' + day];
                } else {
                    v.classList.remove('sc-mark');
                    v.title = '';
                }
            });
        }
    }
}

//刷新节日数据
function updateFestival(year, month) {
    var options = _options;
    var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
    var currentmonth = month - 1;
    //取得节日数据
    var data = languageData['feativals_' + _options.language];
    var lunardata = languageData['lunarFeatival_' + _options.language];
    var solarTermdata = languageData['solarTerm'];
    if (!data) {
        console.error('language error!');
    }

    //循环处理每天的方格
    daysElement.forEach(function (v, i) {
        var day = +v.querySelector('.day').innerHTML;
        if (day == 1) currentmonth++;

        //24节气
        if (options.showSolarTerm) {
            if (solarTermdata[currentmonth + '-' + day]) {
                v.querySelector('.lunar-day').innerHTML = solarTermdata[currentmonth + '-' + day];
                v.classList.add('sc-festival');
            }
        }

        //国际节日
        if (options.showFestival) {
            if (data[currentmonth + '-' + day]) {
                v.querySelector('.lunar-day').innerHTML = data[currentmonth + '-' + day];
                v.classList.add('sc-festival');
            }
        }

        //阴历节日
        if (lunardata && options.showLunarFestival) {
            new LunarHelp(year, currentmonth, day);
            var lunar = getLunarDayNum();
            if (lunardata[lunar.month + '-' + lunar.day]) {
                v.querySelector('.lunar-day').innerHTML = lunardata[lunar.month + '-' + lunar.day];
                v.classList.add('sc-festival');
            }
        }

        //显示操作按钮
        if(!v.classList.contains('sc-othermenth'))
        {
            var $day = year + '-' + month + '-' + day;
            v.querySelector('.oper').innerHTML = '<div class="ivu-btn-group ivu-btn-group-circle "><button type="button" class="btn-include-'+ day +' ivu-btn ivu-btn-ghost ivu-btn-icon-only sc-includeBtn" style="border: 0px; padding-right: 3px;"><i class="ivu-icon ivu-icon-ios-plus-outline"></i></button> ' +
                '<button type="button" class="btn-exclude-'+ day +' ivu-btn ivu-btn-ghost ivu-btn-icon-only sc-excludeBtn" style="border: 0px; padding-left: 3px;"><i class="ivu-icon ivu-icon-ios-minus-outline"></i></button></div>';

            var includeBtn = v.querySelector('.sc-includeBtn');
            includeBtn.onclick = function (){
                includeClick(v, this, day, $day);
            };

            var excludeBtn = v.querySelector('.sc-excludeBtn');
            excludeBtn.onclick = function (){
                excludeClick(v, this, day, $day);
            }
        }
    });

    //执行初始化页面数据
   initMonthDay(month);
}

//包含处理
function includeClick(obj, el, i, day){

    //默认是未选中
    var isSelect = false;

    //如果当前选中排除，需要清除
    if(el.className == 'active')
    {
        el.removeClass('active');
    }

    //设置选中包含
    el.classList.add('active');

    //如果当前选默认颜色
    if(obj.classList.contains('sc-item'))
    {
        obj.classList.remove('sc-item');
        obj.classList.add('sc-item-include');
    }
    else if(obj.classList.contains('sc-item-include'))//如果当前已经包含， 需取消
    {
        obj.classList.remove('sc-item-include');
        obj.classList.add('sc-item');
        isSelect = true;
    }
    else if(obj.classList.contains('sc-item-exclude'))//如果当前排除
    {
        obj.classList.remove('sc-item-exclude');
        obj.classList.add('sc-item-include');
    }

    _net.send({
        server: _include,
        data: {code: _code, date: day, isSelect: isSelect}
    }).then((data) => {
        if (data.success) {
            _msg.success(data.msg);
        } else {
            _msg.error(data.msg);
        }
    });
}

//排除处理
function excludeClick(obj, el, i, day){
    //默认未选中
    var isSelect = false;

    //如果当前选中包含，需要清除
    if(el.className == 'active')
    {
        el.removeClass('active');
    }

    //设置选中排除
    // $(el).toggleClass('active');
    el.classList.add('active');

    //如果当前选默认颜色
    if(obj.classList.contains('sc-item'))
    {
        obj.classList.remove('sc-item');
        obj.classList.add('sc-item-exclude');
    }
    else if(obj.classList.contains('sc-item-exclude'))//如果当前已经包含， 需取消
    {
        obj.classList.remove('sc-item-exclude');
        obj.classList.add('sc-item');
        isSelect = true;
    }
    else if(obj.classList.contains('sc-item-include'))//如果当前排除
    {
        obj.classList.remove('sc-item-include');
        obj.classList.add('sc-item-exclude');
    }

    _net.send({
        server: _exclude,
        data: {code: _code, date: day, isSelect: isSelect}
    }).then((data) => {
        if (data.success) {
            _msg.success(data.msg);
        } else {
            _msg.error(data.msg);
        }
    });
}

function initMonthDay(month){
    _net.send({
        server: _days,
        append: [_code, month]
    }).then((data) => {

        data.includes.forEach(item => {
            let el = _container.querySelector('.btn-include-'+ item);
            el.classList.add('active');

            var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
            daysElement.forEach((v, i) => {
                let day = v.querySelector('.day').innerHTML;
                if(day == item && !v.classList.contains('sc-othermenth'))
                {
                    v.classList.remove('sc-item');
                    v.classList.add('sc-item-include');
                    return;
                }
            });
        });

        data.excludes.forEach(item => {
            let el = _container.querySelector('.btn-exclude-'+ item);
            el.classList.add('active');

            var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
            daysElement.forEach((v, i) => {
                let day = v.querySelector('.day').innerHTML;
                if(day == item && !v.classList.contains('sc-othermenth'))
                {
                    v.classList.remove('sc-item');
                    v.classList.add('sc-item-exclude');
                    return;
                }
            });
        });
    });
}

//刷新假期 休假
function updateHoliday(year, month) {
    var options = _options;
    if (options.showHoliday) {
        var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
        var currentmonth = month - 1;
        //取得节日数据
        var data = languageData.vocation['data_' + year];
        if (data) {
            daysElement.forEach(function (v, i) {
                var day = +v.querySelector('.day').innerHTML;
                if (day == 1) currentmonth++;
                //国际节日
                if (data.indexOf(currentmonth + '-' + day) > 0) {
                    v.classList.add('sc-vocation');
                }
            });
        }
    }
}

//刷新主题
function updateTheme(theme) {
    if (_options.theme.changeAble) {
        var daytheme = theme.days;
        var weektheme = theme.weeks;
        var weeks = arrayfrom(_container.querySelectorAll('.sc-week-item'));
        var days = arrayfrom(_container.querySelectorAll('.sc-item'));
        weeks.forEach(function (v, i) {
            v.style.backgroundColor = weektheme.backgroundColor;
            v.style.fontSize = weektheme.fontSize;
            v.style.color = weektheme.fontColor;
        });
        days.forEach(function (v, i) {
            if (!v.classList.contains('sc-today')) {
                v.style.backgroundColor = daytheme.backgroundColor;
                v.querySelector('.day').style.color = daytheme.fontColor;
            } else {
                v.style.backgroundColor = theme.todaycolor;
            }
            v.querySelector('.day').style.fontSize = daytheme.fontSize;
        });
        var Calendar = this;
        //active border
        days.forEach(function (v, i) {
            v.onmouseover = function (e) {
                style.borderColor = theme.activeSelectColor;
                style.borderWidth = '1px';
            };
            v.onmouseout = function (e) {
                style.borderColor = '#F1EBE4';
                style.borderWidth = '0 0 1px 1px';
            };
        });
    }
}

//刷新事件
function updateEvent() {
    var daysElement = arrayfrom(_container.querySelectorAll('.sc-item'));
    var container = _container;
    daysElement.forEach(function (v, i) {
        v.onmouseover = function (e) {
            v.classList.add('sc-active-day');
        };
        v.onmouseout = function (e) {
            v.classList.remove('sc-active-day');
        };
        v.onclick = function () {
            _selectDay = v;
            var pre = container.querySelector('.sc-selected');
            if (pre) pre.classList.remove('sc-selected');
            v.classList.add('sc-selected');
        };
    });

    var selectYear = container.querySelector('.sc-select-year');
    selectYear.onchange = function () {
        var m = selectMonth.value;
        var y = this.value;
        update(m, y);
    };

    var selectMonth = container.querySelector('.sc-select-month');
    selectMonth.onchange = function () {
        var y = selectYear.value;
        var m = this.value;
        update(m, y);
    };

    var yearadd = container.querySelector('.sc-yright');
    var yearsub = container.querySelector('.sc-yleft');
    var monthadd = container.querySelector('.sc-mright');
    var monthsub = container.querySelector('.sc-mleft');

    yearadd.onclick = function () {
        var currentyear = selectYear.value;
        if (currentyear < 2099) currentyear++;
        selectYear.value = currentyear;
        update(selectMonth.value, currentyear);
    };
    yearsub.onclick = function () {
        var currentyear = selectYear.value;
        if (currentyear > 1900) currentyear--;
        selectYear.value = currentyear;
        update(selectMonth.value, currentyear);
    };
    monthadd.onclick = function () {
        var currentmonth = selectMonth.value;
        var currentyear = selectYear.value;
        if (currentmonth < 12) currentmonth++;else {
            currentmonth = 1;
            selectYear.value = ++currentyear;
        };
        selectMonth.value = currentmonth;
        update(currentmonth, currentyear);
    };
    monthsub.onclick = function () {
        var currentmonth = selectMonth.value;
        var currentyear = selectYear.value;
        if (currentmonth > 1) currentmonth--;else {
            currentmonth = 12;
            selectYear.value = --currentyear;
        }
        selectMonth.value = currentmonth;
        update(currentmonth, currentyear);
    };

    var returntoday = container.querySelector('.sc-return-today');
    returntoday.onclick = function () {
        selectYear.value = tyear;
        selectMonth.value = tmonth;
        update();
    };
}

//添加标记
function addMark(day, info) {
    _options.mark[day] = info;
    update();
}

//获取用户点击的日期
function getSelectedDay() {
    var selectYear = _container.querySelector('.sc-select-year').value;
    var selectMonth = _container.querySelector('.sc-select-month').value;
    var selectDay = _selectDay.querySelector('.day').innerHTML;
    return new Date(selectYear, selectMonth - 1, selectDay);
}

//设置语言
function setLenguage(language) {
    _options.language = language;
    var selectYear = _container.querySelector('.sc-select-year');
    var selectMonth = _container.querySelector('.sc-select-month');
    updateSelect(selectYear.value, selectMonth.value);
    update();
}

//设置是否显示节日
function showFestival(s) {
    _options.showFestival = s;
    update();
}

//设置是否显示假期
function showHoliday(s) {
    _options.showHoliday = s;
    update();
}

//设置是否显示节气
function showSolarTerm(s) {
    _options.showSolarTerm = s;
    update();
}

//设置是否显示阴历节日
function showLunarFestival(s) {
    _options.showLunarFestival = s;
    update();
}

//设置是否显示阴历日期
function showLunarCalendar(s) {
    _options.showLunarCalendar = s;
    update();
}

//设置是否显示标记日期
function showMark(s) {
    _options.showMark = s;
    update();
}

 //将nodelist转为数组
function arrayfrom(nidelist) {
    var array = [];
    [].forEach.call(nidelist, function (v) {
        array.push(v);
    });
    return array;
}

function timeupdate() {
    var timespan = document.querySelectorAll('.sc-time');
    var now = new Date();
    var nh = now.getHours();
    var nm = now.getMinutes();
    var ns = now.getSeconds();
    if (nh < 10) nh = '0' + nh;
    if (nm < 10) nm = '0' + nm;
    if (ns < 10) ns = '0' + ns;
    [].forEach.call(timespan, function (v) {
        v.innerHTML = '时间：' + nh + ":" + nm + ':' + ns;
    });
};

//封装vue插件
var SimpleCalendar = {};
SimpleCalendar.install = function (Vue, options) {

    //添加实例方法 $calendar
    Vue.prototype.$calendar = (id, option) => {

        //默认配置
        let defaultOpt = {
            width: '500px',
            height: '500px',
            language: 'CH', //语言
            showLunarCalendar: true, //阴历
            showHoliday: true, //休假
            showFestival: true, //节日
            showLunarFestival: true, //农历节日
            showSolarTerm: true, //节气
            showMark: true, //标记
            timeRange: {
                startYear: 1900,
                endYear: 2049
            },
            timeZone: "", //时区
            theme: {
                changeAble: false,
                weeks: {
                    backgroundColor: '#FBEC9C',
                    fontColor: '#4A4A4A',
                    fontSize: '20px'
                },
                days: {
                    backgroundColor: '#ffffff',
                    fontColor: '#565555',
                    fontSize: '24px'
                },
                todaycolor: 'orange',
                activeSelectColor: 'orange',
                invalidDays: '#C1C0C0'
            }
        };

        //容器
        _container = id;
        defaultOpt.width = _container.style.offsetWidth;
        defaultOpt.height = _container.style.offsetHeight;

        //合并用户自定义选项
        for(let i in options)
        {
            defaultOpt[i] = options[i]
        }
        _options = defaultOpt;

        //设置请求服务相关参数
        _net = option.net;
        _code = option.code;
        _days = option.days;
        _include = option.include;
        _exclude = option.exclude;
        _msg = option.msg;

        //初始化日历
        init();
    };
};

module.exports = SimpleCalendar;