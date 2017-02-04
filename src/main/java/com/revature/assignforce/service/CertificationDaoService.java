package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Certification;

/**
 * Created by Zach Nelson on 2/1/2017.
 */

@Transactional
@Service
public class CertificationDaoService extends DaoService<Certification,Integer> {
}
