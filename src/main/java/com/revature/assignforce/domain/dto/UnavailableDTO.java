package com.revature.assignforce.domain.dto;

import java.sql.Timestamp;
import java.util.Calendar;

/**
 * Created by Nick Edwards on 3/2/2017.
 */
public class UnavailableDTO {

	private int ID;
	private Timestamp startDate;
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