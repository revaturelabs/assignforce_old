package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by August Duet on 4/10/2017.
 */
@ApiModel("BatchLocationDTO")
public class BatchLocationDTO {

    @ApiModelProperty(notes = "The Location ID", name = "ID", dataType = "int")
    private Integer locationId;
    @ApiModelProperty(notes = "The name of the location", name = "locationName", dataType = "String")
    private String locationName;
    @ApiModelProperty(notes = "The building ID", name = "buildingId", dataType = "Integer")
    private Integer buildingId;
    @ApiModelProperty(notes = "The name of the Building", name = "buildingName", dataType = "String")
    private String buildingName;
    @ApiModelProperty(notes = "The room ID", name = "roomId", dataType = "Integer")
    private Integer roomId;
    @ApiModelProperty(notes = "The Name of the room", name = "roomName", dataType = "String")
    private String roomName;

    public BatchLocationDTO(){}

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    @Override
    public String toString() {
        return "BatchLocationDTO{" +
                "locationId=" + locationId +
                ", locationName='" + locationName + '\'' +
                ", buildingId=" + buildingId +
                ", buildingName='" + buildingName + '\'' +
                ", roomId=" + roomId +
                ", roomName='" + roomName + '\'' +
                '}';
    }
}
