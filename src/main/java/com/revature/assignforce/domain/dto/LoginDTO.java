package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by Zach Nelson on 3/21/2017.
 *
 * For use with the temporary authenticate solution.
 * Safe to delete once Parasol is implemented.
 */
@ApiModel("LoginDTO")
public class LoginDTO {

    @ApiModelProperty(notes = "The username used at login")
    private String username;
    @ApiModelProperty(notes = "The Password used at login")
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
