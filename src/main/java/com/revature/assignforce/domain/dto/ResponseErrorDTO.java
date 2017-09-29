package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;

@ApiModel("ResponseErrorDTO")
public class ResponseErrorDTO {

	private String errorMessage;

	public ResponseErrorDTO() {
		super();
	}
	
	public ResponseErrorDTO(String message) {
		super();
		this.errorMessage = message;
	}
	
	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	
}
