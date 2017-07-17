package com.revature.assignforce.domain;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "BATCH", uniqueConstraints = {
		@UniqueConstraint(columnNames = "BATCH_LOCATION")
})
public class Batch {

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "batchSeq", sequenceName = "BATCH_SEQ")
	@GeneratedValue(generator = "batchSeq", strategy = GenerationType.SEQUENCE)
	private int ID;

	@Column(name = "NAME")
	private String name;

	@Column(name = "START_DATE", nullable = false)
	private Timestamp startDate;

	@Column(name = "END_DATE", nullable = false)
	private Timestamp endDate;

	@Column(name = "SINKED")
	private int sinked;

	@Column(name = "SALESFORCEID")
	private String SFId;


	@ManyToOne
	@JoinColumn(name = "CURRICULUM")
	@Fetch(FetchMode.JOIN)
	private Curriculum curriculum;
	
	@ManyToOne
	@JoinColumn(name = "FOCUS")
	@Fetch(FetchMode.JOIN)
	private Curriculum focus;


	@ManyToOne
	@JoinColumn(name = "STATUS")
	@Fetch(FetchMode.JOIN)
	private BatchStatusLookup batchStatus;

	@ManyToOne
	@JoinColumn(name = "TRAINER")
	@Fetch(FetchMode.JOIN)
	private Trainer trainer;

	@ManyToOne
	@JoinColumn(name = "COTRAINER")
	@Fetch(FetchMode.JOIN)
	private Trainer cotrainer;
	
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="BATCH_SKILL_JT", 
	joinColumns=@JoinColumn(name="BATCH_ID"), 
	inverseJoinColumns=@JoinColumn(name="SKILL_ID"))
	//@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")					// ADDED this to fix serialization/infinite loop issues
	private List<Skill> skills;

	@OneToOne
	@JoinColumn(name = "BATCH_LOCATION")
	BatchLocation batchLocation;

	public Batch() {
		// noarg constructor
	}

	public Batch(int iD, String name, Timestamp startDate, Timestamp endDate, Curriculum curriculum,
			BatchStatusLookup batchStatus, Trainer trainer, Trainer coTrainer, List<Skill> skills,
			Curriculum focus, BatchLocation batchLocation, int sinked
		) {
		super();
		ID = iD;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.curriculum = curriculum;
		this.batchStatus = batchStatus;
		this.trainer = trainer;
		this.cotrainer = coTrainer;
		this.skills = skills;
		this.focus = focus;
		this.batchLocation = batchLocation;
		this.sinked = sinked;
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

	public Timestamp getStartDate() {
		return startDate;
	}

	public void setStartDate(Timestamp startDate) {
		this.startDate = startDate;
	}

	public Timestamp getEndDate() {
		return endDate;
	}

	public void setEndDate(Timestamp endDate) {
		this.endDate = endDate;
	}

	public Curriculum getCurriculum() {
		return curriculum;
	}

	public void setCurriculum(Curriculum curriculum) {
		this.curriculum = curriculum;
	}
	
	public Curriculum getFocus() {
		return focus;
	}

	public void setFocus(Curriculum focus) {
		this.focus = focus;
	}

	public BatchStatusLookup getBatchStatus() {
		return batchStatus;
	}

	public void setBatchStatus(BatchStatusLookup batchStatus) {
		this.batchStatus = batchStatus;
	}

	public Trainer getTrainer() {
		return trainer;
	}

	public void setTrainer(Trainer trainer) {
		this.trainer = trainer;
	}
	
	public List<Skill> getSkills() {
		return skills;
	}

	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}

	public BatchLocation getBatchLocation() {
		return batchLocation;
	}

	public void setBatchLocation(BatchLocation batchLocation) {
		this.batchLocation = batchLocation;
	}

    public int getSinked() {
        return sinked;
    }

    public void setSinked(int sinked) {
        this.sinked = sinked;
    }

	public String getSFId() {return SFId;}

	public void setSFId(String SFId) {this.SFId = SFId;}

	@Override
	public String toString() {
		return "Batch [ID=" + ID + ", Name = " + name + ", startDate = " + startDate + ", endDate = " + endDate
				+ ", curriculum = " + curriculum + ", focus = " + focus + ", batchStatus = " + batchStatus +
                ", trainer = "+ trainer + ", cotrainer = " + cotrainer + ", sinked = " + sinked +"]";
	}

	public Trainer getCotrainer() {
		return cotrainer;
	}

	public void setCotrainer(Trainer coTrainer) {
		this.cotrainer = coTrainer;
	}
}
