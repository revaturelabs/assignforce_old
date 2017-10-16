package com.revature.assignforce.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name = "BUILDING")
@JsonInclude(value = JsonInclude.Include.NON_NULL)
// @JsonIgnoreProperties(ignoreUnknown = true)

public class Building implements Activatable {

	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "buildingSeq", sequenceName = "BUILDING_SEQ")
	@GeneratedValue(generator = "buildingSeq", strategy = GenerationType.SEQUENCE)
	private int ID;

	@Column(name = "NAME", unique = true, nullable = false)
	private String name;

	@Column(name = "LOCATION")
	private int location;

	@Column(name = "active", insertable = false)
	private Boolean active;

	@OneToMany
	@JoinColumn(name = "BUILDING")
	private List<Room> rooms;

	public Building() {
		//No arg constructor
	}

	public Building(int ID, String name, List<Room> rooms, boolean active, int location) {
		super();
		this.ID = ID;
		this.name = name;
		this.rooms = rooms;
		this.location = location;
		this.active = active;
	}

	public Building(int location) {
		this.location = location;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
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

	public int getLocation() {
		return location;
	}

	public void setLocation(int location) {
		this.location = location;
	}

	public List<Room> getRooms() {
		return rooms;
	}

	public void setRooms(List<Room> rooms) {
		this.rooms = rooms;
	}

	@Override
	public String toString() {
		return "Building [ID = " + ID + ", name = " + name + ", location = " + location + ", active = " + active
				+ ", rooms = " + rooms + "]";
	}
}