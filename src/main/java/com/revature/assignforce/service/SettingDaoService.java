package com.revature.assignforce.service;

import com.revature.assignforce.domain.Setting;
import com.revature.assignforce.domain.dao.SettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lazar on 2/8/2017.
 */
@Transactional
@Service
public class SettingDaoService extends DaoService<Setting, Integer>{

    public Setting getGlobalSettings(){
        SettingRepository dao = (SettingRepository) repo;
        return dao.findByAlias("global");
    }
}
