package com.revature.assignforce.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.assignforce.domain.Batch;

@RestController
@RequestMapping("/api/v2/s3Creds")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class S3CredentialsCtrl {

	
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveCredentials() {
		String s3ID = System.getenv("L_ID");
		String s3SecretKey = System.getenv("L_SECRET");
		String s3Name = System.getenv("L_NAME");
		HashMap<String,String> out = new HashMap<String,String>();
		out.put("ID",s3ID);
		out.put("SecretKey",s3SecretKey);
		out.put("BucketName",s3Name);
		return new ResponseEntity< HashMap<String,String> >(out, HttpStatus.OK);
	}
}
