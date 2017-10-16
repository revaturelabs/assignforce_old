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


@Entity
@Table(name = "CURRICULUM")

public class Curriculum implements Activatable{

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "curriculumSeq", sequenceName = "CURRICULUM_SEQ")
	@GeneratedValue(generator = "curriculumSeq", strategy = GenerationType.SEQUENCE)
	private int currId;
	
	@Column(name = "NAME", unique=true, nullable=false)
	private String name;
	
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="CURRICULUM_SKILL_JT", 
	joinColumns=@JoinColumn(name="CURRICULUM_ID"), 
	inverseJoinColumns=@JoinColumn(name="SKILL_ID"))
	//@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")					// ADDED this to fix serialization/infinite loop issues
	private List<Skill> skills;

	@Column(name="active", insertable = false)
	private Boolean active;

	@Column(name="CORE")
	private Boolean core;
	
	public Curriculum(){
		//noarg constructor
	}

	public Curriculum(int currId, String name, List<Skill> skills, boolean core) {
		super();
		this.currId = currId;
		this.name = name;
		this.skills = skills;
		this.core=core;
	}

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

	@Override
	public String toString() {
		return "Curriculum [ID = " + currId + ", name = " + name + ", skills = " + skills + "]";
	}	
}
