package com.revature.assignforce.domain;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "UNAVAILABILITY")
public class Unavailable {

	

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "unavailableSeq", sequenceName = "UNAVAILABLE_SEQ")
	@GeneratedValue(generator = "unavailableSeq", strategy = GenerationType.SEQUENCE)
	private int ID;

	

	@Column(name = "START_DATE", nullable=false)
	private Timestamp startDate;



	@Column(name = "END_DATE", nullable=false)
	private Timestamp endDate;

	
	public Unavailable(){}


	public Unavailable(int iD, Timestamp startDate, Timestamp endDate) {
		super();
		ID = iD;
		this.startDate = startDate;
		this.endDate = endDate;
	}



	public int getID() {
		return ID;
	}



	public void setID(int iD) {
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



	@Override
	public String toString() {
		return "Unavailable [ID=" + ID + ", startDate=" + startDate + ", endDate=" + endDate + "]";
	}

	
}
