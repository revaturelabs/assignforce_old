package com.revature.assignforce.domain;

import java.util.List;

import javax.persistence.*;

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
	
	//it is a one to one relationship, but we only need an id here
	@Column(name = "BUILDING")
	private int building;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "ROOM_UNAVAILABILITY_JT", joinColumns = @JoinColumn(name = "ROOM_ID"), inverseJoinColumns = @JoinColumn(name = "UNAVAILABLE_ID"))
	@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "@id")
	private List<Unavailable> unavailability;

	@OneToMany(mappedBy = "room")
	@JsonIgnoreProperties("room")//ignores properties of room in batches
	private List<Batch> batches;

	@Column(name = "active", insertable = false)
	private Boolean active;

	public Room() {
		//No arg constructor
	}

	public Room(int roomID, String roomName, int building, List<Unavailable> unavailability) {
		super();
		this.roomID = roomID;
		this.roomName = roomName;
		this.building = building;
		this.unavailability = unavailability;
	}
	
	public Room(int roomID, String roomName, int building, List<Unavailable> unavailability, Boolean active) {
		super();
		this.roomID = roomID;
		this.roomName = roomName;
		this.building = building;
		this.unavailability = unavailability;
		this.active = active;
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

	public List<Unavailable> getUnavailability() {
		return unavailability;
	}
	public void setUnavailability(List<Unavailable> unavailability) {
		this.unavailability = unavailability;
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
				+ unavailability + ", batches = " + batches + ", active = " + active + "]";
	}
}