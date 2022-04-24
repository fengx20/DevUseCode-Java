let enable = true; //总开关
//发文
ecodeSDK.overwritePropsFnQueueMapSet('WeaReqTop',{
    fn:(newProps,name)=>{
        if(!enable) return ;
        if(ecodeSDK.checkLPath('/spa/workflow/static4form/index.html')) {
            const baseInfo = WfForm.getBaseInfo();
            const nodetype = jQuery("#nodetype").val();
            //alert(baseInfo.nodeid);
            // console.log("nodeid",baseInfo.nodeid);
            //if((baseInfo.workflowid!==10521&&baseInfo.workflowid!==24523&&baseInfo.workflowid!==28021)||(baseInfo.nodeid!==33529&&baseInfo.nodeid!==33531&&baseInfo.nodeid!==14028&&baseInfo.nodeid!==14023&&baseInfo.nodeid!==30030&&baseInfo.nodeid!==30525&&baseInfo.nodeid!==30028)) return ;
            if((baseInfo.workflowid!==10521&&baseInfo.workflowid!==24523&&baseInfo.workflowid!==28021)||
                (baseInfo.nodeid!==35021&&baseInfo.nodeid!==35022&&baseInfo.nodeid!==35023&&baseInfo.nodeid!==35024&&baseInfo.nodeid!==35025&&baseInfo.nodeid!==35026&&baseInfo.nodeid!==35027
                    &&baseInfo.nodeid!==14021&&baseInfo.nodeid!==14023&&baseInfo.nodeid!==14027&&baseInfo.nodeid!==14028&&baseInfo.nodeid!==29538
                )) return ;
            const {Button} = antd;
            // newProps.tabDatas.push({
            //   title:"页面内的页签",
            //   key:"newTab1"
            // });
            newProps.tabDatas.push({
                title:"交换信息",
                key:"newTab3"
            });
            //新增页签1
            //当增加的组件比较简单的情况下，可以直接在方法内写组件，切忌不能定义在方法外
            // if(newProps.selectedKey==="newTab1") {
            //   newProps.children.push(<Button>交换信息</Button>)
            // }
            //新增页签2
            //当增加的组件比较复杂的情况下，通过异步方式加载
            if(newProps.selectedKey==="newTab3") {
                const acParams = {
                    appId:'${appId}',
                    name:'pageWorkflowSimple', //模块名称
                    isPage:false, //是否是路由页面
                    noCss:true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
                }
                //异步加载模块${appId}下的子模块pageWorkflowSimple
                newProps.children.push(ecodeSDK.getAsyncCom(acParams));
            }
            return newProps;
        }
    },
    order:3,
    desc:'增加一个交换信息'
});

/*
版本要求：kb1906以上
*/