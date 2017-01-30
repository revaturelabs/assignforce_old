package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Skill;

public class CurriculumDTO {

	private int currID;
	private String name;
	private List<Skill> skills;
	
	public int getCurrID() {
		return currID;
	}
	public void setCurrID(int currID) {
		this.currID = currID;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Skill> getSkills() {
		return skills;
	}
	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}
}
