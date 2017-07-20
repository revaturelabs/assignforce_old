package com.revature.assignforce;

import com.google.gson.Gson;
<<<<<<< HEAD
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.domain.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.RemoteTokenServices;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.stereotype.Component;

import java.util.*;
=======
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.revature.assignforce.domain.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
>>>>>>> 617541aed2e8912a3dd498f5e9882142117f735f

@Component
public class Force {
    private static final String REST_VERSION = "40.0";

    @Autowired
    public OAuth2RestTemplate restTemplate;

<<<<<<< HEAD
    @Autowired
    public Force(OAuth2ProtectedResourceDetails resourceDetails,  OAuth2ClientContext clientContext) {
        this.restTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);
    }

=======
>>>>>>> 617541aed2e8912a3dd498f5e9882142117f735f
    @SuppressWarnings("unchecked")
    public String restUrl(OAuth2Authentication auth, String url) {
        HashMap<String, Object> details = (HashMap<String, Object>) auth.getUserAuthentication().getDetails();
        HashMap<String, String> urls = (HashMap<String, String>) details.get("urls");

        return urls.get(url).replace("{version}", REST_VERSION);
    }

    @SuppressWarnings("unchecked")
<<<<<<< HEAD
    public Employee getCurrentEmployee(OAuth2Authentication auth) {
        HashMap<String, String> details = (HashMap<String, String>) auth.getUserAuthentication().getDetails();
        String query = "SELECT Id, Name, CommunityNickname, FirstName, LastName, Email, FullPhotoUrl, SmallPhotoUrl, " +
                "UserRole.Id, UserRole.Name " +
                "FROM User WHERE Id = '" + details.get("user_id") + "'";

        String response = executeSalesForceQuery(auth, query);

        List<Employee> employees = parseSalesForceQueryResponse(response);
        return employees.get(0);
    }

    public List<Employee> getTrainers(OAuth2Authentication auth) {
        String query = "SELECT Id, Name, CommunityNickname, FirstName, LastName, Email, FullPhotoUrl, SmallPhotoUrl, " +
                "UserRole.Id, UserRole.Name " +
                "FROM User WHERE UserRoleId = '" + Role.ROLE_TRAINER + "'";

        String response = executeSalesForceQuery(auth, query);

        return parseSalesForceQueryResponse(response);
    }


    private String executeSalesForceQuery(OAuth2Authentication auth, String query) {
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
                    Role role = new Role();
                    employee.setRoleName(jsonRole.get("Name").getAsString());
                    //employee.setRole(role);
                    employees.add(employee);
                }
        );

        restTemplate.getAccessToken();

        return employees;
    }
=======
    public Employee getRole(OAuth2Authentication auth) {
        HashMap<String, String> details = (HashMap<String, String>) auth.getUserAuthentication().getDetails();
        String url = restUrl(auth, "query") + "?q={q}";

        Gson gson = new Gson();
        Employee employee = gson.fromJson(gson.toJsonTree(details), Employee.class);
        employee.setEmployeeId(details.get("user_id"));

        Map<String, String> params = new HashMap<>();
        params.put("q", "SELECT id, name FROM UserRole " +
                "WHERE Id IN (SELECT UserRoleId FROM User " +
                "WHERE id = '" +
                employee.getEmployeeId()  +"')");


        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, params);
        //String roleStr = restTemplate.getForObject(url, String.class, params);
        String roleStr = responseEntity.getBody();
        System.out.println(url);
        System.out.println(roleStr);
        JsonObject roleData = gson.fromJson(roleStr, JsonElement.class)
                .getAsJsonObject().get("records")
                .getAsJsonArray().get(0).getAsJsonObject();
        System.out.println(roleData);
        //employee.setRoleId(roleData.get("Id").getAsString());
        employee.setRoleId(roleData.get("roleName").getAsString());
        employee.setEmployeeName(roleData.get("userName").getAsString());
        //System.out.println("XXXXXXXXXXXXXXXXXXXXXXXX" + roleData.get("Name").getAsString());

        return employee;
    }

    public Employee getCurrentEmployee(OAuth2Authentication auth) {
        Employee em = getRole(auth);
        return em;
    }

    private static class QueryResult<T> {
        public List<T> records;
    }

    private static class QueryResultEmployee extends QueryResult<Employee> {}
>>>>>>> 617541aed2e8912a3dd498f5e9882142117f735f
}