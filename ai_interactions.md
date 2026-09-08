# Uso de herramientas de IA

## Herramienta utilizada

Durante el desarrollo utilicé **Claude.ai y Claude Code** como asistente de programación, principalmente para analizar problemas, proponer soluciones y apoyar en la implementación y revisión del código.

## En qué la utilicé

La utilicé como apoyo en distintas partes del proyecto, entre ellas:

* Definición de la estructura general del proyecto y algunas decisiones de arquitectura.
* Implementación del algoritmo de **score determinista basado en SHA-256**.
* Desarrollo de los middlewares de autenticación y autorización.
* Creación y revisión de la suite de pruebas utilizando **Vitest y Supertest**.

## Cómo trabajé con la herramienta

El desarrollo se realizó de forma colaborativa. Antes de implementar cada parte, revisaba la propuesta y su funcionamiento para asegurarme de entender lo que se estaba haciendo.

También se utilizó para analizar los errores que fueron apareciendo durante el desarrollo, como problemas de compilación o tests que fallaban. En cada caso, se revisaba la causa del problema, se aplicaba una solución y posteriormente se verificaba que el cambio funcionara correctamente.

La IA fue utilizada como herramienta de apoyo y no como un reemplazo total del criterio técnico.

## Decisiones tomadas personalmente

Algunas decisiones importantes que tomé durante el desarrollo fueron:

* Mantener el nombre `hasValidRutFormat` en lugar de `isValidRut`, ya que el RUT indicado en el enunciado no cumple con el algoritmo de validación del módulo 11. En este caso, consideré más apropiado validar únicamente el formato solicitado.
* Utilizar `sessionStorage` para el manejo de sesión, teniendo presente sus limitaciones de seguridad y dejando documentada como alternativa más adecuada para un entorno de producción la utilización de una **cookie `httpOnly`**.
