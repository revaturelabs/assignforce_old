package com.revature.assignforce.web;

import java.util.ArrayList;
import java.util.List;

import com.revature.assignforce.service.ActivatableObjectDaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.assignforce.domain.Curriculum;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.dto.CurriculumDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;

@RestController
@RequestMapping("/api/v2/curriculum")
@ComponentScan(basePackages="com.revature.assignforce.service")
@Api(value = "Curriculum Controller", description = "Operations regarding Curricula")
public class CurriculumCtrl {

	@Autowired
	ActivatableObjectDaoService<Curriculum, Integer> currService;

	  // CREATE
		// creating new curriculum object from information passed from curriculum data transfer object
	  @PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Create a Curriculum", response = ResponseEntity.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully created Curriculum information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot create Curriculum")
	})
	public Object createCurriculum( @RequestBody CurriculumDTO in ) {

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
	  @PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Get a Curriculum given an ID", response = ResponseEntity.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully retrieved Curriculum information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot retrieve Curriculum information")
	})
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
	  @PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Update a Curriculum", response = ResponseEntity.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully updated Curriculum information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot update Curriculum information")
	})
	public Object updateCurriculum( @RequestBody CurriculumDTO in ) {
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
	  @PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Delete a Curriculum", response = ResponseEntity.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully deleted Curriculum"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot delete Curriculum")
	})
	public Object deleteCurriculum( @PathVariable("id") int ID ) {

		currService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all curricula
	  @PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Retrieve all Curricula", response = ResponseEntity.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully retrieved all Curricula"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot retrieve Curricula")
	})
	public Object retrieveAllCurricula() {

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
