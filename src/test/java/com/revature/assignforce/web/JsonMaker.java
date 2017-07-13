package com.revature.assignforce.web;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Created by workm on 7/13/2017.
 */
public class JsonMaker {
    public String toJsonString(Object anObject){
        Gson gson = new GsonBuilder()
                .serializeNulls()
                .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                .create();
        System.out.println(gson.toJson(this));
        return gson.toJson(this);
    }
}
