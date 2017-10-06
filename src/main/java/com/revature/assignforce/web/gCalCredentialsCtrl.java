package com.revature.assignforce.web;

import java.util.HashMap;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/gCalCreds")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class gCalCredentialsCtrl {

	@PreAuthorize("hasPermission('', 'none')")
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveCredentials() {
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
