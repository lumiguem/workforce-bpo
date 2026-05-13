package com.fcbpo.workforce.infrastructure.config;

import com.fcbpo.workforce.infrastructure.persistence.entity.*;
import com.fcbpo.workforce.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleJpaRepository roleJpaRepository;
    private final CountryJpaRepository countryJpaRepository;
    private final CityJpaRepository cityJpaRepository;
    private final StatusJpaRepository statusJpaRepository;
    private final ContractJpaRepository contractJpaRepository;
    private final WaveJpaRepository waveJpaRepository;
    private final WaveStageJpaRepository waveStageJpaRepository;

    @Override
    public void run(String... args) {
        log.info("Checking metadata tables...");

        if (roleJpaRepository.count() == 0) {
            log.info("Initializing roles...");
            roleJpaRepository.saveAll(List.of(
                    RoleEntity.builder().roleName("Administrador").build(),
                    RoleEntity.builder().roleName("Interpreter").build(),
                    RoleEntity.builder().roleName("Supervisor").build(),
                    RoleEntity.builder().roleName("Agente").build(),
                    RoleEntity.builder().roleName("Recursos Humanos").build()
            ));
        } else if (roleJpaRepository.findByRoleName("Interpreter").isEmpty()) {
            log.info("Adding missing interpreter role...");
            roleJpaRepository.save(RoleEntity.builder().roleName("Interpreter").build());
        }

        if (countryJpaRepository.count() == 0) {
            log.info("Initializing countries...");
            CountryEntity colombia = CountryEntity.builder().countryName("Colombia").countryCode("CO").build();
            CountryEntity mexico = CountryEntity.builder().countryName("México").countryCode("MX").build();
            countryJpaRepository.saveAll(List.of(colombia, mexico));

            if (cityJpaRepository.count() == 0) {
                log.info("Initializing cities...");
                cityJpaRepository.saveAll(List.of(
                        CityEntity.builder().cityName("Bogotá").country(colombia).build(),
                        CityEntity.builder().cityName("Medellín").country(colombia).build(),
                        CityEntity.builder().cityName("Ciudad de México").country(mexico).build(),
                        CityEntity.builder().cityName("Monterrey").country(mexico).build()
                ));
            }
        }

        if (statusJpaRepository.count() == 0) {
            log.info("Initializing status...");
            statusJpaRepository.saveAll(List.of(
                    StatusEntity.builder().description("Activo").build(),
                    StatusEntity.builder().description("Inactivo").build(),
                    StatusEntity.builder().description("En Vacaciones").build(),
                    StatusEntity.builder().description("Licencia").build()
            ));
        }

        if (contractJpaRepository.count() == 0) {
            log.info("Initializing contracts...");
            contractJpaRepository.saveAll(List.of(
                    ContractEntity.builder().contractType("Default").build()
            ));
        }

        if (waveJpaRepository.count() == 0) {
            log.info("Initializing waves with stages...");
            
            WaveEntity wave1 = WaveEntity.builder()
                    .waveName("Wave 2026-01")
                    .description("Primera ola del año")
                    .startDate(LocalDate.now().minusMonths(2))
                    .build();
            
            wave1 = waveJpaRepository.save(wave1);

            waveStageJpaRepository.saveAll(List.of(
                WaveStageEntity.builder()
                        .wave(wave1)
                        .stageName(WaveStageEntity.StageName.TRAINING)
                        .startDate(LocalDate.now().minusMonths(2))
                        .endDate(LocalDate.now().minusMonths(1).minusDays(1))
                        .build(),
                WaveStageEntity.builder()
                        .wave(wave1)
                        .stageName(WaveStageEntity.StageName.NESTING)
                        .startDate(LocalDate.now().minusMonths(1))
                        .endDate(LocalDate.now().minusDays(1))
                        .build(),
                WaveStageEntity.builder()
                        .wave(wave1)
                        .stageName(WaveStageEntity.StageName.PRODUCTION)
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusMonths(6))
                        .build()
            ));
        }

        log.info("Metadata initialization completed.");
    }
}
