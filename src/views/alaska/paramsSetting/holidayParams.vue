<template>
  <div class="cpBox" >
  <Form class="cpCont" style="margin-left:10px;margin-bottom:24px;">
    <div class="cpItemCont" style="margin-bottom: -45px;">
      <FormItem label="年份：" style="width:40%" >
      <DatePicker type="year" style="width: 100px;" :value="yeartype" @on-change="selectyear" :clearable="false" format="yyyy" >
      </DatePicker>
      </FormItem>
    </div>
  </Form>
  <Form class="cpCont "  :label-width="80"  style="border:1px solid #e9eaec;">
    <div class="cpItemCont02"  style="border-bottom:1px solid #e9eaec;padding-top:35px;height:35px;">
      <FormItem style="padding-top:15px;">
        <span class="cpItemText02" style="margin-left:-70px;">法定节假日</span>
        <span class="cpItemText01" style="margin-left:13px;">休假日期</span>
        <span class="cpItemText01" style="margin-left:180px;">补班日期</span>
      </FormItem>
    </div>
    <div class="cpItemCont" v-for="(items,index) in options">
      <span class="cpItemText02" v-show="showflag">{{queryForm[index].title}}</span>
      <FormItem  :label-width="5">
        <DatePicker
        :start-date="startDateselect(options[index].startDate)"
        :id = "'holidayDate'+index"
          class="cpItemInput"
          v-if="showInput&&showflag"
          type="date"
          format="yyyy-MM-dd"
          :editable="false"
          :clearable="false"
          :options="options[index].optionsStart"
          @on-change="changeStartDate(options[index].startDate,index)"
          v-model="options[index].startDate"
          placeholder="全部">
        </DatePicker> 
        <span class="cpItemText" v-if="!showInput&&queryForm[index].startDate">{{queryForm[index].startDate}}</span>
        <span v-show="showInput&&showflag">至</span>
        <span v-show="!showInput&&queryForm[index].startDate">至</span>
      </FormItem>
      <FormItem  :label-width="10">
        <DatePicker
        :start-date="startDateselect(options[index].endDate)"
        :id = "'holidayDate'+(index+options.length)"
          class="cpItemInput2"
          v-if="showInput&&showflag"
          type="date"
          format="yyyy-MM-dd"
          :editable="false"
          :clearable="false"
          :options="options[index].optionsEnd"
          @on-change="changeEndDate(options[index].endDate,index)" 
          v-model="options[index].endDate"
          placeholder="全部">
        </DatePicker>
        <span class="cpItemTextover" v-if="!showInput&&options[index].optionsEnd">{{queryForm[index].endDate}}</span>
      </FormItem>

      <span v-for="(childitems,childindex) in items.overtimeDate" :key="childindex"  class="wpRightItem">
        <DatePicker
         :start-date="startDateselect(items.overtimeDate[childindex])"
          class="cpItemInput3"
          v-if="showInput&&showflag"
          type="date"
          format="yyyy-MM-dd"
          :editable="false"
          v-model="items.overtimeDate[childindex]"
          placeholder="全部">
        </DatePicker>
        <span class="cpItemTextover2" v-if="!showInput">{{queryForm[index].overtimeDate[childindex]}}<span v-if="queryForm[index].overtimeDate[childindex]&&childindex+1 < items.overtimeDate.length">、</span></span>
        <span class="blueClass" v-if="showflag&&showInput&&items.overtimeDate.length > 1 "@click="minuNum(index, childindex)">-</span>
      </span>
      <span v-if="showflag&&showInput&&items.overtimeDate.length < 5" class="blueClass addclass" @click="addNum(index)" >+</span>        
    </div>
  </Form>
  <div class="cpBtnBox">
    <template v-if="showInput">
      <Button class="cpBtnItem" type="primary" @click="saveParams()">保存</Button>
      <Button class="cpBtnItem" type="ghost" @click="cancel()">取消</Button>
    </template>
    <Button class="cpBtnItem" type="ghost" @click="updateCommonParams" v-else>修改</Button>
  </div>
  </div>
</template>

<script>
import moment from 'moment'
import $ from 'jquery'
export default {
  data () {
    return {
      showflag:true,
      ifCheck:false,
      yeartype:'',// 年份选择
      yearstart:' 01-01 00:00:00',//重置区间
      yearend:' 12-31 23:59:59',
      putstartdate:'',
      putenddate:'',
      queryForm:[],
      workDate:{},
      showInput: false, // 显示输入框

      server: {
        query: this.$services.backendService.calendarFestivalRestController.getCalendarFestival,
        save: this.$services.backendService.calendarFestivalRestController.saveCalendarFestival,
      },
      //时间选择
      options:[
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      {optionsStart:{},
       optionsEnd:{},
       startDate:null,
       endDate:null,
       overtimeDate:['']
      },
      ],
      
    }
  },
  created () {
    this.init()
  },

  methods: {
    init () {
      //默认获取当前年份并获取请求与限制
      let vm = this
      let newdate = new Date;
      let newyear = newdate.getFullYear()
      vm.yeartype = newyear.toString()
      vm.setDate(vm.yeartype)
      vm.getqueryAll(vm.yeartype)//请求查询
    },
    //选择年份
    selectyear (year){
      let vm = this
      if (year == undefined) {
        return null
      };
      this.setDateRules()
      this.setDate(year)
      this.yeartype = year
      this.getqueryAll(year)
      if(vm.showInput){
        vm.showflag = false;
      }
      setTimeout(
        function(){ if(vm.showInput){
        vm.showflag = true;
      } }, 500)
      
      
      
      
    },
    //查询
    getqueryAll (year) {
      let vm = this
      let getqueryForm = {
        pageNumber:1,
        pageSize: 20,
        year:year
      } 
      
      vm.$net.send({
        server: vm.server.query,
        data: getqueryForm

      }).then((data) => {
        if (data.data.total== 0 && data.success) { 


           return null
      };
      let res = data.data.rows
      res.forEach( (item,i)=>{
        if (item.id) {//空不覆盖默认
        vm.queryForm[i].id = item.id
        vm.queryForm[i].type = item.type
        vm.queryForm[i].year = getqueryForm.year
        vm.queryForm[i].title = item.title
        vm.queryForm[i].startDate = item.startDate
        vm.queryForm[i].endDate = item.endDate
        //字符串转换数组 
        vm.queryForm[i].overtimeDate = JSON.parse(item.overtime)
        }          
      })
    
      for(let i=0;i<vm.queryForm.length;i++){
        vm.options[i].startDate = vm.deepClone(vm.queryForm[i].startDate)
        vm.options[i].endDate = vm.deepClone(vm.queryForm[i].endDate)
        if (vm.queryForm[i].overtimeDate) {
          vm.options[i].overtimeDate = vm.deepClone(vm.queryForm[i].overtimeDate)
        }else{
          vm.options[i].overtimeDate = ['']
          vm.queryForm[i].overtimeDate =['']
        }
      }


      }).catch(error => {
        vm.$Message.error(error.reason)
      })
      vm.setDateRules()//请求后更新可选日期区间

    },
    // 保存前校验
    saveParams () {
      let vm = this
      let datexMoth =''
      let dateDay =''
      for(let j=0;j< vm.options.length;j++){
      //不修改保存，双向绑定会把数据转化为日期格式，需要转换回来
       if (vm.options[j].startDate instanceof Date) {
        let addzero3 = (vm.options[j].startDate.getMonth() + 1)<10?"0":""
        let addzero4 = vm.options[j].startDate.getDate()<10?"0":"" 
        vm.options[j].startDate = vm.options[j].startDate.getFullYear() +'-'+ addzero3 + (vm.options[j].startDate.getMonth() + 1) +'-'+ addzero4 + vm.options[j].startDate.getDate()
       }  
       if (vm.options[j].endDate instanceof Date) {
        let addzero5 = (vm.options[j].endDate.getMonth() + 1)<10?"0":""
        let addzero6 = vm.options[j].endDate.getDate()<10?"0":"" 
        vm.options[j].endDate = vm.options[j].endDate.getFullYear() +'-'+ addzero5 + (vm.options[j].endDate.getMonth() + 1) +'-'+ addzero6 + vm.options[j].endDate.getDate()
       } 
     }
      if (vm.beforeCheckForm()) {
        for(let i=0;i<vm.queryForm.length;i++){
            vm.queryForm[i].startDate = vm.options[i].startDate 
            vm.queryForm[i].endDate = vm.options[i].endDate
            vm.queryForm[i].holidayDate =  vm.getAllDate(vm.queryForm[i].startDate,vm.queryForm[i].endDate)
            for (let k = 0; k <vm.options[i].overtimeDate.length; k++) {
              //在查询补班数据写入日期后，返回的是被强制转换的时间戳，所以请求修改需要将时间戳转换为对象
              if (vm.options[i].overtimeDate[k]) {
                vm.options[i].overtimeDate[k] = Date.parse(vm.options[i].overtimeDate[k])
                let d = new Date(vm.options[i].overtimeDate[k]); 
                let addzero1 = (d.getMonth() + 1)<10?"0":""
                let addzero2 = d.getDate()<10?"0":""   
                vm.options[i].overtimeDate[k] = (d.getFullYear()) + "-" + addzero1 + (d.getMonth() + 1) + "-" + addzero2 +(d.getDate())
              }else{
                vm.options[i].overtimeDate[k] = ''
              }
            };
          //空数据过滤 &&数据去重         
            vm.options[i].overtimeDate = vm.options[i].overtimeDate.filter(
              (index) =>{
               return index && index.trim();
              }
            )
            let delSame = new Set(vm.options[i].overtimeDate)
            vm.options[i].overtimeDate =  Array.from(delSame)
            if (vm.options[i].overtimeDate !== null&& vm.options[i].overtimeDate.length > 0) {
              vm.queryForm[i].overtimeDate = vm.deepClone(vm.options[i].overtimeDate)
            }else{
              vm.queryForm[i].overtimeDate = null
           }
        }
          vm.pushAllDate()
          vm.showInput = false
          vm.ifCheck = false
      }else{ 
        vm.ifCheck = true 
      }
    },
    //发送
    pushAllDate(){
      let vm = this
      vm.$net.send({
        server: vm.server.save,
        data: vm.queryForm
      }).then((data) => {
        if (data.code === 200) {
          vm.$Message.success('保存成功')
          vm.getqueryAll(vm.queryForm[0].year)//回显获取新增id
        } else {
          vm.$Message.error(data.message)
        }
      }).catch(error => {
        vm.$Message.error(error.reason)
      })
    },
    cancel (){
      let vm = this
      this.setDateRules ();
      this.showInput = false 
      this.ifCheck = false
  
    },
    // 修改为输入状态
    updateCommonParams () {
      let vm = this
      this.setDateRules ()
      for(let i=0;i<vm.queryForm.length;i++){
        vm.options[i].startDate = vm.deepClone(vm.queryForm[i].startDate)
        vm.options[i].endDate = vm.deepClone(vm.queryForm[i].endDate)
        if (vm.queryForm[i].overtimeDate) {
          vm.options[i].overtimeDate = vm.deepClone(vm.queryForm[i].overtimeDate)
        }else{
          vm.options[i].overtimeDate = ['']
          vm.queryForm[i].overtimeDate =['']
        }
      }
       this.showInput = true
    },

    //增减补班日期
    minuNum (index, childindex){
      this.options[index].overtimeDate.splice(childindex, 1)
    },
    addNum (index){
      this.options[index].overtimeDate.push('')
    },
    // 新增创建时间选择，时间范围控制及格式转换
    changeStartDate (datex,index) {
      let vm = this
      let addzero1 = (datex.getMonth()+ 1)<10?"0":""
      let addzero2 = datex.getDate()<10?"0":"" 
      let  startDate = datex.getFullYear() +'-'+ addzero1 + (datex.getMonth()+1) +'-'+ addzero2 + datex.getDate()
      let endDate
      vm.options[index].startDate = startDate
      endDate = new Date(vm.options[index].endDate)
      vm.options[index].optionsEnd =  {
              disabledDate (date) {
                return   date && moment(date).valueOf() < moment(datex).valueOf() || date &&moment(date).valueOf() > moment(vm.putenddate).valueOf()
              }
            } 
      vm.options[index].endDate = datex.getTime() > endDate.getTime()?null:vm.options[index].endDate
      vm.ifCheck?vm.beforeCheckForm(): vm.ifCheck == false
    },
    changeEndDate (datex,index) {
      let vm = this
      let addzero1 = (datex.getMonth()+ 1)<10?"0":""
      let addzero2 = datex.getDate()<10?"0":"" 
      let  endDate = datex.getFullYear() +'-'+ addzero1 + (datex.getMonth()+1) +'-'+ addzero2 + datex.getDate()

     vm.options[index].endDate = endDate
     vm.ifCheck?vm.beforeCheckForm(): vm.ifCheck == false
    },
    beforeCheckForm () {
     let flag = true
     $("[id^='holidayDate']>div.ivu-date-picker-rel>div.ivu-input-wrapper>input.ivu-input").each(function (index, item) {
        if (item.value === '') {
          item.className = 'ivu-input redBorder'
          flag = false

        }else{
          item.className = 'ivu-input'
        }
    })
    return flag

    },
    //重置数据
    setDate (year){

        this.options = [
        {optionsStart:{},
         optionsEnd:{},
         startDate:'null',
         endDate:null,
         overtimeDate:['']
        },
        {optionsStart:{},
         optionsEnd:{},
         startDate:null,
         endDate:null,
         overtimeDate:['']
        },
        {optionsStart:{},
         optionsEnd:{},
         startDate:null,
         endDate:null,
         overtimeDate:['']
        },
        {optionsStart:{},
         optionsEnd:{},
         startDate:null,
         endDate:null,
         overtimeDate:['']
        },
        {optionsStart:{},
         optionsEnd:{},
         startDate:null,
         endDate:null,
         overtimeDate:['']
        },
        {optionsStart:{},
         optionsEnd:{},
         startDate:null,
         endDate:null,
         overtimeDate:['']
        },
        {optionsStart:{},
         optionsEnd:{},
         startDate:null,
         endDate:null,
         overtimeDate:['']
        },
      ]

      this.queryForm = [{
        "id": null,
        "year": year,
        "type": "1",
        "title": "元旦",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate":['']
      },
      {
        "id": null,
        "year": year,
        "type": "2",
        "title": "春节",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate":['']
      },
      {
        "id": null,
        "year": year,
        "type": "3",
        "title": "清明节",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate":['']
      },
      {
        "id": null,
        "year": year,
        "type": "4",
        "title": "劳动节",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate":['']
      },
      {
        "id": null,
        "year": year,
        "type": "5",
        "title": "端午节",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate": ['']
      },
      {
        "id": null,
        "year": year,
        "type": "6",
        "title": "中秋节",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate":['']
      },
      {
        "id": null,
        "year": year,
        "type": "7",
        "title": "国庆节",
        "startDate": null,
        "endDate": null,
        "holidayDate": [],
        "overtimeDate": ['']
      },]

    },
    //重置规则
    setDateRules (){
      let vm = this
      vm.putstartdate = vm.yeartype + vm.yearstart
      vm.putenddate = vm.yeartype + vm.yearend
      let momentstart = moment(new Date (vm.putstartdate)).valueOf()
      let momentend = moment(new Date (vm.putenddate)).valueOf()
      let i = 0
      
      for (let i=0;i<7;i++) {
          vm.options[i].optionsStart= {
            disabledDate (date) {
              return date && date.valueOf() < momentstart || date && date.valueOf() > momentend
            }
          }
          vm.options[i].optionsEnd = {
            disabledDate (date) {
            if (vm.yeartype == vm.queryForm[i].year&&vm.queryForm[i].id) {
              let momentstart01 =  vm.queryForm[i].startDate.replace(/-/g,'/')
              momentstart01 = moment(new Date(momentstart01+' 00:00:00')).valueOf()
              return date && date.valueOf() <  momentstart01 || date && date.valueOf() > momentend
            }else{
              return date && date.valueOf() < momentstart || date && date.valueOf() > momentend
            }
           }
          }
      };      
    },
    startDateselect(value){
     if (value && value !=='') {
        return null
     }else{
      let startyear = parseInt(this.queryForm[0].year)
      return new Date(startyear, 0)
     }
    },
    //深拷贝
    deepClone (data) {
  　　if(!data || !(data instanceof Object) || (typeof data=="function"))
  　　{
  　　　　return data||undefined;
  　　}
  　　var constructor = data.constructor;
  　　var result = new constructor();
  　　for(var key in data){
  　　　　if(data.hasOwnProperty(key)){
  　　　　　　result[key]=this.deepClone(data[key]);
  　　　　}
  　　}
  　　return result;
    },
    //计算起始结束之间的日期
    format (time){
      let ymd = ''
      let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
      let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
      ymd += time.getFullYear() + '-' // 获取年份。
      ymd += mouth + '-' // 获取月份。
      ymd += day // 获取日。
      return ymd // 返回日期。
    },
    getAllDate (start, end){
      let dateArr = []
      let startArr = start.split('-')
      let endArr = end.split('-')
      let db = new Date()
      db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2])
      let de = new Date()
      de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2])
      let unixDb = db.getTime()
      let unixDe = de.getTime()
      let stamp
      const oneDay = 24 * 60 * 60 * 1000;
      for (stamp = unixDb; stamp <= unixDe;) {
         dateArr.push(this.format(new Date(parseInt(stamp))))
         stamp = stamp + oneDay
       }
       return dateArr
    },
  }
}
</script>

<style scoped>
.cpItemCont {
  width: 100%;
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: -24px;
}
.cpItemCont02 {
  width: 100%;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.cpItemInput {
  width: 110px;
  margin-top: 5px;
/*   margin-left: 50px; */

}
.cpItemInput2 {
  width: 110px;
  margin-top: 5px;

}
.cpItemInput3 {
  width: 110px;
  margin-top: 5px;

}

.cpItemInputover {
  width: 110px;

}
.cpItemText {
  width: 90px;
  margin-left:10px;
  display: inline-block;
  height: 32px;
  padding-top: 10px;
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
}
.cpItemText2 {
  width: 30px;
  margin-left:50px;
  display: inline-block;
  height: 32px;
/*   margin: 5px; */
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
}
.cpItemTextover {
  width: 80px;
  display: inline-block;
  height: 32px;
  margin-left: 20px;
  padding-top: 10px;
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
}
.cpItemTextover2 {
  width: 80px;
  display: inline-block;
  height: 32px;
  padding-top: 5px;
  margin-left: 20px;
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
}
.cpItemText01 {
  width: 100px;
  display: inline-block;
  height: 32px;
  margin: 5px;
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
}
.cpItemText02 {
  width: 100px;
  display: inline-block;
  height: 32px;
  margin: 0px 0px 10px 10px;
  font-size: 12px;
  color: #495060;
  line-height: 1.9;
}

.cpBtnBox {
  margin-left: 190px;
  padding: 10px 0 20px;
}
.cpBtnItem {
  width: 100px;
  margin: 0 10px;
}
.blueClass {
        color: blue;
        cursor: pointer;
        margin: 5px 5px 20px 4px;
    }
.wpRightItem {
  margin-left:50px;
  margin-bottom: 20px;
}  
.addclass {

  margin: 5px 5px 20px 5px;
}   
.wpRightItem + .wpRightItem {
  margin-left:0px;
  margin-bottom: 20px;
}   
.ivu-form-item{
  margin-bottom: 24px;
}
.ivu-form-item-content{
  margin-left:10px;
  padding:1px;
}

</style>

<style>
.cpCont label {
  font-weight: normal;
}
.redBorder {
  border-color: #ed3f14 !important;
  box-shadow: 0 0 0 2px rgba(237,63,20,.2) !important;
}   
</style>
