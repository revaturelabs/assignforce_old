package com.revature.assignforce.web;

import com.revature.assignforce.annotations.Authorize;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/api/v2/sfSync/trainer")
public class SalesForceTrainerSyncController extends SalesForceCommunicator{


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object getTrainerById(@CookieValue("JSESSIONID") String cookieSessionId,
                                 @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                                 @PathVariable("id") String ID){
        System.out.println("HERE!!!!");
        return executeQuery(cookieSessionId, tokenValue,
                "SELECT Id, Name, CommunityNickname, FirstName, LastName, " +
                        "Email, FullPhotoUrl, SmallPhotoUrl, UserRole.Id, UserRole.Name " +
                "FROM User WHERE Id = '".concat(ID).concat("'"), getBaseQueryUrl(), new HashMap<String, String>(), "", HttpMethod.GET);
    }
}
