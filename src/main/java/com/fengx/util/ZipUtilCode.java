package com.fengx.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

/**
 * @author: Fengx
 * @date: 2021-12-03
 * @description:
 **/
public class ZipUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(ZipUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {

    }

    /**
     * 压缩文件夹生成压缩包
     * @param file 源文件夹 /qqid/sip
     * @param zos 被压缩文件流 zos = new ZipOutputStream(new FileOutputStream(new File(zipPath)));
     * @param zipPath 生成压缩包路径 /qqid/sip.zip
     */
    public static void compress(File file, ZipOutputStream zos, String zipPath) {
        if (!file.exists()) {
            logger.info("压缩sip包====待压缩的文件目录" + file.getName() + "不存在");
        } else {
            // 文件夹
            File[] fs = file.listFiles();
            BufferedInputStream bis = null;
            byte[] bufs = new byte[10240];
            FileInputStream fis = null;
            try {
                for (File f : fs) {
                    String fName = f.getName();
                    logger.info("压缩sip包====压缩：" + fName);
                    if (!f.isFile()) {
                        if (f.isDirectory()) {
                            compress(f, zos, zipPath);
                        }
                    } else {
                        ZipEntry zipEntry = new ZipEntry(fName);
                        zos.putNextEntry(zipEntry);
                        fis = new FileInputStream(f);
                        bis = new BufferedInputStream(fis, 10240);
                        int read;
                        while ((read = bis.read(bufs, 0, 10240)) != -1) {
                            zos.write(bufs, 0, read);
                        }
                        try {
                            if (null != bis) {
                                bis.close();
                            }
                            if (null != fis) {
                                fis.close();
                            }
                        } catch (IOException var21) {
                            var21.printStackTrace();
                        }
                    }
                }
                logger.info("===========sip压缩包路径："+zipPath+"，文件长度："+new File(zipPath).length());
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (null != bis) {
                        bis.close();
                    }
                    if (null != fis) {
                        fis.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 解压缩
     * @param filePath 压缩包路径
     * @param targetStr 解压目标路径
     */
    public static void decompression(String filePath, String targetStr) {
        // 判断是否是压缩包，不是压缩包抛异常
        isCheckFileNameInZip(filePath);
        File source = new File(filePath);
        if (source.exists()) {
            ZipInputStream zis = null;
            BufferedOutputStream bos = null;
            try {
                zis = new ZipInputStream(new FileInputStream(source));
                ZipEntry entry;
                while((entry = zis.getNextEntry()) != null && !entry.isDirectory()) {
                    File target = new File(targetStr, entry.getName());
                    if (!target.getParentFile().exists()) {
                        target.getParentFile().mkdirs();
                    }
                    bos = new BufferedOutputStream(new FileOutputStream(target));
                    byte[] buffer = new byte[10240];
                    int read;
                    while((read = zis.read(buffer, 0, buffer.length)) != -1) {
                        bos.write(buffer, 0, read);
                    }
                    if (null != bos) {
                        bos.close();
                    }
                }
                zis.closeEntry();
            } catch (Exception var12) {
                throw new RuntimeException(var12);
            } finally {
                // 关闭流
                closeQuietly(zis, bos);
            }
        }
    }

    /**
     * 判断文件是否是 zip 压缩包
     * @param zipFile
     */
    private static void isCheckFileNameInZip(String zipFile) {
        int las = zipFile.lastIndexOf(".");
        if (las == -1) {
            throw new RuntimeException(zipFile + " is not zip format! this format = ??? ");
        } else {
            String format = zipFile.substring(las + 1);
            if (!"zip".equalsIgnoreCase(format)) {
                throw new RuntimeException(zipFile + " is not zip format! this format = " + format);
            }
        }
    }

    /**
     * 关闭流
     * @param closeables
     */
    public static void closeQuietly(Closeable... closeables) {
        try {
            if (closeables != null && closeables.length > 0) {
                Closeable[] var1 = closeables;
                int var2 = closeables.length;
                for(int var3 = 0; var3 < var2; ++var3) {
                    Closeable closeable = var1[var3];
                    if (closeable != null) {
                        closeable.close();
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
