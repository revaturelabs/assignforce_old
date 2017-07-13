package com.revature.assignforce.web;

import com.revature.assignforce.domain.Building;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.BuildingDTO;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by roger on 7/13/2017.
 */
public class BuildingCtrlTest {

    private BuildingDTO buildingDTO;

    private Building buildingTest;

    private List<Room> rooms = new ArrayList<>();

    private List<Unavailable> unavailabilities = new ArrayList<>();

    private Timestamp sTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now().minusMonths(3)).getTime());

    private Timestamp eTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime());

    @Autowired
    private MockMvc mvc;

    @MockBean
    ActivatableObjectDaoService<Building, Integer> buildingService;

    @Before
    public void setUp() throws Exception {
        buildingDTO = new BuildingDTO();
        buildingDTO.setID(1);
        buildingDTO.setName("Building");
        buildingDTO.setLocation(1);

        Room aRoom = new Room();
        aRoom.setRoomID(1);
        aRoom.setRoomName("Revature Room");
        aRoom.setActive(true);
        aRoom.setBuilding(1);

        Unavailable unavailable = new Unavailable();
        unavailable.setID(1);
        unavailable.setStartDate(sTimestamp);
        unavailable.setEndDate(eTimestamp);
        unavailabilities.add(unavailable);

        aRoom.setUnavailabilities(unavailabilities);
        rooms.add(aRoom);

        buildingDTO.setRooms(rooms);
        buildingDTO.setActive(true);

        buildingTest = new Building(buildingDTO.getID(), buildingDTO.getName(), buildingDTO.getRooms(),
                buildingDTO.getActive(), buildingDTO.getLocation());

    }

    @After
    public void tearDown() throws Exception {
        buildingDTO = null;
        buildingTest = null;
    }

    @Test
    public void createBuilding() throws Exception {
        //working on null pointer; Roger
//        mvc.perform(post("/api/v2/building")
//                .contentType(MediaType.APPLICATION_JSON_VALUE)
//                .content(buildingTest.toJsonString()))
//                .andExpect(status().isOk());
    }

    @Test
    public void retrieveBuilding() throws Exception {
    }

    @Test
    public void updateBuilding() throws Exception {
    }

    @Test
    public void deleteBuilding() throws Exception {
    }

    @Test
    public void retrieveAllBuildings() throws Exception {
    }

}