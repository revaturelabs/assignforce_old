package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Building;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.BuildingDTO;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.utils.JsonMaker;
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

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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

    private JsonMaker jsonMaker = new JsonMaker();

    @Autowired
    private MockMvc mvc;

    @MockBean
    ActivatableObjectDaoService<Building, Integer> buildingService;

    @Before
    public void setUp() throws Exception {

        List<Room> rooms = new ArrayList<>();

        buildingDTO = new BuildingDTO();
        buildingDTO.setID(1);
        buildingDTO.setName("Building");
        buildingDTO.setLocation(1);
        buildingDTO.setActive(true);

        Room aRoom = new Room();
        aRoom.setRoomID(1);
        aRoom.setRoomName("Revature Room");
        aRoom.setActive(true);
        aRoom.setBuilding(1);

        aRoom.setUnavailabilities(new ArrayList<>());
        rooms.add(aRoom);
        buildingDTO.setRooms(rooms);


        buildingTest = new Building(buildingDTO.getID(), buildingDTO.getName(), buildingDTO.getRooms(),
                buildingDTO.getActive(), buildingDTO.getLocation());

    }

    @After
    public void tearDown() throws Exception {
        buildingDTO = null;
        buildingTest = null;
    }

<<<<<<< HEAD
    //Happy Trail test case
//    @Test
//    public void createBuilding() throws Exception {
//        given(buildingService.saveItem(any(Building.class))).willReturn(buildingTest);
//        mvc.perform(post("/api/v2/building")
//                .contentType(MediaType.APPLICATION_JSON_VALUE)
//                .content(buildingTest.toJsonString()))
//                .andExpect(status().isOk());
//    }
=======
    @Test
    public void createBuildingTest() throws Exception {
        given(buildingService.saveItem(any(Building.class))).willReturn(buildingTest);
        mvc.perform(post("/api/v2/building")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(buildingTest)))
                .andExpect(status().isOk());
    }

    @Test
    public void createBuildingWithEmptyDTOTest() throws Exception{
        given(buildingService.saveItem(any(Building.class))).willReturn(null);
        buildingTest = new Building();
        mvc.perform(post("/api/v2/building")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(buildingTest)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void createBuildingWithNullDTOTest() throws Exception{
        given(buildingService.saveItem(any(Building.class))).willReturn(null);
        mvc.perform(post("/api/v2/building")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isBadRequest());

    }

    @Test
    public void retrieveBuildingTest() throws Exception {
        given(buildingService.getOneItem(any(Integer.class))).willReturn(buildingTest);
        mvc.perform(get("/api/v2/building/1")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(buildingTest.getName())))
                .andExpect(jsonPath("$.location", is(buildingTest.getLocation())))
                .andExpect(jsonPath("$.active", is(buildingTest.getActive())));
    }

    @Test
    public void retrieveBuildingWithBadIdTest() throws Exception {
        given(buildingService.getOneItem(any(Integer.class))).willReturn(null);
        mvc.perform(get("/api/v2/building/1")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateBuildingTest() throws Exception {
        given(buildingService.saveItem(any(Building.class))).willReturn(buildingTest);
        mvc.perform(put("/api/v2/building")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(buildingTest)))
                .andExpect(status().isOk());
    }
>>>>>>> e1b1c42ffc3c817f9892d38ccc5c76c3ea012df6

    //null pointer exception
//    @Test
//    public void updateBuildingWithEmptyDTOTest() throws Exception {
//        buildingTest = new Building();
//        given(buildingService.saveItem(any(Building.class))).willReturn(null);
//        mvc.perform(put("/api/v2/building")
//                .contentType(MediaType.APPLICATION_JSON_VALUE)
//                .content(jsonMaker.toJsonString(buildingTest)))
//                .andExpect(status().isNotModified());
//    }

    @Test
    public void updateBuildingWithNullDTOTest() throws Exception {
        buildingTest = new Building();
        given(buildingService.saveItem(any(Building.class))).willReturn(null);
        mvc.perform(put("/api/v2/building")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(""))
                .andExpect(status().isBadRequest());

    }

    @Test
    public void deleteBuildingTest() throws Exception {
        doNothing().when(buildingService).deleteItem(any(Integer.class));
        mvc.perform(delete("/api/v2/building/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void retrieveAllBuildingsTest() throws Exception {
        List<Building> buildings = new ArrayList<>();
        buildings.add(buildingTest);
        given(buildingService.getAllItems()).willReturn(buildings);
        mvc.perform(get("/api/v2/building"))
                .andExpect(status().isOk());
    }

    @Test
    public void retrieveAllBuildingsReturnEmptyListTest() throws Exception {
        List<Building> buildings = new ArrayList<>();
        given(buildingService.getAllItems()).willReturn(buildings);
        mvc.perform(get("/api/v2/building"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void retrieveAllBuildingsReturnNullTest() throws Exception {
        given(buildingService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/building"))
                .andExpect(status().isNotFound());

    }
}