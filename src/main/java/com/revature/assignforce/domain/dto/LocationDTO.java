package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Building;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("LocationDTO")
public class LocationDTO {

	@ApiModelProperty(notes = "The location ID", name = "ID", dataType = "int")
	private int ID;
	@ApiModelProperty(notes = "The location name", name = "name", dataType = "String")
	private String name;
	@ApiModelProperty(notes = "The location city", name = "city", dataType = "String")
	private String city;
	@ApiModelProperty(notes = "The location state", name = "state", dataType = "String")
	private String state;
	@ApiModelProperty(notes = "A list of buildings at the location", name = "buildings", dataType = "List<Building>")
	private List<Building> buildings;
	@ApiModelProperty(notes = "A boolean used to mark a location active or not", name = "active", dataType = "Boolean")
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
