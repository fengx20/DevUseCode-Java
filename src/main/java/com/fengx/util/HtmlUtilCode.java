package com.fengx.util;

import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author: Fengx
 * @date: 2021-12-21
 * @description:
 **/
public class HtmlUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(HtmlUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {

    }

    /**
     * 字符串去掉html标签
     * @param htmlStr
     * @return
     */
    public static String delHTMLTag(String htmlStr) {
        String var1 = "<script[^>]*?>[\\s\\S]*?<\\/script>";
        String var2 = "<style[^>]*?>[\\s\\S]*?<\\/style>";
        String var3 = "<[^>]+>";
        String var4 = "\\s*|\t";
        Pattern var5 = Pattern.compile(var1, 2);
        Matcher var6 = var5.matcher(htmlStr);
        htmlStr = var6.replaceAll("");
        Pattern var7 = Pattern.compile(var2, 2);
        Matcher var8 = var7.matcher(htmlStr);
        htmlStr = var8.replaceAll("");
        Pattern var9 = Pattern.compile(var3, 2);
        Matcher var10 = var9.matcher(htmlStr);
        htmlStr = var10.replaceAll("");
        return StringEscapeUtils.unescapeHtml(htmlStr.trim());
    }
}
