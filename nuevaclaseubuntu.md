Una guía así debería estar pensada no como “lista de comandos”, sino como un puente mental entre Windows y Linux. Para alguien que viene de Windows, el mayor obstáculo no suele ser el teclado ni la terminal: es entender cómo piensa Linux. Por eso la guía debería enseñar primero el modelo, y después los comandos.

Yo la organizaría así:

**1. Qué es Linux y qué es Ubuntu**
Aquí pondría una explicación muy breve de conceptos esenciales: sistema operativo, distribución, escritorio, terminal, shell, paquete, repositorio.
La razón es simple: mucha gente cree que “Linux” es una sola cosa, pero en realidad Ubuntu es una distribución de Linux, con herramientas y decisiones propias. Si la persona entiende eso desde el principio, deja de sentir que todo es arbitrario.

**2. Diferencias clave con Windows**
Esta sección debería comparar mentalmente ambas plataformas:

* En Linux los programas suelen instalarse desde repositorios, no tanto desde ejecutables descargados.
* La terminal no es “para hackers”, sino una herramienta normal de administración y automatización.
* Las rutas usan `/` y el sistema de archivos tiene una estructura más uniforme.
* El usuario no suele trabajar como administrador todo el tiempo.
* Muchas acciones se hacen con permisos y comandos, no con ventanas.

La razón es que estos cambios de paradigma explican por qué luego ciertos comandos existen y por qué funcionan así.

**3. Estructura básica del sistema de archivos**
Esto es fundamental. Yo incluiría:

* `/home` para archivos de usuarios
* `/etc` para configuración
* `/var` para datos variables y logs
* `/usr` para programas y recursos
* `/bin`, `/sbin` para comandos esenciales
* `/tmp` para archivos temporales
* `/mnt` y `/media` para montajes y USB

La razón es que en Linux la ubicación de las cosas importa mucho. En Windows la gente suele vivir entre “Escritorio”, “Descargas” y “Program Files”; en Linux conviene comprender dónde vive cada tipo de dato.

**4. Navegación básica por terminal**
Aquí pondría comandos que permiten moverse y orientarse:

* `pwd` para saber dónde estás
* `ls` para listar archivos
* `cd` para cambiar de carpeta
* `mkdir` para crear carpetas
* `touch` para crear archivos vacíos
* `cp` para copiar
* `mv` para mover o renombrar
* `rm` para borrar
* `cat`, `less`, `head`, `tail` para ver contenido

La razón es que la terminal se vuelve mucho menos intimidante cuando la persona aprende primero a ubicarse y manipular archivos. Es la base de casi todo lo demás.

**5. Ayuda integrada y lectura de manuales**
Agregar:

* `man comando`
* `comando --help`
* `apropos palabra`
* `whatis comando`

La razón es pedagógicamente importante: en Linux no necesitas memorizar todo. Saber buscar ayuda desde el sistema es una habilidad más valiosa que aprender 100 comandos de memoria.

**6. Permisos y propiedad**
Aquí incluiría:

* `chmod`
* `chown`
* `sudo`
* lectura básica de `rwx`
* diferencia entre usuario normal y root

La razón es que esto explica por qué a veces “no te deja hacer algo”. En Windows muchos usuarios están acostumbrados a una experiencia más oculta; en Linux conviene entender la seguridad de forma explícita desde temprano.

**7. Instalar, actualizar y desinstalar software**
En Ubuntu esto es imprescindible:

* `apt update`
* `apt upgrade`
* `apt install paquete`
* `apt remove paquete`
* `apt purge paquete`
* `apt search palabra`
* `dpkg -i archivo.deb` como idea general, si procede

La razón es que instalar software en Linux es una de las tareas más comunes, y además enseña el modelo de repositorios, que es más seguro y ordenado que descargar todo manualmente.

**8. Procesos y administración básica del sistema**
Yo pondría:

* `ps`
* `top` o `htop`
* `kill`
* `killall`
* `jobs`, `fg`, `bg` si quieres algo más avanzado

La razón es que el usuario principiante suele pensar en “ventanas” y “programas”, pero Linux trabaja mucho con procesos. Entender eso ayuda a diagnosticar congelamientos, consumo de CPU y tareas colgadas.

**9. Red y conexión**
Aquí conviene algo mínimo pero útil:

* `ip a`
* `ping`
* `curl`
* `wget`
* `ss` o `netstat` como panorama general

La razón es que una persona que viene de Windows suele querer probar “si hay internet”, “qué IP tengo” o “descargar algo”. Estos comandos cubren la base.

**10. Archivos de texto y edición**
Muy importante en Linux:

* `nano` como editor simple
* idea general de `vim` solo como referencia opcional
* `grep`
* `find`
* `wc`
* `sort`
* `uniq`
* `cut`

La razón es que Linux se administra muchísimo a través de texto. Incluso tareas simples terminan pasando por archivos de configuración o salida de comandos.

**11. Variables de entorno y la idea de PATH**
Aquí explicaría:

* qué es `echo $PATH`
* qué es una variable de entorno
* por qué un comando se puede ejecutar sin escribir toda la ruta

La razón es que este concepto desbloquea la comprensión de cómo el sistema encuentra programas. Es uno de esos temas pequeños que explica muchísimas cosas.

**12. Comandos encadenados y redirecciones**
Esto hace que la guía deje de ser solo “uso básico” y pase a “uso real”:

* `|`
* `>`
* `>>`
* `<`
* `grep` junto con `cat` o `less`
* `chmod +x` si quieres hablar de scripts

La razón es que la verdadera potencia de Linux está en combinar herramientas pequeñas. Esa filosofía es muy distinta a la de muchas tareas en Windows.

**13. Atajos de terminal**
Pondría unos pocos, muy prácticos:

* `Tab` para autocompletar
* flechas arriba/abajo para historial
* `Ctrl + C` para detener
* `Ctrl + L` para limpiar pantalla
* `Ctrl + R` para buscar en historial

La razón es que estos atajos aumentan muchísimo la productividad y reducen frustración desde el primer día.

**14. Primeros problemas comunes y cómo resolverlos**
Una mini sección de “errores típicos” vale oro:

* “command not found”
* “permission denied”
* “package not found”
* “unable to locate package”
* “no such file or directory”

La razón es que el principiante aprende más rápido cuando ve que los errores tienen sentido y no son una tragedia.

**15. Buenas prácticas**
Yo cerraría con hábitos:

* no usar `sudo` por costumbre
* leer antes de ejecutar
* usar `man` y `--help`
* no borrar sin verificar rutas
* diferenciar usuario normal de administrador
* preferir repositorios oficiales

La razón es que Linux premia mucho la disciplina y el orden. Enseñar buenas prácticas desde el inicio evita malos hábitos difíciles de corregir después.

Si quisiera que la guía fuera realmente útil para alguien que viene de Windows, le agregaría además una tabla mental de equivalencias, por ejemplo: Explorador de archivos vs terminal, Program Files vs repositorios, administrador vs `sudo`, CMD/PowerShell vs bash, y “carpeta personal” vs `/home/usuario`.

