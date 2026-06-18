Lo que sigue es el enfoque que usaría si quisiera que un estudiante terminara la clase diciendo:

> "Ahora entiendo qué es una VPC, para qué existen las subredes, por qué usamos CIDR, cómo sale el tráfico a Internet y cómo AWS decide hacia dónde enviar los paquetes."

No quiero que memoricen AWS. Quiero que entiendan redes.

---

# Objetivo real del taller

Cuando terminemos, los estudiantes deberían poder responder:

**¿Cómo hago para que un servidor que está dentro de AWS pueda comunicarse con Internet?**

Y más importante:

**¿Qué componentes participan en ese proceso y qué rol cumple cada uno?**

Porque eso es exactamente lo que estamos construyendo.

---

# Introducción: ¿Por qué existe una VPC?

Antes de AWS, una empresa compraba servidores físicos.

Tenía que:

* Comprar switches
* Comprar routers
* Configurar VLANs
* Cablear todo
* Contratar Internet

AWS virtualiza todo eso.

Una VPC es básicamente:

> "Tu propia red privada dentro de AWS"

AWS lo define como una red virtual aislada donde puedes lanzar recursos y controlar completamente el direccionamiento IP, rutas y conectividad. ([Documentación de AWS][1])

---

# Analogía de la ciudad

Me funciona increíble con estudiantes.

Imagina que vas a construir una ciudad.

Necesitas:

1. Un terreno
2. Barrios
3. Calles
4. Salidas de la ciudad
5. Señalética vial

Eso es exactamente lo que estamos haciendo.

| Ciudad                         | AWS                  |
| ------------------------------ | -------------------- |
| Terreno                        | VPC                  |
| Barrios                        | Subredes             |
| Salida a la autopista          | Internet Gateway     |
| Señalética vial                | Tabla de rutas       |
| Asignar señalética a un barrio | Asociación de subred |

---

# Paso 1: Crear la VPC

Pregúntales:

> ¿Dónde vivirán nuestros servidores?

La respuesta es:

Dentro de una VPC.

Ejemplo:

```
10.0.0.0/16
```

Aquí aparece el primer concepto importante.

---

# ¿Qué significa 10.0.0.0/16?

No es una IP.

Es un bloque CIDR.

CIDR significa:

Classless Inter-Domain Routing

Sirve para definir:

> Cuántas direcciones IP tendrá mi red.

AWS permite definir bloques CIDR para las VPC. ([Documentación de AWS][1])

---

# Actividad

Preguntar:

¿Cuántas IPs tiene un /16?

Explicar:

```
32 bits totales
16 bits para red
16 bits para hosts
```

Entonces:

```
2^16
=
65536 IPs
```

No necesitan memorizarlo.

Necesitan entender:

> Mientras menor sea el número después del "/", más grande es la red.

---

# Paso 2: Crear la subred

Aquí suele aparecer la primera gran duda.

---

# ¿Por qué una VPC es /16 y una subred es /20?

Porque estamos dividiendo el terreno.

Imagina:

VPC:

```
10.0.0.0/16
```

Es el país completo.

Luego creamos:

```
10.0.0.0/20
```

Eso es una región dentro del país.

AWS exige que la subred esté contenida dentro del bloque CIDR de la VPC. ([Documentación de AWS][1])

---

# Pregunta para la clase

¿Por qué no ponemos todo en una sola subred?

Excelente discusión.

Respuestas:

* Organización
* Seguridad
* Escalabilidad
* Separación de servicios

---

# Caso real

Empresa:

* Web pública
* Base de datos
* Backend

¿Quieren que la base de datos esté en el mismo segmento que Internet?

No.

Por eso existen distintas subredes.

---

# Ejemplo visual

```
VPC
10.0.0.0/16

├── Subred Web
│   10.0.0.0/20
│
├── Subred Backend
│   10.0.16.0/20
│
└── Subred BaseDatos
    10.0.32.0/20
```

---

# Pregunta poderosa

¿Qué pasaría si dos subredes usan el mismo rango IP?

Respuesta:

Los paquetes no sabrían dónde llegar.

Por eso las subredes no pueden superponerse.

---

# Paso 3: Crear Internet Gateway

Ahora tenemos una ciudad.

Pero no tiene salida.

Nadie entra.

Nadie sale.

---

# Pregunta para los estudiantes

¿Nuestros servidores pueden acceder a Google?

Respuesta:

No.

Todavía no.

---

# ¿Qué es una Internet Gateway?

AWS la define como el componente que permite comunicación entre la VPC e Internet. ([Documentación de AWS][2])

---

# Analogía

Es la puerta principal de la ciudad.

Sin ella:

* No entra tráfico
* No sale tráfico

---

# Actividad

Preguntar:

¿Qué pasaría si tengo una EC2 con IP pública pero no tengo Internet Gateway?

Respuesta:

No puede comunicarse con Internet.

Porque no existe una salida.

AWS lo documenta explícitamente. ([Documentación de AWS][2])

---

# Paso 4: Tabla de rutas

Aquí está el corazón conceptual.

La mayoría de los alumnos hace clic sin entender esto.

---

# Pregunta

Ya tenemos:

* Ciudad
* Barrio
* Puerta de salida

¿Por qué aún no funciona?

Porque nadie sabe dónde está la puerta.

---

# Tabla de rutas

Una tabla de rutas es un conjunto de instrucciones.

AWS:

> Cada ruta tiene un destino y un objetivo. ([Documentación de AWS][3])

Ejemplo:

```
Destino      Objetivo

0.0.0.0/0    igw-123
```

Significa:

> Todo lo que no conozcas envíalo a Internet.

AWS usa exactamente este ejemplo en su documentación. ([Documentación de AWS][1])

---

# Analogía

Es un GPS.

Cuando llega un paquete:

Pregunta:

"¿A dónde debo ir?"

La tabla responde.

---

# Actividad práctica

Dibujar en la pizarra:

```
Servidor
   |
   |
Subred
   |
   |
Tabla de rutas
   |
   |
Internet Gateway
   |
   |
Internet
```

Luego preguntar:

¿Qué pasa si elimino la tabla?

¿Qué pasa si elimino la puerta?

¿Qué pasa si elimino la subred?

---

# Paso 5: Asociar la subred

Este paso suele parecer mágico.

Pero no lo es.

---

# Pregunta

Tengo una tabla de rutas.

Tengo una subred.

¿Cómo sabe la subred qué tabla usar?

Respuesta:

Asociación.

AWS indica que toda subred debe estar asociada a una tabla de rutas. ([Documentación de AWS][1])

---

# Analogía

Tengo un barrio.

Tengo un conjunto de señales de tránsito.

Debo decidir:

¿Qué barrio utilizará esas señales?

Eso es exactamente la asociación.

---

# Concepto fundamental

Una subred NO es pública porque la llames:

```
subred-publica
```

Se vuelve pública cuando:

* Tiene una ruta hacia Internet Gateway
* Está asociada a la tabla correcta

AWS lo indica explícitamente. ([Documentación de AWS][2])

---

# Desafío final

Al terminar el taller, dibuja esto:

```
Internet
    |
    |
Internet Gateway
    |
    |
Tabla de rutas
    |
    |
Subred
    |
    |
EC2
```

Y pregunta:

"Si elimino uno de estos elementos, ¿qué deja de funcionar?"

---

# Caso de uso real 1: Sitio web

Una empresa quiere publicar:

```
www.mitienda.cl
```

Necesita:

* VPC
* Subred pública
* Internet Gateway
* Tabla de rutas
* EC2

Todo lo que acabamos de construir.

---

# Caso de uso real 2: Base de datos

La base de datos:

```
PostgreSQL
```

NO debería estar expuesta.

Entonces:

* Misma VPC
* Otra subred
* Sin ruta hacia Internet

Resultado:

Subred privada.

---

# Caso de uso real 3: Universidad

Sistema de notas.

Arquitectura:

```
Internet
    |
Web
    |
Backend
    |
Base de Datos
```

Cada capa podría vivir en una subred distinta.

---

# Preguntas abiertas para discusión

1. ¿Por qué no poner todo en una sola subred?

2. ¿Por qué una base de datos no debería tener Internet?

3. ¿Qué ventajas tiene separar redes?

4. ¿Qué pasaría si una tabla de rutas se configura mal?

5. ¿Qué ocurriría si dos VPC usan los mismos rangos IP y luego queremos conectarlas?

6. ¿Por qué AWS crea una tabla principal automáticamente?

7. ¿Qué diferencia existe entre tener una IP pública y tener acceso a Internet?

8. ¿Puede existir una Internet Gateway sin tabla de rutas?

9. ¿Puede existir una tabla de rutas sin Internet Gateway?

10. ¿Qué componente toma realmente la decisión final sobre hacia dónde viaja un paquete?

---

# Evaluación perfecta para cerrar

No preguntes:

> ¿Qué botón presionaste?

Pregunta:

> Explica el viaje de un paquete desde una instancia EC2 hasta Google.

Si logran responder:

1. Sale de la instancia.
2. Llega a la subred.
3. Consulta la tabla de rutas.
4. La ruta 0.0.0.0/0 apunta a la Internet Gateway.
5. La Internet Gateway conecta la VPC con Internet.

Entonces entendieron redes en AWS.

Y si entendieron eso, mañana podrán aprender NAT Gateway, VPN, Transit Gateway, Peering, Load Balancers y arquitecturas complejas mucho más fácilmente, porque ya construyeron el modelo mental correcto.

[1]: https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html?utm_source=chatgpt.com "Subnet route tables - Amazon Virtual Private Cloud"
[2]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html?utm_source=chatgpt.com "Enable internet access for a VPC using an internet gateway - Amazon Virtual Private Cloud"
[3]: https://docs.aws.amazon.com/en_us/vpc/latest/userguide/RouteTables.html?utm_source=chatgpt.com "Route table concepts - Amazon Virtual Private Cloud"
