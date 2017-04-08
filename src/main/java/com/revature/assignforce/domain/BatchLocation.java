package com.revature.assignforce.domain;

import javax.persistence.*;

/**
 * Created by August Duet on 4/7/2017.
 */
@Entity
@Table(name="BATCH_LOCATION")
public class BatchLocation {
    @Id
    @Column(name = "ID")
    @SequenceGenerator(allocationSize = 1, name = "batchLocSeq")
    @GeneratedValue(generator = "batchLocSeq", strategy = GenerationType.SEQUENCE)
    private Integer id;

    @Column(name="LOCATION_ID")
    private Integer locationId = null;

    @Column(name="BUILDING_ID")
    private Integer buildingId = null;

    @Column(name="ROOM_ID")
    private Integer roomId = null;

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
