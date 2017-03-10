package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.Unavailable;

public class RoomDTO {

	// batches list may be unrequired.
	// currently, update room is broken, just trying to figure out why.
	private int roomID;
	private String roomName;
	private int building;
	private List<Unavailable> unavailabilities;
	private List<Batch> batches;
	private boolean active;
	
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

	public void setBuilding(int building){
		this.building = building;
	}
	public int getBuilding() {
		return this.building;
	}	

	public List<Unavailable> getUnavailabilities() {
		return unavailabilities;
	}
	public void setUnavailabilities(List<Unavailable> unavailabilities) {
		this.unavailabilities = unavailabilities;
	}

	public Boolean getActive() {
		return active;
	}
	public void setActive(Boolean active) {
		this.active = active;
	}
	public List<Batch> getBatches() {
		return batches;
	}
	public void setBatches(List<Batch> batches) {
		this.batches = batches;
	}
	
}
