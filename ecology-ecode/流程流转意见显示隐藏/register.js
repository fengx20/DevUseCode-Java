//流转意见显示隐藏
var weaQz=false;
var hideorshow="";

var workflowArr = [28021,1];
// 判断流程id

ecodeSDK.overwritePropsFnQueueMapSet('WeaTab',{ //组件名
    fn:(newProps)=>{ //newProps代表组件参数
        const {hash} = window.location;
        if(!hash.startsWith('#/main/workflow/req')) return ; //判断页面地址
        if(!WfForm) return;
        var workflowids = WfForm.getBaseInfo().workflowid;
        // debugger;
        if (!workflowArr.includes(workflowids)) return;
        var workflowid = WfForm.getBaseInfo().workflowid;
        $.ajax({
            url: "/api/ec/common/isWorkflowDoc",
            type: 'get',
            data:{
                "workflowid":workflowid,
            },
            dataType: 'json',
            async: false, // 同步
            success: function (result) {
                // console.log("常用批示语",result);
                if(result.api_status){
                    hideorshow=result.isWorkflowDoc;
                }
            }
        });
        // debugger;
        if(hideorshow!=true) return;
        //其余的显示出来签字意见
        if(!weaQz){
            weaQz=true;
            // console.log("WeaTab",newProps);
            var weaQzyj=window.setInterval(function(){
                if($(".wea-tab>.ant-row").length>0){
                    window.clearInterval(weaQzyj);
                    $(".wf-req-sign-list").hide();
                    $(".wea-tab>.ant-row").append("<div id='qzAn'><button><a>展开详情<i class='icon-coms-up2' /></a></button></div>");
                    $("#qzAn>button>a").unbind("click").click(function(){
                        if($(".wf-req-sign-list").attr("style")&&$(".wf-req-sign-list").attr("style").indexOf("none")!=-1){
                            $(".wf-req-sign-list").show();
                            $("#qzAn>button > a").html("展开详情<i class='icon-coms-down2' />");
                        }else if($(".wf-req-sign-list").attr("style")&&$(".wf-req-sign-list").attr("style").indexOf("none")==-1){
                            $(".wf-req-sign-list").hide();
                            $("#qzAn>button > a").html("展开详情<i class='icon-coms-up2' />");
                        }
                    })
                }
            },100)
        }
    },
    order:1, //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
    desc:'在这里写此复写的作用，在调试的时候方便查找'
});



//签字意见框里放提交等按钮
function tijiao(){
    buttonstop();
}
//保存
function savebuttons(){
    savebutton();
}
var submite=false;
var buttonstop="";
var textbuttons="";
var savebutton="";
var savetext="";
window.tijiao=tijiao;
window.savebuttons=savebuttons;
var rightbuttonp="";
var rightid="";
ecodeSDK.overwritePropsFnQueueMapSet('WeaReqTop',{ //组件名
    fn:(newProp)=>{ //newProps代表组件参数
        const {hash} = window.location;
        if(!hash.startsWith('#/main/workflow/req')) return ; //判断页面地址
        console.log('WeaReqTop:',newProp); //在这里输出日志，如果成功输出代表组件成功定位
        if(newProp.buttons){
            rightid=JSON.parse(window.ecCom.WeaTools.ls.getStr('theme-account')).userid;
            $.ajax({
                url: "/api/ec/common/getUserSecLevel",
                type: 'get',
                data:{
                    "userid":rightid,
                },
                dataType: 'json',
                async: false, // 同步
                success: function (result) {
                    // console.log("常用批示语",result);
                    if(result.api_status){
                        rightbuttonp=result.seclevel;
                    }
                }
            });
            for(var i=0;i<newProp.buttons.length;i++){
                if(newProp.buttons[i].props.title=="提交"
                    ||newProp.buttons[i].props.title=="批准"
                    ||newProp.buttons[i].props.title=="录入确认"
                ){
                    buttonstop=newProp.buttons[i].props.onClick;
                    textbuttons=newProp.buttons[i].props.title;
                }else if(newProp.buttons[i].props.title=="保存"){
                    savebutton=newProp.buttons[i].props.onClick;
                    savetext=newProp.buttons[i].props.title;
                }

            }
            // debugger;
            if(rightbuttonp&&rightbuttonp>=70){
                for(var j=newProp.buttons.length-1;j>=0;j--){
                    if(newProp.buttons[j]&&newProp.buttons[j].props.title=="提交"
                        ||newProp.buttons[j].props.title=="批准"
                        ||newProp.buttons[j].props.title=="录入确认"){
                        newProp.buttons.splice(j,1);
                    }
                    if(newProp.buttons[j]&&newProp.buttons[j].props.title=="保存"){
                        newProp.buttons.splice(j,1);
                    }
                }
            }
        }
    },
    order:1, //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
    desc:'在这里写此复写的作用，在调试的时候方便查找'
});
var seclevel="";
ecodeSDK.overwritePropsFnQueueMapSet('WeaRichText',{ //组件名
    fn:(newProps)=>{ //newProps代表组件参数
        const {hash} = window.location;
        if(!hash.startsWith('#/main/workflow/req')) return ; //判断页面地址
        var userid=JSON.parse(window.ecCom.WeaTools.ls.getStr('theme-account')).userid;
        $.ajax({
            url: "/api/ec/common/getUserSecLevel",
            type: 'get',
            data:{
                "userid":userid,
            },
            dataType: 'json',
            async: false, // 同步
            success: function (result) {
                // console.log("常用批示语",result);
                if(result.api_status){
                    seclevel=result.seclevel;
                }
            }
        });
        // debugger;
        if(seclevel<70) return;
        if($("#sumbimtie").lenth==undefined||$("#sumbimtie").lenth==0){
            if(!submite){
                submite=true;
                var okl=400;
                var sunbm=window.setInterval(function(){
                    okl--;
                    if(okl<=0){
                        window.clearInterval(sunbm);
                    }
                    if($(".wea-rich-text-toolbar-bottom").length>0){
                        window.clearInterval(sunbm);
                        $(".wea-rich-text-toolbar-bottom").append("<button id='sumbimtie' onclick='tijiao();'>"+textbuttons+"</button><button id='savebuttonn' onclick='savebuttons();'>"+savetext+"</button>");
                        // console.log($(".wea-rich-text-toolbar-bottom").find("span").eq(0));
                        // $(".wea-rich-text-toolbar-bottom").find("span").eq(0).before("<div tabindex='0' id='textsign' style='float:left;padding: 4px 8px;cursor: pointer;font-size: 13px;'><i class='icon-coms-Advice' />常用批示语</div>");
                        // $(".wea-rich-text-extents a").each(function(){
                        //     if($(this).text().indexOf("常用批示语")!=-1){
                        //       var _this=$(this);
                        //       _this.find(".wea-cb-item").css("background","transparent");
                        //       _this.find(".wea-cb-item").css("border","none");
                        //       $("#textsign").click(function(e){
                        //         // debugger;
                        //         _this.find(".wea-cb-item").click();
                        //         e.stopPropagation();
                        //       })
                        //       // console.log($(this));
                        //       $(this).find(".wea-cb-item").html("")
                        //       $(this).css("position","inherit");


                        //     }
                        // })
                    }
                },500)
            }
        }
        // var numds=1000;
        // var setnumds=window.setInterval(function(){
        //   numds--;
        //   if(numds<=0){
        //     window.clearInterval(setnumds);
        //   }
        //   if($(".wfphrase-content").length>0){
        //     // window.clearInterval(setnumds);
        //     // console.log($(".wfphrase-content"));
        //     $(".wfphrase-content").css("left","0");
        //     $(".wfphrase-content").css("margin","0");
        //     $(".wfphrase-content").css("top","-15px");
        //     // console.log("111");
        //     if($(".wfphrase-content").find(".triangle_border_nw")&&$(".wfphrase-content").find(".triangle_border_nw").length>0){
        //       $(".wfphrase-content").find(".triangle_border_nw").hide();
        //     }
        //   }
        // },300)
    },
    order:10, //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
    desc:'在这里写此复写的作用，在调试的时候方便查找'
});


var textsign=false;
ecodeSDK.overwritePropsFnQueueMapSet('WeaRichText',{ //组件名
    fn:(newProps)=>{ //newProps代表组件参数
        const {hash} = window.location;
        if(!hash.startsWith('#/main/workflow/req')) return ;
        console.log('WeaRichText:',newProps); //在这里输出日志，如果成功输出代表组件成功定位
        if(!textsign){
            textsign=true;
            var numsign=400;
            var setwindows=window.setInterval(function(){
                numsign--;
                if(numsign<=0){
                    window.clearInterval(setwindows);
                }
                if($(".wea-rich-text-toolbar-bottom").length>0&&$("#textsign").length==0){
                    window.clearInterval(setwindows);
                    $(".wea-rich-text-toolbar-bottom").find("span").eq(0).before("<div tabindex='0' id='textsign' style='float:left;padding: 4px 8px;cursor: pointer;font-size: 16px;'><i class='icon-coms-Advice' />常用批示语</div>");
                    $(".wea-rich-text-extents a").each(function(){
                        if($(this).text().indexOf("常用批示语")!=-1){
                            var _this=$(this);
                            _this.find(".wea-cb-item").css("background","transparent");
                            _this.find(".wea-cb-item").css("border","none");
                            $("#textsign").click(function(e){
                                // debugger;
                                _this.find(".wea-cb-item").click();
                                e.stopPropagation();
                            })
                            // console.log($(this));
                            $(this).find(".wea-cb-item").html("")
                            $(this).css("position","inherit");
                        }
                    })
                    $(".wea-rich-text-toolbar-bottom .wea-rich-text-toolbar-bottom-item ").each(function(){
                        if($(this).text().indexOf("位置")!=-1){
                            $(this).hide();
                        }
                    })
                }
            },500);
            var numds=400;
            var setnumds=window.setInterval(function(){
                numds--;
                if(numds<=0){
                    window.clearInterval(setnumds);
                }
                if($(".wfphrase-content").length>0){
                    // window.clearInterval(setnumds);
                    $(".wfphrase-content").css("left","0");
                    $(".wfphrase-content").css("margin","0");
                    $(".wfphrase-content").css("top","-15px");
                    if($(".wfphrase-content").find(".triangle_border_nw")&&$(".wfphrase-content").find(".triangle_border_nw").length>0){
                        $(".wfphrase-content").find(".triangle_border_nw").hide();
                    }
                }
            },300)
        }
    },
    order:1, //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
    desc:'在这里写此复写的作用，在调试的时候方便查找'
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaLeftTree',{ //组件名
    fn:(newProps)=>{ //newProps代表组件参数
        const {hash} = window.location;
        if(!hash.startsWith('#/main/workflow/listDoing')) return ;
        // console.log('WeaLeftTree:',newProps); //在这里输出日志，如果成功输出代表组件成功定位
        var inputhide=400;
        var setinput=window.setInterval(function(){
            inputhide--;
            if(inputhide<=0){
                window.clearInterval(setinput);
            }
            if($(".wea-left-tree .wea-left-tree-search .wea-input-focus").length>0){
                window.clearInterval(setinput);
                $(".wea-left-tree .wea-left-tree-search .wea-input-focus").hide();
            }
        },300)
    },
    order:1, //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
    desc:'在这里写此复写的作用，在调试的时候方便查找'
});
