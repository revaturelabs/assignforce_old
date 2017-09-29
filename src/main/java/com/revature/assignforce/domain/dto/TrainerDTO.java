package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Certification;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Unavailable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("TrainerDTO")
public class TrainerDTO {

	@ApiModelProperty(notes = "The trainer ID")
	private int trainerId;
	@ApiModelProperty(notes = "The trainers first name")
	private String firstName;
	@ApiModelProperty(notes = "The trainers last name")
	private String lastName;
	@ApiModelProperty(notes = "A list of the trainers skills ")
	private List<Skill> skills;
	@ApiModelProperty(notes = "A list of the trainers certifications")
	private List<Certification> certifications;
	@ApiModelProperty(notes = "A list of the trainers unavailabilities ")
	private List<Unavailable> unavailabilities;
	@ApiModelProperty(notes = "A boolean that marks the trainer active or not")
	private Boolean active;
	@ApiModelProperty(notes = "The trainers resume ")
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
	public List<Unavailable> getUnavailabilities() {
		return unavailabilities;
	}
	public void setUnavailabilities(List<Unavailable> unavailabilities) {
		this.unavailabilities = unavailabilities;
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
