package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.sql.Timestamp;
import java.util.Calendar;

/**
 * Created by Nick Edwards on 3/2/2017.
 */
@ApiModel("UnavailableDTO")
public class UnavailableDTO {

	@ApiModelProperty(notes = "The unavailable ID", name = "ID", dataType = "int")
	private int ID;
	@ApiModelProperty(notes = "The start date of unavailability", name = "startDate", dataType = "Timestamp")
	private Timestamp startDate;
	@ApiModelProperty(notes = "The end date of unavailability", name = "endDate", dataType = "Timestamp")
	private Timestamp endDate;

	public int getUnavailableId() {
		return ID;
	}

	public void setUnavailableId(int iD) {
		ID = iD;
	}

	public Timestamp getStartDate() {
		return startDate;
	}

	public void setStartDate(Timestamp startDate) {
		this.startDate = startDate;
	}

	public Timestamp getEndDate() {
		return endDate;
	}

	public void setEndDate(Timestamp endDate) {
		this.endDate = endDate;
	}
}