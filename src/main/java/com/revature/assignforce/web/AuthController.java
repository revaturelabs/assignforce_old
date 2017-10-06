package com.revature.assignforce.web;

import com.revature.assignforce.domain.Force;
import com.revature.assignforce.domain.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.hibernate4.SpringSessionContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController

public class AuthController {

    @Autowired
    private Force force;

    @Autowired
    public OAuth2RestTemplate restTemplate;

    @Qualifier("oauth2ClientContext")
    @Autowired
    private OAuth2ClientContext context;

    @RequestMapping(value= "auth/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getInfo(OAuth2Authentication auth)
    {
        Employee emp = force.getCurrentEmployee(auth);
        System.out.println("This is the emp role name: " + emp.getRoleName());
        String tk = restTemplate.getAccessToken().toString();
        emp.setAccessToken(tk);
//        req.getSession().setAttribute("auth", auth);
        System.out.println(auth.toString());

        return ResponseEntity.ok(emp);
    }


    @RequestMapping(value= "api/v2/userRoleinfo")
    public void getUserRoleInfo(OAuth2Authentication auth)
    {
        //Employee emp = force.getCurrentEmployee(auth);
        System.out.println("This is auth from userroleinfo: " + auth.toString());
        //return emp.getRoleName();
    }


}