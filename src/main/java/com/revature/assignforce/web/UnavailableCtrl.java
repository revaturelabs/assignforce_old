package com.revature.assignforce.web;

import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.UnavailableDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.DaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
public class UnavailableCtrl {
	
	@Autowired
	DaoService<Unavailable, Integer> unavailableService;
	
	// CREATE
	// creating new unavailable object from information passed from unavailable data transfer object
	@PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
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
	@PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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
	@PreAuthorize("hasPermission('', 'trainer_profile')")
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
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
	@PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteUnavailability( @PathVariable("id") int ID ) {
		unavailableService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	// GET ALL **PROBABLY WON'T BE USED**
	@PreAuthorize("hasPermission('', 'basic')")
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
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
