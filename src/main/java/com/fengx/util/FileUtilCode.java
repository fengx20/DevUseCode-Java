package com.fengx.util;

import cn.hutool.core.img.ImgUtil;
import com.aspose.words.HtmlSaveOptions;
import com.aspose.words.SaveFormat;
import org.apache.commons.codec.binary.Base64;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.converter.WordToHtmlConverter;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.ooxml.POIXMLDocument;
import org.apache.poi.ooxml.extractor.POIXMLTextExtractor;
import org.apache.poi.openxml4j.exceptions.OpenXML4JException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.xmlbeans.XmlException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import weaver.file.AESCoder;
import weaver.general.xziputil.commons.FileUtils;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipInputStream;

/**
 * @author: Fengx
 * @date: 2021-11-03
 * @description: 文件文档工具类
 **/
public class FileUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(FileUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {

    }

    /**
     * 创建文件夹
     * @param
     */
    public static void newDir(String path){
        File file = new File(path);
        // 如果文件夹不存在
        if(!file.exists()){
            logger.info("=======开始创建临时文件夹============");
            // 创建文件夹
            file.mkdirs();
            logger.info("=======创建临时文件夹结束============");
        }
    }

    /**
     * 销毁文件夹（以及文件）
     * @param path
     */
    public static void destructionFile(String path) {
        logger.info("删除文件夹======"+path+"开始");
        File file = new File(path);
        FileUtils.deleteQuietly(file);
        logger.info("删除文件夹======"+path+"成功");
    }

    /**
     * 获取文件创建时间和大小
     * @param path
     * @return
     * @throws IOException
     */
    public static Map<String,Object> getWjCreatTime(String path) throws IOException {
        Map<String ,Object> map = new HashMap<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // 获取文件路径
        Path testPath = Paths.get(path);
        BasicFileAttributeView basicView = Files.getFileAttributeView(testPath, BasicFileAttributeView.class);
        BasicFileAttributes basicFileAttributes = basicView.readAttributes();
        map.put("size",basicFileAttributes.size()+"字节");
        map.put("time",df.format(new Date(basicFileAttributes.creationTime().toMillis())));
        return map;
    }

    /**
     * 获取doc、docx文件内容
     * @param path
     * @return
     */
    public static String wordToText(String path) {
        String filecontent = "";
        // 需要判断文档是.doc还是.docx
        if (path.endsWith(".doc")) {
            try {
                InputStream is = new FileInputStream(new File(path));
                WordExtractor we = new WordExtractor(is);
                String result = StringUtilCode.replaceSpecialStr(we.getText());
                we.close();
                filecontent = result;
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        } else if (path.endsWith(".docx")) {
            try {
                OPCPackage opcPackage = POIXMLDocument.openPackage(path);
                POIXMLTextExtractor extractor = new XWPFWordExtractor(opcPackage);
                String result = StringUtilCode.replaceSpecialStr(extractor.getText());
                extractor.close();
                filecontent = result;
            } catch (IOException | XmlException | OpenXML4JException ioException) {
                ioException.printStackTrace();
            }
        }  else {
            logger.error("不是word文档或路径不正确，请检查");
        }
        return filecontent;
    }

    /**
     * doc、docx文件转html格式，返回html格式字符串----------不使用aspose-words
     * @param wordPath
     * @return htmlContent
     */
    public static String WordToHtmlContent(String wordPath){
        String htmlContentStr = "";
        try {
            File fileexist = new File(wordPath);
            if(fileexist.exists()) {
                if (wordPath.endsWith(".doc")) {
                    // 原word文档
                    InputStream input = new FileInputStream(new File(wordPath));
                    HWPFDocument wordDocument = new HWPFDocument(input);
                    WordToHtmlConverter wordToHtmlConverter = new WordToHtmlConverter(
                            DocumentBuilderFactory.newInstance().newDocumentBuilder()
                                    .newDocument());

                    wordToHtmlConverter.setPicturesManager((content, pictureType, suggestedName, widthInches, heightInches) -> {
                        BufferedImage bufferedImage = ImgUtil.toImage(content);
                        String base64Img = ImgUtil.toBase64(bufferedImage, pictureType.getExtension());
                        //  带图片的word，则将图片转为base64编码，保存在一个页面中
                        StringBuilder sb = (new StringBuilder(base64Img.length() + "data:;base64,".length()).append("data:;base64,").append(base64Img));
                        return sb.toString();
                    });

                    // 解析word文档
                    wordToHtmlConverter.processDocument(wordDocument);
                    Document htmlDocument = wordToHtmlConverter.getDocument();
                    htmlContentStr = DocumentToString(htmlDocument);
                } else if (wordPath.endsWith(".docx")) {
                    // 未完成
                } else {
                    logger.error("不是word文档或路径不正确，请检查");
                }
            }else{
                logger.error("文件不存在，请检查");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return htmlContentStr;
    }

    /**
     * doc、docx转html字符串----------使用aspose-words
     * 将word的内容转为html返回字符串，图片全部转为base64编码。
     * @param wordPath
     * @return
     */
    public static String wordToHtml(String wordPath) throws FileNotFoundException {
        logger.info("DocumentUtil====doc、docx转换html字符串开始");
        InputStream in = new FileInputStream(new File(wordPath));
        ByteArrayOutputStream htmlStream = new ByteArrayOutputStream();
        String htmlText = "";
        try {
            com.aspose.words.Document doc = new com.aspose.words.Document(in);
            HtmlSaveOptions opts = new HtmlSaveOptions(SaveFormat.HTML);
            // 是否设置XHTML
            opts.setExportXhtmlTransitional(false);
            opts.setExportImagesAsBase64(true);
            opts.setExportPageSetup(true);
            doc.save(htmlStream,opts);
            htmlText = new String(htmlStream.toByteArray(), StandardCharsets.UTF_8);
            htmlStream.close();
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return htmlText;
    }

    /**
     * Document对象转字符串
     * @param document
     * @return
     */
    public static String DocumentToString(Document document) {
        // 这个有 <?xml version="1.0" encoding="utf-8"/>
        //        return XMLUtils.DocumentToString(document);
        String htmlContentStr = "";
        StringWriter writer = null;
        try {
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            DOMSource source = new DOMSource(document);
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            writer = new StringWriter();
            StreamResult result = new StreamResult(writer);
            transformer.transform(source, result);
            htmlContentStr = writer.getBuffer().toString();
        }catch (Exception e) {
            e.printStackTrace();
        }finally{
            if(writer != null){
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return htmlContentStr;
    }

    /**
     * 文件转base64字符串
     * @param path
     * @return
     */
    public static String fileToBase64(String path) {
        String base64 = null;
        InputStream in = null;
        try {
            File file = new File(path);
            in = new FileInputStream(file);
            byte[] bytes = new byte[(int) file.length()];
            in.read(bytes);
            base64 = new String(Base64.encodeBase64(bytes),"UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return base64;
    }

    /**
     * base64字符串解码还原为文件
     * @param outFilePath 输出文件路径
     * @param base64 base64文件编码字符串
     * @param outFileName 输出文件名
     */
    public static void base64ToFile(String outFilePath, String base64, String outFileName) {
        File file;
        // 创建文件目录
        File dir = new File(outFilePath);
        if (!dir.exists() && !dir.isDirectory()) {
            dir.mkdirs();
        }
        BufferedOutputStream bos = null;
        FileOutputStream fos = null;
        try {
            byte[] bytes = Base64.decodeBase64(base64);
            file = new File(outFilePath + "/" + outFileName);
            fos = new FileOutputStream(file);
            bos = new BufferedOutputStream(fos);
            bos.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (bos != null) {
                try {
                    bos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 获取文件输入流
     * @param fileRealPath 文件路径
     * @param isZip 是否压缩 0 否 1 是
     * @param isAesEncrypt 是否加密 0 否 1 是
     * @param aesCode 解密编码
     * @return
     */
    public InputStream getFileInputStream(String fileRealPath, String isZip, String isAesEncrypt, String aesCode) throws IOException {
        InputStream is = null;
        if ((fileRealPath == null) || ("".equals(fileRealPath))) {
            logger.info("FtpUtil====fileRealPath为空!");
            return null;
        }
        try {
            logger.info("获取文件数据流----zip文件路径："+fileRealPath+"，"+isZip+"，"+isAesEncrypt);
            File theFile = new File(fileRealPath);
            // 解压缩
            if ("1".equals(isZip)) {
                ZipInputStream zin = new ZipInputStream(new FileInputStream(theFile));
                if (zin.getNextEntry() != null) {
                    is = new BufferedInputStream(zin);
                }
            } else {
                is = new BufferedInputStream(new FileInputStream(fileRealPath));
            }
            // 解密
            if("1".equals(isAesEncrypt)){
                is = AESCoder.decrypt(is, aesCode);
            }
        } catch (Exception e) {
            logger.info("FtpUtil====获取文件流失败...."+e);
            e.printStackTrace();
        }
        return is;
    }




}
