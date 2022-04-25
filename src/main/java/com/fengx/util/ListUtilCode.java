package com.fengx.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: Fengx
 * @date: 2021-11-22
 * @description:
 **/
public class ListUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(ListUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        for(int i = 0; i < 10; i++){
            list.add(String.valueOf(i));
        }
        System.out.println(groupList(list, 5));
    }

    /**
     * list分组
     * @param list 待分组list
     * @param groupSize 分组大小
     * @param <T> 分组元素类型
     * @return 用map来存新的分组数据，形如->{keyName0=[11, 22], keyName1=[33, 44]}
     */
    public static <T> Map<String, List<T>> groupList(List<T> list, int groupSize) {
        // 数组大小
        int listSize = list.size();
        // 截取数组的偏移量
        int toIndex = groupSize;
        Map<String, List<T>> map = new HashMap<>(16);
        // 分组下标
        int keyToken = 0;
        for (int i = 0; i < list.size(); i += groupSize) {
            // 若最后一次分组时元素个数小于分组大小，则需要调整偏移量
            if (i + groupSize > listSize) {
                toIndex = listSize - i;
            }
            List<T> newList = list.subList(i, i + toIndex);
            map.put("keyName" + keyToken, newList);
            keyToken++;
        }
        logger.info("list长度："+list.size()+"，list分组个数为："+map.size());
        return map;
    }

    /**
     * List去掉中括号
     * @param list
     * @return
     */
    public static String listToStrNoKh(List<String> list){
        String listStr = "";
        list.add("123,234,31231");
        list.add("11,22,33");
        list.add("88,77,66");
        if(!list.isEmpty()) {
            for (String s : list) {
                if (!"".equals(s)) {
                    listStr = listStr.concat(s).concat(",");
                }
            }
            logger.info(listStr);
            if (!"".equals(listStr)) {
                int idx1 = listStr.lastIndexOf(",");
                listStr = listStr.substring(0, idx1);
            }
        }
        logger.info(listStr);
        return listStr;
    }

}
