package com.revature.assignforce.domain;

import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "TRAINER")
public class Trainer implements Activatable{

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "trainerSeq", sequenceName = "TRAINER_SEQ")
	@GeneratedValue(generator = "trainerSeq", strategy = GenerationType.SEQUENCE)
	private int trainerID;

	@Column(name = "FIRST_NAME", nullable = false)
	private String firstName;

	@Column(name = "LAST_NAME", nullable = false)
	private String lastName;

	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="TRAINER_UNAVAILABILITY_JT", 
	joinColumns=@JoinColumn(name="TRAINER"), 
	inverseJoinColumns=@JoinColumn(name="UNAVAILABILITY"))
	private List<Unavailable> unavailable;

	//@ManyToMany(mappedBy="trainer", cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@ManyToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
	@JoinTable(name="TRAINER_SKILL_JT",
    joinColumns=@JoinColumn(name="TRAINER"),
    inverseJoinColumns=@JoinColumn(name="SKILL"))
	@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")						// ADDED this to fix serialization/infinite loop issues
	private List<Skill> skill;

	@OneToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
	@JoinColumn(name="Trainer")
	private List<Certification> certification;


	@Column(name="active", insertable = false)
	private Boolean active;

	public int getTrainerID() {
		return trainerID;
	}
	
	public Trainer(){}

	public Trainer(int trainerID, String firstName, String lastName, List<Unavailable> unavailable, List<Skill> skill, List<Certification> certification) {
		super();
		this.trainerID = trainerID;
		this.firstName = firstName;
		this.lastName = lastName;
		this.unavailable = unavailable;
		this.skill = skill;
		this.certification = certification;
	}


	public void setTrainerID(int trainerID) {
		this.trainerID = trainerID;
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

	public List<Unavailable> getUnavailable() {
		return unavailable;
	}
	
	public void setUnavailable(List<Unavailable> unavailable) {
		this.unavailable = unavailable;
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

	public List<Certification> getCertification() {
		return certification;
	}

	public void setCertification(List<Certification> certification) {
		this.certification = certification;
	}
}
