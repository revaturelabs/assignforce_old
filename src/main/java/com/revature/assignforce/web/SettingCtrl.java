package com.revature.assignforce.web;

import com.revature.assignforce.annotations.Authorize;
import com.revature.assignforce.domain.Setting;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.SettingDTO;
import com.revature.assignforce.service.DaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by lazar on 2/8/2017.
 */

@RestController
@RequestMapping("/api/v2/setting")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class SettingCtrl {
    @Autowired
    DaoService<Setting, Integer> settingService;

    //Create
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object createSetting(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                                @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                                @RequestBody SettingDTO in ){
        return new ResponseEntity(null, HttpStatus.NOT_IMPLEMENTED);
    }

    //Retrieve
    @RequestMapping(value = "/{settingId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object retrieveSetting (@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                                   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                                   @PathVariable("settingId") int settingId){
        Setting setting = settingService.getOneItem(settingId);
        if(setting == null) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No Setting found of ID " + settingId +"."), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity< Setting >(setting, HttpStatus.OK);
        }
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object getGlobalSettings(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                                    @RequestHeader(value="X-XSRF-TOKEN") String tokenValue){

        List<Setting> settings = settingService.getAllItems();

        if(settings == null){
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all Settings failed"), HttpStatus.NOT_FOUND);
        } else if (settings.isEmpty()){
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No Settings available"), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity< List<Setting> >(settings, HttpStatus.OK);
        }
    }

    //Update
    @RequestMapping( method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object updateSetting(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                                @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
                                @RequestBody Setting in ){
        try{
            settingService.saveItem(in);
        }catch (Exception ex){
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("An error has occured while updating system settings"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
    }

    //Delete
    @RequestMapping(value = "/{settingId}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Authorize
    public Object deleteSetting(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
                                @RequestHeader(value="X-XSRF-TOKEN") String tokenValue){
        return new ResponseEntity<Object>(null, HttpStatus.NOT_IMPLEMENTED);
    }
}
