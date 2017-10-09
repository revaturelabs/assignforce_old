package com.revature.assignforce.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by August Duet on 11/28/2016.
 */
@Controller
public class DefaultRoutingController {

    //Don't ask why it works, just accept it
    @RequestMapping(value = {"/login", "/home", "/batches", "/curriculum", "/trainers", "/locations", "/profile", "/profile/:id", "/reports", "/settings"})
    public String routeToHome(){
        return "";
    }

    // Added for Parasol Project - Simply did what I was asked to do....    
    @RequestMapping(value="/health")
    public ResponseEntity<String> healthCheck(){
        return new ResponseEntity<>("Hello worldz", HttpStatus.OK);
    }
}
