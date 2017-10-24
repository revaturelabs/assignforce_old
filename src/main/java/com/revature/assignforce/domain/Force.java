package com.revature.assignforce.domain;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.revature.assignforce.domain.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

@Component

public class Force {
    private static final String REST_VERSION = "40.0";


    private OAuth2RestTemplate restTemplate;

    @Autowired
    public Force(OAuth2ProtectedResourceDetails resourceDetails, OAuth2ClientContext clientContext) {
        this.restTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);
    }

    @SuppressWarnings("unchecked")
    public String restUrl(Authentication auth, String url) {
        HashMap<String, Object> details = (HashMap<String, Object>) auth.getDetails();
        HashMap<String, String> urls = (HashMap<String, String>) details.get("urls");

        return urls.get(url).replace("{version}", REST_VERSION);
    }

    @SuppressWarnings("unchecked")
    public Employee getCurrentEmployee(OAuth2Authentication auth) {
        return getCurrentEmployee(auth.getUserAuthentication());
    }

    public Employee getCurrentEmployee(Authentication auth) {
        HashMap<String, String> details = (HashMap<String, String>) auth.getDetails();
        String query = "SELECT Id, Name, CommunityNickname, FirstName, LastName, Email, FullPhotoUrl, SmallPhotoUrl, " +
                "UserRole.Id, UserRole.Name " +
                "FROM User WHERE Id = '" + details.get("user_id") + "'";

        String response = executeSalesForceQuery(auth, query);

        List<Employee> employees = parseSalesForceQueryResponse(response);
        return employees.get(0);
    }

    private String executeSalesForceQuery(Authentication auth, String query) {
        String url = restUrl(auth, "query") + "?q={q}";

        Map<String, String> params = new HashMap<>();
        params.put("q", query);


        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, params);
        return responseEntity.getBody();
    }

    private List<Employee> parseSalesForceQueryResponse(String response) {
        List<Employee> employees = new ArrayList<>();
        JsonObject object = new Gson().fromJson(response, JsonElement.class).getAsJsonObject();
        JsonArray arr = object.getAsJsonArray("records");

        arr.forEach(jsonElement -> {
                    JsonObject jsonObject = jsonElement.getAsJsonObject();
                    Employee employee = new Employee();
                    employee.setEmployeeId(jsonObject.get("Id").getAsString());
                    employee.setRoleName(jsonObject.get("Name").getAsString());
                    employee.setFirstName(jsonObject.get("FirstName").getAsString());
                    employee.setLastName (jsonObject.get("LastName").getAsString());


                    JsonObject jsonRole = jsonObject.get("UserRole").getAsJsonObject();
                    employee.setRoleName(jsonRole.get("Name").getAsString());
                    employees.add(employee);
                }
        );

        restTemplate.getAccessToken();

        return employees;
    }
}