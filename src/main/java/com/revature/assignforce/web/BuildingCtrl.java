package com.revature.assignforce.web;

import java.util.ArrayList;
import java.util.List;

import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.service.BatchDaoService;
import com.revature.assignforce.service.BuildingDaoService;
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

import com.revature.assignforce.domain.Building;
import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.dto.BuildingDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;

@RestController
@RequestMapping("/api/v2/building")
@ComponentScan(basePackages = "com.revature.assignforce.service")
@Api(value = "Building Controller", description = "CRUD Buildings")
public class BuildingCtrl {

	@Autowired
	ActivatableObjectDaoService<Building, Integer> buildingService;

	// CREATE
	// creating new building object from information passed from building data
	// transfer object
	@PreAuthorize("hasPermission('', 'manager')")
	@ApiOperation(value = "Create a building", response = BuildingDaoService.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully created a building"),
			@ApiResponse(code=400, message ="Bad Request, BuildingDTO"),
			@ApiResponse(code=500, message ="Cannot create building")
	})
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
	@PreAuthorize("hasPermission('', 'basic')")
	@ApiOperation(value = "Retrieve a building", response = BuildingDaoService.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully retrieved a building"),
			@ApiResponse(code=400, message ="Bad Request, BuildingDTO"),
			@ApiResponse(code=500, message ="Cannot retrieve building")
	})
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
	@PreAuthorize("hasPermission('', 'manager')")
	@ApiOperation(value = "Update building", response = BuildingDaoService.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully updated building"),
			@ApiResponse(code=400, message ="Bad Request, BuildingDTO"),
			@ApiResponse(code=500, message ="Cannot update building")
	})
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateBuilding(@RequestBody BuildingDTO in) {

		Integer id = in.getID();
		id = (id != null)? id : 0;
		String name = (in.getName() != null)? in.getName(): "";
		Integer location = in.getLocation();
		location = (location != null)? in.getLocation() : 0;
		List<Room> rooms = (in.getRooms() != null)? in.getRooms() : new ArrayList<Room>();
		Boolean active = (in.getActive() != null)? in.getActive() : false;
		Building out = new Building(id, name, rooms, active, location);
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
	@PreAuthorize("hasPermission('', 'manager')")
	@ApiOperation(value = "Delete a branch", response = BuildingDaoService.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully delete a building"),
			@ApiResponse(code=400, message ="Bad Request, BuildingDTO"),
			@ApiResponse(code=500, message ="Cannot delete a building")
	})
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteBuilding(@PathVariable("id") int ID) {

		buildingService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}

	// GET ALL
	// retrieve all buildings
	@PreAuthorize("hasPermission('', 'basic')")
	@ApiOperation(value = "Retrieve all buildings", response = BuildingDaoService.class)
	@ApiResponses({
			@ApiResponse(code=200, message ="Successfully retrieve all buildings"),
			@ApiResponse(code=400, message ="Bad Request, BuildingDTO"),
			@ApiResponse(code=500, message ="Cannot retrieve all building")
	})
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
