package com.revature.assignforce.security;

import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.domain.Force;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import java.io.Serializable;
import java.util.HashMap;


public class CustomSecurity implements PermissionEvaluator {
    @Autowired
    Force force;

    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        boolean hasPermission = false;
        if (auth != null && permission instanceof String) {
//            HashMap<String, String> details = (HashMap<String, String>)auth.getDetails();
            System.out.println(auth.toString());
            Employee e = force.getCurrentEmployee(auth);

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
        return false;
    }
}
