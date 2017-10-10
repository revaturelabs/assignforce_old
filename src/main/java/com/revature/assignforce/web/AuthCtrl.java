package com.revature.assignforce.web;

import com.revature.assignforce.domain.Force;
import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Api(value = "Authorization Controller", description = "Authorization Controller")
public class AuthCtrl {
    private final static Log logger = LogFactory.getLog(AuthCtrl.class);

    @Autowired
    private Force force;

    @Autowired
    public OAuth2RestTemplate restTemplate;

    @Qualifier("oauth2ClientContext")
    @Autowired
    private OAuth2ClientContext context;


    @PreAuthorize("hasPermission('', 'basic')")
    @ApiOperation(value = "Gets information of Employee", response= ActivatableObjectDaoService.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully received employee information"),
            @ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
            @ApiResponse(code=500, message ="Cannot retrieve Employee information")
    })
    @RequestMapping(value= "/auth/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<Employee> getInfo(OAuth2Authentication auth)
    {
        Employee emp = force.getCurrentEmployee(auth);
        String tk = restTemplate.getAccessToken().toString();
        emp.setAccessToken(tk);

        return ResponseEntity.ok(emp);
    }

    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(value= "api/v2/userRoleinfo")
    public @ResponseBody void getUserRoleInfo(OAuth2Authentication auth)
    {
        Employee emp = force.getCurrentEmployee(auth);
        logger.warn(emp);
    }

    @RequestMapping(value = "/api/v2/logout", method = RequestMethod.GET)
    public String logout() {
        return "redirect:/logout";
    }


}