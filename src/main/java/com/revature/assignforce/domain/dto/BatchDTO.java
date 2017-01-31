package com.revature.assignforce.domain.dto;

import java.sql.Timestamp;

public class BatchDTO {

	private int ID;
	private String name;
	private int curriculum;
	private int trainer;
	private int cotrainer;
	private int location;
	private int room;
	private Timestamp startDate;
	private Timestamp endDate;

	  // ID
	public int getID() {
		return ID;
	}
	public void setID(int batchId) {
		this.ID = batchId;
	}
	
	  // name
	public String getName() {
		return name;
	}
	public void setName(String batchName) {
		this.name = batchName;
	}
	
	  // curriculum
	public int getCurriculum() {
		return curriculum;
	}
	public void setCurriculum(int curr) {
		this.curriculum = curr;
	}
	
	  // trainer
	public int getTrainer() {
		return trainer;
	}
	public void setTrainer(int trainer) {
		this.trainer = trainer;
	}
	
	  // cotrainer
	public int getCotrainer() {
		return cotrainer;
	}
	public void setCotrainer(int cotrainer) {
		this.cotrainer = cotrainer;
	}
	
	  // location
	public int getLocation() {
		return location;
	}
	public void setLocation(int location) {
		this.location = location;
	}
	
	  // room
	public int getRoom() {
		return room;
	}
	public void setRoom(int room) {
		this.room = room;
	}
	
	  // start date
	public Timestamp getStartDate() {
		return startDate;
	}
	public void setStartDate(Timestamp date) {
		this.startDate = date;
	}
	
	  // end date
	public Timestamp getEndDate() {
		return endDate;
	}
	public void setEndDate(Timestamp endDate) {
		this.endDate = endDate;
	}
	
	@Override
	public String toString() {
		return "BatchDTO [batchName=" + name + ", curr=" + curriculum + ", trainer=" + trainer + 
				", cotrainer=" + cotrainer + ", room=" + room + ", date=" + startDate + ", date2=" + endDate + "]";
	}
	
	
	
	
	
	
	
}
