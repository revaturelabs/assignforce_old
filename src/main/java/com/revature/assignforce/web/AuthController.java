package com.revature.assignforce.web;

//import com.revature.assignforce.Force;
import com.revature.assignforce.Force;
import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.domain.dto.LoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
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
	@Qualifier("oauth2ClientContext")
	@Autowired
	private OAuth2ClientContext context;


	//	@Autowired
//	private Force force;
//
//	@RequestMapping(value = "/auth", method = RequestMethod.POST)
//	public List<Force.Trainer> train(OAuth2Authentication principal) {
//		return force.trainers(principal);
//	}
@RequestMapping(value="/auth", method=RequestMethod.POST)
	public OAuth2Authentication getUser(OAuth2Authentication auth)
{


	System.out.println("Force.get Role: XXXXXXXXXXXXX " + force.getRole(auth));
//		System.out.println("USER DETAILS MMMMMMMMMMM: " + auth.getUserAuthentication().getDetails());
//		//return (List<Force>) force.getRole(auth);
//
	System.out.println("Authorized XZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" + (OAuth2Authentication) auth.getUserAuthentication().getDetails());
	return (OAuth2Authentication) auth.getUserAuthentication().getDetails();


}



	//used for Parasol. Temporarily out of order. Sorry for the inconvenience

	/*@RequestMapping(value="/authorize",method=RequestMethod.GET)
	public void initSetup(@RequestParam String redirect_url, HttpSession session, HttpServletResponse response) throws IOException{
		String sToken = (String) session.getAttribute("token");
		String authServiceRedirectUrl = System.getenv("AUTH_SERVICE_REDIRECT");

		if(authServiceRedirectUrl == null){
			response.sendError(500, "Could not contact the authorization service");
			return;
		}
		if(sToken == null){
			session.setAttribute("redirect", redirect_url);
			response.sendRedirect(authServiceRedirectUrl);
		}else{
			response.sendRedirect(String.format("%s?token=%s", redirect_url, sToken));
		}
	}

	@RequestMapping(value="/token")
	public void getToken(@RequestParam(required = false) String token, HttpSession session, HttpServletResponse response) throws IOException {

		session.setAttribute("token", token);
		String redirect = (String) session.getAttribute("redirect");
		response.sendRedirect(String.format("%s?token=%s", redirect, token));
	}*/

	@RequestMapping(value= "/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Employee> getInfo(OAuth2Authentication auth)
	{
		System.out.println("AUTHCONTROLLER CURRENT EMPLOYEE: " + force.getCurrentEmployee(auth));
		return ResponseEntity.ok( force.getCurrentEmployee(auth));
	}
}
