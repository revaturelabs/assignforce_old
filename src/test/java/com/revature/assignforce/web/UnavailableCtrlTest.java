package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.service.DaoService;
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
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by gdittric on 7/12/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc
public class UnavailableCtrlTest {

    private Unavailable testUnavailable = null;

    private JsonMaker jsonMaker = new JsonMaker();

    @Autowired
    UnavailableCtrl anUnavailableController;

    @Autowired
    private MockMvc mvc;

    @MockBean
    DaoService<Unavailable, Integer> unavailableService;

    @Before
    public void setUp(){
        testUnavailable = new Unavailable(0,
                new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime()),
                new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime()));

    }

    @After
    public void tearDown(){
        testUnavailable = null;
    }

    @Test
    public void createUnavailabilityTest() throws Exception {
        given(unavailableService.saveItem(any(Unavailable.class))).willReturn(testUnavailable);
        System.out.println(Timestamp.valueOf(LocalDateTime.now()).toString());
        mvc.perform(post("/api/v2/unavailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testUnavailable)))
                .andExpect(status().isOk());
    }

    @Test
    public void createUnavailabilityWithEmptyDTOTest() throws Exception {
        testUnavailable = new Unavailable();
        given(unavailableService.saveItem(any(Unavailable.class))).willReturn(null);
        mvc.perform(post("/api/v2/unavailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testUnavailable)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void createUnavailabilityWithNoDTOTest() throws Exception {
        given(unavailableService.saveItem(any(Unavailable.class))).willReturn(null);
        mvc.perform(post("/api/v2/unavailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void retrieveUnavailabilityTest() throws Exception {
        given(unavailableService.getOneItem(any(Integer.class))).willReturn(testUnavailable);
        mvc.perform(get("/api/v2/unavailable/42"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.startDate", is(testUnavailable.getStartDate().getTime())))
                .andExpect(jsonPath("$.endDate", is(testUnavailable.getEndDate().getTime())))
                .andExpect(jsonPath("$.id", is(testUnavailable.getID())));
    }

    @Test
    public void retrieveUnavailableUnavailabilityTest() throws Exception {
        given(unavailableService.getOneItem(any(Integer.class))).willReturn(null);
        mvc.perform(get("/api/v2/unavailable/42"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateSkillTest() throws Exception {
        given(unavailableService.saveItem(any(Unavailable.class))).willReturn(testUnavailable);
        mvc.perform(put("/api/v2/unavailable")
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonMaker.toJsonString(testUnavailable)))
            .andExpect(status().isOk());
    }

    @Test
    public void updateSkillWithNullTest() throws Exception {
        given(unavailableService.saveItem(any(Unavailable.class))).willReturn(null);
        mvc.perform(put("/api/v2/unavailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateSkillWithEmptyUnavailableTest() throws Exception {
        testUnavailable = new Unavailable();
        given(unavailableService.saveItem(any(Unavailable.class))).willReturn(null);
        mvc.perform(put("/api/v2/unavailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testUnavailable)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteUnavailabilityTest() throws Exception {
        doNothing().when(unavailableService).deleteItem(anyInt());
        mvc.perform(get("/api/v2/unavailable/42"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void retrieveAllUnavailabilitiesTest() throws Exception {
        List<Unavailable> unavailableList = new ArrayList<Unavailable>();
        unavailableList.add(testUnavailable);
        given(unavailableService.getAllItems()).willReturn(unavailableList);
        mvc.perform(get("/api/v2/unavailable"))
                .andExpect(status().isOk());
    }

    @Test
    public void retrieveAllUnavailabilitiesWhenEmptyTest() throws Exception {
        List<Unavailable> unavailableList = new ArrayList<Unavailable>();
        given(unavailableService.getAllItems()).willReturn(unavailableList);
        mvc.perform(get("/api/v2/unavailable"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void retrieveAllUnavailabilitiesWhenNullTest() throws Exception {
        given(unavailableService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/unavailable"))
                .andExpect(status().isNotFound());
    }
}