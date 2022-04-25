package com.fengx.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @author: Fengx
 * @date: 2021-12-03
 * @description:
 **/
public class MD5UtilCode {

    private static final Logger logger = LoggerFactory.getLogger(MD5UtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {

    }

    /**
     * MD5加密
     * @param strdemo
     * @return
     */
    public static String md5(String strdemo) {
        String string = null;
        char[] hexDigist = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("MD5");
            md.update(strdemo.getBytes());
            byte[] datas = md.digest();
            // 16 个字节的长整数
            char[] str = new char[2 * 16];
            int k = 0;
            for (int i = 0; i < 16; i++) {
                byte b = datas[i];
                // 高4位
                str[k++] = hexDigist[b >>> 4 & 0xf];
                // 低4位
                str[k++] = hexDigist[b & 0xf];
            }
            string = new String(str);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return string;
    }

    /**
     * md5加密：md5(ticket+timestamp)
     * @param ticket
     * @param time
     * @return
     */
    public static String getToken(String ticket, String time){
        StringBuffer tickettime = new StringBuffer();
        tickettime.append(ticket).append(time);
        try {
            // 生成一个MD5加密计算摘要
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 计算md5函数
            md.update(tickettime.toString().getBytes());
            StringBuilder sb = new StringBuilder();
            byte[] bits = md.digest();
            for (int bit : bits) {
                int a = bit;
                if (a < 0) a += 256;
                if (a < 16) sb.append("0");
                sb.append(Integer.toHexString(a));
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 计算文件32位md5值
     * @param filePath 文件路径
     * @return
     * @throws FileNotFoundException
     */
    public static String md5HashCode32(String filePath) throws FileNotFoundException{
        FileInputStream fis = new FileInputStream(filePath);
        return md5HashCode32(fis);
    }

    /**
     * 计算文件32位md5值
     * @param fis 输入流
     * @return
     */
    public static String md5HashCode32(InputStream fis) {
        try {
            // 拿到一个MD5转换器,如果想使用SHA-1或SHA-256，则传入SHA-1,SHA-256
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 分多次将一个文件读入，对于大型文件而言，比较推荐这种方式，占用内存比较少。
            byte[] buffer = new byte[1024];
            int length;
            while ((length = fis.read(buffer, 0, 1024)) != -1) {
                md.update(buffer, 0, length);
            }
            fis.close();
            // 转换并返回包含16个元素字节数组,返回数值范围为-128到127
            byte[] md5Bytes = md.digest();
            StringBuffer hexValue = new StringBuffer();
            /**
             * 如果小于16，那么val值的16进制形式必然为一位，
             * 因为十进制0,1...9,10,11,12,13,14,15 对应的 16进制为 0,1...9,a,b,c,d,e,f;
             * 此处高位补0。
             */
            for (byte md5Byte : md5Bytes) {
                int val = ((int) md5Byte) & 0xff;
                if (val < 16) {
                    hexValue.append("0");
                }
                // 这里借助了Integer类的方法实现16进制的转换
                hexValue.append(Integer.toHexString(val));
            }
            return hexValue.toString().toUpperCase();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }



}
