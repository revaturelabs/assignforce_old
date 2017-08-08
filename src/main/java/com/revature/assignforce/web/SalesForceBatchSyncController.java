package com.revature.assignforce.web;

import com.revature.assignforce.annotations.Authorize;
import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.Force;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.sun.jndi.toolkit.url.Uri;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
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
@RequestMapping("/api/v2/sfSync")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class SalesForceBatchSyncController {

    @Autowired
    private Force force;

    @Autowired
    private OAuth2RestTemplate restTemplate;

    @Autowired
    private OAuth2RestTemplate aRestTemplate;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object getBatches(@CookieValue("JSESSIONID") String cookieSessionId,
                          @RequestHeader(value="X-XSRF-TOKEN") String tokenValue){
        String url = "https://revature--int1.cs17.my.salesforce.com/services/data/v{version}/query/?q=";
        url = force.restUrl(url);
        url = addSelectAllQueryTo(url);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.add("Authorization", "Bearer " + tokenValue);
        HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);
        Map<String, String> params = new HashMap<>();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, params);
        System.out.println(response.getBody());
        return new ResponseEntity<String>(response.getBody(), response.getStatusCode());
    }

    @RequestMapping( method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object updateBatch(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                              @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                              @RequestBody BatchDTO in){
        return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
    }

    public String addSelectAllQueryTo(String url){
        String query = "SELECT Id, Name, Batch_Start_Date__c, Batch_End_Date__c, Skill_Type__c, Batch_Trainer__c, Co_Trainer__c, Location__c From Training__c";
        return url.concat(query);
    }
}
