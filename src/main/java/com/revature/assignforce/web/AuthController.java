package com.revature.assignforce.web;

import com.revature.assignforce.domain.Force;
import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.security.OAuth2TokenAuthenticator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    @Autowired
    private OAuth2TokenAuthenticator theTokenAuthenticator;

    @Autowired
    private Force force;

    @Autowired
    public OAuth2RestTemplate restTemplate;

    @Qualifier("oauth2ClientContext")
    @Autowired
    private OAuth2ClientContext context;

    @RequestMapping(value= "/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getInfo(OAuth2Authentication auth)
    {
        Employee emp = force.getCurrentEmployee(auth);
        String tk = restTemplate.getAccessToken().toString();
        theTokenAuthenticator.createSession(restTemplate.getAccessToken(), auth);
        emp.setAccessToken(tk);
        return ResponseEntity.ok(emp);
    }
}