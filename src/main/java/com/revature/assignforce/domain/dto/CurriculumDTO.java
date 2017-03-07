package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Skill;

public class CurriculumDTO {

	private int currId;
	private String name;
	private List<Skill> skills;
	private Boolean active;
	private Boolean core;
	
	public int getCurrId() {
		return currId;
	}
	public void setCurrId(int currId) {
		this.currId = currId;
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

	public Boolean getActive() {
		return active;
	}
	public void setActive(Boolean active) {
		this.active = active;
	}

	public Boolean getCore() {
		return core;
	}
	public void setCore(Boolean core) {
		this.core = core;
	}
}
