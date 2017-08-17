package com.revature.assignforce.web;

import com.revature.assignforce.annotations.Authorize;
import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.Force;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.SalesforceBatchDTO;
import com.sun.jndi.toolkit.url.Uri;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/sfSync/batch")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class SalesForceBatchSyncController extends SalesForceCommunicator{

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    @Transactional
    public Object getBatches(@CookieValue("JSESSIONID") String cookieSessionId,
                          @RequestHeader(value="X-XSRF-TOKEN") String tokenValue){
        return executeQuery(cookieSessionId, tokenValue, getSelectAllQuery(), getBaseQueryUrl(), new HashMap<String, String>(), "", HttpMethod.GET);
    }

    @RequestMapping( method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    @Transactional
    public Object updateBatch(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                              @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                              @RequestBody SalesforceBatchDTO in){
        System.out.println(in.toJsonString());
        if(in.getId() != null) {
            return executeQuery(cookiesessionIdCookie, tokenValue, "", getBasicObjectUrl() + "Training__c/" + in.getId(), new HashMap<String, String>(), in.toJsonString(), HttpMethod.PATCH);
        }else {
            return createBatch(cookiesessionIdCookie, tokenValue, in);

        }
    }

    @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    @Transactional
    public Object createBatch(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                              @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                              @RequestBody SalesforceBatchDTO in){
        return executeQuery(cookiesessionIdCookie, tokenValue, "", getBasicObjectUrl() + "Training__c", new HashMap<>(), in.toJsonString(), HttpMethod.POST);
    }

}
