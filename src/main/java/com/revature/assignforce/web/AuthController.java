package com.revature.assignforce.web;

//import com.revature.assignforce.Force;
import com.revature.assignforce.Force;
import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.domain.dto.LoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v2")
public class AuthController {

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
		emp.setAccessToken(tk);
		return ResponseEntity.ok(emp);
	}
}
