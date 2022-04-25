package com.fengx.util;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.*;
import java.nio.charset.Charset;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;

/**
 * @author: Fengx
 * @date: 2021-11-03
 * @description: HTTP工具类
 **/
public class HttpUtilCode {

    private static final Logger logger = LoggerFactory.getLogger(HttpUtilCode.class);

    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {
        JSONObject response = new JSONObject();
        response.put("123", "1231111");
        response.put("11", "444");
        System.out.println(response.getString("3333"));
    }

    /**
     * post请求方法
     * @param url  请求url
     * @param data 请求入参
     * @return 出参
     */
    public static JSONObject sendPost(String url, String data) {
        logger.info("--------- sendPost url=" + url);
        logger.info("--------- sendPost data=" + data);
        String response = null;
        try {
            CloseableHttpClient httpclient = null;
            CloseableHttpResponse httpresponse = null;
            try {
                httpclient = HttpClients.createDefault();
                HttpPost httppost = new HttpPost(url);
                StringEntity stringentity = new StringEntity(data, ContentType.create("application/json", "UTF-8"));
                httppost.setEntity(stringentity);
                httpresponse = httpclient.execute(httppost);
                response = EntityUtils.toString(httpresponse.getEntity());
            } finally {
                if (httpclient != null) {
                    httpclient.close();
                }
                if (httpresponse != null) {
                    httpresponse.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("--------- sendPost Exception=" + e.getMessage(), e);
        }
        try {
            return JSONObject.parseObject(response);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * post请求附件上传接口，form表单提交
     * @param url 请求地址
     * @param filepath 文件路径
     * @param fileName 参数：文件名
     * @param app 参数
     * @param timestamp 参数
     * @param token 参数
     * @param timeout 超时时间
     * @return
     */
    public static Map<String, String> httpPostUploadFileRequest(String url, String filepath, String fileName, String app, String timestamp, String token, int timeout){
        logger.info("httpPostUploadFileRequest====请求数据："+url+"，"+filepath+"，"+app+"，"+timestamp+"，"+token);
        Map<String, String> resultMap = new HashMap<>();
        CloseableHttpClient httpClient = HttpClients.createDefault();
        String result = "";
        // 每个post参数之间的分隔。随意设定，只要不会和其他的字符串重复即可。
        String boundary = "-------4585696313564699-------";
        try {
            HttpPost post = new HttpPost(url);
            // 设置请求头
            post.setHeader("Content-Type","multipart/form-data; boundary="+boundary);

            // 设置请求头
//            post.setHeader("Accept-Language", "zh-CN,zh;q=0.9");
//            post.setHeader("Accept", "application/json");
//            post.addHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

            // 文件类型参数
            // 创建MultipartEntityBuilder对象，并添加需要上传的数据
//            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
//            builder.setCharset(Charset.forName("utf-8"));
//            // 1.设置上传的模式
//            // 加上此行代码解决返回中文乱码问题
//            builder.setMode(HttpMultipartMode.RFC6532);

            //BROWSER_COMPATIBLE自定义charset，RFC6532=utf-8，STRICT=iso-8859-1
            //此处一定要用RFC6532，网上普遍用的BROWSER_COMPATIBLE依然会出现中文名乱码
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();// .setMode(HttpMultipartMode.RFC6532)

            // 字符编码
            builder.setCharset(Charset.forName("UTF-8"));

            // 模拟浏览器
            builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);

            //  每个post参数之间的分隔
            builder.setBoundary(boundary);

            // multipart/form-data
//            File file = new File(filepath);
//            builder.addPart("multipartFile",new FileBody(file));

            // 添加文件
            File file1 = new File(filepath);
            builder.addBinaryBody("file", new FileInputStream(file1), ContentType.MULTIPART_FORM_DATA, file1.getName());

            //multipartEntityBuilder.setCharset(Charset.forName("UTF-8")); //此处踩坑，转发出去的filename依然为乱码
            //ContentType contentType = ContentType.create("multipart/form-data",Charset.forName("UTF-8")); //此处也是坑，转发出去的filename依然为乱码

            //  每个post参数之间的分隔
            builder.setBoundary(boundary);

            // 其他参数
            builder.addTextBody("app", app, ContentType.create("text/plain", Consts.UTF_8));
            builder.addTextBody("time", timestamp, ContentType.create("text/plain", Consts.UTF_8));
            builder.addTextBody("token", token, ContentType.create("text/plain", Consts.UTF_8));
            builder.addTextBody("name", fileName, ContentType.create("text/plain", Consts.UTF_8));
            // 文件后缀
            String wjhz = fileName.substring(fileName.lastIndexOf(".")+1);
            builder.addTextBody("type", wjhz);


            // 解决中文乱码
//            ContentType contentType = ContentType.create("application/x-www-form-urlencoded", HTTP.UTF_8);
            // 添加文本类型参数
//            builder.addTextBody("app", app, contentType);
//            builder.addTextBody("time", timestamp, contentType);
//            builder.addTextBody("token", token, contentType);
//            builder.addTextBody("name", fileName, contentType);
//            // 文件后缀
//            String wjhz = Util.null2String(fileName.substring(fileName.lastIndexOf(".")+1));
//            builder.addTextBody("type", wjhz, contentType);


            // 利用build()方法创建一个HttpEntity对象，采用HttpPost的setEntity的方法
            HttpEntity entity = builder.build();
            post.setEntity(entity);
            logger.info("httpPostUploadFileRequest====HttpEntity："+JSONObject.toJSONString(entity));

            // 设置连接超时时间
//            RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(timeout)
//                    .setConnectionRequestTimeout(timeout).setSocketTimeout(timeout).build();
//            post.setConfig(requestConfig);
            long time = System.currentTimeMillis();

            // 提交请求
            HttpResponse response = httpClient.execute(post);
            logger.info("post请求附件上传接口====封装httpclient所需要的时间HttpMultipartFormdata.httpPostRequest："+(System.currentTimeMillis() - time));

            HttpEntity responseEntity = response.getEntity();
            // 返回结果
            resultMap.put("scode", String.valueOf(response.getStatusLine().getStatusCode()));
            resultMap.put("data", "");
            if (responseEntity != null) {
                // 将响应内容转换为字符串
                result = com.fengx.devusecode.EncodeUtilCode.decodeUnicode(EntityUtils.toString(responseEntity, Charset.forName("utf-8")));
                resultMap.put("data", result);
            }
            logger.info("post请求附件上传接口====返回结果："+resultMap);
        } catch (Exception e) {
            resultMap.put("scode", "error");
            resultMap.put("data", "HTTP请求出现异常: " + e.getMessage());
            Writer w = new StringWriter();
            e.printStackTrace(new PrintWriter(w));
            logger.error("post请求附件上传接口====HTTP请求出现异常: " + w.toString());
        } finally {
            try {
                httpClient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return resultMap;
    }

    /**
     * get请求方法
     * @param url
     * @return
     */
    public static JSONObject sendGet(String url) {
        logger.info("--------- sendPost url=" + url);
        String response = null;
        try {
            CloseableHttpClient httpclient = null;
            CloseableHttpResponse httpresponse = null;
            try {
                httpclient = HttpClients.createDefault();
                HttpGet httpget = new HttpGet(url);
                httpresponse = httpclient.execute(httpget);
                response = EntityUtils.toString(httpresponse.getEntity());
            } finally {
                if (httpclient != null) {
                    httpclient.close();
                }
                if (httpresponse != null) {
                    httpresponse.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("--------- sendGet Exception=" + e.getMessage(), e);
        }
        try {
            return JSONObject.parseObject(response);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 绕过HTTPS证书
     * @return
     */
    public static HttpClient wrapClient() {
        try {
            SSLContext ctx = SSLContext.getInstance("SSL");
            X509TrustManager tm = new X509TrustManager() {
                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                @Override
                public void checkClientTrusted(X509Certificate[] arg0,
                                               String arg1) throws CertificateException {
                }

                @Override
                public void checkServerTrusted(X509Certificate[] arg0,
                                               String arg1) throws CertificateException {
                }
            };
            ctx.init(null, new TrustManager[] { tm }, null);
            SSLConnectionSocketFactory ssf = new SSLConnectionSocketFactory(
                    ctx, NoopHostnameVerifier.INSTANCE);
            CloseableHttpClient httpclient = HttpClients.custom()
                    .setSSLSocketFactory(ssf).build();
            return httpclient;
        } catch (Exception e) {
            return HttpClients.createDefault();
        }
    }

    /**
     * 接口请求超时处理
     */
    public static void time(){
        // 接口请求超时处理
//        final ExecutorService exec = Executors.newSingleThreadExecutor();
//        Callable<Integer> call = () -> {
//            // 这个是一个耗时的网络请求
//            return seas.archiveXml(xmlStr, params);
//        };
//        // 等同于下面
////                    Callable<Integer> call = new Callable<Integer>(){
////                        public Integer call() throws Exception{
////                            //这个是一个耗时的网络 请求
////                            return seas.archiveXml(xmlStr, params);
////                        }
////                    };
//        // Future是一个接口，该接口用来返回异步的结果
//        Future<Integer> future = exec.submit(call);
//        int count = 0;
//        try{
//            // 同步结果，并且设置超时时间
//            count = future.get(240000, TimeUnit.MILLISECONDS);
//        }catch(InterruptedException | ExecutionException | TimeoutException e){
//            logger.error("调用档案系统归档接口超时===="+requestid+"，已归档条数："+count);
//            e.printStackTrace();
//        }
//        //执行结束后，手动关闭线程池
//        exec.shutdown();
    }

}
