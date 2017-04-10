package com.revature.assignforce.domain.dto;

import java.sql.Timestamp;
import java.util.List;

import com.revature.assignforce.domain.BatchLocation;
import com.revature.assignforce.domain.Skill;

public class BatchDTO {

	private int ID;
	private String name;
	private int curriculum;
	private int focus;
	private int trainer;
	private int cotrainer;
	private int location;
	private int building;
	private int room;
	private Timestamp startDate;
	private Timestamp endDate;
	private List<Skill> skills;

	public BatchDTO(){}

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
	
	  // focus
	public int getFocus() {
		return focus;
	}
	public void setFocus(int focus) {
		this.focus = focus;
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
	
	//skills
	public List<Skill> getSkills() {
		return skills;
	}
	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}

	//building
	public int getBuilding() {return building;}
	public void setBuilding(int building) {this.building = building;}

	@Override
	public String toString() {
		return "BatchDTO [batchName = " + name + ", curr = " + curriculum + ", focus = " + focus
				+ ", trainer = " + trainer + ", cotrainer = " + cotrainer + ", room = " + room
				+ ", date = " + startDate + ", date2 = " + endDate + "]";
	}
	
	
	
	
	
	
	
}
