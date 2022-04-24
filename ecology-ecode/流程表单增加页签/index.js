const { Button,Table,Input} = antd;
const { WeaTable,WeaDialog,WeaTextarea,WeaBrowser } = ecCom;

//react组件层，用来定义视图和交互
//inject获取baseFormStore到组件props中
//observer来支持集成mobx
class WorkflowSimple extends React.Component {
    constructor(props) { //初始化，固定语法
        super(props);
        let requestName = WfForm.getFieldValue("field-1");
        let djdw = WfForm.getBrowserShowName(WfForm.convertFieldNameToId("djdw"));
        let djbm = WfForm.getBrowserShowName(WfForm.convertFieldNameToId("djbm"));
        this.state = {
            fsnr : "您好，已发《"+requestName+"》，请及时登录增城数字政府集约化办公系统进行处理。（"+djdw+djbm+"）",
            dataSource:[],
            pageNum : 15,
            selectedRowKeys:[],
            getdatas:[],
            total:0,
            visible:false,
            loading:false,
            title:"短信催办",
            currentPage:1,
            cshm:"",
            columns : [{
                title:'接收单位',
                dataIndex: 'jsdw',
                key: 'jsdw',
                width: "12%",
            }, {
                title: '接收时间',
                dataIndex: 'receivetime',
                key: 'receivetime',
                width: "13%",
            }, {
                title: '操作状态',
                dataIndex: 'czstate',
                key: 'czstate',
                width: "12%",
            }, {
                title: '操作时间',
                dataIndex: 'operatetime',
                key: 'operatetime',
                width: "13%",
            }, {
                title: '交换状态',
                dataIndex: 'state',
                key: 'state',
                width: "12%",
            }, {
                title: '签收/拒收人',
                dataIndex: 'qsdw',
                key: 'qsdw',
                width: "12%",
            }, {
                title: '签收/拒收时间',
                dataIndex: 'qssj',
                key: 'qssj',
                width: "13%",
            }, {
                title: '单位联系人',
                dataIndex: 'dwlxr',
                key: 'dwlxr',
                width: "13%",
            }]
        };
    }
    componentWillUnmount() {
    }
    //CSX 初始化调用
    componentWillMount(){
        this.getDataList();
    }
    getDataList(){
        const baseInfo = WfForm.getBaseInfo();
        let datas = [];
        $.ajax({
            async : false,
            type : "get",
            url : "/api/workflow/zcqzf/csa/getExchangeInfo",
            data : {
                "requestid" : baseInfo.requestid,
                "fslx" : 1
            },
            dataType : 'json',
            success : function(data) {
                datas = data;
            }
        });
        // console.log("data",datas.length);
        this.dataSource = datas;
        this.total = datas.length;
    }
    expExcel(){
        const baseInfo = WfForm.getBaseInfo();
        let requestid = baseInfo.requestid ;
        window.ecCom.WeaTools.callApi('/api/workflow/zcqzf/csa/GetExchangingInfo/expExcel', 'POST', {requestid : requestid,fslx:1}).then(data=> {
            //console.log("data",data);
            if(data.code === "0"){
                window.open("/filesystem/downloadBatch/" + data.result, '_blank');
            }else{
                alert(data.msg);
            }
        })
    }
    getdataJson(selectKey){
        let jsdwids = "";
        selectKey.map((item,index) =>
            jsdwids += (jsdwids==="") ? item.jsdwid : ","+item.jsdwid

        );

        // console.log('selectKey: ', selectKey);
        // console.log('selectKey: ', jsdwids);
        var datajson ;
        $.ajax({
            async : false,
            type : "get",
            url : "/api/workflow/zcqzf/csa/getLxrDatas",
            data : {
                "subids" : jsdwids
            },
            dataType : 'json',
            success : function(data) {
                //  console.log("data",data);
                datajson = data;
            }
        });
        return datajson ;
    }
    send_sdmbdata(selectKey,fsnr,cshm){
        const baseInfo = WfForm.getBaseInfo();
        let jsdwids = "";
        selectKey.map((item,index) =>
            jsdwids += (jsdwids==="") ? item.jsdwid : ","+item.jsdwid

        );
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
        //  alert("selectKey11111"+selectKey);
        //  console.log("selectKey11111",selectKey);
        ecCom.WeaLoadingGlobal.start();
        window.ecCom.WeaTools.callApi('/api/workflow/zcqzf/csa/sendUrge', 'GET', {requestid: baseInfo.requestid,jsdwids : jsdwids,fsnr : fsnr,cshm:cshm}).then(data=> {
            //console.log("data",data);
            if(data.state==="1"){
                alert("发送短信成功！");
            }else{
                alert("发送短信失败，请联系系统管理员！报错信息:"+data.msg);
            }
            ecCom.WeaLoadingGlobal.end();
            ecCom.WeaLoadingGlobal.destroy();
            this.setState({ visible: false });
        })
    }

    render() { //渲染
        console.log("enter render_发文");
        const { columns,dataSource,pageNum,total,currentPage,selectedRowKeys,loading,visible,title,getdatas,cshm,fsnr } = this.state;
        //CSX 改为确认后调用和初始化时调用
        //this.getDataList();

        let ytj = 0;
        let yck = 0;
        let wck = 0;
        let yqs = 0;
        let yjs = 0;
        this.dataSource.map(function(item, idx){
            if(item.czstate==="已提交"){
                ytj++;
            }
            if (item.czstate==="已查看"){
                yck++;
            }
            if (item.czstate==="未查看"){
                wck++;
            }
            if(item.state==="签收"){
                yqs++;
            }
            if(item.state==="拒收"){
                yjs++;
            }
            //   console.log("测试。。。item="+item+",,,,,,idx="+idx);
        });
        //   console.log("dataSource",this.dataSource);
        const pagination = {
            total: total,
            showQuickJumper: true,
            showTotal: (total) => { return `共${total}条`; },
            pageSize: pageNum,
        };
        let selectKey = selectedRowKeys;
        // 通过 rowSelection 对象表明需要行选择
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                selectKey = selectedRows;
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
        };
        let buttons = [
            <Button type="primary" onClick={()=>{
                //CSX 确认后调用
                this.getDataList();
                this.send_sdmbdata(selectKey,fsnr,cshm);
            }}>确认</Button>,
        ];
        return (

            <div style={{padding:20}}>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => {
                        //  console.log("selectKey222222", selectKey);
                        if(selectKey.length>0){
                            this.setState({ visible: true , getdatas: this.getdataJson(selectKey),selectedRowKeys:selectKey});
                        }else{
                            alert("请勾选需要进行催办的流程");
                        }
                    }}
                    >短信催办</Button>
                    <span>    </span>
                    <Button type="primary" onClick={() => {
                        this.expExcel();
                    }}
                    >导出Excel表</Button>
                    <WeaDialog
                        title={title}
                        style={{width: 800, height: 350}}
                        visible={visible}
                        buttons={buttons}
                        onCancel={() => this.setState({ visible: false })}
                    >

                        <div className = "div1">
                            <table className = "tablety1" >
                                <tr>
                                    <td><span className = "spanty1">联系人：</span></td>
                                    <td>
                      <span id = 'lxr' className = "spanty1 spanty2">
                        <WeaBrowser
                            type={17}
                            className="wea-tag-group"
                            textDecoration={true}
                            inputStyle={{ width: 600 }}
                            viewAttr={1}
                            replaceDatas={getdatas}
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
                    </WeaDialog>
                </div>
                <div class = "content_zdy">
                    <div class = "center_zdy">
                        <div class = "box_zdy">
                            <div><img src="/zcqzf/images/zrs.png"/></div>
                            <div>
                                <p id = "zrc">{this.total}</p>
                                <p>总发送单位</p>
                            </div>
                        </div>
                        <div class = "box_zdy">
                            <div><img src="/zcqzf/images/ytj.png" /></div>
                            <div>
                                <p id = "ytj">{ytj}</p>
                                <p>已提交单位</p>
                            </div>
                        </div>
                        <div class = "box_zdy">
                            <div><img src="/zcqzf/images/yqs.png" /></div>
                            <div>
                                <p id = "wtj">{yqs}</p>
                                <p>已签收单位</p>
                            </div>
                        </div>
                        <div class = "box_zdy">
                            <div><img src="/zcqzf/images/wtj.png" /></div>
                            <div>
                                <p id = "yck">{yjs}</p>
                                <p>已拒收单位</p>
                            </div>
                        </div>
                        <div class = "box_zdy">
                            <div><img  src="/zcqzf/images/wck.png" /></div>
                            <div>
                                <p id = "wck">{wck}</p>
                                <p>未查看单位</p>
                            </div>
                        </div>
                        <div class = "box2_zdy">
                            <div><img  src="/zcqzf/images/yck.png"  /></div>
                            <div>
                                <p id = "wck">{yck}</p>
                                <p>已查看单位</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.dataSource} pagination={false} className = "tablezdy"/>

            </div>
        )
    }
}

//发布模块
ecodeSDK.setCom('${appId}','pageWorkflowSimple',WorkflowSimple);