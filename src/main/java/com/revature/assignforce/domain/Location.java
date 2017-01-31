package com.revature.assignforce.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "LOCATION")
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class Location implements Activatable{
	
	@Id
	@Column(name = "ID")
	@SequenceGenerator(allocationSize = 1, name = "locationSeq", sequenceName = "LOCATION_SEQ")
	@GeneratedValue(generator = "locationSeq", strategy = GenerationType.SEQUENCE)
	private int ID;
	
	@Column(name = "NAME", unique=true, nullable=false)
	private String name;
	
	@Column(name = "CITY")
	private String city;
	
	@Column(name = "STATE")
	private String state;

	@Column(name="active", insertable = false)
	private Boolean active;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name="LOCATION")
	//@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private List<Room> rooms;
	
	public Location(){}

	public Location(int iD, String name, String city, String state, List<Room> rooms, Boolean active) {
		super();
		ID = iD;
		this.name = name;
		this.city = city;
		this.state = state;
		this.rooms = rooms;
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

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public List<Room> getRooms() {
		return rooms;
	}

	public void setRooms(List<Room> rooms) {
		this.rooms = rooms;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "Location [ID=" + ID + ", name=" + name + ", city=" + city + ", state=" + state + ", rooms=" + rooms
				+ "]";
	}

	
	
}