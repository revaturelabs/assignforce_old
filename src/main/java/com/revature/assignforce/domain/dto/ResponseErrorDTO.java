package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("ResponseErrorDTO")
public class ResponseErrorDTO {

	@ApiModelProperty(notes = "The current error message")
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
