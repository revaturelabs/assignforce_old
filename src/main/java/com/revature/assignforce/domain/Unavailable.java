package com.revature.assignforce.domain;

import java.sql.Timestamp;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "UNAVAILABILITY")
public class Unavailable {	

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "unavailableSeq", sequenceName = "UNAVAILABLE_SEQ")
	@GeneratedValue(generator = "unavailableSeq", strategy = GenerationType.SEQUENCE)
	private int ID;

	
	//@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "START_DATE", nullable=false)
	private Timestamp startDate;


	//@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "END_DATE", nullable=false)
	private Timestamp endDate;

	
	public Unavailable(){
		//noarg constructor
	}

	public Unavailable(Timestamp startDate, Timestamp endDate) {
		super();
		this.startDate = startDate;
		this.endDate = endDate;
	}
	
	public Unavailable(int id, Timestamp startDate, Timestamp endDate) {
		super();
		this.ID = id;
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
		return "Unavailable [ID = " + ID + ", startDate = " + startDate + ", endDate = " + endDate + "]";
	}	
}
