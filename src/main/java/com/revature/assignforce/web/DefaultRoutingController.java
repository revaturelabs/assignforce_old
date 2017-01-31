package com.revature.assignforce.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by August Duet on 11/28/2016.
 */
@Controller
public class DefaultRoutingController {

    @RequestMapping(value = {"/home", "/batches", "/trainers", "/locations", "/reports"})
    public String routeToHome(){
        return "forward:index.html";
    }
}
