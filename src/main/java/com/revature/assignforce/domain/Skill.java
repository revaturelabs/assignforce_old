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
	private int ID;
	
	@Column(name = "NAME", unique=true, nullable=false)
	private String Name;

	@Column(name="active", insertable = false)
	private Boolean active;

	public Skill(){}
	
	public Skill(int iD, String name) {
		super();
		ID = iD;
		Name = name;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "Skill [ID=" + ID + ", Name=" + Name + "]";
	}

	
	
}
