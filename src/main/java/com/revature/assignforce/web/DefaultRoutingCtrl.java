package com.revature.assignforce.web;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by August Duet on 11/28/2016.
 */
@Controller
@Api(value = "Routing Controller", description = "Operations regarding Routing")
public class DefaultRoutingCtrl {


    //Don't ask why it works, just accept it
    @RequestMapping(value = {"/login", "/home", "/batches", "/curriculum", "/trainers", "/locations", "/profile", "/profile/:id", "/reports", "/settings"})
    @ApiOperation(value = "Route to Home", response = String.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="We're going Home"),
            @ApiResponse(code=400, message ="Bad Request, Cannot go Home"),
            @ApiResponse(code=500, message ="Cannot go Home")
    })
    public String routeToHome(){
        return "";
    }

    // Added for Parasol Project - Simply did what I was asked to do....
    @RequestMapping(value="/health")
    @ApiOperation(value = "Check", response = ResponseEntity.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Healthy"),
            @ApiResponse(code=400, message ="Not Healthy"),
            @ApiResponse(code=500, message ="Not Healthy")
    })
    public ResponseEntity<String> healthCheck(){
        return new ResponseEntity<>("Hello worldz", HttpStatus.OK);
    }
}
