package com.revature.assignforce.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
@RequestMapping(value = "/api/v2")
public class AuthController {

	//probably switch to @RequestBody for params, using an array of strings
	//temporary authentication until Parasol is up and running
	@RequestMapping(value="/auth", method=RequestMethod.POST)
	public void login(@RequestParam String username, @RequestParam String password, HttpServletResponse response) throws IOException {
		String user = System.getenv("AF_USERNAME");
		String pass = System.getenv("AF_PASSWORD");

		if (username.equals(user) && password.equals(pass)){
			//go to home
			response.sendRedirect("/home");
		} else {
			response.sendError(400, "Invalid login credentials");
		}
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
}
