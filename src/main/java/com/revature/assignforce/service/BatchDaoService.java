package com.revature.assignforce.service;

import com.revature.assignforce.domain.Employee;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Batch;

@Transactional
@Service
public class BatchDaoService extends DaoService<Batch, Integer> {
}
