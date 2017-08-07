package com.revature.assignforce.web;

import com.revature.assignforce.annotations.Authorize;
import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.dto.BatchDTO;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/sfSync")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class SalesForceBatchSyncController {

    @RequestMapping( method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object updateBatch(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                              @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                              @RequestBody BatchDTO in){
        return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
    }
}
