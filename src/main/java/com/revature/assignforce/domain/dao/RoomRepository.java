package com.revature.assignforce.domain.dao;

import org.springframework.stereotype.Repository;

import com.revature.assignforce.domain.Room;

@Repository
public interface RoomRepository extends ActivatableObjectRepository<Room, Integer> {

}
