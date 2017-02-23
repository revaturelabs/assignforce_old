package com.revature.assignforce.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by August Duet on 11/28/2016.
 */
@Controller
public class DefaultRoutingController {

    @RequestMapping(value = {"/home", "/batches", "/curriculum", "/trainers", "/locations", "/profile", "/profile/:id", "/reports", "/settings"})
    public String routeToHome(){
        return "forward:index.html";
    }
}
