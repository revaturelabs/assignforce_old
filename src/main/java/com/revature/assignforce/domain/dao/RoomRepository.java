package com.revature.assignforce.domain.dao;

import com.revature.assignforce.domain.Room;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends ActivatableObjectRepository<Room, Integer> {

}
