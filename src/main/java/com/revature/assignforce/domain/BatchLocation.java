package com.revature.assignforce.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * Created by August Duet on 4/7/2017.
 */
@Entity
@Table(name="BATCH_LOCATION")
@ApiModel("Batch")
public class BatchLocation {
    @Id
    @Column(name = "ID")
    @SequenceGenerator(allocationSize = 1, name = "batchLocSeq", sequenceName = "BATCH_LOC_SEQ")
    @GeneratedValue(generator = "batchLocSeq", strategy = GenerationType.SEQUENCE)
    private Integer id;

    @Column(name="LOCATION_ID")
    private Integer locationId = null;

    @Formula("(select LOCATION.NAME from LOCATION where LOCATION_ID = LOCATION.ID)")
    private String locationName;

    @Column(name="BUILDING_ID")
    private Integer buildingId = null;

    @Formula("(select BUILDING.NAME from BUILDING where BUILDING_ID = BUILDING.ID)")
    private String buildingName;

    @Column(name="ROOM_ID")
    private Integer roomId = null;

    @Formula("(select ROOM.NAME from ROOM where ROOM_ID = ROOM.ID)")
    private String roomName;

    public BatchLocation(){}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    @Override
    public String toString() {
        return "BatchLocation{" +
                "id=" + id +
                ", locationId=" + locationId +
                ", buildingId=" + buildingId +
                ", roomId=" + roomId +
                '}';
    }
}
