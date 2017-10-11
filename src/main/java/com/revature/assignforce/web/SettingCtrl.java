package com.revature.assignforce.web;

import com.revature.assignforce.domain.Setting;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.SettingDTO;
import com.revature.assignforce.service.DaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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
@Api(value = "Setting Controller", description = "Operations regarding settings")
public class SettingCtrl {
    private final static Log logger = LogFactory.getLog(SettingCtrl.class);

    @Autowired
    DaoService<Setting, Integer> settingService;

    //Create
    @PreAuthorize("hasPermission('', 'manager')")
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Create a Setting", response = ResponseEntity.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully created Setting information"),
            @ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
            @ApiResponse(code=500, message ="Cannot create Setting")
    })
    public Object createSetting(@RequestBody SettingDTO in ){
        return new ResponseEntity(null, HttpStatus.NOT_IMPLEMENTED);
    }

    //Retrieve
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(value = "/{settingId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Get a Setting based on an ID", response = ResponseEntity.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully received Setting information"),
            @ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
            @ApiResponse(code=500, message ="Cannot retrieve Setting")
    })
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
    @ApiOperation(value = "Gets all Settings", response = ResponseEntity.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully received Global Settings information"),
            @ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
            @ApiResponse(code=500, message ="Cannot retrieve Global Settings")
    })
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
    @ApiOperation(value = "Update a Setting", response = ResponseEntity.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully updated Setting information"),
            @ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
            @ApiResponse(code=500, message ="Cannot update Setting")
    })
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
    @ApiOperation(value = "Delete a Setting", response = ResponseEntity.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="You cannot delete settings"),
            @ApiResponse(code=400, message ="You cannot delete settings"),
            @ApiResponse(code=500, message ="You cannot delete settings")
    })
    public Object deleteSetting(){
        return new ResponseEntity<Object>(null, HttpStatus.NOT_IMPLEMENTED);
    }
}
