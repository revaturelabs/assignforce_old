package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Building;
import com.revature.assignforce.domain.Unavailable;

public class RoomDTO {

	private int roomID;
	private String roomName;
	private int building;
	private List<Unavailable> unavailabilities;	
	private Boolean active;
	private int buildingId;
	
	public int getBuildingId(){
		return buildingId;
	}
	
	public void setBuildingId(int buildingId){
		this.buildingId = buildingId;
	}
	
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
	
}
