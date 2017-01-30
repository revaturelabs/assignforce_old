package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Unavailable;

public class TrainerDTO {

	private int ID;
	private String firstName;
	private String lastName;
	private List<Skill> skills;
	private List<Unavailable> unavailabilities;
	
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public List<Skill> getSkills() {
		return skills;
	}
	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}
	public List<Unavailable> getUnavailabilities() {
		return unavailabilities;
	}
	public void setUnavailabilities(List<Unavailable> unavailabilities) {
		this.unavailabilities = unavailabilities;
	}
	
}
