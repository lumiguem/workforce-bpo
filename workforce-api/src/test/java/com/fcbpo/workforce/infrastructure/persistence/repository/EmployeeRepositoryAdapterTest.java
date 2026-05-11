package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.infrastructure.persistence.entity.CityEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.CountryEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.EmployeeEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.RoleEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.StatusEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EmployeeRepositoryAdapterTest {

    @Test
    void save_mapsForeignKeysToReferences() {
        EmployeeJpaRepository employeeJpaRepository = mock(EmployeeJpaRepository.class);
        EntityManager entityManager = mock(EntityManager.class);

        RoleEntity roleRef = RoleEntity.builder().roleId(7).build();
        CityEntity cityRef = CityEntity.builder().cityId(10).build();
        CountryEntity countryRef = CountryEntity.builder().countryId(20).build();
        StatusEntity statusRef = StatusEntity.builder().statusId(30).build();
        EmployeeEntity managerRef = EmployeeEntity.builder().employeeId(99).build();

        when(entityManager.getReference(eq(RoleEntity.class), eq(7))).thenReturn(roleRef);
        when(entityManager.getReference(eq(CityEntity.class), eq(10))).thenReturn(cityRef);
        when(entityManager.getReference(eq(CountryEntity.class), eq(20))).thenReturn(countryRef);
        when(entityManager.getReference(eq(StatusEntity.class), eq(30))).thenReturn(statusRef);
        when(entityManager.getReference(eq(EmployeeEntity.class), eq(99))).thenReturn(managerRef);

        ArgumentCaptor<EmployeeEntity> entityCaptor = ArgumentCaptor.forClass(EmployeeEntity.class);
        when(employeeJpaRepository.save(entityCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeRepositoryAdapter adapter = new EmployeeRepositoryAdapter(employeeJpaRepository, entityManager);

        Employee domain = Employee.builder()
                .firstName("Ana")
                .lastName("Perez")
                .companyEmail("ana@company.com")
                .personalEmail("ana@gmail.com")
                .phoneNumber("999999999")
                .roleId(7)
                .cityId(10)
                .countryId(20)
                .statusId(30)
                .reportsTo(99)
                .build();

        Employee saved = adapter.save(domain);

        EmployeeEntity persisted = entityCaptor.getValue();
        assertThat(persisted.getRole()).isSameAs(roleRef);
        assertThat(persisted.getCity()).isSameAs(cityRef);
        assertThat(persisted.getCountry()).isSameAs(countryRef);
        assertThat(persisted.getStatus()).isSameAs(statusRef);
        assertThat(persisted.getManager()).isSameAs(managerRef);

        assertThat(saved.getRoleId()).isEqualTo(7);
        assertThat(saved.getCityId()).isEqualTo(10);
        assertThat(saved.getCountryId()).isEqualTo(20);
        assertThat(saved.getStatusId()).isEqualTo(30);
        assertThat(saved.getReportsTo()).isEqualTo(99);

        verify(employeeJpaRepository, times(1)).save(any(EmployeeEntity.class));
    }

    @Test
    void toDomain_mapsDescriptiveFields() {
        EmployeeJpaRepository employeeJpaRepository = mock(EmployeeJpaRepository.class);
        EntityManager entityManager = mock(EntityManager.class);

        RoleEntity role = RoleEntity.builder().roleId(1).roleName("Developer").build();
        CityEntity city = CityEntity.builder().cityId(1).cityName("Bogota").build();
        CountryEntity country = CountryEntity.builder().countryId(1).countryName("Colombia").countryCode("CO").build();
        StatusEntity status = StatusEntity.builder().statusId(1).description("Active").build();
        EmployeeEntity manager = EmployeeEntity.builder().employeeId(2).firstName("John").lastName("Doe").build();

        EmployeeEntity entity = EmployeeEntity.builder()
                .employeeId(1)
                .firstName("Jane")
                .lastName("Smith")
                .role(role)
                .city(city)
                .country(country)
                .status(status)
                .manager(manager)
                .build();

        when(employeeJpaRepository.findById(1)).thenReturn(java.util.Optional.of(entity));

        EmployeeRepositoryAdapter adapter = new EmployeeRepositoryAdapter(employeeJpaRepository, entityManager);

        Employee domain = adapter.findById(1).orElseThrow();

        assertThat(domain.getRoleName()).isEqualTo("Developer");
        assertThat(domain.getCityName()).isEqualTo("Bogota");
        assertThat(domain.getCountryName()).isEqualTo("Colombia");
        assertThat(domain.getCountryCode()).isEqualTo("CO");
        assertThat(domain.getStatusDescription()).isEqualTo("Active");
        assertThat(domain.getReportsToName()).isEqualTo("John Doe");
    }
}

