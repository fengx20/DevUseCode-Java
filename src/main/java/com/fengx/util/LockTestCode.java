package com.fengx.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author: Fengx
 * @date: 2022-03-01
 * @description:
 **/
public class LockTestCode {

    public static void main(String[] args) {
        for(int i = 0; i < 5; i++){
            NumberThread numberThread = new NumberThread();
            new Thread(numberThread).start();
        }
    }

    static class NumberThread implements Runnable {

        public static int count = 0;

        @Override
        public void run() {
            synchronized (this){
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
                System.out.println(simpleDateFormat.format(new Date()) + "-" + ++count);
            }
        }
    }
}


