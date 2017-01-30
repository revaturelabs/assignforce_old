package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Unavailable;

public class RoomDTO {

	private int roomID;
	private String roomName;
	private List<Unavailable> unavailabilities;
	
	public int getRoomID() {
		return roomID;
	}
	public void setRoomID(int iD) {
		roomID = iD;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String name) {
		roomName = name;
	}
	public List<Unavailable> getUnavailabilities() {
		return unavailabilities;
	}
	public void setUnavailabilities(List<Unavailable> unavailabilities) {
		this.unavailabilities = unavailabilities;
	}
	
}
