let enable = true; //总开关
let isRun = false
// const Com = ecodeSDK.getAsyncCom(acParams);

ecodeSDK.overwritePropsFnQueueMapSet('WeaReqTop',{
    fn:(newProps,name)=>{
        if(!enable) return ;
        //console.log("aaa",ecodeSDK.checkLPath('/spa/workflow/static4form/index.html'));
        if(ecodeSDK.checkLPath('/spa/workflow/static4form/index.html')) {
            const baseInfo = WfForm.getBaseInfo();
            const nodetype = jQuery("#nodetype").val();
            if((baseInfo.workflowid!==10521&&baseInfo.workflowid!==24523&&baseInfo.workflowid!==28021&&baseInfo.workflowid!==31521)||(baseInfo.nodeid!==33531&&baseInfo.nodeid!==14028&&baseInfo.nodeid!==30030&&baseInfo.nodeid!==30525&&baseInfo.nodeid!==37529&&baseInfo.nodeid!==37530&&baseInfo.nodeid!==37529&&baseInfo.nodeid!==35024)) return ;
//      console.log("nodetype",nodetype);
//      console.log("nodetype",nodetype==0);
            const {Button} = antd;
            const acParams = {
                appId:'${appId}',
                name:'NewReqTopButtonCom', //模块名称
                isPage:false, //是否是路由页面
                noCss:true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
            }
            //异步加载模块${appId}下的子模块NewTopCom
            //注意新增一个按钮需要更改三处，分别是（1）右上角的按钮、（2）右上角下拉之后显示的按钮、（3）右键菜单的按钮
            //其中右键菜单的按钮见WeaRightMenu的复写案例
            //（1）右上角的按钮
            const Com = ecodeSDK.getAsyncCom(acParams);
            //下面放开会导致按钮有的话里面缺东西
            // if(isRun) return;
            const runSript = ()=>{

                // const Com = ecodeSDK.getAsyncCom(acParams);
                newProps.buttons.push(
                    <span>
          <Button title="发送公文" className= "ant-btn-primary"onClick={()=>{
              let instance = ecodeSDK.getCom('${appId}','NewReqTopButtonComInstance');
              instance && instance.triggerModal(true);
          }}>发送公文</Button>
                        {window.comsMobx?Com:""}
        </span>
                );
                //判断一下comsMobx是否存在，再加载组件，避免预加载时无comsMobx导致报错

                //（2）右上角下拉之后显示的按钮
                newProps.dropMenuDatas.push({
                    key: 'BTN_NEWBUTTON',
                    icon: null,
                    content: '发送公文',
                    onClick: ()=>{
                        let instance = ecodeSDK.getCom('${appId}','NewReqTopButtonComInstance');
                        instance && instance.triggerModal(true);
                    },
                    disabled:false
                });
                isRun=true
            }
            runSript()

            console.log('WeaReqTop newProps:',newProps);
            return newProps;
        }
    },
    order:2,
    desc:'增加一个叫发送公文的按钮'
});

ecodeSDK.overwritePropsFnQueueMapSet('WeaRightMenu',{
    fn:(newProps,name)=>{

        //   console.log("csa_newProps:",newProps);
        if(ecodeSDK.checkLPath('/spa/workflow/index_form.jsp#/main/workflow/req')) {
            const baseInfo = WfForm.getBaseInfo();
            if(baseInfo.workflowid!==11021) return ;
            const {Button} = antd;
            //（3）右键菜单的按钮
            newProps.datas.push({
                key: 'BTN_NEWBUTTON',
                icon: null,
                content: '发送公文',
                onClick: ()=>{
                    let instance = ecodeSDK.getCom('${appId}','NewReqTopButtonComInstance');
                    instance && instance.triggerModal(true);
                },
                disabled:false
            });
            return newProps;
        }
    },
    order:3,
    desc:'增加一个叫发送公文的按钮'
});

/*
版本要求：kb1906以上
如何在表单上调用：
var instance = ecodeSDK.getCom('886b80277dc94221b4cf6747b7e1b910','NewReqTopButtonComInstance');
if(instance) {
	instance.triggerModal(false);
}
*/