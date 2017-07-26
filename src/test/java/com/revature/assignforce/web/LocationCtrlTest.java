package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.dto.LocationDTO;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by roger on 7/14/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc

public class LocationCtrlTest {

    private LocationDTO locationDTO;

    private Location locationTest;

    private JsonMaker jsonMaker = new JsonMaker();

    @Autowired
    private MockMvc mvc;

    @MockBean
    ActivatableObjectDaoService<Location, Integer> locationService;


    @Before
    public void setUp() throws Exception {
        locationDTO = new LocationDTO();
        locationDTO.setID(1);
        locationDTO.setName("Test");
        locationDTO.setCity("Test");
        locationDTO.setState("Test");
        locationDTO.setBuildings(new ArrayList<>());
        locationDTO.setActive(true);

        locationTest = new Location(locationDTO.getID(),locationDTO.getName(),locationDTO.getCity(),
                locationDTO.getState(),locationDTO.getBuildings(),locationDTO.getActive());

    }

    @After
    public void tearDown() throws Exception {
        locationDTO = null;
        locationTest = null;
    }

    @Test
    @WithMockUser
    public void createLocationTest() throws Exception {
        given(locationService.saveItem(any(Location.class))).willReturn(locationTest);
        mvc.perform(post("/api/v2/location")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(locationTest))
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void createLocationWithEmptyDTOTest() throws Exception {
        given(locationService.saveItem(any(Location.class))).willReturn(null);
        mvc.perform(post("/api/v2/location")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(locationTest)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser
    public void createLocationReturnNullTest() throws Exception {
        given(locationService.saveItem(any(Location.class))).willReturn(null);
        mvc.perform(post("/api/v2/location")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    public void retrieveLocationTest() throws Exception {
        given(locationService.getOneItem(any(Integer.class))).willReturn(locationTest);
        mvc.perform(get("/api/v2/location/1")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(locationTest.getName())))
                .andExpect(jsonPath("$.city", is(locationTest.getCity())))
                .andExpect(jsonPath("$.state", is(locationTest.getState())));
    }

    @Test
    @WithMockUser
    public void retrieveLocationWithBadIdTest() throws Exception {
        given(locationService.getOneItem(any(Integer.class))).willReturn(null);
        mvc.perform(get("/api/v2/location/1")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isNotFound());

    }

    @Test
    @WithMockUser
    public void updateLocationTest() throws Exception {
        given(locationService.saveItem(any(Location.class))).willReturn(locationTest);
        mvc.perform(put("/api/v2/location")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(locationTest)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void updateLocationWithEmptyDTOTest() throws Exception {
        locationTest = new Location();
        given(locationService.saveItem(any(Location.class))).willReturn(null);
        mvc.perform(put("/api/v2/location")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(locationTest)))
                .andExpect(status().isNotModified());
    }

    @Test
    @WithMockUser
    public void updateLocationReturnNullTest() throws Exception {
        locationTest = new Location();
        given(locationService.saveItem(any(Location.class))).willReturn(null);
        mvc.perform(put("/api/v2/location")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    public void deleteLocationTest() throws Exception {
        doNothing().when(locationService).deleteItem(any(Integer.class));
        mvc.perform(delete("/api/v2/location/1")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void retrieveAllLocationsTest() throws Exception {
        List<Location> locations = new ArrayList<>();
        locations.add(locationTest);
        given(locationService.getAllItems()).willReturn(locations);
        mvc.perform(get("/api/v2/location")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void retrieveAllLocationsWithEmptyListTest() throws Exception {
        List<Location> locations = new ArrayList<>();
        given(locationService.getAllItems()).willReturn(locations);
        mvc.perform(get("/api/v2/location")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    public void retrieveAllLocationsReturnNullTest() throws Exception {
        given(locationService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/location")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }
}