package com.fengx.util;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author: Fengx
 * @date: 2021-11-03
 * @description: JSON工具类 fastjson
 **/
public class JSONUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(JSONUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {

    }

    /**
     * 转成JSON字符串（不保留格式，换行、空格都会去掉）
     * @param object
     * @return
     */
    public static String toJsonStr(Object object) {
        if (object == null) {
            return "";
        }
        // 不保留格式
        if (object instanceof String) {
            return String.valueOf(JSON.parse(object.toString()));
        }
        return JSON.toJSONString(object);
    }



}
