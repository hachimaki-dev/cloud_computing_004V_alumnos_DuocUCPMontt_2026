Sí, te entiendo perfectamente. Lo que tus estudiantes necesitan no es memorizar clicks, sino construir un modelo mental claro: primero definimos el “terreno” de red, luego lo dividimos en zonas, después abrimos o cerramos caminos, y finalmente le decimos a cada zona qué mapa seguir. En AWS, eso se traduce en VPC, subred, puerta de enlace de internet, tabla de enrutamiento y asociación de la tabla a la subred. La VPC es el contenedor lógico; las subredes son particiones dentro de ese contenedor; la tabla de rutas decide por dónde sale el tráfico; y la asociación hace que esa subred use esa tabla. AWS además indica que cada subred debe asociarse a una tabla de rutas y que, por defecto, las subredes quedan vinculadas a la tabla principal de la VPC si no haces una asociación explícita. ([Documentación de AWS][1])

La clave pedagógica es esta: no están “haciendo clicks”, están construyendo una red privada con reglas. Una VPC con CIDR 10.0.0.0/16 define un espacio de 65.536 direcciones IPv4 posibles, y AWS permite bloques VPC desde /16 hasta /28. Luego, una subred como 10.0.0.0/20 es un pedazo de ese espacio, y AWS exige que el bloque CIDR de la subred esté dentro del bloque de la VPC y que no se sobreponga con otras subredes. En subredes IPv4, AWS reserva las primeras cuatro direcciones y la última, así que un /20 tiene 4.096 direcciones totales y 4.091 utilizables. ([Documentación de AWS][2])

Eso explica por qué no se usa simplemente una sola red enorme para todo. El /16 es el “territorio completo” y el /20 es una “zona” dentro de ese territorio. Esa partición sirve para separar funciones, controlar acceso, distribuir recursos por zonas de disponibilidad y dejar espacio para crecer sin rehacer toda la arquitectura. AWS recomienda planificar el espacio IP pensando en expansión futura, precisamente porque el bloque inicial de la VPC no se puede encoger ni cambiar de tamaño una vez creado. ([Documentación de AWS][2])

La puerta de enlace de internet existe porque la VPC, por sí sola, no tiene salida directa a Internet. AWS lo dice explícitamente: una IGW entrega un destino en la tabla de rutas para tráfico que debe ir a Internet, y para IPv4 además realiza NAT. Por eso la IGW no es “un adorno”; es el componente que vuelve posible que una subred sea pública. Sin esa puerta, aunque exista la subred, el tráfico no sabe a dónde salir. ([Documentación de AWS][3])

La tabla de enrutamiento es el “mapa de carreteras” de la subred. AWS la define como el controlador de tráfico de la VPC: cada tabla contiene rutas, y cada ruta indica un destino y un objetivo. En la práctica, cuando agregas la ruta 0.0.0.0/0 hacia la IGW, estás diciendo “todo lo que no sea parte de la red local debe poder salir por la puerta de Internet”. Sin esa ruta, la subred sigue existiendo, pero no se comporta como pública. ([Documentación de AWS][1])

Y aquí está la parte que más conviene enfatizar en clase: una subred se vuelve “pública” no por llamarla pública, sino por su ruta. AWS lo resume así: una subred pública tiene una ruta directa a una puerta de enlace de internet; una subred privada no la tiene. Por eso el paso de “editar rutas” no es administrativo ni decorativo, sino el momento en que se define la política de acceso de esa subred. ([Documentación de AWS][4])

Con esa base, el taller puede enseñarse como una historia de 5 capas:

Primero, “creamos el país” con la VPC. Aquí el objetivo es que entiendan aislamiento y rango IP: este es el espacio donde vivirán todos los recursos.

Después, “dividimos el país” en subredes. Aquí el objetivo es aprender que una red se planifica por bloques y que los bloques no deben superponerse.

Luego, “abrimos la salida” con la IGW. Aquí el objetivo es entender que Internet no aparece mágicamente; hay que poner una puerta y una regla de salida.

Después, “dibujamos el mapa” en la tabla de rutas. Aquí el objetivo es comprender que no basta con tener red: hay que decidir a dónde va cada destino.

Finalmente, “asignamos el mapa correcto” a la subred. Aquí el objetivo es ver que la asociación es la forma en que la política realmente se aplica. AWS permite asociación explícita de subredes a tablas distintas, mientras que la tabla principal actúa como destino por defecto si no se especifica otra. ([Documentación de AWS][5])

Para que funcionen tanto quienes van más lento como quienes van más rápido, te conviene enseñar con tres preguntas fijas en cada paso: “¿qué estoy definiendo?”, “¿qué problema resuelve?” y “¿qué pasaría si lo omitiera?”. Por ejemplo, al crear la subred, la respuesta correcta no es “poner /20 porque sí”, sino “estoy reservando un subconjunto del espacio de la VPC para un grupo de recursos, evitando colisiones con otras subredes”. Al crear la ruta 0.0.0.0/0, la respuesta correcta no es “porque AWS lo pide”, sino “estoy declarando el camino por defecto hacia Internet”. Al asociar la tabla, la respuesta correcta no es “porque el botón lo dice”, sino “porque sin asociación la subred no usa esa política de tráfico”. ([Documentación de AWS][6])

Te propongo un guion didáctico muy efectivo para clase. Primero muestras una imagen simple: un rectángulo grande que represente la VPC y dos rectángulos pequeños dentro que representen subredes. Luego explicas que el bloque /16 es el espacio completo y el /20 es una parte de ese espacio. Después dibujas una puerta al costado y una flecha hacia afuera para la IGW. Luego dibujas un semáforo o una señal de tránsito para la tabla de rutas. Y al final conectas la subred pública con la tabla correcta. Ese orden visual hace que el estudiante vea la red como un sistema, no como un formulario web. ([Documentación de AWS][2])


[1]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html?utm_source=chatgpt.com "Configure route tables - Amazon Virtual Private Cloud"
[2]: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html?utm_source=chatgpt.com "VPC CIDR blocks"
[3]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html?utm_source=chatgpt.com "Enable internet access for a VPC using an internet gateway"
[4]: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html?utm_source=chatgpt.com "Subnets for your VPC - Amazon Virtual Private Cloud"
[5]: https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html?utm_source=chatgpt.com "How Amazon VPC works - Amazon Virtual Private Cloud"
[6]: https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html?utm_source=chatgpt.com "Subnet CIDR blocks - Amazon Virtual Private Cloud"
