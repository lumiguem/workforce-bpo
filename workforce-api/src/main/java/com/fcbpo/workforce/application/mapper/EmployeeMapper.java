package com.fcbpo.workforce.application.mapper;

import com.fcbpo.workforce.application.dto.CreateEmployeeRequest;
import com.fcbpo.workforce.application.dto.EmployeeResponse;
import com.fcbpo.workforce.application.dto.UpdateEmployeeRequest;
import com.fcbpo.workforce.domain.model.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(target = "employeeId", ignore = true)
    @Mapping(target = "roleName", ignore = true)
    @Mapping(target = "cityName", ignore = true)
    @Mapping(target = "countryName", ignore = true)
    @Mapping(target = "countryCode", ignore = true)
    @Mapping(target = "statusDescription", ignore = true)
    @Mapping(target = "reportsToName", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Employee toDomain(CreateEmployeeRequest request);

    @Mapping(target = "employeeId", ignore = true)
    @Mapping(target = "roleName", ignore = true)
    @Mapping(target = "cityName", ignore = true)
    @Mapping(target = "countryName", ignore = true)
    @Mapping(target = "countryCode", ignore = true)
    @Mapping(target = "statusDescription", ignore = true)
    @Mapping(target = "reportsToName", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateDomain(UpdateEmployeeRequest request, @MappingTarget Employee employee);

    EmployeeResponse toResponse(Employee employee);

    List<EmployeeResponse> toResponseList(List<Employee> employees);


}
