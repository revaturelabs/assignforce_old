package com.revature.assignforce.domain;

<<<<<<< HEAD
import org.springframework.security.oauth2.common.OAuth2AccessToken;

public class Employee {
    private String employeeId;
    private String roleId;
    private String firstName;
    private String lastName;
    private String roleName;
    private String accessToken;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
=======
public class Employee {
    private String employeeId;
    private String roleId;
    private String employeeName;

    public String getEmployeeName() {return employeeName;}

    public void setEmployeeName(String employeeName) {this.employeeName = employeeName;}
>>>>>>> 617541aed2e8912a3dd498f5e9882142117f735f

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleId() {
        return roleId;
    }
<<<<<<< HEAD

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
=======
>>>>>>> 617541aed2e8912a3dd498f5e9882142117f735f
}