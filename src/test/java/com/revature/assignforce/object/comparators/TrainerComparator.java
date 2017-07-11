package com.revature.assignforce.object.comparators;

import com.revature.assignforce.domain.Trainer;

import java.util.Comparator;

/**
 * Created by workm on 7/11/2017.
 */
public class TrainerComparator implements Comparator {

    //Only tests for equality for testing purposes, DO NOT USE AS IS OTHERWISE
    @Override
    public int compare(Object o1, Object o2) {
        if(o1 instanceof Trainer && o2 instanceof Trainer){
            boolean flag = true;
            Trainer t1 = (Trainer) o1;
            Trainer t2 = (Trainer) o2;
            flag = (t1.getTrainerId() == t2.getTrainerId());
            //TODO: continue here
        }else{

        }

    }
}
