# Interpreter Workflow

Fecha de revision: 2026-05-13

## Objetivo

Documentar el workflow ideal de interpretes y waves:

- crear `employee`
- activar como `interpreter`
- asignar `wave`
- asignar `contract`
- asignar `languages`
- calcular la etapa actual desde `wave_stages`

## Modelo funcional

### `employees`

Entidad base de la persona.

- se crea primero
- puede tener cualquier rol
- si el rol es `Interpreter`, luego puede operar como interprete

### `interpreter_details`

Perfil operativo del interprete.

- enlaza el employee con una wave
- guarda `contract_id`
- guarda fechas operativas
- habilita al interprete para el roster

### `waves`

Contenedor de la cohorte o campaña operativa.

- agrupa interpretes
- define el ciclo de trabajo
- no debe mezclarse con la creacion base del employee

### `wave_stages`

Define el calendario y las fases de la wave.

- `TRAINING`
- `NESTING`
- `PRODUCTION`

Cada stage tiene:

- `start_date`
- `end_date`

## Regla de negocio para el roster

Un interprete solo debe aparecer en el roster si cumple todo esto:

- tiene rol `Interpreter`
- tiene `interpreter_details`
- `interpreter_details.wave_id` no es nulo
- la wave existe
- la wave tiene `wave_stages`

## Lectura de la etapa actual

La etapa actual se calcula a partir de `wave_stages`.

Ejemplo:

- si la fecha actual cae dentro de `TRAINING`, el interprete esta en training
- si cae dentro de `NESTING`, esta en nesting
- si cae dentro de `PRODUCTION`, esta en production

## Resumen

- `employees` crea la persona
- `interpreter_details` activa el rol operativo
- `waves` agrupa la operacion
- `wave_stages` define el ciclo temporal
- el roster debe mostrar solo interpretes listos para operar

