package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Room;

public class BuildingDTO {

	private int ID;
	private String name;
	private Location location;
	private List<Room> rooms;
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

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
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
