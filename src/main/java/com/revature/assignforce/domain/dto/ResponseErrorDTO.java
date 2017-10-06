package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("ResponseError")
public class ResponseErrorDTO {

	@ApiModelProperty(notes = "The current error message", name = "errorMessage", dataType = "String")
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
