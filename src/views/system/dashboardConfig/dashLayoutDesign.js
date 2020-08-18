import echarts from 'echarts';
import net from '@/util/net'

export function _addWidget2Column(id, _cw, flag) {
    console.log(_cw.id)
    console.log(_cw.code)
    console.log(_cw.title)
    var _column = $('#' + id);
    var _wt;
    var _wth;

    _wt = $('<li  id="' + _cw.id + '"style="border: 0px;" ></li>').appendTo(_column);
    _wth = $('<div class="panel panel-default"  style="width: 100%;height: 0;padding-bottom: 92%;margin-bottom: 0px;"></div>').appendTo(_wt);

    // /*组件头部分*/
    var _heading = $('<div class="panel-heading"></div>').appendTo(_wth);
    var _h3 = $('<div class="panel-title" style="font-size: 13px;">' + _cw.title + '</div>').appendTo(_heading);


    /*组件内容部分*/
    var _wtc = $('<div class="panel-body" id="' + _cw.id + '_content" style="width: 100%;height: 15px;padding: 0px;"></div>').appendTo(_wth);

    $('<div style="width:100%;height:100%;"></div>').appendTo(_wtc);
    // _wtc.height(_cw.height);

    net.ajax({
        url: "/sys/dashLayoutDesign/getWidgetContent/" + _cw.code,
        type: "POST",
    }).then((data) => {

        if (data.success) {
            /*请求组件内容成功，清空content，并追加组件内容*/
            _wtc.empty();
            if (data.content.indexOf("<table") != -1) {
                // data.content=  data.content.replace("<table", "<table width='200px;' ");
                $(data.content).appendTo(_wtc);
            } else {
               var  div= $("<div id=\"" + _cw.code + "_chart\" style=\"width:350px;height:295px;\" class='chart'></div>").appendTo(_wtc);
               var  div1= $("<div id=\"" + _cw.code + "\" style=\"width:100%;height:120px;\" class='img'></div>").appendTo(_wtc);
                var chart = echarts.init($('#' + _cw.code + '_chart')[0]);
                chart.setOption(JSON.parse(data.content));
                setTimeout(function () {
                    var picInfo = chart.getDataURL({
                        type:"png",
                        pixelRatio: 1,
                        backgroundColor: '#fff'
                    });
                    $('<img src="'+picInfo+'" style=\'width: 100%;height: 100%;\' ></img>').appendTo(div1);
                },1000);
            }

        }
        else {
            _wtc.empty();
            $('<div style="width:100%;height:30px;text-align:center;vertical-align:middle;padding-top:20%">组件加载失败，请联系管理员。</div>').appendTo(_wtc);
        }

    });
}


function _addRemoveButton(widget) {
    /*非设计模式下，不增加删除按钮*/
    var _btn = $('<a href="#" class="remove"><i class="fa fa-times pull-right"></i></a>').appendTo(widget);
    _btn.mousedown(function (e) {
        e.stopPropagation();
    }).click(function () {
        var _self = this;
        $.messager.confirm('提示', "确定移除该组件？", function (r) {

            if (!r) return;
            /*从 _config 中移除组件*/
            _removeWidget($(_self).parents('.widget').attr('id'));

            $(_self).parents('.widget').animate({
                opacity: 0
            }, function () {
                $(this).wrap('<div/>').parent().slideUp(function () {
                    $(this).remove();
                });
            });

        });
        return false;
    });
}
