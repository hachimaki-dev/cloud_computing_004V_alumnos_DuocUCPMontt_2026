# Taller Práctico: Amazon EC2 + Amazon EFS desde Cero
### Para estudiantes que nunca (o casi nunca) han trabajado con la nube

---

> **¿Para quién es este taller?**
> Para ti, que quizás alguna vez seguiste los clics de un profe pero no quedó del todo claro *por qué* hacías cada cosa. Aquí vas a entender cada paso antes de ejecutarlo. Sin apuro.

---

## ¿Qué vas a aprender?

Al terminar este taller vas a ser capaz de:

1. Crear una máquina virtual (EC2) en Amazon Web Services
2. Conectarte a ella desde tu computador usando PuTTY
3. Gestionar usuarios y contraseñas dentro de Linux
4. Crear un sistema de archivos compartido en la nube (EFS)
5. Montar ese sistema de archivos en tu máquina virtual
6. Hacer que el montaje sobreviva reinicios del servidor

---

## Antes de empezar: conceptos clave (léelos, en serio)

No saltes esta sección. Si entiendes estos conceptos, el resto fluye solo.

**¿Qué es la nube?**
Es simplemente el computador de otra persona. Amazon tiene miles de computadores en sus centros de datos. Tú los "alquilas" por horas o minutos. Cuando creas una EC2, estás reservando uno de esos computadores para ti.

**¿Qué es EC2?**
*Elastic Compute Cloud*. Es el servicio de AWS para crear máquinas virtuales. Piénsalo como un computador sin pantalla que vive en internet. Tú te conectas a él de forma remota.

**¿Qué es una instancia?**
Es una máquina virtual específica que tú creaste. Como abrir una aplicación: el programa es EC2, tu instancia es *tu* ventana abierta.

**¿Qué es una AMI?**
*Amazon Machine Image*. Es la "foto" del sistema operativo que va a tener tu máquina. Es como elegir si instalas Windows o Linux antes de encender el computador.

**¿Qué es t2.small?**
Es el tamaño de la máquina: cuánta RAM y CPU tiene. `t2.small` es pequeña (1 CPU, 2 GB RAM), perfecta para practicar sin gastar.

**¿Qué es un par de claves (.pem)?**
Como una llave y una cerradura. AWS guarda la cerradura, tú guardas la llave (el archivo `.pem`). Sin esa llave no puedes entrar. **Si la pierdes, no hay forma de recuperarla.**

**¿Qué es PuTTY?**
Un programa para Windows que te permite conectarte a servidores Linux de forma remota. Es el "teléfono" que usas para hablar con tu máquina en la nube.

**¿Qué es EFS?**
*Elastic File System*. Es un disco duro que vive en la nube, separado de tu máquina virtual. Lo útil: puedes conectar el mismo EFS a varias máquinas al mismo tiempo. Como una carpeta compartida en red, pero en AWS.

**¿Qué es una VPC?**
*Virtual Private Cloud*. Es tu red privada dentro de AWS. Para que EC2 y EFS puedan comunicarse, deben estar en la misma VPC. Como estar en el mismo edificio para poder usar el mismo servidor de archivos.

**¿Qué es un grupo de seguridad?**
Es el firewall de tu instancia. Define qué tráfico puede entrar y salir. Si no abres el puerto correcto, no podrás conectarte ni montar el EFS.

---

## MÓDULO 1 — Crear y conectar una instancia EC2

---

### Paso 1.1 — Ingresar a la consola de AWS

1. Ve a [https://console.aws.amazon.com](https://console.aws.amazon.com)
2. Inicia sesión con tu cuenta (o la cuenta de laboratorio que te dieron)
3. Verifica que la región en la esquina superior derecha diga **US East (N. Virginia)** — `us-east-1`

> **¿Por qué importa la región?**
> AWS tiene centros de datos en todo el mundo. Todo lo que crees en una región no existe en las otras. Si creas tu EC2 en Virginia y tu EFS en Irlanda, no se pueden ver.

---

### Paso 1.2 — Buscar el servicio EC2

1. En la barra de búsqueda superior escribe `EC2`
2. Haz clic en el resultado **EC2** (máquinas virtuales en la nube)
3. En el menú izquierdo, haz clic en **Instancias**
4. Luego en el botón naranja **Lanzar instancias**

---

### Paso 1.3 — Configurar la máquina virtual

Vas a llenar un formulario. Aquí cada campo importa:

**Nombre:**
Ponle un nombre descriptivo, por ejemplo: `MiServidor-EC2`

**Imagen de máquina de Amazon (AMI):**
- Busca `Amazon Linux 2023`
- Asegúrate que diga **kernel-6.18** en la descripción
- Arquitectura: `64 bits (x86)`
- Debe decir "Apto para la capa gratuita"

> **¿Por qué Amazon Linux y no Ubuntu?**
> Amazon Linux está optimizado para AWS. Incluye herramientas como `amazon-efs-utils` en sus repositorios. En Ubuntu tendrías que hacer pasos extra.

**Tipo de instancia:**
- Selecciona `t2.small`
- Verás que tiene 1 vCPU y 2 GB de memoria

**Par de claves (inicio de sesión):**
- Haz clic en **Crear un nuevo par de claves**
- Nombre: `ec2_tuNombre` (ejemplo: `ec2_julian`)
- Tipo: RSA
- Formato: `.pem`
- Haz clic en **Crear par de claves**
- **El archivo se descargará automáticamente. Guárdalo en un lugar seguro. No lo pierdas.**

**Configuración de red:**
- Deja la VPC predeterminada
- Asegúrate que "Asignar IP pública automáticamente" esté **habilitado**
- En Firewall (grupos de seguridad): selecciona **Crear grupo de seguridad**
  - Marca: ✅ Permitir tráfico SSH desde: `Anywhere`

**Almacenamiento:**
- Deja el valor predeterminado: 1 volumen de 8 GiB

**Resumen:**
- Número de instancias: `1`
- Haz clic en **Lanzar instancia**

---

### Paso 1.4 — Esperar que la instancia esté lista

1. Haz clic en el ID de la instancia que aparece
2. Espera que el **Estado de la instancia** diga ✅ `En ejecución`
3. Espera que las **Comprobaciones de estado** digan `2/2 comprobaciones superadas`

> Esto puede tomar 1-2 minutos. La máquina está "encendiendo".

Anota estos datos que necesitarás después:
- **DNS público** (algo como `ec2-XX-XX-XX-XX.compute-1.amazonaws.com`)
- **ID de VPC** (algo como `vpc-XXXXXXXX`) — lo necesitas para el EFS

---

### Paso 1.5 — Preparar PuTTY para conectarse

PuTTY no entiende archivos `.pem` directamente. Necesitas convertirlo a `.ppk` usando **PuTTYgen**.

**Convertir la clave .pem a .ppk:**

1. Abre **PuTTYgen** (viene instalado con PuTTY)
2. Haz clic en **Load**
3. Cambia el filtro de archivos a `All Files (*.*)`
4. Navega hasta tu archivo `.pem` y ábrelo
5. Verás un mensaje de éxito — haz clic en OK
6. Haz clic en **Save private key**
7. Te preguntará si quieres guardar sin frase — haz clic en **Sí**
8. Guarda el archivo como `ec2_tuNombre.ppk`

**Conectarse con PuTTY:**

1. Abre **PuTTY**
2. En el campo **Host Name**: escribe `ec2-user@TU_DNS_PUBLICO`
   - Ejemplo: `ec2-user@ec2-44-201-206-164.compute-1.amazonaws.com`
3. Puerto: `22`
4. En el menú izquierdo ve a: **Connection > SSH > Auth > Credentials**
5. En **Private key file for authentication** haz clic en **Browse**
6. Selecciona tu archivo `.ppk`
7. Vuelve a **Session**, escribe un nombre en **Saved Sessions** y haz clic en **Save** (para no repetir esto cada vez)
8. Haz clic en **Open**
9. Si aparece una advertencia de seguridad, haz clic en **Accept**

✅ Si ves el logo de Amazon Linux con una `$` al final, ¡estás dentro!

---

## MÓDULO 2 — Gestión de usuarios en Linux

---

### Paso 2.1 — Entender dónde estás

Cuando entras por PuTTY, eres el usuario `ec2-user`. Este usuario tiene permisos limitados. Para hacer cambios importantes en el sistema necesitas usar `sudo` (ejecutar como administrador).

Comprueba quién eres:
```bash
whoami
```
Debe decir: `ec2-user`

---

### Paso 2.2 — Cambiar la contraseña de root

El usuario `root` es el administrador máximo del sistema. Por defecto en AWS no tiene contraseña (se accede solo por clave). Vamos a asignarle una:

```bash
sudo passwd root
```

El sistema te pedirá:
```
New password:
Retype new password:
```

Escribe `1234` (en el taller usamos esta contraseña simple; en producción real, nunca hagas esto).

> **¿Por qué sudo?**
> Solo root puede cambiar la contraseña de root. `sudo` te permite ejecutar ese comando *como si fueras root* de forma temporal.

---

### Paso 2.3 — Crear un nuevo usuario

Vamos a crear el usuario `ADM_PICKET`:

```bash
sudo useradd ADM_PICKET
```

Verificar que se creó:
```bash
cat /etc/passwd | grep ADM_PICKET
```
Deberías ver una línea con el usuario y su directorio home.

---

### Paso 2.4 — Asignar contraseña al nuevo usuario

```bash
sudo passwd ADM_PICKET
```

Escribe `Duoc_2025` cuando te lo pida (dos veces).

> **Nota:** Linux no muestra los caracteres mientras escribes la contraseña. Es normal, sigue escribiendo.

**Verificar que el usuario existe en el sistema:**
```bash
cat /etc/passwd
```
Este archivo lista todos los usuarios del sistema. Busca `ADM_PICKET` al final.

---

## MÓDULO 3 — Crear y configurar Amazon EFS

---

### Paso 3.1 — ¿Por qué EFS y no solo el disco de la EC2?

El disco que tiene tu EC2 (EBS) solo puede conectarse a **una** máquina a la vez y desaparece si terminas la instancia. EFS es diferente:

- Se puede montar en **múltiples instancias** simultáneamente
- Persiste aunque elimines tu EC2
- Escala automáticamente (no necesitas elegir tamaño fijo)

Ideal para: logs compartidos, archivos de configuración, contenido web compartido.

---

### Paso 3.2 — Crear el sistema de archivos EFS

1. En la consola de AWS busca `EFS`
2. Haz clic en **Crear sistema de archivos**
3. Ponle un nombre: `DiscoEFSPrueba`
4. **VPC:** selecciona la misma VPC donde está tu EC2 (usa el ID que anotaste antes)
5. Haz clic en **Crear**

---

### Paso 3.3 — Verificar que la VPC coincide

Este es un paso crítico que se pasa por alto frecuentemente.

**En tu instancia EC2:**
1. Ve a EC2 > Instancias > tu instancia
2. Pestaña **Redes**
3. Anota el **ID de VPC**: `vpc-XXXXXXXX`
4. Anota la **Zona de disponibilidad**: `us-east-1a` (o similar)

**En tu EFS:**
1. Ve a EFS > tu sistema de archivos
2. Pestaña **Red**
3. Verifica que el **ID de VPC** sea el mismo
4. Verifica que la **Zona de disponibilidad** coincida

> **Si las VPC no coinciden:** el EFS y la EC2 no pueden verse. Es como intentar compartir una carpeta entre dos redes completamente separadas.

---

### Paso 3.4 — Verificar el grupo de seguridad del EFS

El EFS usa el protocolo NFS en el **puerto 2049**. Tu grupo de seguridad debe permitirlo.

**Opción A — Usar el mismo grupo de seguridad:**
En la configuración de red del EFS, selecciona el mismo grupo de seguridad que usa tu instancia EC2 (`launch-wizard-XX`).

**Opción B — Verificar que el puerto 2049 esté abierto:**
1. Ve a EC2 > Grupos de seguridad
2. Selecciona tu grupo
3. Pestaña **Reglas de entrada**
4. Si no existe una regla para NFS (puerto 2049), agrégala:
   - Tipo: `NFS`
   - Origen: `0.0.0.0/0` (para el taller; en producción sería más restrictivo)

---

## MÓDULO 4 — Montar el EFS en la instancia EC2

---

### Paso 4.1 — Instalar amazon-efs-utils

Esta herramienta permite montar EFS de forma más simple y segura que con NFS puro.

```bash
sudo yum update -y
sudo yum install amazon-efs-utils -y
```

Espera que termine. Verás mensajes de descarga e instalación. Al final debe decir `Complete!`

> **¿Qué es yum?**
> Es el gestor de paquetes de Amazon Linux (similar a una "tienda de aplicaciones" por consola). `yum install` = instalar programa.

---

### Paso 4.2 — Obtener el ID del EFS

1. Ve a la consola de AWS > EFS
2. Copia el **ID del sistema de archivos**: algo como `fs-XXXXXXXXXXXXXXXXX`

---

### Paso 4.3 — Crear el punto de montaje

Un "punto de montaje" es simplemente una carpeta vacía donde vas a "conectar" el EFS. Es como el enchufe donde conectas el disco externo.

```bash
ls
mkdir efs
ls
```

Verás que ahora existe la carpeta `efs` en tu directorio home.

> Puedes crear el punto de montaje donde quieras. En este taller lo ponemos en `/home/ec2-user/efs` para simplificar.

---

### Paso 4.4 — Montar el EFS

```bash
sudo mount -t efs -o tls fs-XXXXXXXXXXXXXXXXX:/ /home/ec2-user/efs
```

Reemplaza `fs-XXXXXXXXXXXXXXXXX` con tu ID real.

> **¿Qué significa cada parte?**
> - `sudo`: necesitas permisos de administrador para montar sistemas de archivos
> - `mount`: el comando para conectar un disco
> - `-t efs`: el tipo es EFS (usa amazon-efs-utils)
> - `-o tls`: usa cifrado en tránsito (más seguro)
> - `fs-XXXX:/`: el EFS y la carpeta raíz dentro de él
> - `/home/ec2-user/efs`: dónde lo vas a "conectar" en tu máquina

**Si aparece el error `mount point /home/ec2-user/efs does not exist`:**
```bash
sudo mkdir -p /home/ec2-user/efs
```
Luego intenta montar de nuevo.

---

### Paso 4.5 — Verificar que el montaje funcionó

```bash
df -h
```

Este comando muestra todos los discos montados. Busca una línea que termine en `/home/ec2-user/efs`. Debería verse así:

```
Filesystem      Size  Used Avail Use% Mounted on
...
fs-XXXX:/       8.0E     0  8.0E   0% /home/ec2-user/efs
```

> `8.0E` significa 8 exabytes — EFS no tiene límite de tamaño real, escala automáticamente. Por eso muestra ese número enorme.

**Prueba escribir un archivo en el EFS:**
```bash
echo "Hola desde EC2" > /home/ec2-user/efs/prueba.txt
cat /home/ec2-user/efs/prueba.txt
```

---

## MÓDULO 5 — Montaje automático (persistencia tras reinicios)

---

### Paso 5.1 — El problema

Si reinicias tu instancia ahora, el EFS **se desmontará**. El comando `mount` que ejecutaste solo dura hasta el próximo apagado. Para que se monte automáticamente cada vez que enciende el servidor, debes editar el archivo `/etc/fstab`.

---

### Paso 5.2 — ¿Qué es /etc/fstab?

Es una lista de instrucciones que Linux lee al arrancar para saber qué discos montar automáticamente. Cada línea = un disco o sistema de archivos.

Ver su contenido actual:
```bash
cat /etc/fstab
```

---

### Paso 5.3 — Editar fstab con nano

```bash
sudo nano /etc/fstab
```

Agrega esta línea al **final** del archivo (sin borrar nada):

```
fs-XXXXXXXXXXXXXXXXX:/ /home/ec2-user/efs efs defaults,_netdev,tls,iam,bysystemd,automount 0 0
```

Reemplaza `fs-XXXXXXXXXXXXXXXXX` con tu ID real.

**Guardar y salir de nano:**
- `Ctrl + O` → guardar (Enter para confirmar)
- `Ctrl + X` → salir

> **¿Qué significa `_netdev`?**
> Le dice a Linux "espera a que haya red antes de montar esto". Sin esta opción, si el sistema intenta montar el EFS antes de conectarse a internet, falla y puede dejar el servidor en un estado raro.

---

### Paso 5.4 — Probar sin reiniciar

Antes de reiniciar, prueba que la línea que agregaste es correcta:

```bash
sudo umount /home/ec2-user/efs
sudo mount -a
df -h
```

`mount -a` monta todo lo que está en fstab. Si no hay errores y ves el EFS en `df -h`, la configuración está bien.

---

### Paso 5.5 — Reiniciar y verificar

```bash
sudo reboot
```

PuTTY se desconectará. Espera 1-2 minutos y vuelve a conectarte.

Una vez dentro, ejecuta:
```bash
df -h
```

Si el EFS aparece montado sin que hayas hecho nada, ¡lo lograste! El montaje es persistente.

---

## Ejercicios de práctica adicionales

Estos ejercicios te ayudarán a consolidar lo aprendido. Intenta resolverlos sin mirar la guía primero.

---

**Ejercicio 1 — Repetición base**
Elimina tu instancia EC2 y créala de nuevo desde cero. Repite todos los pasos del Módulo 1. El objetivo es que el proceso se vuelva natural.

**Ejercicio 2 — Segundo usuario**
Crea un usuario llamado `OPE_TORRES` con contraseña `Taller_2025`. Verifica que aparezca en `/etc/passwd`.

**Ejercicio 3 — Permisos de carpeta en EFS**
Dentro del EFS, crea una carpeta llamada `compartido` y dale permisos de escritura a todos los usuarios:
```bash
sudo mkdir /home/ec2-user/efs/compartido
sudo chmod 777 /home/ec2-user/efs/compartido
```
¿Qué significa `777`? Investígalo.

**Ejercicio 4 — Dos instancias, un EFS**
Crea una segunda instancia EC2 en la misma VPC. Monta el mismo EFS en ella. Crea un archivo desde la primera instancia y verifica que se ve desde la segunda.

**Ejercicio 5 — Diagnóstico**
Desmonta el EFS intencionalmente (`sudo umount /home/ec2-user/efs`), luego intenta montarlo con un ID de EFS incorrecto. ¿Qué error aparece? ¿Cómo lo interpretas?

---

## Errores comunes y cómo resolverlos

| Error | Causa probable | Solución |
|---|---|---|
| `mount: no such file or directory` | El directorio de montaje no existe | `sudo mkdir -p /home/ec2-user/efs` |
| `Connection timed out` al montar | Puerto 2049 bloqueado o VPCs distintas | Verifica grupo de seguridad y que VPC coincida |
| PuTTY: `Connection refused` | La instancia aún está iniciando | Espera 2 minutos y reintenta |
| PuTTY: `Server unexpectedly closed` | Clave .ppk incorrecta o usuario equivocado | Verifica que usas `ec2-user` y la clave correcta |
| `Permission denied` en un comando | Falta `sudo` | Agrega `sudo` al inicio del comando |
| EFS no aparece en `df -h` tras reboot | Error en la línea de fstab | Revisa sintaxis con `sudo mount -a` |

---

## Comandos de referencia rápida

```bash
# Ver usuarios del sistema
cat /etc/passwd

# Crear usuario
sudo useradd NOMBRE_USUARIO

# Cambiar contraseña
sudo passwd NOMBRE_USUARIO

# Ver discos montados
df -h

# Montar EFS manualmente
sudo mount -t efs -o tls fs-XXXX:/ /punto/de/montaje

# Desmontar EFS
sudo umount /punto/de/montaje

# Montar todo lo que está en fstab
sudo mount -a

# Editar fstab
sudo nano /etc/fstab

# Reiniciar el servidor
sudo reboot

# Ver qué usuario soy
whoami

# Ver en qué carpeta estoy
pwd

# Listar archivos
ls -la
```

---

## Lista de verificación final

Usa esta lista para confirmar que completaste todo:

- [ ] Instancia EC2 creada con Amazon Linux 2023 kernel-6.18
- [ ] Tipo de instancia: t2.small
- [ ] Par de claves generado y archivo .pem guardado de forma segura
- [ ] Conexión exitosa por PuTTY con usuario `ec2-user`
- [ ] Contraseña de root cambiada a `1234`
- [ ] Usuario `ADM_PICKET` creado con contraseña `Duoc_2025`
- [ ] EFS creado en la misma VPC que la instancia
- [ ] VPC del EFS y EC2 verificadas (deben coincidir)
- [ ] Zona de disponibilidad verificada
- [ ] Grupo de seguridad con puerto 2049 abierto
- [ ] `amazon-efs-utils` instalado
- [ ] Punto de montaje creado (`mkdir efs`)
- [ ] EFS montado correctamente (verificado con `df -h`)
- [ ] Archivo de prueba creado en el EFS
- [ ] Línea agregada a `/etc/fstab`
- [ ] Montaje automático verificado tras `sudo reboot`

---

*Taller desarrollado para estudiantes de introducción a computación en la nube — AWS EC2 + EFS*