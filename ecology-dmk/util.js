
// 数组判断重复
var arr = new Array();
arr.push("123");
isRepeat(arr)

function isRepeat(arr) {
    if(!arr || arr.length < 1){
        return false;
    }
    var hash = {};
    for ( var i in arr) {
        if (hash[arr[i]]) {
            return true;
        }
        hash[arr[i]] = true;
    }
    return false;
}

// map 转 json
var datamap = new Map();
datamap.set("a", "123");
mapToJson(datamap);
function strMapToObj(strMap){
    let obj= Object.create(null);
    for (let[k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}
// map转换为json
function mapToJson(map) {
    return JSON.stringify(this.strMapToObj(map));
}

// 字符串转json
function strToJson(str){
    return JSON.parse(str);
}