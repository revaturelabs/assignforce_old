package com.revature.assignforce.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by August Duet on 11/28/2016.
 */
@Controller
public class DefaultRoutingController {

    @RequestMapping(value = {"/home", "/batches", "/trainers", "/locations", "/profile", "/profile/:id", "/reports", "/settings"})
    public String routeToHome(){
        return "forward:index.html";
    }

    // Added for Parasol Project - Simply did what I was asked to do....    
    @RequestMapping(value="/health")
    public ResponseEntity<String> healthCheck(){
        return new ResponseEntity<>("Hello worldz", HttpStatus.OK);
    }
}
