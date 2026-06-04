# Lineamientos Pedagógicos y Técnicos: Fundamentos de Cloud Computing

Este documento sirve como base de contexto para la creación de contenidos y herramientas interactivas del curso. El objetivo es mantener una estructura consistente, de alto valor pedagógico, y optimizar el uso de recursos tecnológicos y tokens de IA.

---

## 1. Estructura Obligatoria de Cada Clase

Cada clase en la plataforma debe seguir estrictamente esta estructura de tres partes:

### A. Teoría (25% del tiempo)
* **Enfoque:** Conceptos esenciales explicados a través de analogías del mundo real. Evitar jerga excesivamente técnica sin antes definirla.
* **Recursos Visuales:** Diagramas interactivos, esquemas lógicos y resúmenes visuales premium.
* **Modo Profesor (Filtro Docente):** Notas integradas y discretas que le explican al profesor cómo dictar la sección, qué analogías usar y qué preguntas lanzar al grupo.

### B. Práctica (60% del tiempo)
* **Desafío sin AWS:** Dado que no se cuenta con acceso a la consola de AWS, cada laboratorio debe ser reemplazado por:
  * **Simuladores Interactivos en la Web:** Componentes interactivos creados con JavaScript (calculadoras de IP, simuladores de ruteo de paquetes, paneles de configuración virtual).
  * **Laboratorios Locales y Gratuitos:** Ejercicios prácticos realizables en la máquina del estudiante (uso de terminal, servidores locales livianos, APIs gratuitas, etc.).
* **Guía Paso a Paso:** Instrucciones claras, capturas de pantalla o diagramas que ilustren cada paso.

### C. Cierre con Metacognición (15% del tiempo)
* **Reflexión Activa:** Preguntas diseñadas para que el estudiante piense sobre su propio proceso de aprendizaje.
* **Autoevaluación:** Mini-quizzes interactivos que al responder revelan retroalimentación instantánea explicando el "por qué" de la respuesta correcta.

---

## 2. El "Modo Profesor" (Teacher's Guide)

Es una funcionalidad clave diseñada para apoyar al docente que está aprendiendo el ramo mientras lo enseña.

* **Activación:** Un interruptor global en la barra de navegación.
* **Visibilidad:** Cuando está activado, aparecen elementos visuales (con un borde verde esmeralda o fondo distintivo) que contienen:
  * **Notas de Preparación Rápida:** Resúmenes de 5 minutos sobre la teoría detrás de la lección.
  * **Analogías Clave:** Ejemplos sencillos para explicar conceptos abstractos.
  * **Manejo de Dudas:** Lista de preguntas frecuentes de alumnos y respuestas recomendadas.
  * **Gestión de Tiempos:** Sugerencias de cuántos minutos dedicar a cada sección.

---

## 3. Estrategia de Alternativas a AWS

Para cada unidad del curso que asuma el uso de AWS, utilizaremos las siguientes rutas alternativas:

| Servicio AWS | Concepto Clave a Enseñar | Alternativa Práctica Propuesta |
| :--- | :--- | :--- |
| **Redes Físicas vs Virtuales** (Clase 0) | Qué es una IP, binarios, máscaras, LAN | Entrenador Binario interactivo de 8 bits, visualizador de bloqueo de máscara, y laboratorio local de ping/servidor local. |
| **VPC & Subnets** (Clase 1) | Rangos de IP, CIDR, Subredes Públicas/Privadas, IGW y Route Tables | Calculadora CIDR visual integrada y Simulador de Ruteo de Paquetes interactivo. |
| **Seguridad y Resiliencia** (Clase 2) | Security Groups vs NACLs, NAT Gateway, Availability Zones (Multi-AZ) | Constructor de reglas de firewall interactivo, simulador de NAT translation, panel de caída de AZs en vivo, y laboratorio de diagramado Draw.io. |
| **EC2 (Virtual Servers)** (Clase 3) | Cómputo en la nube, servidores web, firewalls locales | Servidores web locales en Python/Node, simulación de puertos en la terminal, o despliegue rápido gratuito en Glitch/Render. |
| **S3 (Object Storage)** (Clase 4) | Almacenamiento de objetos, buckets, permisos | Uso de `localStorage` para entender almacenamiento llave-valor, o APIs de almacenamiento gratuito en la web. |
| **IAM (Identity & Access Management)** (Clase 5) | Usuarios, Roles, Políticas de acceso | Simulador interactivo de políticas JSON para entender denegar/permitir accesos. |

---

## 4. Directrices de Desarrollo (Ahorro de Tokens y Rendimiento)

1. **Arquitectura Limpia:** Usar Vanilla HTML, CSS y JS. Evitar frameworks pesados o bundlers a menos que sea estrictamente necesario.
2. **Modularidad CSS:** Mantener un único archivo `styles.css` con variables CSS globales para asegurar consistencia estética.
3. **Simuladores Autónomos:** Toda la lógica de simulación debe correr del lado del cliente (JS puro), eliminando la necesidad de APIs de backend o bases de datos complejas.
4. **Optimización de Contenido:** Explicaciones concisas y de alta densidad de información para reducir el volumen de texto inútil.

---

## 5. Directrices del Modo Presentación (PPT Integrado)

Para proyectar las clases en el aula de forma dinámica:
* **Estructura HTML:** Cada diapositiva se define con una etiqueta `<section class="slide">` dentro de un contenedor principal `.slides-container`.
* **Modo Proyector:** Cuando se activa el modo presentación (`body.presentation-mode`), el CSS oculta la navegación regular y el pie de página, mostrando una diapositiva a la vez en pantalla completa.
* **Notas de Orador:** Si el `body.teacher-mode-active` está activado simultáneamente, se revelan notas de ayuda al final del slide con analogías breves e indicaciones pedagógicas en color verde esmeralda.
* **Interactividad:** Los widgets de práctica (juego binario, calculadoras, simulador de paquetes) deben diseñarse para ser completamente utilizables dentro de las diapositivas de presentación, permitiendo demostraciones en vivo.

