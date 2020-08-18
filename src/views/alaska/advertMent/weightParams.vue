<template>
  <div class="wpBox">
    <div class="wpLeft">
      <div class="wpLeftTitle">工单区域：</div>
      <div class="wpLeftTreeBox">
        <Tree :data="treeJson"   :render= "renderContent"></Tree>
      </div>
    </div>
    <div class="wpRight">
      <div class="wpRightItem">
      <Card>
          <p slot="title" style="font-weight:normal;" v-cloak>
            配置区域：{{ resDataagencyName }}
          </p>            
          <Row>
          <Form ref="editForm" :model="editForm" :label-width="180" :rules='ruleValidate' >
              <Row>  
              <Col span="23">
                  <FormItem label="提 示 语：" prop="advertContent" required>
                      <Input v-model="editForm.advertContent" type="textarea" :maxlength='50' :show-word-limit='true' ></Input>
                  </FormItem>

              </Col>
              </Row>  
              <Row>                
              <Col span="11" >

                  <FormItem label="广告图片1：" prop="advertPics[0]" >
                  <div style="display: flex;align-content:center;width:202px;height:75px;">
                    <div class="demo-upload-list" v-show="!imagehidden">
                        <template >
                            <img :src="this.defaultList[0].url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                               <!--  <Icon type="ios-eye-outline" @click.native="handleView()"></Icon> -->
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
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        type="drag"
                        :action="loadImg"
                        style="display: inline-block;width:202px;height:75px;"
                        v-show='imagehidden'
                        >
                        <div style="width:202px;height:75px;line-height: 20px;padding-top:20px;background:#FAFAFA;">
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
              <Col span="12">
              <FormItem label="超链接1：" prop="advertPics[0]">
                      <Input v-model="picHyperlink0" :maxlength='300' :show-word-limit='true' :clearable='true'></Input>
                  </FormItem> 
              </Col>
              </Row>
              <Row>  
              <Col span="11">
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
                        type="drag"
                        :action="loadImg"
                        style="display: inline-block;width:202px;height:75px;"
                        v-show='imagehidden2'>
                        <div style="width:202px;height:75px;line-height: 20px;padding-top:20px;background:#FAFAFA;">
                            <Icon type="ios-cloud-upload-outline" size="20"></Icon>
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
              <Col span="12">
                  <FormItem label="超链接2：" prop="advertPics[1]" >
                      <Input v-model="picHyperlink1":maxlength='300' :show-word-limit='true' :clearable='true'/>                    
                  </FormItem>
              </Col>
              <Col span="23">
                  <div>
                  <span class="wpRightRedTips2">
                       提示：广告图片不能大于1M，图片仅支持png、jpeg、ipg、bmp格式，高宽比为125*335。
                  </span>
                  </div>
              </Col>
              </Row>
              <br><br>               
              <Col span="22">
                  <div align="center">
                      <Button @click="btnSaveBefore('editForm')" type="primary" style="margin:0 11px; height: 40px; width: 100px;" v-show="buttonSav">保存</Button>
                      <Button @click="btnCancle" type="ghost" style="margin:0 11px; height: 40px; width: 100px;">取消</Button>
                      <Button @click="confirm" type="ghost" style="margin:0 11px; height: 40px; width: 100px;" v-show="buttonDel">删除</Button>
                  </div>
              </Col>
          </Form>
          </Row>
      </Card>
      </div>
    </div>
  </div>
</template>

<script>
import app from "@/config/app"
import { uploadUrl,picurlpath } from '@/util/utils'
const areaJson = require('@/util/area.json')

export default {
  data () {
    return {
      resDataagencyName:'',
      warningtype:false,
      warningtype2:false,      
      organizationObject: {},
      buttonSav:false,
      pathtitle:'',
      Panpathtitle1:'',
      Panpathtitle2:'',
      pathpalace:'',
      acept:'.png,.jpg,.jpeg,.bmp',
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
        regionNo:this.pathpalace,
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
           }]
      },
        //新增
      defaultList:
         [{
            url: '',
            name:''
            },
            {
            url: '',
            name:''
      }],
      imgName: '',
      visible: false,
      ruleValidate: {
         advertContent: [{ required: true, min: 1,message: '请输入提示语', trigger: 'blur' }],
      },
      treeJson: [], // 区域树数据
      organizationJson: [], // 机构树数据
      areaJson: areaJson, // 省市区级联数据
      areaData: [], // 选择的省市区的值，包括value、label
      orderOrganizationData: [], // 派单机构
      selectedNode: [], // 选中的节点
      editForms: {
         areaValue: []
      },
      treeObject: {}, // 区域树（省市区）的对象，用于根据子级向上搜索父级
      orderOrganizationObject: {}, // 机构数据的对象，用于根据子级向上搜索父级
      regionServer: this.$services.backendService.sysRegionRestController, // 区域服务地址
      organizationServer: this.$services.backendService.organizationRestController // 机构服务地址
      
    }
  },
mounted (){
    // setTimeout(()=>{ that.init() }, 2000);
    this.init()
    },
  methods: {
    init () {
      let vm = this
      vm.orderOrganizationData = [{
        organizationJson: [], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }, {
        organizationJson: [], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }]
      vm.getAllRegionTree()


    },
    renderContent (h, { root, node, data }) {
      let vm = this
        return h('span', {
                    style: {
                        color:data.advertConf=='Y'?'blue':'',
                        cursor:'pointer',
                        display: 'inline-block',
                        width: '100%'
                    },
                    on: {
                                click: () => { vm.selectNode(node.node)}
                            }
                }, [
                    h('span',data.title,{
                    style: {
                        color:'green'
                    }},[

                        h('span', {
                    style: {
                        color:'yellow'
                    }})
                    ])
                ]);
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
        this.warningwidth = false
        this.warningsize = true

      },
      handleBeforeUpload (file) {

        return this.checkImageWH(file);
                
      },
      handleBeforeUpload2 (file) {

        return this.checkImageWH2(file);
                
      },
      handleMaxSize2 (file) {
        this.warningwidth2 = false
        this.warningsize2 = true

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
        const imgType = file.type.split("/") 
        this.loadImgType.attachTypeCode = imgType[1]
        let self = this;

        if (file.type =='image/jpeg'||file.type =='image/jpg'||file.type =='image/png'||file.type =='image/bmp') {
        this.warningtype = false
        };

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
        this.warningsize2 = false
        this.warningpic2 = false
        this.warningwidth2 =false
        this.warningwidth =false
        const imgType = file.type.split("/") 
        this.loadImgType.attachTypeCode = imgType[1]
        let self = this;
        if (file.type =='image/jpeg'||file.type =='image/jpg'||file.type =='image/png'||file.type =='image/bmp') {
        this.warningtype2 = false
        };
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
      // 
      btnSaveBefore(name){
        this.warningwidth = false
        this.warningwidth2 =false
        this.warningsize =false
        this.warningsize2 =false
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.warningpic = false
            this.warningpic2 = false
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

            this.resetAllFlag()

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
                    this.getAllRegionTree ()
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
                        this.getAllRegionTree ()

                      }else{
                        this.$Message.error({content: '保存失败！'});   
                      }
                  }
                );
              }
      },
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
                    this.resetAllNone()
                    this.resetAllFlag()
                    this.getAllRegionTree ()

                  }else{
                    this.$Message.error({content: '删除失败'});
                  }
            });           
 
      },
      btnCancle () {

         this.resetAllFlag() 

          if(this.editFormSave.id){
            this.editForm =this.deepClone(this.editFormSave)
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
              'regionNo':vm.pathpalace,
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
      changeArrayToObject (array) {
          let vm = this
          array.forEach(item => {
            vm.organizationObject[item.value] = item

            if (item.children && item.children.length > 0) {
              vm.changeArrayToObject(item.children)
            }
          })
      },
      getParentName (agencyId) {//获取并分解所有区域码，传入区域码，用父集找
          let vm = this
          if (agencyId) {

            let newOrgName = vm.organizationObject[agencyId] ? vm.organizationObject[agencyId].label : ''
            let oldOrgName = vm.resDataagencyName 
            vm.resDataagencyName = oldOrgName ? `${newOrgName}${oldOrgName}` : newOrgName
            vm.getParentName(vm.organizationObject[agencyId].parentId)
            

          }
        },
    // 获取区域树数据
        getAllRegionTree () {
          let vm = this
          vm.$net.send({
            server: vm.regionServer.getAllRegionTree
          }).then(data => {

            if (data.code === 200) {
              vm.treeJson = data.data

              vm.arrayToObject(vm.treeJson, vm.treeObject, 'regionNo')
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
            let organizationJson = JSON.stringify(data.data)
                organizationJson = organizationJson.replace(/regionNo/g, 'value').replace(/title/g, 'label')
                organizationJson = JSON.parse(organizationJson)
            vm.changeArrayToObject(organizationJson)

          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        },
        // 辅助函数，数组转变对象
        arrayToObject (array, object, key) {
          let vm = this
          array.forEach(item => {
            object[item[key]] = item
            if (item.children && item.children.length > 0) {
              this.arrayToObject(item.children, object, key)
            }
          })
        },

        // 根据区域编号获取权重数据
        getDispatchParams (regionNo) {
          let vm = this
          vm.$net.send({
            server: vm.regionServer.getDispatchParams,
            data: {
              regionNo: regionNo
            }
          }).then(data => {
            if (data.code === 200) {
              let dispatchData = data.data

              // 如果没有权重数据，则显示新增时的样式
              if (dispatchData.length === 0) {
                vm.addNewRegion(true)
                return false
              }

              // 有数据，遍历获取对应数据
              dispatchData.forEach((item, index) => {
                vm.orderOrganizationData.push({
                  organizationJson: [ ...vm.organizationJson ],
                  organizationData: [],
                  organizationValue: [],
                  weight: item.weight
                })
                vm.getParentOrderOrganizationByChild(index, item.orgNo)
              })
            } else {
              vm.$Message.error(`${data.code}:${data.message}`)
            }
          }).catch(error => {
            vm.$Message.error(error.reason)
          })
        },

        // 根据子级机构code，获取父级机构的code和name
        getParentOrderOrganizationByChild (index, childNode) {
          let vm = this
          if (vm.orderOrganizationObject[childNode]) {
            let data = { value: childNode, label: vm.orderOrganizationObject[childNode].label }

            vm.orderOrganizationData[index].organizationData.unshift(data)
            vm.orderOrganizationData[index].organizationValue.unshift(childNode)

            if (vm.orderOrganizationObject[childNode].parentId) {
              vm.getParentOrderOrganizationByChild(index, vm.orderOrganizationObject[childNode].parentId)
            }
          }
        },

        // 选择区域树节点
        selectNode (node) {

          let vm = this
          vm.selectedNode = node
          vm.buttonSav =true

            vm.areaData = []
            vm.editForm.areaValue = []
            vm.orderOrganizationData = []
            vm.getParentRegionByChild(node.regionNo)

          let regionNoPath = node.regionNo

          this.Panpathtitle1 = node.title
          // vm.getAllRegionTree()
          this.querySelect(regionNoPath)


        },
        querySelect(path){
          //重置操作

                let vm = this
                vm.resDataagencyName =''
                vm.getParentName(path)
                this.warninglink1 = false
                this.warninglink2 = false
                this.warningwidth =false
                this.warningwidth2 =false
                this.warningsize = false
                this.warningsize2 = false
                this.warningpic = false
                this.warningpic2 = false

                this.defaultList[0].url =''
                this.defaultList[1].url =''            
                this.pathpalace = path

                this.picHyperlink0 =''
                this.picHyperlink1 =''

                this.imagehidden = true
                this.imagehidden2 = true
                this.$net.send({
                server: this.$services.backendService.advertRestController.getAdvert,
                append: this.pathpalace
              }).then(
                (data)=>{

                  if(data.data){
                    this.editFormSave = {...data.data}
                    this.editForm =this.deepClone(this.editFormSave)
                    this.picHyperlink0 = this.deepClone(this.editFormSave.advertPics[0].picHyperlink)
                    this.picHyperlink1 = this.deepClone(this.editFormSave.advertPics[1].picHyperlink)
                    this.defaultList[0].url = data.data.advertPics[0].picUrl == null?null:picurlpath + this.deepClone(this.editFormSave.advertPics[0].picUrl)
                    this.defaultList[1].url = data.data.advertPics[1].picUrl == null?null:picurlpath + this.deepClone(this.editFormSave.advertPics[1].picUrl)  
                    this.editForm.advertPics[0].picUrl?this.imagehidden = false:this.imagehidden = true
                    this.editForm.advertPics[1].picUrl?this.imagehidden2 = false:this.imagehidden2 = true
                    this.buttonDel = true
                  }else{
                    this.buttonDel = false
                    this.editFormSave = {}
                    this.editForm = {}
                    this.editForm = {

              'advertContent':'',
              'regionNo':this.pathpalace,
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
                    this.defaultList[0].url=''
                    this.defaultList[1].url=''
                    this.picHyperlink0=''
                    this.picHyperlink1=''
                    
                  }                           
                  
                });
        },
        // 根据区域的code查找父级省市的code和name
        getParentRegionByChild (regionNo) {
          let vm = this
          let data = { value: regionNo, label: vm.treeObject[regionNo].title }

          vm.editForms.areaValue.unshift(regionNo * 1)
          vm.areaData.unshift(data)

          if (vm.treeObject[regionNo].parentId) {
            vm.getParentRegionByChild(vm.treeObject[regionNo].parentId)
          }
        },

        // 获取节点项最上级的区域
        getTopLevelNode (node, regionNo) {
          let vm = this
          if (node.parentId) {
            vm.getTopLevelNode(vm.treeObject[node.parentId], regionNo)
          } else {
            let treeJsonRegionNos = vm.treeJson.map(item => {
              return item.regionNo
            })
            if (!treeJsonRegionNos.includes(node.regionNo)) {
              vm.treeJson.push(node)
              vm.showParentNode(vm.treeJson, regionNo)
            }
          }
        },

        // 展开搜索内容所在的节点的父节点
        showParentNode(nodeList, regionNo) {
          let vm = this
          for (let item of nodeList) {
            if (item.regionNo === regionNo) {
              break
              return
            }

            item.expand = true
            if (item.children && item.children.length > 0) {
              vm.showParentNode(item.children, regionNo)
            }
          }
        },

    // 选择区域

    // 新增机构区域，清空右边的数据，hadSelectedNode:是否有选中节点
    addNewRegion (hadSelectedNode) {
      let vm = this
      vm.areaData = []
      vm.editForms.areaValue = []
      vm.orderOrganizationData = [{
        organizationJson: [ ...vm.organizationJson ], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }, {
        organizationJson: [ ...vm.organizationJson ], // 机构源数据
        organizationValue: [], // 选择的机构的value
        organizationData: [], // 选择的机构的值，包括value、label
        weight: '' // 权重
      }]

      // 如果不是点击省市时，由于没有重置清空右边的数据时，取消选中清空，并将已选数组清空
      // 点击省市时，由于没有重置清空右边的数据时，如果取消选中，就会让人以为选不来，所以区分开来
      if (vm.selectedNode.length > 0 && hadSelectedNode !== true) {
        vm.cancelSelected(vm.treeJson)
        vm.selectedNode = []
      }
    },

    // 递归判断取消选中
    cancelSelected (array) {
      let vm = this
      array.forEach(item => {
        if (item.regionNo === vm.selectedNode[0].regionNo) {
          item.selected = false
        }

        if (item.children && item.children.length > 0) {
          vm.cancelSelected(item.children)
        }
      })
    }

  }
}
</script>

<style scoped>
.wpBox {
  display: flex;
}

.wpLeft {
  width: 300px;
  margin-right: 20px;
  padding: 20px;
  border: 1px solid #ccc;
}
.wpLeftTitle {
  font-weight: 500;
}
.wpLeftSearchBox {
  margin: 20px 0;
}
.wpLeftSearchInputOne {
  margin-right: 10px;
}
.wpLeftSearchBox {
  display: flex;
  justify-content: space-between;
}
.wpLeftTreeBox {
  padding: 5px;
  border: 1px solid #ccc;
}
.wpLeftBtnBox {
  margin-top: 20px;
  text-align: center;
}
.wpLeftBtnItem {
  margin: 0 7px;
}

.wpRight {
  flex-grow: 1;
  border: 1px solid #ccc;
}
.wpRightItem {
  margin-top: 20px;
}
.wpRightItem:first-child {
  margin-top: 0;
}
.wpRightItemRedStar {
  width: 7px;
  margin: 6px 6px 0 0;
  font-size: 20px;
  color: #ed3f14;
}
.wpRightItemSelectBox {
  display: flex;
  align-content: center;
  margin-top: 5px;
}
.wpRightItemSelect {
  width: 430px;
  margin-right: 30px;
}
.wpRightOrganizationBox {
  margin-top: 5px;
}
.wpRightOrganizationItem {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.wpLeftSearchInputTwo {
  width: 100px;
  margin: 0 10px 0 5px;
}
.wpRightOrganizationBtn {
  width: 26px;
  height: 26px;
  margin-left: 20px;
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


.wpRightAddBtnBox {
  margin-left: 13px;
}
.wpRightOtherBtnBox {
  margin: 20px 0 0 130px;
}
.wpRightOtherBtn {
  width: 75px;
  margin: 0 10px;
}
</style>

<style>
.wpInputBorderRed .ivu-input {
  border: 1px solid #ed3f14;
}
.wpRight label {
  margin-bottom: 0;
  font-weight: normal;
}
label {
  font-weight: normal;
}
.layout{
        background-color: #fff;
        padding: 10px;
    }
    .ivu-layout-sider{
        background-color: #fff;
    }
    .wpRightRedTips1 {
      position: absolute;
      left: 12px;
      font-size: 12px;
      color: #ed3f14;
    }

/*     新增css */
    .demo-upload-list{
        display: inline-block;
        width:202px;
        height:75px;
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
        width:202px;
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