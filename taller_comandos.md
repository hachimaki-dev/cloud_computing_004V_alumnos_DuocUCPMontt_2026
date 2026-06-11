# 🚀 Taller Práctico — Preparando un Servidor Linux en AWS
**Duración estimada:** ~1 hora | **Entorno:** AWS Academy + Ubuntu EC2

---

## 📖 Tu misión

Eres parte de un equipo de desarrollo que acaba de conseguir un servidor en la nube. El servidor llegó vacío — solo tiene el sistema operativo instalado. Tu trabajo es dejarlo listo para que el equipo pueda trabajar de forma **segura y ordenada**.

Para eso necesitas:
1. Crear y conectarte al servidor
2. Crear un usuario para el desarrollador del equipo
3. Organizar los archivos del proyecto
4. Proteger las credenciales sensibles
5. Instalar y activar el programador de tareas del servidor

Cada paso construye sobre el anterior. No saltes adelante sin verificar que lo anterior funciona.

---

## 🏗️ MÓDULO 0 — Crear el servidor en AWS (tu EC2)
**Objetivo:** Tener una máquina Linux corriendo en la nube a la que puedas conectarte.

> 💡 **¿Qué es una EC2?** Es una máquina virtual en la nube de Amazon. Tú eliges el sistema operativo, el tamaño, y en minutos tienes un servidor funcionando en algún datacenter del mundo. Es como tener una computadora, pero sin tocarla físicamente.

### Pasos para crear la instancia

1. Entra a **AWS Academy** → inicia tu entorno → abre la **consola de AWS**
2. En el buscador superior escribe **EC2** y entra al servicio
3. Haz clic en **Launch Instance**
4. Completa la configuración:

| Campo | Valor |
|-------|-------|
| Name | `servidor-backend` |
| Application and OS Images | **Ubuntu** (busca "Ubuntu Server 22.04 LTS") ⚠️ No elegir "Amazon Linux" |
| Instance type | `t2.micro` (es la gratuita) |
| Key pair | Crea uno nuevo → ponle nombre → tipo **RSA** → formato **.pem** → descárgalo y guárdalo en un lugar seguro |
| Network settings | Deja los valores por defecto, solo asegúrate que **Allow SSH traffic** esté marcado |

5. Haz clic en **Launch Instance**
6. Espera ~1 minuto y ve a **Instances** — cuando el estado diga **running** y los checks estén en verde, está lista

> ⚠️ **Guarda bien tu archivo `.pem`** — es la única llave para entrar al servidor. Si la pierdes, no hay recuperación posible.

### Anota esto antes de continuar

Ve a tu instancia y copia la **Public IPv4 address**. La vas a necesitar en el siguiente módulo.

---

### ✅ Checkpoint 0

Antes de seguir, confirma:
- [ ] La instancia aparece como **running**
- [ ] Los **Status checks** muestran 2/2 checks passed
- [ ] Tienes el archivo `.pem` descargado
- [ ] Tienes anotada la IP pública

---

## 🔌 MÓDULO 1 — Conectarse al servidor
**Objetivo:** Abrir una terminal dentro del servidor para poder trabajar en él.

> 💡 **¿Por qué necesito conectarme así?** El servidor no tiene pantalla ni teclado. La única forma de usarlo es a través de **SSH** (Secure Shell), un protocolo que abre un túnel seguro entre tu computador y el servidor. Todo lo que escribes en tu terminal viaja encriptado hasta la máquina remota.

Tienes dos opciones. Elige la que más te acomode:

---

### Opción A — Usando PowerShell (recomendado, más simple)

Windows 10 y 11 ya tienen SSH instalado de forma nativa.

1. Abre **PowerShell** (búscalo en el menú inicio)
2. Navega hasta donde guardaste tu `.pem`:
```powershell
cd C:\Users\TuUsuario\Downloads
```
3. Conéctate:
```powershell
ssh -i "nombre-de-tu-llave.pem" ubuntu@IP_DE_TU_INSTANCIA
```

> ⚠️ En Ubuntu el usuario por defecto es `ubuntu`, no `ec2-user`. Ese es un detalle importante — si escribes `ec2-user` te rechazará la conexión.

Si te pregunta `Are you sure you want to continue connecting?` escribe `yes` y presiona Enter.

---

### Opción B — Usando PuTTY

PuTTY no entiende el formato `.pem` directamente — necesitas convertirlo a `.ppk` primero.

**Paso 1 — Convertir `.pem` a `.ppk` con PuTTYgen:**
1. Abre **PuTTYgen** (viene con PuTTY)
2. Haz clic en **Load**
3. En el explorador de archivos, cambia el filtro a "All Files (*.*)" para que aparezca tu `.pem`
4. Selecciona tu archivo `.pem` y haz clic en **Open**
5. Haz clic en **Save private key** → confirma que no quieres passphrase → guárdalo como `.ppk`

**Paso 2 — Conectarse con PuTTY:**
1. Abre **PuTTY**
2. En **Host Name** escribe: `ubuntu@IP_DE_TU_INSTANCIA`
3. El puerto debe ser **22**
4. En el panel izquierdo ve a **Connection → SSH → Auth → Credentials**
5. En **Private key file for authentication** carga tu archivo `.ppk`
6. Vuelve a **Session** y haz clic en **Open**

> 💡 Puedes guardar la sesión en PuTTY para no repetir estos pasos cada vez. Escribe un nombre en **Saved Sessions** y haz clic en **Save**.

---

Una vez conectado por cualquiera de las dos opciones, verás algo así:

```
ubuntu@ip-172-xx-xx-xx:~$
```

Ese símbolo `$` es la terminal del servidor. Todo lo que escribas a partir de ahora se ejecuta **dentro de la máquina en la nube**.

Ejecuta estos comandos para orientarte:
```bash
whoami
pwd
uname -a
```

> 💡 `whoami` dice quién eres, `pwd` dice dónde estás, y `uname -a` muestra información del sistema operativo. En Ubuntu verás algo como `Linux ... Ubuntu`.

---

### ✅ Checkpoint 1

Antes de seguir, confirma:
- [ ] Ves el prompt `ubuntu@ip-...`
- [ ] `whoami` devuelve `ubuntu`
- [ ] `uname -a` menciona Ubuntu en la respuesta

---

## 👤 MÓDULO 2 — Crear el usuario del desarrollador
**Objetivo:** Crear una identidad separada para el desarrollador del equipo, con su propia contraseña.

> 💡 **¿Por qué no trabajar siempre como `ubuntu`?** En un servidor real, compartir el usuario `ubuntu` entre todos es un problema de seguridad — no sabes quién hizo qué, y si alguien lo compromete, lo compromete todo. Cada desarrollador debe tener su propio usuario con sus propios permisos. Eso es exactamente lo que vas a hacer ahora.

### Entender `sudo`

Antes de crear usuarios, necesitas entender `sudo`. Crear usuarios es una operación de administrador — no cualquiera puede hacerlo. El comando `sudo` te permite ejecutar un comando con privilegios de superusuario (root), siempre que tu usuario tenga permisos para hacerlo.

```bash
sudo whoami
```
Debería devolver `root`. Eso confirma que tienes permisos de administrador.

### Crear el usuario

```bash
sudo useradd -m -s /bin/bash dev_js
```

- `-m` → crea una carpeta home para el usuario (`/home/dev_js`)
- `-s /bin/bash` → le asigna bash como terminal (sin esto el usuario no puede iniciar sesión normalmente)
- `dev_js` → el nombre del usuario

### Asignar contraseña

```bash
sudo passwd dev_js
```

Te pedirá escribir la contraseña dos veces. **No verás nada mientras escribes** — eso es normal y es una medida de seguridad de Linux.

### Explorar lo que pasó

```bash
id dev_js
```
Verás algo como: `uid=1001(dev_js) gid=1001(dev_js) groups=1001(dev_js)`

```bash
ls /home/
```
Deberías ver tanto `ubuntu` como `dev_js` — cada usuario tiene su propio espacio.

> 💡 **¿Qué es uid/gid?** Linux internamente identifica usuarios con números, no con nombres. `uid` es el ID del usuario, `gid` es el ID de su grupo principal. Cuando asignas permisos a archivos, Linux usa estos números por debajo.

---

### ✅ Checkpoint 2

Antes de seguir, confirma ejecutando:
```bash
id dev_js
```
- [ ] Ves `uid=...` con el nombre `dev_js`
- [ ] Existe la carpeta `/home/dev_js`
- [ ] El comando `sudo passwd dev_js` completó sin errores

---

## 📁 MÓDULO 3 — Organizar los archivos del proyecto
**Objetivo:** Crear la estructura de carpetas y archivos base del proyecto backend.

> 💡 **¿Por qué importa la estructura de archivos?** En un servidor compartido el orden es crítico. Si cada desarrollador guarda archivos donde quiere, en poco tiempo nadie sabe dónde está nada. Una estructura predefinida (`src` para código, `config` para configuraciones, `logs` para registros) es un estándar de la industria.

### Crear la estructura de una sola vez

```bash
mkdir -p ~/proyecto_backend/src ~/proyecto_backend/config ~/proyecto_backend/logs
```

> 💡 El flag `-p` le dice a `mkdir` que cree todos los directorios intermedios que necesite. Sin él, tendrías que crear `proyecto_backend` primero y luego cada subdirectorio por separado.

Verifica la estructura:
```bash
ls -R ~/proyecto_backend
```

Deberías ver:
```
/home/ubuntu/proyecto_backend:
config  logs  src
```

### Crear los archivos base

```bash
touch ~/proyecto_backend/src/app.js
touch ~/proyecto_backend/config/db.conf
```

> 💡 `touch` crea un archivo vacío. En la vida real, estos archivos tendrían código y configuraciones — por ahora los dejamos vacíos como estructura base.

Verifica:
```bash
ls -l ~/proyecto_backend/src/
ls -l ~/proyecto_backend/config/
```

---

### ✅ Checkpoint 3

Antes de seguir, confirma:
- [ ] `ls -R ~/proyecto_backend` muestra las 3 carpetas
- [ ] Existe el archivo `app.js` dentro de `src`
- [ ] Existe el archivo `db.conf` dentro de `config`

---

## 🔒 MÓDULO 4 — Proteger los archivos del proyecto
**Objetivo:** Asignar propietario y permisos correctos para que solo `dev_js` pueda acceder al proyecto.

> 💡 **¿Por qué esto importa en un servidor real?** Imagina que `db.conf` tiene la contraseña de tu base de datos de producción. Si cualquier usuario del servidor puede leerlo, cualquier persona con acceso al servidor puede robar esas credenciales. Los permisos bien configurados son la primera línea de defensa.

### Entender los permisos de Linux

Primero mira cómo están los permisos ahora mismo:
```bash
ls -l ~/proyecto_backend/
```

Verás algo así:
```
drwxr-xr-x 2 ubuntu ubuntu ... config
drwxr-xr-x 2 ubuntu ubuntu ... logs
drwxr-xr-x 2 ubuntu ubuntu ... src
```

Cada línea se lee así:
```
d  rwx  r-x  r-x    ubuntu  ubuntu
│   │    │    │
│   │    │    └── Otros usuarios
│   │    └─────── Grupo
│   └──────────── Propietario
└──────────────── d=directorio / -=archivo
```

Y cada bloque de permisos:

| Símbolo | Valor | En archivo | En directorio |
|---------|-------|-----------|--------------|
| `r` | 4 | Puede leer | Puede ver contenido (`ls`) |
| `w` | 2 | Puede modificar | Puede crear/borrar dentro |
| `x` | 1 | Puede ejecutar | Puede entrar (`cd`) |
| `-` | 0 | Sin permiso | Sin permiso |

Los valores se suman: `rwx`=7, `r-x`=5, `rw-`=6, `---`=0

### Cambiar el propietario

Ahora todo le pertenece a `ubuntu`. Lo correcto es que le pertenezca a `dev_js`:

```bash
sudo chown -R dev_js ~/proyecto_backend/
```

- `chown` → change owner
- `-R` → recursivo (aplica a todo lo que está adentro)
- `dev_js` → el nuevo propietario

Verifica:
```bash
ls -l ~/proyecto_backend/
```
Ahora deberías ver `dev_js` en lugar de `ubuntu`.

### Configurar permisos de la carpeta principal

Queremos:
- Propietario (`dev_js`): acceso total → `rwx` = **7**
- Grupo: solo ver y entrar → `r-x` = **5**
- Otros: ningún acceso → `---` = **0**

```bash
sudo chmod 750 ~/proyecto_backend/
```

### Proteger el archivo de credenciales

`db.conf` es especialmente sensible. Solo el propietario debe poder leerlo y editarlo, nadie más:
- Propietario: leer y escribir → `rw-` = **6**
- Grupo: ninguno → `---` = **0**
- Otros: ninguno → `---` = **0**

```bash
sudo chmod 600 ~/proyecto_backend/config/db.conf
```

### Verifica todo junto

```bash
ls -l ~/proyecto_backend/
ls -l ~/proyecto_backend/config/
```

Para `proyecto_backend` deberías ver `drwxr-x---` y propietario `dev_js`.
Para `db.conf` deberías ver `-rw-------` y propietario `dev_js`.

---

### ✅ Checkpoint 4

Antes de seguir, confirma:
- [ ] El propietario de `proyecto_backend/` es `dev_js`
- [ ] Los permisos de `proyecto_backend/` son `rwxr-x---` (750)
- [ ] Los permisos de `db.conf` son `rw-------` (600)

---

## ⚙️ MÓDULO 5 — Instalar y activar el programador de tareas
**Objetivo:** Instalar `cronie` y dejar el servicio corriendo para que el servidor pueda ejecutar tareas automáticas.

> 💡 **¿Para qué sirve esto?** En un servidor backend real hay tareas que deben ejecutarse solas: limpiar logs viejos a medianoche, hacer backups cada hora, enviar reportes diarios. `cronie` es el programa que gestiona eso en Linux — equivale al "Programador de tareas" de Windows.

### ¿Qué es un gestor de paquetes?

En Windows instalas programas bajando un `.exe` desde internet. En Linux usas un gestor de paquetes que descarga e instala desde repositorios oficiales verificados — es más seguro y todo queda registrado.

Ubuntu usa `apt`:

```bash
sudo apt update
sudo apt install cronie -y
```

> 💡 El `apt update` primero actualiza la lista de paquetes disponibles — es como "revisar qué versiones nuevas existen" antes de instalar. El `-y` responde "sí" automáticamente a la confirmación.

### Iniciar y habilitar el servicio

```bash
sudo systemctl enable --now crond
```

Desglosando este comando:
- `systemctl` → la herramienta que gestiona servicios en Linux moderno
- `enable` → registra el servicio para que arranque automáticamente cada vez que el servidor se reinicie
- `--now` → además de registrarlo, lo inicia ahora mismo sin esperar el próximo reinicio
- `crond` → el nombre del servicio (los servicios en Linux suelen terminar en `d` de *daemon*, que significa proceso en segundo plano)

### Verificar que está funcionando

```bash
sudo systemctl status crond
```

Busca esta línea en la salida:
```
Active: active (running)
```

Si ves eso en verde, el servicio está corriendo correctamente.

> 💡 Si dice `inactive` o `failed`, prueba con `sudo systemctl start crond` y vuelve a verificar el estado.

---

### ✅ Checkpoint 5 — Final

Confirma que completaste todo el taller:
- [ ] La instancia EC2 Ubuntu está corriendo en AWS
- [ ] Te conectaste exitosamente vía SSH
- [ ] El usuario `dev_js` existe y tiene contraseña (`id dev_js`)
- [ ] La estructura `proyecto_backend/src/config/logs` está creada
- [ ] Los archivos `app.js` y `db.conf` existen
- [ ] El propietario de todo el proyecto es `dev_js`
- [ ] Los permisos de la carpeta son `750` y del archivo de config `600`
- [ ] `crond` está `active (running)`

---

## 🗺️ ¿Qué aprendiste hoy?

| Concepto | ¿Para qué sirve en el mundo real? |
|----------|----------------------------------|
| EC2 en AWS | Servidores bajo demanda sin hardware físico |
| SSH | Acceso remoto seguro a servidores |
| Usuarios Linux | Separar identidades y responsabilidades |
| `mkdir / touch` | Organizar proyectos en el servidor |
| Permisos y `chmod` | Proteger archivos sensibles |
| `chown` | Asignar responsabilidad sobre archivos |
| `systemctl` | Gestionar servicios del servidor |
| `apt` | Instalar software de forma segura |

