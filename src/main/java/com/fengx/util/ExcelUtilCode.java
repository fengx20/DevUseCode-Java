package com.fengx.util;

import jxl.Workbook;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.write.Label;
import jxl.write.*;
import weaver.general.GCONST;
import weaver.general.Util;

import java.awt.*;
import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author: Fengx
 * @date: 2022-04-02
 * @description: Excel 工具类
 **/
public class ExcelUtilCode {

    public static final String filePath = new StringBuilder().append(GCONST.getRootPath()).append("filesystem").append(File.separatorChar).append("downloadBatch").append(File.separatorChar).toString();

    public String exportExcel(List<String> paramList1,
                              List<Map<String, String>> paramList, List<String> paramList2,
                              String paramString) {
        File localFile = new File(filePath);
        if (!localFile.exists()) {
            localFile.mkdirs();
        }
        String str = new StringBuilder().append(paramString)
                .append(new Date().getTime()).append(".xls").toString();
        try {
            WritableWorkbook localWritableWorkbook = Workbook
                    .createWorkbook(new File(new StringBuilder().append(filePath)
                            .append(str).toString()));
            WritableSheet localWritableSheet = localWritableWorkbook
                    .createSheet("Sheet1", 0);
            // 给列设置不同的宽度
            localWritableSheet.setColumnView(0, 20);
            localWritableSheet.setColumnView(1, 30);
            localWritableSheet.setColumnView(2, 20);
            localWritableSheet.setColumnView(3, 30);
            localWritableSheet.setColumnView(4, 20);
            localWritableSheet.setColumnView(5, 20);
            localWritableSheet.setColumnView(6, 30);
            localWritableSheet.setColumnView(7, 20);

            // 设置字体
            WritableFont font1 = new WritableFont(
                    WritableFont.createFont("微软雅黑"), 10, WritableFont.BOLD,
                    false, UnderlineStyle.NO_UNDERLINE, Colour.WHITE);
            // 设置背景色
            Color color = Color.decode("#585858");
            localWritableWorkbook.setColourRGB(Colour.ORANGE, color.getRed(),
                    color.getGreen(), color.getBlue());
            WritableCellFormat cellFormat1 = new WritableCellFormat(font1);
            cellFormat1.setBackground(Colour.ORANGE);
            for (int i = 0; i < paramList1.size(); i++) {
                localWritableSheet.addCell(new jxl.write.Label(i, 0, (String) paramList1
                        .get(i), cellFormat1));
            }

            for (int i = 0; i < paramList.size(); i++) {
                if (paramList.get(i) != null) {
                    for (int j = 0; j < paramList2.size(); j++) {
                        localWritableSheet.addCell(new Label(j, i + 1, Util
                                .null2String((String) ((Map) paramList.get(i))
                                        .get(paramList2.get(j)))));
                    }
                }
            }
            localWritableWorkbook.write();

            localWritableWorkbook.close();
            return str;
        } catch (Exception localException) {
            localException.printStackTrace();
        }
        return null;
    }
}
