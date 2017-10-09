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
@RequestMapping("/api/v2/s3Creds")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class S3CredentialsCtrl {

	@PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveCredentials() {
		//grabs the S3 info name, accessId, and secretAccessId from your environment variables
		String s3ID = System.getenv("S3_ID");
		String s3SecretKey = System.getenv("S3_SECRET");
		String s3Name = System.getenv("S3_NAME");
		//insert the variables into a hashMap so that it could be passed as an JSON value
		HashMap<String,String> out = new HashMap<>();
		out.put("ID",s3ID);
		out.put("SecretKey",s3SecretKey);
		out.put("BucketName",s3Name);
		return new ResponseEntity< HashMap<String,String> >(out, HttpStatus.OK);
	}
}
