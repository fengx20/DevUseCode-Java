
// 是否需要盖章
var sfxygzID = WfForm.convertFieldNameToId("sfxygz", "detail_1");
// 盖章状态
var gzztID= WfForm.convertFieldNameToId("gzzt", "detail_1");

// 提交控制
WfForm.registerCheckEvent(WfForm.OPER_SUBMIT, function (callback) {
var flag = true;
// 遍历明细行
var rowArr = WfForm.getDetailAllRowIndexStr("detail_1").split(",");
console.log(rowArr);
for(var i=0; i<rowArr.length; i++){
var rowIndex = rowArr[i];
if(rowIndex !== ""){
var sfxygzvalue = WfForm.getFieldValue(sfxygzID+"_"+rowIndex);
var gzztvalue = WfForm.getFieldValue(gzztID+"_"+rowIndex);
console.log(sfxygzvalue);
console.log(gzztvalue);
if(sfxygzvalue == 1 && gzztvalue == 0){
alert("有需要盖章的文件，未完成盖章，无法提交");
flag  = false;
}
}
}
if (flag == true) {
callback();
}
});

