package com.revature.assignforce.web;

import java.util.List;

import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.assignforce.domain.Curriculum;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.dto.CurriculumDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.DaoService;

@RestController
@RequestMapping("/api/v2/curriculum")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class CurriculumCtrl {

	@Autowired
	ActivatableObjectDaoService<Curriculum, Integer> currService;

	  // CREATE
		// creating new curriculum object from information passed from curriculum data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createCurriculum( @RequestBody CurriculumDTO in ) {
	
		int ID = in.getCurrID();
		String name = in.getName();
		List<Skill> skills = in.getSkills();
		
		Curriculum out = new Curriculum( ID, name, skills );
		out = currService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Curriculum failed to save."), HttpStatus.NOT_IMPLEMENTED);
		} else {
			return new ResponseEntity<Curriculum>(out, HttpStatus.OK);
		}
	}
	
	  // RETRIEVE
		// retrieve curriculum with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveCurriculum( @PathVariable("id") int ID ) {
		
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
	public Object updateCurriculum( @RequestBody CurriculumDTO in ) {
	
		int ID = in.getCurrID();
		String name = in.getName();
		List<Skill> skills = in.getSkills();
		
		Curriculum out = new Curriculum( ID, name, skills );
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
	public Object deleteCurriculum( @PathVariable("id") int ID ) {

		currService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all curricula
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveAllCurricula() {

		List<Curriculum> all = currService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all curricula failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty() == true) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No curricula available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Curriculum> >(all, HttpStatus.OK);
		}
	}
}
