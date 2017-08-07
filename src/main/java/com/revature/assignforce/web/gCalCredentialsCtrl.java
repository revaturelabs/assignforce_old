package com.revature.assignforce.web;

import java.util.HashMap;

import com.revature.assignforce.annotations.Authorize;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/gCalCreds")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class gCalCredentialsCtrl {

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object retrieveCredentials(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
									  @RequestHeader(value="X-XSRF-TOKEN") String tokenValue) {
		String clientID = System.getenv("CLIENT_ID");
		String apiKey = System.getenv("API_KEY");
		String calendarID = System.getenv("CALENDAR_ID");
		HashMap<String,String> out = new HashMap<>();
		out.put("ClientID",clientID);
		out.put("ApiKey",apiKey);
		out.put("CalendarID",calendarID);
		return new ResponseEntity< HashMap<String,String> >(out, HttpStatus.OK);
	}
}
