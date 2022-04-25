package com.fengx.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author: Fengx
 * @date: 2021-11-03
 * @description: 字符串相关工具类
 **/
public class StringUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(StringUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {
        System.out.println(substringStr("test"));
    }


    /**
     * 截取字符串
     * @param str
     * @return
     */
    public static String substringStr(String str){
        String strLsh = "SW2022001";
        String strnd = strLsh.substring(2, strLsh.length() - 3);
        String strfzbh = strLsh.substring(strLsh.length() - 3, strLsh.length());
        // 2022,001
        return strnd+","+strfzbh;
    }

    /**
     * 截取字符串
     * 去掉最后一个 ,
     * @param str
     * @return
     */
    public static String removeStr(String str){
        int idx = str.lastIndexOf(",");
        str = str.substring(0, idx);
        return str;
    }

    /**
     * 去除字符串中的空格、回车、换行符、制表符等
     * @param str
     * @return
     */
    public static String replaceSpecialStr(String str) {
        String repl = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s");
            Matcher m = p.matcher(str);
            repl = m.replaceAll("");
        }
        return repl;
    }

    /**
     * 获取字符串中文个数
     * @param content
     * @return
     */
    public int getContentCount(String content){
        int count = 0;
        String regex = "[\u4e00-\u9fa5]";
        count = content.length() - content.replaceAll(regex, "").length();
        return count;
    }

    /**
     * 生成随机数字和字母组合
     * @param length 长度
     * @return
     */
    public String getCharAndNumr(int length) {
        Random random = new Random();
        StringBuffer valSb = new StringBuffer();
        String charStr = "0123456789abcdefghijklmnopqrstuvwxyz";
        int charLength = charStr.length();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(charLength);
            valSb.append(charStr.charAt(index));
        }
        return valSb.toString();
    }

    /**
     * 判断是否为中文字符
     * @param c
     * @return
     */
    public static boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
                || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
            return true;
        }
        return false;
    }

    /**
     * 判断字符串是否全是数字
     * @param str
     * @return
     */
    public static boolean isNumeric2(String str) {
        return str != null && str.matches("-?\\d+(\\.\\d+)?");
    }

}
