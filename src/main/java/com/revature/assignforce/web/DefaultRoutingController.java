package com.revature.assignforce.web;

import com.revature.assignforce.annotations.Authorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by August Duet on 11/28/2016.
 */
@Controller
public class DefaultRoutingController {

    @RequestMapping(value = {"/login", "/home", "/batches", "/curriculum", "/trainers", "/locations", "/profile", "/profile/:id", "/reports", "/settings"})
    @Authorize
    public String routeToHome(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                              @RequestHeader(value="X-XSRF-TOKEN") String tokenValue){
        return "forward:home.html";
    }

    // Added for Parasol Project - Simply did what I was asked to do....    
    @RequestMapping(value="/health")
    @Authorize
    public ResponseEntity<String> healthCheck(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                                              @RequestHeader(value="X-XSRF-TOKEN") String tokenValue){
        return new ResponseEntity<>("Hello worldz", HttpStatus.OK);
    }
}
