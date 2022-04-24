const {Button,Row,Col,Input} = antd;
const {WeaDialog,WeaBrowser,WeaInput,WeaTextarea,WeaSelect} = ecCom;
const getLabel = window.ecCom.WeaLocaleProvider.getLabel;
//64
class NewReqTopButtonCom extends React.Component {
    constructor(props) { //初始化，固定语法
        super(props);
        let requestName = WfForm.getFieldValue("field-1");
        // if(""===requestName){
        //   requestName = WfForm.getFieldValue("requestName");
        // }
        let djdw = WfForm.getBrowserShowName(WfForm.convertFieldNameToId("ngdwfb"));
        let djbm = WfForm.getBrowserShowName(WfForm.convertFieldNameToId("ngbm"));
        this.state = {
            title: "发送公文",
            visible: false,
            selectVal:-1,
            selectCPBVal:-1,
            fsdw:"",
            fsnr:"您好，已发《"+requestName+"》，请及时登录增城数字政府集约化办公系统进行处理。（"+djdw+djbm+"）",
            cshm:""
        };
    }
    componentDidMount() {
        ecodeSDK.setCom('${appId}','NewReqTopButtonComInstance',this);
    }
    componentWillUnmount() {
        ecodeSDK.setCom('${appId}','NewReqTopButtonComInstance',null);
    }
    triggerModal(b) {
        this.setState({
            visible:b
        });
    }
    getVisible(){

        return this.state.visible;
    }
    getdataJson(subids){
        var datajson ;

        //  console.log("subids",subids);
        $.ajax({
            async : false,
            type : "get",
            url : "/api/workflow/zcqzf/csa/getLxrDatas",
            data : {
                "subids" : subids
            },
            dataType : 'json',
            success : function(data) {
                //  console.log("data",data);
                datajson = data;
            }
        });
        // console.log("datajson",datajson);
        return datajson ;
    }
    send_sdmbdata(selectVal,fsdw,fsnr,cshm,selectCPBVal){

        const baseInfo = WfForm.getBaseInfo();
        if(selectVal==""){
            alert("是否办结未填！");
            return;
        }
        if(selectCPBVal==""){
            alert("是否发送呈批表未填！");
            return;
        }
        if(fsdw==""){
            alert("收发文单位未填！");
            return;
        }
        if(cshm!==""){
            let cshms = '';
            let isok = 1;
            if(cshm){
                cshms = cshm.split(',').map(list => ({list}));
            }
            cshms.map((i,index) =>{
                var regex = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if(regex.test(i.list)){
                }else{
                    isok=-1;
                    alert("第"+(index+1)+"个手机号码输入有误，请重新输入！");
                }
            })
            if(isok===-1){
                return;
            }
        }
        //alert("发送调试中"+baseInfo.requestid);
        //  console.log("fsdw",fsdw);
        //  console.log("fsnr",fsnr);

        ecCom.WeaLoadingGlobal.start();
        window.ecCom.WeaTools.callApi('/api/workflow/zcqzf/csa/transfer', 'GET', {requestid: baseInfo.requestid,sfbj : selectVal,fsdw : fsdw,fsnr : fsnr,fslx:1,workflowid:baseInfo.workflowid,cshm:cshm,sffscpb:selectCPBVal}).then(data=> {
            console.log("data",data);
            if(data.state==="0"){
                ecCom.WeaLoadingGlobal.end();
                ecCom.WeaLoadingGlobal.destroy();
                let msg = "发送公文操作成功，流程已办结，确认后关闭本页面！\n";
                if(data.msg!=="转办处理成功"){
                    msg+="其中以下短信发送失败："+data.msg;
                }
                alert(msg);
                window.opener=null;
                window.open('','_self');
                window.close();
                this.setState({ visible: false })
            }else if(data.state==="1"){
                ecCom.WeaLoadingGlobal.end();
                ecCom.WeaLoadingGlobal.destroy();
                let msg = "发送公文操作成功，流程不需要办结！\n";
                if(data.msg!=="转办处理成功"){
                    msg+="其中以下短信发送失败："+data.msg;
                }
                alert(msg);
                this.setState({ visible: false })
            }else{
                ecCom.WeaLoadingGlobal.end();
                ecCom.WeaLoadingGlobal.destroy();
                alert("发送公文操作环节出错请联系管理员，出错信息："+data.msg);
                // this.setState({ visible: false })
            }
            // alert('测试是否回到这步~');
            //生成子流程之后再发短信
            window.ecCom.WeaTools.callApi('/api/workflow/zcqzf/csa/2/send', 'GET', {requestid: baseInfo.requestid,fsnr : data.fsnr,cshm:data.cshm}).then(data=> {});
        });
    }

    render() {
        const { title, visible,selectVal,fsdw,fsnr,cshm,selectCPBVal } = this.state;
        let marginBottomValue=16;
        let offset = 4;
        let titlecol = 4;
        let fieldcol = 10;
        const baseInfo2 = WfForm.getBaseInfo();
        let buttons = [
            <Button type="primary" onClick={()=>{
                this.send_sdmbdata(selectVal,fsdw,fsnr,cshm,selectCPBVal);
            }}>确认</Button>,
        ];


        //由于复写的位置放的是按钮，如果使用div可能会影响布局，所以建议使用span
        return (

            <WeaDialog

                title={title}
                style={{width: 800, height: 450}}
                visible={visible}
                buttons={buttons}
                //       bottomLeft="这是左侧添加的额外内容"
                onCancel={() => this.setState({ visible: false })}
            >
                <div className = "div1">
                    <div>
                        <table className = "tablety1">

                            <tr>
                                <td><span className = "spanty1">是否办结:</span></td>
                                <td>
                <span className = "spanty1 spanty2">
                  <WeaSelect
                      options={[
                          {
                              key: "0",
                              selected: false,
                              showname: "办结"
                          },{
                              key: "1",
                              selected: false,
                              showname: "不办结"
                          }
                      ]}
                      viewAttr={3}
                      detailtype={3}

                      onChange={(v,showname)=>{
                          this.setState({ selectVal: v })
                      }}
                  />
              </span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className = "spanty1">是否发送呈批表:</span></td>
                                <td>
                <span className = "spanty1 spanty2">
                  <WeaSelect
                      options={[
                          {
                              key: "0",
                              selected: false,
                              showname: "发送"
                          },{
                              key: "1",
                              selected: false,
                              showname: "不发送"
                          }
                      ]}
                      viewAttr={3}
                      detailtype={3}

                      onChange={(v,showname)=>{
                          this.setState({ selectCPBVal: v })
                      }}
                  />
              </span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className = "spanty1">收发文单位：</span></td>
                                <td>
                <span className = "spanty1 spanty2">
                  <WeaBrowser
                      viewAttr={3}
                      type={194}
                      title={"收发文单位"}
                      tabs={[{isSearch:true,key:'1',name:'按列表',selected:false,showOrder:0,dataParams:{list:'1'}},{isSearch:false,key:'2',name:'组织结构',selected:false,showOrder:0}]}
                      //className="wea-tag-group"
                      textDecoration={true}
                      inputStyle={{ width: 470 }}
                      destDataParams={{ includeParent: 0 }}
                      onChange={(ids, names, datas) =>{
                          this.setState({ fsdw: ids })
                          let getdatas = this.getdataJson(ids);
                          //console.log("getdatas",getdatas);
                          let buttons = <WeaBrowser
                              type={17}
                              textDecoration={true}
                              viewAttr={1}
                              //className="wea-tag-group"
                              inputStyle={{ width: 470 }}
                              replaceDatas={getdatas}
                              isSingle={false}
                          />
                          ReactDOM.render(buttons,
                              document.getElementById('lxr')
                          );

                      }
                      }
                      isSingle={false}
                  />
                </span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className = "spanty1">联系人：</span></td>
                                <td>
                <span id = 'lxr' className = "spanty1 spanty2">
                  <WeaBrowser
                      type={17}
                      //className="wea-tag-group"
                      textDecoration={true}
                      inputStyle={{ width: 470 }}
                      viewAttr={1}
                      replaceDatas={[]}
                      onChange={(ids, names, datas) =>{}
                      }
                      isSingle={false}
                  />
                </span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className = "spanty1">抄送号码：</span></td>
                                <td>
                <span  className = "spanty1 spanty2">
                  <Input  onChange={ (e)=>{this.setState({ cshm: e.target.value });}}/>
                </span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className = "spanty1">短信内容：</span></td>
                                <td>
                 <span className = "spanty1 spanty2">
                  <WeaTextarea
                      id='test1'
                      viewAttr={2}
                      value={`${fsnr}`}
                      minRows={8}
                      onChange={(v)=>{
                          this.setState({ fsnr: v }) //用了这个之后多行文本不能输入
                      }}
                  />
                </span>
                                </td>
                            </tr>
                        </table>

                    </div>
                </div>
                <div className = "beizhu">注：若需发送呈批表，请先点击“打印呈批表”按钮，表单中将生成呈批表并发送至单位。</div>
            </WeaDialog>

        )
    }
}

//发布模块
ecodeSDK.setCom('${appId}','NewReqTopButtonCom',NewReqTopButtonCom);