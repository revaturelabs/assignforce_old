package com.revature.assignforce.web;

import com.revature.assignforce.domain.Force;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class SalesForceCommunicator {
    HttpHeaders headers;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    Force force;

    public ResponseEntity<String> executeQuery(String sessionId, String tokenValue,
                                               String query, String url, Map<String, String> params, String jsonBody, HttpMethod method){
        String queryUrl = url;
        System.out.println(queryUrl);
        queryUrl += query;
        System.out.println(queryUrl);
        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        headers.add("Authorization", "Bearer " + tokenValue);
        HttpEntity<String> entity = new HttpEntity<String>(jsonBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(queryUrl, method, entity, String.class, params);
        System.out.println(response.getBody());
        return new ResponseEntity<String>(response.getBody(), response.getStatusCode());
    }

    public String getBaseQueryUrl(){
        return force.restUrl("https://revature--int1.cs17.my.salesforce.com/services/data/v{version}/query/?q=");
    }

    public String getSelectAllQuery(){
        return "SELECT Id, Name, Batch_Start_Date__c, Batch_End_Date__c, Skill_Type__c, Batch_Trainer__c, Co_Trainer__c, Location__c From Training__c";
    }

    public String getBasicObjectUrl(){
        return force.restUrl("https://revature--int1.cs17.my.salesforce.com/services/data/v{version}/sobjects/");
    }
}
