package com.revature.assignforce.object.comparators;

import com.revature.assignforce.domain.Trainer;

import java.util.Comparator;

/**
 * Created by gdittric on 7/11/2017.
 */
public class TrainerComparator implements Comparator {

    /*Only tests for equality for testing purposes, DO NOT USE AS IS OTHERWISE
    * in addition all lists inside the trainer object are compare via size
    * rather than object type since different subclasses of List are not equal
    */
    @Override
    public int compare(Object o1, Object o2) {
        if(o1 instanceof Trainer && o2 instanceof Trainer){
            boolean flag = true;
            Trainer t1 = (Trainer) o1;
            Trainer t2 = (Trainer) o2;
            flag = (t1.getTrainerId() == t2.getTrainerId());
            flag = flag && (t1.getFirstName().equals(t2.getFirstName()));
            flag = flag && (t1.getLastName().equals(t2.getLastName()));
            flag = flag && (t1.getActive().equals(t2.getActive()));
            flag = flag && (t1.getCertifications().size() == t2.getCertifications().size());
            flag = flag && (t1.getSkills().size() == t2.getSkills().size());
            flag = flag && (t1.getResume().equals(t2.getResume()));
            flag = flag && (t1.getUnavailabilities().size() == t2.getUnavailabilities().size());
            return (flag)? 0 : -1;
        }else{
            return -1;
        }

    }
}
