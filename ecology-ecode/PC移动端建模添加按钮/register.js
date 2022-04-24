let enable = true; //总开关
let isRun = false;

$(document).ready(function(){

});

// 企查查参数
let aes_key = "jIMSui6A6zsTu2m00qHGEQ==";
let aes_iv = "8jnfx27m7wlyqkai"; // 公司密钥截取前16位小写
let loginName = "18602002554";
let role = "staff";
let name = "";
let email = "";

// ------------------------------------------PC端表单页面
const showDialog = (workflowid)=>{
    var fieldidkhqc = "";
    var khqcValue = "";
    if(WfForm){
        // 流程表单
        if(workflowid == 141 || workflowid == 243){
            // 客户建档申请、代发-客户建档
            fieldidkhqc = WfForm.convertFieldNameToId("khqc");
        }else if(workflowid == 200){
            // 合同审批
            fieldidkhqc = WfForm.convertFieldNameToId("dfqygs");
        }else if(workflowid == 48){
            // 供应商建档
            fieldidkhqc = WfForm.convertFieldNameToId("gysmc");
        }
    }
    khqcValue = WfForm.getFieldValue(fieldidkhqc);
    if(khqcValue === ""){
        alert("客户全称为空，请检查");
    }else{
        ecCom.WeaTools.callApi('/api/qccApi/gentoken', 'GET',
            {aes_key:aes_key,aes_iv:aes_iv,loginName:loginName,role:role,name:name,email:email}
        ).then(data=> {
            // console.log("data",data);
            if(data.code==="200"){
                let tokenencode = encodeURIComponent(data.token);
                var url = "https://pro-plugin.qcc.com/plugin-login?key=c69ea923dd6d11eb990b0c42a106ce72&token="+tokenencode+"&returnUrl=/company-gateway?keyword="+khqcValue+""
                console.log(url);
                window.open(url);
            }else if(data.code === "500"){
                alert("token生成错误，请联系管理员，errormsg："+data.msg);
            }
        });
    }

    // let token = "Ha5s4o6wBjLlg7frFllDVKtzRx3AoqPvHMzAGMtcK3lhtHV89X/pKSgG300+sdGcjfNyByBolkEF7H1p/ZI8yBXQyxTRV6NxI3e+U5rhtlLUdoOsRWhBzrn3vIVb84Jmstqnyq4U/Fw0khdRiIMqIw==";
    // let tokenencode = encodeURIComponent(token);
    // var url = "https://pro-plugin.qcc.com/plugin-login?key=c69ea923dd6d11eb990b0c42a106ce72&token=Ha5s4o6wBjLlg7frFllDVKtzRx3AoqPvHMzAGMtcK3lhtHV89X%2FpKSgG300%2BsdGcjfNyByBolkEF7H1p%2FZI8yNwfKFS%2FPahpeJAcm3ohzllhTKHddUtuel5UcZwQ%2FoDmETtNLzu2oUOWeR3OS9V74w%3D%3D&returnUrl=/company-gateway?keyword="+khqcValue+"";
    // if(khqcValue === ''){
    //   alert("客户全称为空，请检查");
    // }else{
    //   console.log(url);
    //   window.open(url);
    // }

}

// PC端流程表单增加企业查询按钮
ecodeSDK.overwritePropsFnQueueMapSet('WeaReqTop',{
    fn:(newProps,name)=>{
        if(!enable) return;
        if(ecodeSDK.checkLPath('/spa/workflow/static4form/index.html')) {
            const baseInfo = WfForm.getBaseInfo();
            // 客户建档申请、代发-客户建档、合同审批、供应商建档
            if((baseInfo.workflowid !== 141 && baseInfo.workflowid !== 243
                && baseInfo.workflowid !== 200 && baseInfo.workflowid !== 48)) return;
            if(newProps.children) {
                const {Button} = antd;
                newProps.buttons.unshift(
                    <span>
                    <Button type="primary" onClick={()=>{
                        showDialog(baseInfo.workflowid);
                    }}>企业查询</Button>
                  </span>
                );
                // primary  ghost

                //（2）右上角下拉之后显示的按钮
                // newProps.dropMenuDatas.push({
                //   key: 'BTN_NEWBUTTON',
                //   icon: null,
                //   content: '测试111',
                //   onClick: ()=>{
                //     showDialog();
                //   },
                //   disabled:false
                // });

                const acParams = {
                    appId:'${appId}', //appId会自动识别
                    name:'NewReqTopButtonCom', //模块名称
                    isPage:true, //是否是路由页面
                    noCss:true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
                }
                const Com = ecodeSDK.getAsyncCom(acParams);
                newProps.children.push(<Com />);
                return newProps;
            }
        }
    },
    order:1,
    desc:'PC端流程表单增加企业查询按钮'
});

// ------------------------------------------PC端建模页面
const showMode = (customid)=>{
    var fieldidkhqc = "";
    var khqcValue = "";
    if(ModeForm){
        // 建模页面
        if(customid == 6){
            // 客户档案
            fieldidkhqc = ModeForm.convertFieldNameToId("qyqc");
        }else if(customid == 7){
            // 供应商档案
            fieldidkhqc = ModeForm.convertFieldNameToId("gysmc");
        }
    }
    khqcValue = ModeForm.getFieldValue(fieldidkhqc);
    if(khqcValue == "" && customid == 6){
        alert("客户全称为空，请检查");
    }else if(khqcValue == "" && customid == 7){
        alert("供应商名称为空，请检查");
    }else{
        ecCom.WeaTools.callApi('/api/qccApi/gentoken', 'GET',
            {aes_key:aes_key,aes_iv:aes_iv,loginName:loginName,role:role,name:name,email:email}
        ).then(data=> {
            // console.log("data",data);
            if(data.code==="200"){
                let tokenencode = encodeURIComponent(data.token);
                var url = "https://pro-plugin.qcc.com/plugin-login?key=c69ea923dd6d11eb990b0c42a106ce72&token="+tokenencode+"&returnUrl=/company-gateway?keyword="+khqcValue+""
                console.log(url);
                window.open(url);
            }else if(data.code === "500"){
                alert("token生成错误，请联系管理员，errormsg："+data.msg);
            }
        });
    }

    // let token = "Ha5s4o6wBjLlg7frFllDVKtzRx3AoqPvHMzAGMtcK3lhtHV89X/pKSgG300+sdGcjfNyByBolkEF7H1p/ZI8yBXQyxTRV6NxI3e+U5rhtlLUdoOsRWhBzrn3vIVb84Jmstqnyq4U/Fw0khdRiIMqIw==";
    // let tokenencode = encodeURIComponent(token);
    // var url = "https://pro-plugin.qcc.com/plugin-login?key=c69ea923dd6d11eb990b0c42a106ce72&token=Ha5s4o6wBjLlg7frFllDVKtzRx3AoqPvHMzAGMtcK3lhtHV89X%2FpKSgG300%2BsdGcjfNyByBolkEF7H1p%2FZI8yNwfKFS%2FPahpeJAcm3ohzllhTKHddUtuel5UcZwQ%2FoDmETtNLzu2oUOWeR3OS9V74w%3D%3D&returnUrl=/company-gateway?keyword="+khqcValue+"";
    // if(khqcValue === ''){
    //   alert("客户全称为空，请检查");
    // }else{
    //   console.log(url);
    //   window.open(url);
    // }

}

// PC端建模页面增加企业查询按钮
ecodeSDK.overwritePropsFnQueueMapSet('WeaReqTop',{
    fn:(newProps,name)=>{
        if(!enable) return;
        if (!ecodeSDK.checkLPath('/spa/cube/index.html#/main/cube/card')) return;
        if (!ModeForm) return;
        const baseInfo = ModeForm.getCardUrlInfo();
        // console.log(baseInfo);
        // 客户档案、供应商档案
        if(!baseInfo || baseInfo.customid !== "6" && baseInfo.customid !== "7") return;
        // console.log(newProps);
        if(newProps.children && newProps.buttons.length < 2 ) {
            const {Button} = antd;
            newProps.buttons.unshift(
                <span>
                    <Button type="primary" onClick={()=>{
                        showMode(baseInfo.customid);
                    }}>企业查询</Button>
                  </span>
            );
            // }
            return newProps;
        }

    },
    order:1,
    desc:'PC端流程表单增加企业查询按钮'
});


// ------------------------------------------移动端表单
// 切换EM底部按钮为H5模式: 思路是修改流程表单globalStore中的数据em_showBottomToolBar，为true的时候使用的EM自带的按钮组
const hiddenEmBtn = function() {
    const isEmobile = window.WeaverMobile.Tools.mobileDetect().isEmobile();
    if (isEmobile && window.em) {
        const { toJS } = mobx;
        const globalStore = WfForm.getGlobalStore();
        if (globalStore) {
            let { variableMap, controlVariableMap } = globalStore;
            variableMap = toJS(variableMap);
            const { em_showBottomToolBar } = variableMap;
            if (em_showBottomToolBar) {
                controlVariableMap('em_showBottomToolBar', false); //为true的时候使用的EM自带的按钮组
            }
        }
        isRun = true;
    }
}

ecodeSDK.overwriteMobilePropsFnQueueMapSet('TabPage', {
    fn: (newProps) => {
        if (!enable) return;
        if (isRun) return;
        if (!ecodeSDK.checkLPath('/spa/workflow/static4mobileform/index.html#/req')) return;
        if (!WfForm) return;
        const { toJS } = mobx;
        const baseInfo = WfForm.getBaseInfo();
        if (!baseInfo || baseInfo.workflowid !== 141 && baseInfo.workflowid !== 243
            && baseInfo.workflowid !== 200 && baseInfo.workflowid !== 48) return;
        if (window.em && window.em.checkJsApi && window.em.checkJsApi('hideBottomToolBar') ) {
            hiddenEmBtn();
            return;
        }
    }
})

function openqcc(){
    if(WfForm){
        const baseInfo = WfForm.getBaseInfo();
        var fieldidkhqc = "";
        var khqcValue = "";
        // 客户建档申请、代发-客户建档
        if(baseInfo.workflowid == 141 || baseInfo.workflowid == 243){
            fieldidkhqc = WfForm.convertFieldNameToId("khqc");
        }else if(baseInfo.workflowid == 200){
            // 合同审批
            fieldidkhqc = WfForm.convertFieldNameToId("dfqygs");
        }else if(baseInfo.workflowid == 48){
            // 供应商建档
            fieldidkhqc = WfForm.convertFieldNameToId("gysmc");
        }
        khqcValue = WfForm.getFieldValue(fieldidkhqc);
        if(khqcValue === ""){
            // WfForm.showMessage("客户全称为空，请检查");
            alert("客户全称为空，请检查");
        }else{
            jQuery.ajax({
                type: "GET",
                url: "/api/qccApi/gentoken",
                data:{aes_key:aes_key,aes_iv:aes_iv,loginName:loginName,role:role,name:name,email:email},
                async: false,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if(data.code === "200"){
                        let tokenencode = encodeURIComponent(data.token);
                        var url = "https://pro-h5.qcc.com/plugin-login?key=c69ea923dd6d11eb990b0c42a106ce72&token="+tokenencode+"&returnUrl=/company-gateway?keyword="+khqcValue+""
                        console.log(url);
                        window.showHoverWindow(url);
                    }else if(data.code === "500"){
                        // WfForm.showMessage("token生成错误，请联系管理员，errormsg："+data.msg);
                        alert("token生成错误，请联系管理员，errormsg："+data.msg);
                    }
                },
                error:function(e){
                    //请求出错处理
                    console.log(e);
                }
            });
        }
    }

    // let token = "Ha5s4o6wBjLlg7frFllDVKtzRx3AoqPvHMzAGMtcK3lhtHV89X/pKSgG300+sdGcjfNyByBolkEF7H1p/ZI8yBXQyxTRV6NxI3e+U5rhtlLUdoOsRWhBzrn3vIVb84Jmstqnyq4U/Fw0khdRiIMqIw==";
    // let tokenencode = encodeURIComponent(token);
    // var url = "https://pro-h5.qcc.com/plugin-login?key=c69ea923dd6d11eb990b0c42a106ce72&token="+tokenencode+"&returnUrl=/company-gateway?keyword=小米";
    // window.showHoverWindow(url);
}

// 移动端流程表单增加企业查询按钮
ecodeSDK.overwriteMobilePropsFnQueueMapSet('Flex', {
    fn: (newProps) => {
        if (!enable) return;
        if (!ecodeSDK.checkLPath('/spa/workflow/static4mobileform/index.html#/req')) return;
        if (!WfForm) return;
        const baseInfo = WfForm.getBaseInfo();
        if (!baseInfo || baseInfo.workflowid !== 141 && baseInfo.workflowid !== 243
            && baseInfo.workflowid !== 200 && baseInfo.workflowid !== 48) return;
        // console.log(newProps);
        if(newProps.children){
            if(newProps.className === "wf-bottomOperate-container"){
                if(newProps.children[0].props.btntype !== "remark"){
                    // 签字意见显示
                    newProps.children.splice(2, 0, <div id="qycx" className="qycx" onClick={()=>{openqcc()}}>企业查询</div>);
                }else{
                    newProps.children.splice(3, 0, <div id="qycx" className="qycx" onClick={()=>{openqcc()}}>企业查询</div>);
                }
            }
        }
    },
    order:1,
    desc:'移动端流程表单增加企业查询按钮'
});

/*
版本要求：kb1906以上
如何在表单上调用：
var instance = ecodeSDK.getCom('886b80277dc94221b4cf6747b7e1b910','NewReqTopButtonComInstance');
if(instance) {
	instance.triggerModal(false);
}
*/
