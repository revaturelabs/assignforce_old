package com.revature.assignforce.domain;

import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name = "ROOM")
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Room implements Activatable {

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "roomSeq", sequenceName = "ROOM_SEQ")
	@GeneratedValue(generator = "roomSeq", strategy = GenerationType.SEQUENCE)
	private int roomID;

	@Column(name = "NAME", nullable = false)
	private String roomName;
	
	//it is a one to one relationship, but we only need an id here..  Right?
	@Column(name="BUILDING")
	private int building;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "ROOM_UNAVAILABILITY_JT",
	joinColumns = @JoinColumn(name = "ROOM_ID"),
	inverseJoinColumns = @JoinColumn(name = "UNAVAILABLE_ID"))
	//@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "@id")
	private List<Unavailable> unavailable;

	@OneToMany(mappedBy = "room")
	@JsonIgnoreProperties("room")
	private List<Batch> batches;

	@Column(name = "active", insertable = false)
	private Boolean active;

	public Room() {
		//No arg constructor
	}

	public Room(int roomID, String roomName, int building, List<Unavailable> unavailable) {
		super();
		this.roomID = roomID;
		this.roomName = roomName;
		this.building = building;
		this.unavailable = unavailable;
	}
	
	public Room(int roomID, String roomName, int building, List<Unavailable> unavailable, Boolean active) {
		super();
		this.roomID = roomID;
		this.roomName = roomName;
		this.building = building;
		this.unavailable = unavailable;
		this.active = active;
	}
	
	public Room(int buildingID){
		this.building = buildingID;
	}

	public int getBuilding() {
		return building;
	}

	public void setBuilding(int building) {
		this.building = building;
	}

	public int getRoomID() {
		return roomID;
	}

	public void setRoomID(int roomID) {
		this.roomID = roomID;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public List<Unavailable> getUnavailable() {
		return unavailable;
	}

	public void setUnavailable(List<Unavailable> unavailable) {
		this.unavailable = unavailable;
	}

	public List<Batch> getBatches() {
		return batches;
	}

	public void setBatches(List<Batch> batches) {
		this.batches = batches;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "Room [roomID = " + roomID + ", roomName = " + roomName + ", building = " + building + ", unavailable = "
				+ unavailable + ", batches = " + batches + ", active = " + active + "]";
	}
}