package com.revature.assignforce.domain.dao;

import com.revature.assignforce.domain.Activatable;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;

/**
 * Created by August Duet on 11/29/2016.
 */
@NoRepositoryBean
public interface ActivatableObjectRepository<T extends Activatable, ID extends Serializable> extends BaseRepository<T, ID>{
    public List<T> findByActiveIsTrue();
}
