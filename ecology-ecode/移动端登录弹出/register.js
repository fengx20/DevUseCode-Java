function gethide(){
    // debugger;
    $('#getOpenDocs').hide()
    $('#getdoc').hide()
}
var tim=false;
var docids="";
window.gethide=gethide;
ecodeSDK.overwriteMobilePropsFnQueueMapSet('PullToRefresh',{ //组件名
    fn:(newProps)=>{ //newProps代表组件参数
        //进行位置判断
        console.log("PullToRefresh",newProps);
        const {hash} = window.location;
        if(!hash.startsWith('#/menu-preview?')) return ;
        $.ajax({
            url: "/api/doc/console/multi/openWin/getOpenDocs",
            type: 'get',
            data:{
            },
            dataType: 'json',
            async: false, // 同步
            success: function (result) {
                // console.log("常用批示语",result);
                if(result.api_status&&result.docs.length>0){
                    // hideorshow=result.isWorkflowDoc;
                    // console.log("常用批示语1",result.docs);

                    docids=result.docs[0].id;
                    if(!tim){
                        tim=true;
                        var numso=500;
                        var mom=window.setInterval(function(){
                            if($("body").length>0){
                                window.clearInterval(mom);
                                $("body").append("<div id='getOpenDocs'></div>");
                                // var iframesrc="/spa/document/static4mobile/index.html#/systemDoc/doc/"+docids;
                                $("body").append("<div id='getdoc'><div id='fioo' style='flex: 1 1;overflow: auto;-webkit-overflow-scrolling: touch;height: 90%;width: 90%;margin: 0 auto;'></div><div id='enterbuttons'><button id='enterolid'>请等待5s</button><div></div>");
                                $.ajax({
                                    url: "/api/doc/mobile/systemDoc/getDocDetail",
                                    type: 'get',
                                    data:{
                                        "docid":docids
                                    },
                                    dataType: 'json',
                                    async: false, // 同步
                                    success: function (result) {
                                        console.log(result);
                                        $("#fioo").html(result.docInfo.doccontent);
                                    }
                                })
                                var t = 5;
                                inter = setInterval(function() {
                                    t--;
                                    $('#enterolid').text("请等待"+t+"s");
                                    if(t <= 0) {
                                        clearInterval(inter);
                                        // window.location.reload();
                                        $('#enterolid').text("确定")
                                    }
                                }, 1000);
                                setTimeout(function(){
                                    $("#enterolid").click(function(){
                                        gethide();
                                    })
                                },5000)
                                document.addEventListener('visibilitychange',function(){
                                        // debugger;
                                        var isHidden = document.hidden;
                                        if(isHidden){
                                            // $('#getOpenDocs', document.getElementsByClassName('iframeids')[0].contentWindow.document).hide();
                                            // $('#getOpenDocs', parent.document)
                                            // $('#getdoc', parent.document).hide()
                                            // $("#getOpenDocs").hide();
                                            // $("#getdoc").hide();
                                        } else {
                                            // console.log('你终于回来了啊');
                                            $("#getOpenDocs").hide();
                                            $("#getdoc").hide();
                                        }
                                    }
                                );
                                // $("body").append("<div id='getdoc'><iframe class='iframeids' style='border-radius: 3%;width: 100%;height: 100%;border: none;' src='"+iframesrc+"'></iframe></div>");

                                // $('title', document.getElementsByClassName('iframeids')[0].contentWindow.document).text("工作台");
                                // debugger;
                                // var mons=window.setInterval(function(){
                                //   numso--;
                                //   if(numso<=0){
                                //     window.clearInterval(mons);
                                //   }
                                //   if($('.wea-system-doc-whitebg', document.getElementsByClassName('iframeids')[0].contentWindow.document).length>0&&$("#enterbuttons").length==0){
                                //     // window.clearInterval(mons);

                                //     $('.wea-system-doc-whitebg', document.getElementsByClassName('iframeids')[0].contentWindow.document).find(".hidden-header-dramer").hide();
                                //     $('.wea-system-doc-whitebg', document.getElementsByClassName('iframeids')[0].contentWindow.document).find(".hidden-footer-dramer").hide();
                                //     if($('#enterbuttons', document.getElementsByClassName('iframeids')[0].contentWindow.document).length==0){
                                //       $('.wea-doc-info', document.getElementsByClassName('iframeids')[0].contentWindow.document).after("<div id='enterbuttons'><button onclick='gethide()'>确定</button></div>")
                                //       document.addEventListener('visibilitychange',function(){
                                //         // debugger;
                                //         var isHidden = document.hidden;
                                //         if(isHidden){
                                //           // $('#getOpenDocs', document.getElementsByClassName('iframeids')[0].contentWindow.document).hide();
                                //           // $('#getOpenDocs', parent.document)
                                //           // $('#getdoc', parent.document).hide()
                                //           // $("#getOpenDocs").hide();
                                //           // $("#getdoc").hide();
                                //         } else {
                                //           // console.log('你终于回来了啊');
                                //           $("#getOpenDocs").hide();
                                //           $("#getdoc").hide();
                                //         }
                                //         }
                                //       );
                                //     }
                                //   }
                                // },100)
                            }
                        },100)
                    }
                }
            }
        });

    },
    order:1, //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
    desc:'在这里写此复写的作用，在调试的时候方便查找'
});
