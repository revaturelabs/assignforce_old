package com.revature.assignforce.service;

import com.revature.assignforce.domain.BatchLocation;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * Created by August Duet on 4/7/2017.
 */
@Transactional
@Service
public class BatchLocationDaoService extends DaoService<BatchLocation, Integer>{
}
