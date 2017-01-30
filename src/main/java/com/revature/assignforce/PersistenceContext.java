/**
 *
 */
package com.revature.assignforce;

import java.sql.SQLException;
import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import oracle.jdbc.pool.OracleDataSource;

@Configuration
@EnableJpaRepositories("com.revature.assignforce.entry.repos")
@EnableTransactionManagement
public class PersistenceContext {
	@Bean
	DataSource dataSource(Environment env) throws SQLException{
		OracleDataSource dataSource = new OracleDataSource();
		dataSource.setDriverType(env.getRequiredProperty("db.driver"));
		dataSource.setURL(env.getRequiredProperty("db.url"));
		dataSource.setUser(env.getRequiredProperty("db.username"));
		dataSource.setPassword(env.getRequiredProperty("db.password"));
		
		return dataSource;
	}
	
	@Bean
	LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource ds, Environment env){
		LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
		entityManagerFactoryBean.setDataSource(ds);
		entityManagerFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
		entityManagerFactoryBean.setPackagesToScan("com.revature.assignforce.domain");
		
		Properties props = new Properties();
		
		props.put("hibernate.dialect", env.getRequiredProperty("hibernate.dialect"));
		props.put("hibernate.hbm2ddl.auto", env.getRequiredProperty("hibernate.hbm2ddl.auto"));
		
		entityManagerFactoryBean.setJpaProperties(props);
		
		return entityManagerFactoryBean;
	}
	
	@Bean
	JpaTransactionManager transactionManager(EntityManagerFactory emf){
		JpaTransactionManager tm = new JpaTransactionManager();
		tm.setEntityManagerFactory(emf);
		return tm;
	}
}
