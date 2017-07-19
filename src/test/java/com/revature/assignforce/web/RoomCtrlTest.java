package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.Unavailable;
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

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.*;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by gdittric on 7/13/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc
public class RoomCtrlTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ActivatableObjectDaoService<Room, Integer> roomService;


    private Room testRoom = null;

    private JsonMaker jsonMaker = new JsonMaker();

    @Before
    public void setUp(){
        List<Unavailable> unavailablities = new ArrayList<Unavailable>();
        testRoom = new Room(0, "aRoom",
                3, unavailablities, false);

    }

    @After
    public void tearDown(){
        testRoom = null;
    }

    @Test
    public void createRoom() throws Exception {
        given(roomService.saveItem(any(Room.class))).willReturn(testRoom);
        mvc.perform(post("/api/v2/room")
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonMaker.toJsonString(testRoom)))
                .andExpect(status().isOk());
    }

    @Test
    public void createRoomWithInvalidDTO() throws Exception {
        given(roomService.saveItem(any(Room.class))).willReturn(null);
        mvc.perform(post("/api/v2/room")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testRoom)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void retrieveRoom() throws Exception {
        given(roomService.getOneItem(anyInt())).willReturn(testRoom);
        mvc.perform(get("/api/v2/room/42"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomName", is(testRoom.getRoomName())));
    }

    @Test
    public void retrieveInvalidRoom() throws Exception {
        given(roomService.getOneItem(anyInt())).willReturn(null);
        mvc.perform(get("/api/v2/room/42"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateRoom() throws Exception {
        given(roomService.saveItem(any(Room.class))).willReturn(testRoom);
        mvc.perform(put("/api/v2/room")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testRoom)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.roomName",
                            is(testRoom.getRoomName())));
    }

    @Test
    public void updateInvalidRoom() throws Exception {
        given(roomService.saveItem(any(Room.class))).willReturn(null);
        mvc.perform(put("/api/v2/room")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testRoom)))
                .andExpect(status().isNotModified());
    }

    @Test
    public void deleteRoom() throws Exception {
        doNothing().when(roomService).deleteItem(anyInt());
        mvc.perform(delete("/api/v2/room/42"))
                .andExpect(status().isOk());
    }

    @Test
    public void retrieveAllRooms() throws Exception {
        List<Room> rooms = new ArrayList<Room>();
        rooms.add(testRoom);
        given(roomService.getAllItems()).willReturn(rooms);
        mvc.perform(get("/api/v2/room"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(rooms.size())));
    }

    @Test
    public void retrieveAllRoomsWithEmptySet() throws Exception {
        List<Room> rooms = new ArrayList<Room>();
        given(roomService.getAllItems()).willReturn(rooms);
        mvc.perform(get("/api/v2/room"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void retrieveAllRoomsWithFailure() throws Exception {
        given(roomService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/room"))
                .andExpect(status().isNotFound());
    }

}