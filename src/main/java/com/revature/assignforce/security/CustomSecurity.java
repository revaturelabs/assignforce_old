package com.revature.assignforce.security;

import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.domain.Force;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;

@Component
public class CustomSecurity implements PermissionEvaluator {
    @Autowired
    private Force force;


    public ArrayList<String> addPrivilages(String... args){
        ArrayList<String> privilages = new ArrayList<>();
        for(String s: args){
            privilages.add(s);
        }
        return privilages;
    }
//    "trainers",addPrivilages("Read_Batcches")

    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        System.out.println("inside hasPermission");
        System.out.println(auth.toString());
        System.out.println((String)permission);

        boolean hasPermission = false;
        if (auth != null && permission instanceof String) {
//            HashMap<String, String> details = (HashMap<String, String>)auth.getDetails();
            System.out.println(auth.toString());
            Employee e = force.getCurrentEmployee((OAuth2Authentication)auth);

//            System.out.println(details.toString());
//            String role = details.get("roleName");
//            System.out.println("The " + targetDomainObject + " Is:" + role);
            if(e.getRoleName().equals((String)permission))
                hasPermission = true;

        }
        return hasPermission;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable serializable, String s, Object o) {
        return true;
    }
}
