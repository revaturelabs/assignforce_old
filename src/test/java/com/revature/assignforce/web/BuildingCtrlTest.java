package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Building;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.BuildingDTO;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by roger on 7/13/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc

public class BuildingCtrlTest {

    private BuildingDTO buildingDTO;

    private Building buildingTest;

    @Autowired
    private MockMvc mvc;

    @MockBean
    ActivatableObjectDaoService<Building, Integer> buildingService;

    @Before
    public void setUp() throws Exception {

        List<Room> rooms = new ArrayList<>();

        List<Unavailable> unavailabilities = new ArrayList<>();

        Timestamp sTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now().minusMonths(3)).getTime());

        Timestamp eTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime());

        buildingDTO = new BuildingDTO();
        buildingDTO.setID(1);
        buildingDTO.setName("Building");
        buildingDTO.setLocation(1);

        Room aRoom = new Room();
        aRoom.setRoomID(1);
        aRoom.setRoomName("Revature Room");
        aRoom.setActive(true);
        aRoom.setBuilding(1);

        aRoom.setUnavailabilities(new ArrayList<>());
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

    //Happy Trail test case
//    @Test
//    public void createBuilding() throws Exception {
//        given(buildingService.saveItem(any(Building.class))).willReturn(buildingTest);
//        mvc.perform(post("/api/v2/building")
//                .contentType(MediaType.APPLICATION_JSON_VALUE)
//                .content(buildingTest.toJsonString()))
//                .andExpect(status().isOk());
//    }

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