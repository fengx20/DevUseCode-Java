var arr = new Array();

for(var i = 0; i < 5; i++){
    arr.push(i);
}

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