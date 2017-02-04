package com.revature.assignforce.domain.dto;

import com.revature.assignforce.domain.Unavailable;

import java.util.List;

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
