# Informe de Estado del Proyecto: SkillSphere (ExpertBot Hub)

**Fecha:** 22 de julio de 2025
**Generado por:** Gemini CLI Assistant

---

## 1. Resumen del Proyecto

**Nombre Actual:** SkillSphere (anteriormente ExpertBot Hub)
**Descripción:** Plataforma web que ofrece múltiples chatbots especializados (Flora, Stylo, Delish, Pulse, Domus, Kash) para diferentes nichos.
**Objetivo Principal:** Crear una plataforma escalable con asistentes IA 100% gratuitos para el usuario final, sin requerir información de pago ni incurrir en costos para el desarrollador.
**Tecnologías Actuales:**
*   **Frontend:** React.js (con Tailwind CSS)
*   **Backend:** Node.js (Express.js)
*   **IA:** Google Gemini API (modelo `models/gemma-3-4b-it`)
*   **Caching:** `node-cache` (en memoria)
*   **Autenticación:** Clave API simple (`x-api-key`)
*   **Rate Limiting:** `express-rate-limit` (30 solicitudes/min)

---

## 2. Historial y Desafíos Superados

El proyecto ha evolucionado significativamente, superando varios desafíos técnicos para mantener el objetivo de gratuidad y funcionalidad:

*   **Estructura del Proyecto:** Creación y organización inicial de directorios y archivos.
*   **Problemas de Conectividad Local (Frontend <-> Backend):**
    *   Se resolvieron errores `ECONNREFUSED` y `Network Error` mediante la configuración de `proxy` en `package.json` del frontend y `trust proxy` en el backend.
    *   Se depuró la ausencia de `Content-Type` y `req.body` en solicitudes `POST` del navegador. Se intentaron múltiples soluciones con `fetch` y `axios`, y se concluyó que el problema era muy específico del entorno del usuario (posiblemente navegador/sistema operativo).
*   **Integración de APIs de IA:**
    *   **Hugging Face Inference API:** Intentos fallidos de integración debido a persistentes errores `404 Not Found` o `Invalid credentials in Authorization header`.
    *   **Cohere API:** Integración inicial exitosa, pero se encontraron `TypeError`s debido a la inicialización de la librería y formato de respuesta.
    *   **Ollama (LLM Local):** Se implementó y funcionó correctamente con `gemma3n:latest`, demostrando la viabilidad de una IA 100% local y gratuita.
    *   **Google Gemini API (Actual):** Integración exitosa. Se superaron errores `404 Not Found` (modelo `gemini-pro` no disponible), `Invalid value at 'contents'` (formato incorrecto del prompt para Gemini), y `TypeError: this.getModel is not a function`. Actualmente usa `models/gemma-3-4b-it`.
*   **Control de Respuestas de IA:** Se ajustaron prompts para idioma (español) y concisión, y se configuraron `maxLength` y `temperature` en la API de Gemini.
*   **Robustez de la API:** Se implementó autenticación con clave API y rate limiting alineado con los límites de Google.
*   **Estabilidad:** Resueltos problemas de "congelamiento" del bot con timeouts y ajuste del formato de `contents` para Gemini.
*   **Rediseño Básico:** Se actualizaron los nombres del proyecto (SkillSphere) y de los bots (Flora, Stylo, Delish, Pulse, Domus, Kash). Se configuró una paleta de colores y tipografías básicas con Tailwind CSS.

---

## 3. Estado Actual y Problemas Pendientes

La aplicación es **funcional** y los bots responden utilizando Gemma 3 a través de la API de Gemini.

**Problemas/Áreas de Mejora Pendientes:**

1.  **Problema Crítico de `req.body` Vacío (Frontend -> Backend):**
    *   **Descripción:** Las solicitudes `POST` desde el frontend (navegador) al backend llegan con `req.body` vacío y sin el encabezado `Content-Type`, a pesar de que el frontend lo especifica.
    *   **Impacto:** Impide que la aplicación funcione correctamente desde el navegador.
    *   **Diagnóstico:** `curl` funciona perfectamente, lo que sugiere que el problema está en el navegador (Firefox/Chrome) o en alguna capa de red/sistema que interfiere con las solicitudes `POST` salientes del navegador. Se han agotado las depuraciones estándar de código.
    *   **Prioridad:** ALTA (bloquea la funcionalidad completa desde el navegador).

2.  **Problema de Ejecución de Python (Acceso Denegado):**
    *   **Descripción:** El intérprete de Python (`P:\PYTHON\python.exe`) no puede ejecutarse, dando "acceso denegado", incluso con terminal de administrador y después de reinstalaciones.
    *   **Impacto:** Impide la ejecución de scripts Python locales (como `gemma.py` para depuración o futuras herramientas).
    *   **Diagnóstico:** Problema a nivel de permisos del sistema operativo Windows o interferencia de software de seguridad.
    *   **Prioridad:** ALTA (bloquea herramientas de desarrollo y depuración).

3.  **Optimización de Respuestas de LLM para Contenido Largo (ej. Recetas de ChefAI):**
    *   **Descripción:** Las respuestas largas (como recetas) aún pueden cortarse a pesar de aumentar `maxOutputTokens`.
    *   **Solución Propuesta:** Estrategia de "generación en múltiples pasos" (generar ingredientes, luego instrucciones).
    *   **Prioridad:** Media (mejora de calidad).

4.  **Mejora de la Calidad y Coherencia de las Respuestas de los Bots:**
    *   **Descripción:** Refinar prompts y parámetros de generación para una mayor adherencia a la personalidad y utilidad.
    *   **Prioridad:** Media (mejora de calidad).

5.  **Optimización del Consumo de Tokens:**
    *   **Descripción:** Reducir el número de tokens enviados en el prompt (ej. resumen del historial de conversación).
    *   **Prioridad:** Media (sostenibilidad a largo plazo).

6.  **Mejoras en la Experiencia de Usuario del Frontend:**
    *   **Descripción:** Indicadores de carga efectivos, mensajes de error más claros y amigables.
    *   **Prioridad:** Media (UX).

7.  **Documentación del Proyecto:**
    *   **Descripción:** Crear un `README.md` completo y documentación para el despliegue.
    *   **Prioridad:** Baja (mantenimiento).

8.  **Estrategias de Despliegue Gratuito y Sostenible:**
    *   **Descripción:** Preparar el proyecto para Vercel/Railway, gestión de variables de entorno en producción.
    *   **Prioridad:** Baja (despliegue).

---

## 4. Instrucciones para Iniciar el Proyecto

Para iniciar el proyecto en tu máquina local:

1.  **Asegúrate de que el backend esté corriendo:**
    *   Abre una terminal y navega a `P:\expertbot-hub\backend`.
    *   Ejecuta `npm start`.
    *   Deberías ver `Servidor corriendo en el puerto 5002`.

2.  **Asegúrate de que el frontend esté corriendo:**
    *   Abre OTRA terminal y navega a `P:\expertbot-hub\frontend`.
    *   Ejecuta `npm start`.
    *   Deberías ver `webpack compiled successfully`.

3.  **Accede a la aplicación:**
    *   Abre tu navegador y ve a `http://localhost:3000`.

---

## 5. Archivos Clave del Proyecto

Los archivos del proyecto se encuentran en `P:\expertbot-hub`. Los más relevantes para el estado actual son:

*   `backend/package.json`
*   `backend/.env` (contiene `API_KEY` y `GEMINI_API_KEY`)
*   `backend/server.js`
*   `backend/middleware/authenticateApiKey.js`
*   `backend/services/gemini.js`
*   `backend/config/botPrompts.js`
*   `backend/config/botConfigs.js`
*   `frontend/package.json`
*   `frontend/tailwind.config.js`
*   `frontend/src/index.css`
*   `frontend/src/App.js`
*   `frontend/src/services/api.js`
*   `frontend/src/components/BotSelector.js`
*   `frontend/src/components/BotCard.js`
*   `frontend/src/components/ChatInterface.js`
*   `frontend/src/components/MessageBubble.js`

---
