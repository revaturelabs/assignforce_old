package com.revature.assignforce.domain.dto;

import java.sql.Timestamp;
import java.util.List;

import com.revature.assignforce.domain.BatchLocation;
import com.revature.assignforce.domain.Skill;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("Batch")
public class BatchDTO {

	@ApiModelProperty(notes = "The Batch ID", name = "ID", dataType = "int")
	private int ID;
	@ApiModelProperty(notes = "The name of the batch", name = "name", dataType = "String")
	private String name;
	@ApiModelProperty(notes = "The curriculum assigned to the batch", name = "curriculum", dataType = "int")
	private int curriculum;
	@ApiModelProperty(notes = "The topic the batch will focus on", name = "focus", dataType = "int")
	private int focus;
	@ApiModelProperty(notes = "The trainer that will be assigned to the batch", name = "trainer", dataType = "int")
	private int trainer;
	@ApiModelProperty(notes = "The Co-trainer that will be assigned to the batch", name = "cotrainer", dataType = "int")
	private int cotrainer;
	@ApiModelProperty(notes = "the physical location the batch will be assigned to", name = "location", dataType = "int")
	private int location;
	@ApiModelProperty(notes = "The physical building the batch will be assigned to", name = "building", dataType = "int")
	private int building;
	@ApiModelProperty(notes = "The physical room the batch will be assigned to", name = "room", dataType = "int")
	private int room;
	@ApiModelProperty(notes = "The date the batch starts training", name = "startDate", dataType = "Timestamp")
	private Timestamp startDate;
	@ApiModelProperty(notes = "The date the batch stopped training", name = "endDate", dataType = "Timestamp")
	private Timestamp endDate;
	@ApiModelProperty(notes = "The list of technical skills", name = "skills", dataType = "List<Skill>")
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
