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
	private int trainerId;

	@Column(name = "FIRST_NAME", nullable = false)
	private String firstName;

	@Column(name = "LAST_NAME", nullable = false)
	private String lastName;

	@Column(name = "TRAINER_RESUME")
	private String resume;

	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="TRAINER_UNAVAILABILITY_JT", 
	joinColumns=@JoinColumn(name="TRAINER"), 
	inverseJoinColumns=@JoinColumn(name="UNAVAILABILITY"))
	private List<Unavailable> unavailability;

	//@ManyToMany(mappedBy="trainer", cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@ManyToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
	@JoinTable(name="TRAINER_SKILL_JT",
    joinColumns=@JoinColumn(name="TRAINER"),
    inverseJoinColumns=@JoinColumn(name="SKILL"))
	@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")						// ADDED this to fix serialization/infinite loop issues
	private List<Skill> skills;

	@OneToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
	@JoinColumn(name="Trainer")
	private List<Certification> certifications;

	@Column(name="active", insertable = false)
	private Boolean active;

	public Trainer(){
		//noarg constructor
	}

	public Trainer(int trainerId, String firstName, String lastName, String resume, List<Unavailable> unavailability, List<Skill> skills, List<Certification> certifications) {
		super();
		this.trainerId = trainerId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.unavailability = unavailability;
		this.skills = skills;
		this.certifications = certifications;
		this.resume = resume;
	}

    public int getTrainerId() {
        return trainerId;
    }

	public void setTrainerId(int trainerId) {
		this.trainerId = trainerId;
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

	public List<Unavailable> getUnavailability() {
		return unavailability;
	}

	public void setUnavailability(List<Unavailable> unavailability) {
		this.unavailability = unavailability;
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

	public List<Certification> getCertifications() {
		return certifications;
	}

	public void setCertifications(List<Certification> certifications) {
		this.certifications = certifications;
	}

	public String getResume() {
		return resume;
	}

	public void setResume(String resume) {
		this.resume = resume;
	}
}
