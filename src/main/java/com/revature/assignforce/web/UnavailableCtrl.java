package com.revature.assignforce.web;

import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.UnavailableDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.DaoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

/**
 * Created by Nick Edwards on 3/2/2017.
 */

@RestController
@RequestMapping("/api/v2/unavailable")
@ComponentScan(basePackages="com.revature.assignforce.service")
@Api(value = "Unavailable Controller", description = "Operations regarding unavailable data")
public class UnavailableCtrl {
	
	@Autowired
	DaoService<Unavailable, Integer> unavailableService;
	
	// CREATE
	// creating new unavailable object from information passed from unavailable data transfer object
	@RequestMapping(method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Create an Unavailable ", response = Unavailable.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully received Unavailable information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot create Unavailable")
	})
	public Object createUnavailability( @RequestBody UnavailableDTO in ) {
		int ID = in.getUnavailableId();
		Timestamp startDate = in.getStartDate();
		Timestamp endDate = in.getEndDate();
		
		Unavailable out = new Unavailable( ID, startDate, endDate );
		out = unavailableService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Unavailability failed to save."), HttpStatus.NOT_IMPLEMENTED);
		} else {
			return new ResponseEntity<Unavailable>(out, HttpStatus.OK);
		}
	}
	
	// RETRIEVE
	// retrieve unavailability with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Get an Unavailable with a given ID", response = Unavailable.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully received Unavailable information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot retrieve Unavailable")
	})
	public Object retrieveUnavailability( @PathVariable("id") int ID ) {
		Unavailable out = unavailableService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No unavailability found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Unavailable>(out, HttpStatus.OK);
		}
	}
	
	// UPDATE
	// updating an existing unavailability object with information passed from unavailable data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Update an unavailability ", response = Unavailable.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully updated Unavailable information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot update Unavailable")
	})
	public Object updateSkill( @RequestBody UnavailableDTO in ) {
		
		int ID = in.getUnavailableId();
		Timestamp startDate = in.getStartDate();
		Timestamp endDate = in.getEndDate();
		
		Unavailable out = new Unavailable( ID, startDate, endDate);
		out = unavailableService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO> (new ResponseErrorDTO("Unavailability failed to save."), HttpStatus.NOT_MODIFIED);
		} else {
				return new ResponseEntity<Unavailable>(out, HttpStatus.OK);
		}
	}
	
	// DELETE
	// delete unavailability with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Delete an unavailability ", response = Unavailable.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully deletedUnavailable information"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot delete Unavailable")
	})
	public Object deleteUnavailability( @PathVariable("id") int ID ) {
		unavailableService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	// GET ALL **PROBABLY WON'T BE USED**
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Retrieve all unavailabilities ", response = Unavailable.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully retrieved all Unavailabilities"),
			@ApiResponse(code=400, message ="Bad Request, the information recieved maybe invalid"),
			@ApiResponse(code=500, message ="Cannot retrieve Unavailablities")
	})
	public Object retrieveAllUnavailabilities() {
		
		List<Unavailable> all = unavailableService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all unavailabilities failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty()){
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No unavailabilities available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Unavailable> >(all, HttpStatus.OK);
		}
	}
}
