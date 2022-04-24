
$.ajax({
    url:"/r_rz_zdbg/api/jtt/officeDocExchange/checkTableData",    //请求的url地址
    dataType:"json",   //返回格式为json
    async:false,//请求是否异步，默认为异步，这也是ajax重要特性
    data:{"requestId":requestId},    //参数值
    type:"GET",   //请求方式
    success:function(req){
        console.log(req);
        //请求成功时处理
        if (req.data) {
            callback();
        }else{
            WfForm.showMessage("没有查询到公文竞争审查表填写记录！请填写后在提交！", 2, 5);
            return false;
        }
    },
    error:function(e){
        //请求出错处理
        console.log(e);
    }
});