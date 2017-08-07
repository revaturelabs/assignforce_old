package com.revature.assignforce.web;

import java.util.ArrayList;
import java.util.List;

import com.revature.assignforce.annotations.Authorize;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.assignforce.domain.Curriculum;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.dto.CurriculumDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;

@RestController
@RequestMapping("/api/v2/curriculum")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class CurriculumCtrl {

	@Autowired
	ActivatableObjectDaoService<Curriculum, Integer> currService;

	  // CREATE
		// creating new curriculum object from information passed from curriculum data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object createCurriculum(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
								   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
								   @RequestBody CurriculumDTO in ) {
		int id = in.getCurrId();
		String name = in.getName();
		List<Skill> skills = in.getSkills();
		boolean core = in.getCore();

		Curriculum out = new Curriculum( id, name, skills, core);
		out = currService.saveItem( out );

		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Curriculum failed to save."), HttpStatus.INTERNAL_SERVER_ERROR);
		} else {
			return new ResponseEntity<Curriculum>(out, HttpStatus.OK);
		}
	}

	  // RETRIEVE
		// retrieve curriculum with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object retrieveCurriculum(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
									 @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
									 @PathVariable("id") int ID ) {
		Curriculum out = currService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No curriculum found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Curriculum>(out, HttpStatus.OK);
		}
	}

	  // UPDATE
		// updating an existing curriculum object with information passed from curriculum data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object updateCurriculum(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
								   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
								   @RequestBody CurriculumDTO in ) {
		Integer id = in.getCurrId();
		id = (id != null)? in.getCurrId() : 0;
		String name = (in.getName() != null)? in.getName() : "";
		List<Skill> skills = (in.getSkills() != null)? in.getSkills() : new ArrayList<Skill>();
		Boolean core = (in.getCore() != null)? in.getCore() : false;
		
		Curriculum out = new Curriculum( id, name, skills, core );
		out.setActive(in.getActive());
		out = currService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Curriculum failed to save."), HttpStatus.NOT_MODIFIED);
		} else {
			return new ResponseEntity<Curriculum>(out, HttpStatus.OK);
		}
	}
	
	  // DELETE
		// delete curriculum with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object deleteCurriculum(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
								   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
								   @PathVariable("id") int ID ) {
		currService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all curricula
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object retrieveAllCurricula(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
									   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue) {

		List<Curriculum> all = currService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all curricula failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty()) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No curricula available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Curriculum> >(all, HttpStatus.OK);
		}
	}
}
