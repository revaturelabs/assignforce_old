package com.revature.assignforce.domain;

public class Employee {
    private String employeeId;
    private String roleId;
    private String employeeName;

    public String getEmployeeName() {return employeeName;}

    public void setEmployeeName(String employeeName) {this.employeeName = employeeName;}

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
}