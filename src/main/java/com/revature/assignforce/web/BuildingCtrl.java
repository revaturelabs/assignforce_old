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

import com.revature.assignforce.domain.Building;
import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.dto.BuildingDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;

@RestController
@RequestMapping("/api/v2/building")
@ComponentScan(basePackages = "com.revature.assignforce.service")
public class BuildingCtrl {

	@Autowired
	ActivatableObjectDaoService<Building, Integer> buildingService;

	// CREATE
	// creating new building object from information passed from building data
	// transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createBuilding(@RequestBody BuildingDTO in) {
		
		int ID = in.getID(); //we shouldn't need the building id - it will be generated...  right?
		String name = in.getName(); //building name
		int location = in.getLocation(); //building's location id.  This is where it is was breaking - said the location id is 0
		List<Room> rooms = in.getRooms(); //list of rooms(if being created in this step, no rooms..)

		// int iD, String name, String city, String state, List<Building>
		// buildings, Boolean active
		Building out = new Building(ID, name, rooms, true, location);
		out = buildingService.saveItem(out);// I need to see this: active is being set to null in the db. Is it because it should be 1 in the db instead of true?  idk
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Building failed to save."),
					HttpStatus.INTERNAL_SERVER_ERROR);
		} else {
			return new ResponseEntity<Building>(out, HttpStatus.OK);
		}
	}

	// RETRIEVE
	// retrieve Building with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveBuilding(@PathVariable("id") int ID) {

		Building out = buildingService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No building found of ID " + ID + "."),
					HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Building>(out, HttpStatus.OK);
		}
	}

	// UPDATE
	// updating an existing Building object with information passed from
	// Building data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateBuilding(@RequestBody BuildingDTO in) {

		int ID = in.getID();
		String name = in.getName();
		int location = in.getLocation();
		List<Room> rooms = in.getRooms();
		Boolean active = in.getActive();
		Building out = new Building(ID, name, rooms, active, location);
		out = buildingService.saveItem(out);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Building failed to update."),
					HttpStatus.NOT_MODIFIED);
		} else {
			return new ResponseEntity<Building>(out, HttpStatus.OK);
		}
	}

	// DELETE
	// delete Building with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteBuilding(@PathVariable("id") int ID) {

		buildingService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}

	// GET ALL
	// retrieve all buildings
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveAllBuildings() {

		List<Building> all = buildingService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all buildings failed."),
					HttpStatus.NOT_FOUND);
		} else if (all.isEmpty()) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No buildings available."),
					HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<List<Building>>(all, HttpStatus.OK);
		}
	}

}
