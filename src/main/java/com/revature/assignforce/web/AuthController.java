package com.revature.assignforce.web;

import com.revature.assignforce.domain.dto.LoginDTO;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@RestController
@RequestMapping(value = "/api/v2")
public class AuthController {

	//temporary authentication until Parasol is up and running
	@RequestMapping(value="/auth", method=RequestMethod.POST)
	public void authenticate(@RequestBody LoginDTO login, HttpServletResponse response) throws IOException {
		String user = System.getenv("AF_USERNAME");
		String pass = System.getenv("AF_PASSWORD");

		if (!login.getUsername().equals(user) || !login.getPassword().equals(pass)){
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
