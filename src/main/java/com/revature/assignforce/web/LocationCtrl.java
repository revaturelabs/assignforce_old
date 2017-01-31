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

import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.dto.LocationDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.DaoService;

@RestController
@RequestMapping("/api/v2/location")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class LocationCtrl {
	
	@Autowired
	ActivatableObjectDaoService<Location, Integer> locationService;
	
	  // CREATE
		// creating new location object from information passed from location data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createLocation( @RequestBody LocationDTO in ) {
	
		int ID = in.getID();
		String name = in.getName();
		String city = in.getCity();
		String state = in.getState();
		List<Room> rooms = in.getRooms();
		
		Location out = new Location( ID, name, city, state, rooms, true );
		out = locationService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Location failed to save."), HttpStatus.NOT_IMPLEMENTED);
		} else {
			return new ResponseEntity<Location>(out, HttpStatus.OK);
		}
	}
	
	  // RETRIEVE
		// retrieve location with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveLocation( @PathVariable("id") int ID ) {
		
		Location out = locationService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No location found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Location>(out, HttpStatus.OK);
		}
	}
	
	  // UPDATE
		// updating an existing location object with information passed from location data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateLocation( @RequestBody LocationDTO in ) {
	
		int ID = in.getID();
		String name = in.getName();
		String city = in.getCity();
		String state = in.getState();
		List<Room> rooms = in.getRooms();
		Boolean active = in.getActive();
		
		Location out = new Location( ID, name, city, state, rooms, active );
		out = locationService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Location failed to update."), HttpStatus.NOT_MODIFIED);
		} else {
			return new ResponseEntity<Location>(out, HttpStatus.OK);
		}
	}
	
	  // DELETE
		// delete location with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteLocation( @PathVariable("id") int ID ) {
		
		locationService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all locations
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveAllLocations() {
		
		List<Location> all = locationService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all locations failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty() == true) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No locations available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Location> >(all, HttpStatus.OK);
		}
	}
	
}
