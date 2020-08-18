<template>
    <div>
      <Card>
          <p slot="title" style="font-weight:normal;">
          默认广告配置：
          </p>            
          <Row>
          <Form ref="editForm" :model="editForm" :label-width="180" :rules='ruleValidate'>
              <Row>  
              <Col span="21">
                  <FormItem label="提 示  语：" prop="advertContent" required>
                      <Input v-model="editForm.advertContent" type="textarea" :maxlength='50' :show-word-limit='true' ></Input>
                  </FormItem>
              </Col>
              </Row>  
              <Row>                
              <Col span="10" >
                  <FormItem label="广告图片1：" prop="advertPics[0]" >
                    <div style="display: flex;align-content:center;width:202px;height:75px;">
                      <div class="demo-upload-list" v-show="!imagehidden">
                          <template >
                              <img :src="this.defaultList[0].url">
                              <div class="demo-upload-list-cover">
                                  <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                              </div>
                          </template>
                      </div>
                      <Upload
                          ref ="upload"
                          :show-upload-list="false"
                          :default-file-list="defaultList"
                          :on-success="handleSuccess"
                          :accept='acept'
                          :format="['png','jpg','jpeg','bmp']"
                          :data="loadImgType"
                          :max-size="1024"
                          :on-format-error="handleFormatError"
                          :on-exceeded-size="handleMaxSize"
                          :before-upload="handleBeforeUpload"
                          type="drag"
                          :action="loadImg"
                          style="display: inline-block;"
                          v-show='imagehidden'
                          >
                          <div style="width: 202px;height:75px;line-height: 20px;padding-top:20px;background:#FAFAFA;">
                              <Icon type="ios-cloud-upload-outline" size="20"></Icon>
                              <p>上传图片</p>
                              
                          </div>
                      </Upload>
                    </div>
                  <span class="wpRightRedTips1" v-if="warningsize">
                    广告图片不能大于1M  
                  </span>
                  </span> 
                  <span class="wpRightRedTips1" v-if="warningwidth">
                    请选择高宽比125*335的图片  
                  </span>
                  <span class="wpRightRedTips1" v-if="warningpic">
                       请上传图片（已输入超链接时需同时上传广告图片）
                  </span>
                  <span class="wpRightRedTips1" v-if="warningtype">
                       图片仅支持png、jpeg、ipg、bmp格式
                  </span>                     
                  </FormItem>
              </Col>
              <Col span="11">
                  <FormItem label="超链接1：" prop="advertPics[0]">
                      <Input v-model="picHyperlink0" :maxlength='300' :show-word-limit='true' :clearable='true'></Input>
                  </FormItem>
              </Col>
              </Row>
              <Row>  
              <Col span="10">
                  <FormItem label="广告图片2：" prop="advertPics[1]" >
                  <div style="display: flex;width:202px;height:75px;">
                  <div class="demo-upload-list" v-show="!imagehidden2">
                        <template >
                            <img :src="this.defaultList[1].url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="handleRemove2()"></Icon>
                            </div>
                        </template>
                    </div>
                    <Upload
                        ref ="upload2"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess2"
                        :accept='acept'
                        :format="['png','jpg','jpeg','bmp']"
                        :data="loadImgType"
                        :max-size="1024"
                        :on-exceeded-size="handleMaxSize2"
                        :before-upload="handleBeforeUpload2"
                        :on-format-error="handleFormatError2"
                        type="drag"
                        :action="loadImg"
                        style="display: inline-block;"
                        v-show='imagehidden2'>
                        <div style="width: 202px;height:75px;line-height: 20px;padding-top:20px;background:#FAFAFA;">
                            <Icon type="ios-cloud-upload-outline" size="20" ></Icon>
                            <p>上传图片</p>
                        </div>
                    </Upload>
                  </div>
                  <span class="wpRightRedTips1" v-if="warningsize2">
                    广告图片不能大于1M  
                  </span>
                  </span> 
                  <span class="wpRightRedTips1" v-if="warningwidth2">
                    请选择高宽比125*335的图片  
                  </span>
                  <span class="wpRightRedTips1" v-if="warningpic2">
                       请上传图片（已输入超链接时需同时上传广告图片）
                  </span>
                   <span class="wpRightRedTips1" v-if="warningtype2">
                       图片仅支持png、jpeg、ipg、bmp格式
                  </span>    
                  </FormItem>
              </Col>
              <Col span="11">
                  <FormItem label="超链接2：" prop="advertPics[1]" >
                      <Input v-model="picHyperlink1":maxlength='300' :show-word-limit='true' :clearable='true'/>                    
                  </FormItem>
              </Col>
              </Row>
              <Col span="22">
                  <div>
                  <span class="wpRightRedTips2">
                       提示：广告图片不能大于1M，图片仅支持png、jpeg、ipg、bmp格式，高宽比为125*335。
                  </span>
                  </div>
              </Col>
              <br><br>                           
              <Col span="22">
                  <div align="center">
                      <Button @click="btnSaveBefore('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;">保存</Button>
                      <Button @click="btnCancle" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">取消</Button>
                      <!--<Button @click="confirm" type="ghost" style="margin:0 11px; height: 40px; width: 100px;" v-show="buttonDel">删除</Button>-->
                  </div>
              </Col>
          </Form>
          </Row>
      </Card>

    </div>              
</template>

<script>
  import app from "@/config/app"
  import { uploadUrl,picurlpath } from '@/util/utils'
  export default {
    data () {
      return {
        acept:'.jpeg,.png,.jpg,.bmp',
        warningtype:false,
        warningtype2:false,
        adid:'',
        buttonDel:false,
        imagehidden:true,
        imagehidden2:true,
        warningsize:false,
        warningwidth:false,
        warningsize2:false,
        warningwidth2:false,
        warningpic:false,
        warningpic2:false,
        loadImg: uploadUrl + app.url.server + this.$services.backendService.fileRestController.upload.url,
        loadImgType: {attachTypeCode: ''},
        picHyperlink0:"",
        picHyperlink1:"",
        editFormSave:{},
        editForm: {
          advertContent:'',
          regionNo:'000000',
          advertPics:
            [{
                advertId:'',
                picHyperlink:'',
                picUrl:''
            },
            {
                advertId:'',
                picHyperlink:'',
                picUrl:''
            }]},
        //新增
        defaultList:[{
                url: '',
                name:''
                     },
                {
                url: '',
                name:''
                     }     

                ],
        imgName: '',
        visible: false,
        ruleValidate: {
                    advertContent: [
                        { required: true, min: 1,message: '请输入提示语', trigger: 'blur' }
                    ],
                  }

    }
    },

    mounted (){
      this.init()
    },
    computed: {
        },
    methods:{
      init () {

        this.$net.send({
            server: this.$services.backendService.advertRestController.getAdvert,
            append:'000000'
          }).then(
            (data)=>{
              if(data.data){
                this.editFormSave = {...data.data}
                this.editForm =this.deepClone(this.editFormSave)
                this.picHyperlink0 = this.deepClone(this.editFormSave.advertPics[0].picHyperlink)
                this.picHyperlink1 = this.deepClone(this.editFormSave.advertPics[1].picHyperlink)

                this.defaultList[0].url = data.data.advertPics[0].picUrl == null?null:picurlpath + this.deepClone(this.editFormSave.advertPics[0].picUrl)
                this.defaultList[1].url = data.data.advertPics[1].picUrl == null?null: picurlpath + this.deepClone(this.editFormSave.advertPics[1].picUrl)  
                this.editForm.advertPics[0].picUrl?this.imagehidden = false:this.imagehidden = true
                this.editForm.advertPics[1].picUrl?this.imagehidden2 = false:this.imagehidden2 = true
                this.buttonDel = true
              }else{
                this.editForm.advertContent ='工作人员会在1-3个工作日内联系您，请耐心等待。'
                
              }               
            });
      },
      handleView (name) {
                // this.imgName = name.name;
                // this.warningwidth = false;
                // this.visible = true;
      },
      handleRemove () {
          this.warningtype = false
          this.warningtype2 = false        
          this.defaultList[0].url =''
          this.defaultList[0].name =''
          this.editForm.advertPics[0].picUrl = ''
          this.imagehidden = !this.imagehidden

      },
      handleFormatError (file) {

          this.warningtype = true
          this.warningtype2 = false
      },
      handleFormatError2 (file) {

          this.warningtype2 = true
          this.warningtype = false
      
      },
      handleSuccess (res, file) {

          this.warningtype = false
          this.warningtype2 = false
          this.warningsize = false
          this.warningwidth = false
          this.warningwidth2 = false
          if (res.code == 200) {
          this.defaultList[0].url = picurlpath + res.data.uploadPath
          this.editForm.advertPics[0].picUrl = res.data.uploadPath
          this.defaultList[0].name = res.data.saveFileName
          this.imagehidden = !this.imagehidden

          return null
          };
          this.$Message.error({content: res.message});
      },
      handleMaxSize (file) {
          this.warningtype = false
          this.warningtype2 = false
          this.warningwidth = false;
          this.warningsize = true;

      },
      handleBeforeUpload (file) {

           return this.checkImageWH(file);
                
      },
      handleBeforeUpload2 (file) {              

           return this.checkImageWH2(file);
                
      },
      handleMaxSize2 (file) {
          this.warningwidth2 = false;
          this.warningsize2 = true;

      },

      handleRemove2 () {
          this.warningtype2 = false
          this.warningtype = false
          this.defaultList[1].url =''
          this.defaultList[1].name =''
          this.editForm.advertPics[1].picUrl = ''
          this.warningwidth2 = false
          this.imagehidden2 = !this.imagehidden2

      },
      handleSuccess2 (res, file) {
          
          this.warningtype2 = false
          this.warningtype = false
          this.warningsize2 = false
          this.warningwidth2 =false
          
          if (res.code == 200) {
          this.defaultList[1].url = picurlpath + res.data.uploadPath
          this.editForm.advertPics[1].picUrl = res.data.uploadPath
          this.defaultList[1].name = res.data.saveFileName
          this.imagehidden2 = !this.imagehidden2
          return null
          };
          this.$Message.error({content: res.message});
      },
      checkImageWH(file) {

          this.warningtype = true
          this.warningtype2 = false
          this.warningsize = false
          this.warningpic = false
          this.warningwidth =false
          this.warningwidth2 =false
          if (file.type =='image/jpeg'||file.type =='image/jpg'||file.type =='image/png'||file.type =='image/bmp') {
            this.warningtype = false
          };
          
          const imgType = file.type.split("/") 
          this.loadImgType.attachTypeCode = imgType[1]
          let self = this;
          return new Promise(function (resolve, reject) {
              let filereader = new FileReader();
              filereader.onload = e => {
                  let src = e.target.result;
                  const image = new Image();
                  image.onload = function () {
                      if (this.width/this.height ==2.68) {
                          resolve();
                          
                      }else {
                          self.warningwidth = true                        
                          reject();   
                      }
                  };
                  image.onerror = reject;
                  image.src = src;
              };
              filereader.readAsDataURL(file);
          });
      },
      checkImageWH2(file) {

          this.warningtype2 = true
          this.warningtype = false
          this.warningsize = false
          this.warningpic2 = false
          this.warningwidth2 =false
          this.warningwidth =false
          if (file.type =='image/jpeg'||file.type =='image/jpg'||file.type =='image/png'||file.type =='image/bmp') {
              this.warningtype2 = false
          };
          
          const imgType = file.type.split("/") 
          this.loadImgType.attachTypeCode = imgType[1]
          let self = this;
          return new Promise(function (resolve, reject) {
              let filereader = new FileReader();
              filereader.onload = e => {
                  let src = e.target.result;
                  const image = new Image();
                  image.onload = function () {
                      if (this.width/this.height ==2.68) {
                          resolve();
                          
                      }else {
                          self.warningwidth2 = true                       
                          reject();   
                      }
                  };
                  image.onerror = reject;
                  image.src = src;
              };
              filereader.readAsDataURL(file);
          });
        },

      confirm () {
            this.$Modal.confirm({
                title: '确认删除',
                content: '确认删除?',
                onOk: () => {
                  this.btnDel()
                },
                onCancel: () => {
                  this.$Message.info('取消');
                }
            });
      }, 
      // 用户机构保存事件
      btnSaveBefore(name){

            this.warningwidth = false
            this.warningwidth2 =false
            this.warningsize =false
            this.warningsize2 =false

            this.$refs[name].validate((valid) => {
            if (valid) {
            this.warningpic = false
            this.warningpic2 = false
            this.editForm.advertPics[0].picHyperlink = this.deepClone(this.picHyperlink0)
            this.editForm.advertPics[1].picHyperlink = this.deepClone(this.picHyperlink1)

              if (this.picHyperlink0&&(this.defaultList[0].url == '' || this.defaultList[0].url == undefined)) {   
                  this.warningpic = true
                    return null         
              };
              if (this.picHyperlink1&&(this.defaultList[1].url == '' || this.defaultList[1].url == undefined)) {
                  this.warningpic2 = true
                    return null
              };
            this.btnSave ()
              } else {

              return null

              }
            })
      },
      btnSave () {

            this.resetAllFlag() //先把所有告警注释掉避免保存失败无操作清除

            this.editForm.advertPics[0].picHyperlink = this.picHyperlink0?this.deepClone(this.picHyperlink0):''
            this.editForm.advertPics[1].picHyperlink =this.picHyperlink1?this.deepClone(this.picHyperlink1):''

            if(this.editForm.id){
              
              this.$net.send({
                  server: this.$services.backendService.advertRestController.updateAdvert,
                  data: this.editForm
              }).then(
                  (data)=>{
                      if (data.success) {
                        this.editFormSave =this.deepClone(this.editForm)
                        this.$Message.info({content: '修改成功！'});
                        this.buttonDel = true
                        }else{

                        this.$Message.error({content: '修改失败！'});

                        }
                  })            
            }else{
              this.$net.send({
                  server: this.$services.backendService.advertRestController.saveAdvert,
                  data: this.editForm
              }).then(
                (data)=>{
                  if (data.success) {  

                      this.$Message.info({content: '保存成功！'});
                      this.editFormSave = {...data.data}
                      this.editForm =this.deepClone(this.editFormSave)
                      this.buttonDel = true

                    }else{

                      this.$Message.error({content: '保存失败！'});
                    }
                }
              );
            }
      },
      //删除，默认区域不存在删除
      btnDel () {
         const adid = this.editFormSave.id            
         this.$net.send({
            server: this.$services.backendService.advertRestController.deleteAdvert,
            append:adid
          }).then(
            (data)=>{
              if (data.success) {
                  this.$Message.info({content: '已删除'});
                  this.buttonDel = false
                  this.editFormSave = {}
                  this.resetAllNone()
                  this.resetAllFlag()
                  
                }else{

                  this.$Message.error({content: '删除失败'});

                }
          });           
 
      },
      btnCancle () {
        this.resetAllFlag()       
        if(this.editFormSave.id){

          this.editForm = this.deepClone(this.editFormSave)
          this.picHyperlink0 = this.deepClone(this.editFormSave.advertPics[0].picHyperlink)
          this.picHyperlink1 = this.deepClone(this.editFormSave.advertPics[1].picHyperlink)
          this.defaultList[0].url = picurlpath + this.deepClone(this.editFormSave.advertPics[0].picUrl)
          this.defaultList[1].url = picurlpath + this.deepClone(this.editFormSave.advertPics[1].picUrl)
          this.editFormSave.advertPics[0].picUrl?this.imagehidden = false:this.imagehidden = true
          this.editFormSave.advertPics[1].picUrl?this.imagehidden2 = false:this.imagehidden2 = true

        }else{
               
          this.resetAllNone()
          

        }             
              
      },
      //深拷贝，避免对象深层只覆盖地址而非值
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
      //重置告警（部分）
      resetAllFlag(){

          let vm = this
          vm.warningtype = false
          vm.warningtype2 = false
          vm.warningwidth =false
          vm.warningwidth2 =false
          vm.warningsize = false
          vm.warningsize2 = false
          vm.warningpic = false
          vm.warningpic2 = false
      },
      //未保存空取消或删除重置
      resetAllNone(){
          let vm = this
          vm.editForm = {}
            vm.editForm = {
              'advertContent':'',
              'regionNo':'000000',
              'advertPics':
                [{
                    'advertId':'',
                    'picHyperlink':'',
                    'picUrl':''
                },
                {
                    'advertId':'',
                    'picHyperlink':'',
                    'picUrl':''
            }]},
            
            vm.defaultList[0].url=''
            vm.defaultList[1].url=''
            vm.picHyperlink0=''
            vm.picHyperlink1=''
            vm.imagehidden = true
            vm.imagehidden2 = true
      },


        }
      }
</script>


<style scoped>
    .layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
    .wpRightRedTips1 {
    width: 285px;
  position: absolute;
  left: 12px;
  font-size: 12px;
  color: #ed3f14;
    }
.wpRightRedTips2 {
  position: absolute;
  left: 100px;
  font-size: 12px;
  color: #ed3f14;
    }
/*     新增css */

    .demo-upload-list{
        display: inline-block;
        width: 202px;
        height: 75px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        width: 202px;
        height:75px;
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    } 
      
</style>









