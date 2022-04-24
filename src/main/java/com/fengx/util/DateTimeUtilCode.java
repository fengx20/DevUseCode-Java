package com.fengx.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @author: Fengx
 * @date: 2021-11-04
 * @description: 日期时间工具类
 **/
public class DateTimeUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(DateTimeUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args){
//        System.out.println(getCurrentDateTime());
//        System.out.println(HtxqlcAction.strToDate("2021-12-28"));
//        System.out.println(datecal("2021-03-25", "2021-02-25"));
//        BigDecimal qrje = new BigDecimal("231");
//        System.out.println(qrje);
        // 四舍五入
        BigDecimal cs_jk = BigDecimal.valueOf(30).divide(BigDecimal.valueOf(365), 2, BigDecimal.ROUND_HALF_UP);
//        BigDecimal cs_jk1 = BigDecimal.valueOf(32).divide(BigDecimal.valueOf(365));
        System.out.println(cs_jk.toString());
    }


    /**
     * 返回今天到这个日期之间，间隔天数的日期集合，包括本身
     * @param startDay
     * @param endDay
     * @param day
     * @return
     */
    public static List<String> getDays(String startDay, String endDay, int day) {
        // 返回的日期集合
        List<String> days = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date start = sdf.parse(startDay);
            Date end = sdf.parse(endDay);

            Calendar tempStart = Calendar.getInstance();
            tempStart.setTime(start);
            Calendar tempEnd = Calendar.getInstance();
            tempEnd.setTime(end);
            while (tempStart.before(tempEnd)) {
                days.add(sdf.format(tempStart.getTime()));
                tempStart.add(Calendar.DATE, day);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return days;
    }

    /**
     * 两个日期间隔天数
     * @param startDateStr
     * @param endDateStr
     * @return
     */
    public static int datecal(String startDateStr, String endDateStr) {
        int days = 0;
        try {
            SimpleDateFormat simpleFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = simpleFormat.parse(startDateStr);
            Date endDate = simpleFormat.parse(endDateStr);
            long startDateTime = startDate.getTime();
            long endDateTime = endDate.getTime();
            days = Math.abs((int) ((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)));
        }catch (Exception e){
            e.printStackTrace();
        }
        return days ;
    }

    /**
     * date2比date1多的天数
     * @param date1
     * @param date2
     * @return
     */
    public static int calcDayOffset(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);

        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date2);
        int day1 = cal1.get(Calendar.DAY_OF_YEAR);
        int day2 = cal2.get(Calendar.DAY_OF_YEAR);

        int year1 = cal1.get(Calendar.YEAR);
        int year2 = cal2.get(Calendar.YEAR);
        if (year1 != year2) {  //同一年
            int timeDistance = 0;
            for (int i = year1; i < year2; i++) {
                if (i % 4 == 0 && i % 100 != 0 || i % 400 == 0) {  //闰年
                    timeDistance += 366;
                } else {  //不是闰年

                    timeDistance += 365;
                }
            }
            return timeDistance + (day2 - day1);
        } else { //不同年
            return day2 - day1;
        }
    }

    /**
     * 获取当前日期时间
     * @return
     */
    public static String getCurrentDateTime(){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        // SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        // SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date today = new Date();
        return simpleDateFormat.format(today);
    }

    /**
     * 获取10、13位数字时间戳
     * @return
     */
    public static String getTimestampStr(){
        // 13位
        return String.valueOf(Calendar.getInstance().getTimeInMillis());
        // 10位
//        return String.valueOf(Calendar.getInstance().getTimeInMillis() / 1000);
    }

    /**
     * 字符串转日期，加6年，转回字符串
     * @param datestr
     * @return
     */
    public static String strToDate(String datestr){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String xhtjsrq = "";
        Date date;
        try {
            date = sdf.parse(datestr);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            // 日期加6年
            calendar.add(Calendar.YEAR,+6);
            Date xhtjsrqdate = calendar.getTime();
            xhtjsrq = sdf.format(xhtjsrqdate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return xhtjsrq;
    }



}
