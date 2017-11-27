package com.revature.assignforce.web;

import java.util.HashMap;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/gCalCreds")
@ComponentScan(basePackages="com.revature.assignforce.service")
@Api(value = "Google Calender Credentials Controller", description = "Operations regarding Google Calender Credentials")
public class gCalCredentialsCtrl {

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Retrieve Google Calender Credentials", response = ResponseEntity.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully retrieved Credentials information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot retrieve Credentials information")
	})
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
