package com.revature.assignforce.domain.dto;

/**
 * Created by Zach Nelson on 3/21/2017.
 *
 * For use with the temporary authenticate solution.
 * Safe to delete once Parasol is implemented.
 */
public class LoginDTO {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
