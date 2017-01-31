package com.revature.assignforce.domain;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "CURRICULUM")
public class Curriculum implements Activatable{

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "curriculumSeq", sequenceName = "CURRICULUM_SEQ")
	@GeneratedValue(generator = "curriculumSeq", strategy = GenerationType.SEQUENCE)
	private int ID;
	
	@Column(name = "NAME", unique=true, nullable=false)
	private String name;
	
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="CURRICULUM_SKILL_JT", 
	joinColumns=@JoinColumn(name="CURRICULUM_ID"), 
	inverseJoinColumns=@JoinColumn(name="SKILL_ID"))
	@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")					// ADDED this to fix serialization/infinite loop issues
	private List<Skill> skill;

	@Column(name="active", insertable = false)
	private Boolean active;

	
	public Curriculum(){}
	
	public Curriculum(int iD, String name, List<Skill> skill) {
		super();
		ID = iD;
		this.name = name;
		this.skill = skill;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Skill> getSkill() {
		return skill;
	}

	public void setSkill(List<Skill> skill) {
		this.skill = skill;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "Curriculum [ID=" + ID + ", name=" + name + ", skill=" + skill + "]";
	}

	
	
}
