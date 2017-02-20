package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Certification;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Unavailable;

public class TrainerDTO {

	private int trainerId;
	private String firstName;
	private String lastName;
	private List<Skill> skills;
	private List<Certification> certifications;
	private List<Unavailable> unavailability;
	private Boolean active;
	private String resume;
	
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
	public List<Skill> getSkills() {
		return skills;
	}
	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}
	public List<Certification> getCertifications() {
		return certifications;
	}
	public void setCertifications(List<Certification> certifications) {
		this.certifications = certifications;
	}
	public List<Unavailable> getUnavailability() {
		return unavailability;
	}
	public void setUnavailability(List<Unavailable> unavailability) {
		this.unavailability = unavailability;
	}
	public Boolean getActive() {
		return active;
	}
	public void setActive(Boolean active) {
		this.active = active;
	}
	public String getResume() {
		return resume;
	}
	public void setResume(String resume) {
		this.resume = resume;
	}
}
