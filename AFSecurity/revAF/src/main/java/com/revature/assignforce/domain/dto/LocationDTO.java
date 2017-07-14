package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Building;

public class LocationDTO {

	private int ID;
	private String name;
	private String city;
	private String state;
	private List<Building> buildings;
	private Boolean active;

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

	public void setBuildings(List<Building> buildings) {
		this.buildings = buildings;
	}

	public List<Building> getBuildings() {
		return buildings;
	}

}
