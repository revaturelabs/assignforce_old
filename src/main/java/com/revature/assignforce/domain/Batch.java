package com.revature.assignforce.domain;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name="BATCH")
public class Batch {

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "batchSeq", sequenceName = "BATCH_SEQ")
	@GeneratedValue(generator = "batchSeq", strategy = GenerationType.SEQUENCE)
	private int ID;
	
	@Column(name="NAME")
	private String Name;

	@Column(name = "START_DATE", nullable=false)
	private Timestamp startDate;

	@Column(name = "END_DATE", nullable=false)
	private Timestamp endDate;

	@ManyToOne
	@JoinColumn(name = "CURRICULUM")
	@Fetch(FetchMode.JOIN)
	private Curriculum curriculum;
	
	@ManyToOne
	@JoinColumn(name = "ROOM")
	@Fetch(FetchMode.JOIN)
	private Room room;
	
	@ManyToOne
	@JoinColumn(name = "LOCATION")
	@Fetch(FetchMode.JOIN)
	private Location location;
	
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
	
	public Batch(){}
	
	public Batch(int iD, String name, Curriculum curriculum, Location location, Room room, Trainer trainer,
			Trainer cotrainer, Timestamp startDate, Timestamp endDate, BatchStatusLookup status) {
		super();
		ID = iD;
		Name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.curriculum = curriculum;
		this.room = room;
		this.location = location;
		this.batchStatus = status;
		this.trainer = trainer;
		this.cotrainer = cotrainer;
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


	public Room getRoom() {
		return room;
	}


	public void setRoom(Room room) {
		this.room = room;
	}


	public Location getLocation() {
		return location;
	}


	public void setLocation(Location location) {
		this.location = location;
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


	@Override
	public String toString() {
		return "Batch [ID=" + ID + ", Name=" + Name + ", startDate=" + startDate + ", endDate=" + endDate + ", curriculum=" + curriculum + ", room=" + room + ", location=" + location + ", batchStatus="
				+ batchStatus + ", trainer=" + trainer + "]";
	}


	public Trainer getCotrainer() {
		return cotrainer;
	}


	public void setCotrainer(Trainer coTrainer) {
		this.cotrainer = coTrainer;
	}


	public Batch(int iD, String name, Timestamp startDate, Timestamp endDate, Curriculum curriculum, Room room,
			Location location, BatchStatusLookup batchStatus, Trainer trainer, Trainer coTrainer) {
		super();
		ID = iD;
		Name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.curriculum = curriculum;
		this.room = room;
		this.location = location;
		this.batchStatus = batchStatus;
		this.trainer = trainer;
		this.cotrainer = coTrainer;
	}

}
