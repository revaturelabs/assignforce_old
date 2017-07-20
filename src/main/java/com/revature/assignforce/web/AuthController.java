package com.revature.assignforce.web;

import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.domain.Force;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v2")
public class AuthController {

	@Autowired
	private Force force;

    @RequestMapping(value="/auth", method=RequestMethod.POST)
    public OAuth2Authentication getUser(OAuth2Authentication auth)
    {
        System.out.println("Authorized: @AuthController" + auth.getUserAuthentication().getDetails());
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
    @RequestMapping(value= "/userinfo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getInfo(OAuth2Authentication auth)
    {
        //System.out.println("AUTHCONTROLLER CURRENT EMPLOYEE: " + force.getCurrentEmployee(auth));
        return ResponseEntity.ok( force.getCurrentEmployee(auth));
    }

}