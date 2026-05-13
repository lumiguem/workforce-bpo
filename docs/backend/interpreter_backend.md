# Interpreter Backend

Fecha de revision: 2026-05-13

## Alcance

Este documento resume el estado del backend para soportar:

- alta de employees
- activacion como interprete
- asignacion a waves
- asignacion de contract
- asignacion de languages
- roster operativo con etapa actual

## Estado actual

El backend ya tenia piezas para interpretes y waves, pero el flujo estaba dividido y con supuestos fragiles.

### Endpoints existentes

- `POST /api/employees`
- `POST /api/interpreters/{interpreterId}/setup`
- `GET /api/interpreters`

### Servicios existentes

- `EmployeeService`
- `InterpreterSetupService`
- `InterpreterDetailsService`
- `InterpreterLanguageService`
- `InterpreterService`

## Cambios aplicados

### 1. Rol interprete sin hardcode

Se elimino la dependencia de `role_id = 1` y se paso a buscar el rol por nombre estable: `Interpreter`.

Archivos tocados:

- `workforce-api/src/main/java/com/fcbpo/workforce/domain/repository/RoleRepository.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/persistence/repository/RoleJpaRepository.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/persistence/repository/RoleRepositoryAdapter.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/config/DataInitializer.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/application/service/InterpreterDetailsService.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/application/service/InterpreterLanguageService.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/application/service/InterpreterService.java`

### 2. Validacion de wave y contract

Se agrego persistencia para `contracts` y validacion explicita de existencia.

Archivos agregados:

- `workforce-api/src/main/java/com/fcbpo/workforce/domain/model/Contract.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/domain/repository/ContractRepository.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/persistence/entity/ContractEntity.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/persistence/repository/ContractJpaRepository.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/persistence/repository/ContractRepositoryAdapter.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/exception/WaveNotFoundException.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/exception/ContractNotFoundException.java`

Archivos actualizados:

- `workforce-api/src/main/java/com/fcbpo/workforce/application/service/InterpreterDetailsService.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/infrastructure/config/DataInitializer.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/exception/GlobalExceptionHandler.java`

### 3. Wave stages obligatorios

Se agrego una excepcion especifica para waves sin stages configurados.

Archivos agregados:

- `workforce-api/src/main/java/com/fcbpo/workforce/exception/WaveStagesNotConfiguredException.java`

Archivos actualizados:

- `workforce-api/src/main/java/com/fcbpo/workforce/application/service/InterpreterDetailsService.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/exception/GlobalExceptionHandler.java`

### 4. Roster enriquecido

El roster ahora:

- filtra interpretes operativos
- expone `waveName`
- expone `currentStage`
- calcula la etapa actual desde `wave_stages`
- excluye waves sin stages

Archivos actualizados:

- `workforce-api/src/main/java/com/fcbpo/workforce/application/dto/InterpreterWithDetailsResponse.java`
- `workforce-api/src/main/java/com/fcbpo/workforce/application/service/InterpreterService.java`

Archivos agregados:

- `workforce-api/src/test/java/com/fcbpo/workforce/application/service/InterpreterServiceTest.java`

## Base de datos

No se requirio una migracion estructural obligatoria.

Si se considera necesario a nivel de datos:

- asegurar la presencia del rol `Interpreter`
- asegurar un contrato por defecto si el negocio usa `contract_id = 1`

Tablas ya presentes y usadas:

- `employees`
- `contracts`
- `waves`
- `wave_stages`
- `interpreter_details`

## Endpoint unico

No existe hoy un endpoint atomico para:

- crear employee
- activar interprete
- asignar wave
- asignar idioma
- asignar contrato

Se dejo el flujo en dos pasos:

- crear employee
- ejecutar setup de interprete

## Verificacion

Se ejecuto:

- `mvn test`

Resultado:

- build exitoso
- tests exitosos

## Observacion pendiente

Sigue apareciendo un warning de Hibernate sobre `users.employee_id`, pero no afecta este flujo.

