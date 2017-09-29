package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Room;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("Batch")
public class BuildingDTO {

	@ApiModelProperty(notes = "The building ID")
	private int ID;
	@ApiModelProperty(notes = "The name of the building")
	private String name;
	@ApiModelProperty(notes = "The location of the building")
	private int location;
	@ApiModelProperty(notes = "A list of Rooms in the building")
	private List<Room> rooms;
	@ApiModelProperty(notes = "A boolean used to mark a building active or not")
	private Boolean active;

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

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

}
