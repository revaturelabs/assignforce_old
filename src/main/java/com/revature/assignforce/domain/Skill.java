package com.revature.assignforce.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


@Entity
@Table(name = "SKILL")
public class Skill implements Activatable{

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "skillSeq", sequenceName = "SKILL_SEQ")
	@GeneratedValue(generator = "skillSeq", strategy = GenerationType.SEQUENCE)
	private int skillId;
	
	@Column(name = "NAME", unique=true, nullable=false)
	private String name;

	@Column(name="active", insertable = false)
	private Boolean active;

	public Skill(){}
	
	public Skill(int skillId, String name) {
		super();
		this.skillId = skillId;
		this.name = name;
	}

	public int getSkillId() {
		return skillId;
	}

	public void setSkillId(int skillId) {
		this.skillId = skillId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "Skill [ID = " + skillId + ", Name = " + name + "]";
	}
}
