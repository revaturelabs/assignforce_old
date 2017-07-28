package com.revature.assignforce.web;

import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.dto.BatchDTO;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/sfSync")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class SalesForceBatchSyncController {

    @RequestMapping( method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object updateBatch(@RequestBody BatchDTO in){
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!HEREE");
        return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
    }
}
