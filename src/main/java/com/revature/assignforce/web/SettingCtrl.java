package com.revature.assignforce.web;

import com.revature.assignforce.domain.Setting;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.SettingDTO;
import com.revature.assignforce.service.DaoService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by lazar on 2/8/2017.
 */

@RestController
@RequestMapping("/api/v2/setting")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class SettingCtrl {
    private final static Log logger = LogFactory.getLog(SettingCtrl.class);

    @Autowired
    DaoService<Setting, Integer> settingService;

    //Create
    @PreAuthorize("hasPermission('', 'manager')")
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object createSetting(@RequestBody SettingDTO in ){
        return new ResponseEntity(null, HttpStatus.NOT_IMPLEMENTED);
    }

    //Retrieve
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(value = "/{settingId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object retrieveSetting (@PathVariable("settingId") int settingId){

        Setting setting = settingService.getOneItem(settingId);
        if(setting == null) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No Setting found of ID " + settingId +"."), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity< Setting >(setting, HttpStatus.OK);
        }
    }

    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object getGlobalSettings(){

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
    @PreAuthorize("hasPermission('', 'manager')")
    @RequestMapping( method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object updateSetting(@RequestBody Setting in ){

        try{
            settingService.saveItem(in);
        }catch (Exception ex){
            logger.warn(ex);
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("An error has occured while updating system settings"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<Object>(null, HttpStatus.NO_CONTENT);
    }

    //Delete
    @PreAuthorize("hasPermission('', 'manager')")
    @RequestMapping(value = "/{settingId}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object deleteSetting(){
        return new ResponseEntity<Object>(null, HttpStatus.NOT_IMPLEMENTED);
    }
}
