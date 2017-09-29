package com.revature.assignforce.domain.dto;

import java.util.List;

import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.Unavailable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("RoomDTO")
public class RoomDTO {

	// batches list may be unrequired.
	// currently, update room is broken, just trying to figure out why.
	@ApiModelProperty(notes = "The room ID", name = "roomID", dataType = "int")
	private int roomID;
	@ApiModelProperty(notes = "The room name", name = "roomName", dataType = "String")
	private String roomName;
	@ApiModelProperty(notes = "The building number the room belongs to", name = "building", dataType = "int")
	private int building;
	@ApiModelProperty(notes = "A list of unavailabilities", name = "unavailabilities", dataType = "List<Unavailable>")
	private List<Unavailable> unavailabilities;
	@ApiModelProperty(notes = "A boolean that marks the room active or not", name = "active", dataType = "boolean")
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
}
