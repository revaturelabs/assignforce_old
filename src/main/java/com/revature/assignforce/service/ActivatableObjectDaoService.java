package com.revature.assignforce.service;

import com.revature.assignforce.domain.Activatable;
import com.revature.assignforce.domain.dao.ActivatableObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by August Duet on 11/29/2016.
 */
public class ActivatableObjectDaoService<T extends Activatable, ID extends Serializable> extends DaoService<T, ID>{


    protected ActivatableObjectRepository<T, ID> repo;

    @Autowired
    public void setRepo(ActivatableObjectRepository<T, ID> repo) {
        this.repo = repo;
    }

    @Override
    //public List<T> getAllItems(){ return repo.findByActiveIsTrue();}

    public void deleteItem(ID id){

        try{
            repo.delete(id);
        }catch(Exception ex){
            Activatable item = (Activatable) repo.findOne(id);
            item.setActive(false);

            T saveItem = (T)item;
            repo.save(saveItem);
        }


    }
}
