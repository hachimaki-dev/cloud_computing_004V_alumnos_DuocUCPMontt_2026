#!/bin/bash

# Actualizar el sistema
yum update -y

# Instalar servidor web Apache
yum install -y httpd

# Iniciar el servicio y habilitarlo al arranque
systemctl start httpd
systemctl enable httpd

# Crear una página HTML moderna
cat << 'EOF' > /var/www/html/index.html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Servidor Web Público</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb);
    color:white;
    overflow:hidden;
}

body::before{
    content:"";
    position:absolute;
    width:600px;
    height:600px;
    background:rgba(255,255,255,.08);
    border-radius:50%;
    top:-180px;
    right:-180px;
    filter:blur(20px);
}

body::after{
    content:"";
    position:absolute;
    width:500px;
    height:500px;
    background:rgba(255,255,255,.05);
    border-radius:50%;
    bottom:-150px;
    left:-150px;
    filter:blur(25px);
}

.container{
    position:relative;
    z-index:1;
    background:rgba(255,255,255,0.12);
    backdrop-filter:blur(10px);
    padding:60px 80px;
    border-radius:20px;
    text-align:center;
    border:1px solid rgba(255,255,255,.25);
    box-shadow:0 20px 40px rgba(0,0,0,.35);
}

h1{
    font-size:4rem;
    margin-bottom:20px;
    text-transform:uppercase;
    letter-spacing:3px;
}

p{
    font-size:1.3rem;
    color:#e5e7eb;
    margin-bottom:10px;
}

small{
    display:block;
    margin-top:25px;
    color:#cbd5e1;
    font-size:1rem;
}
</style>
</head>

<body>

<div class="container">
    <h1>WEB PÚBLICA DE<br> "NOMBRE Y APELLIDO"</h1>

    <p>Servidor Web Público desplegado correctamente.</p>

    <small>
        ⚠️ Reemplace <strong>"NOMBRE Y APELLIDO"</strong> por su nombre antes de ejecutar el script.
    </small>
</div>

</body>
</html>
EOF