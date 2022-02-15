<?php

    session_start();

    if(isset($_COOKIE["mantener"])){
        $_SESSION["dni"]=$_COOKIE["mantener"];
    }
 
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    require_once("../../php/funciones.php");
    
    $conexion=conectarServidor();

    $titulo=trim($_POST['titulo']);
    $contenido=trim($_POST['contenido']);
    $imagen=trim($_POST['imagen']);
    $fecha_publicacion=trim($_POST['fecha_publicacion']);

    $consulta_insercion="INSERT INTO noticia values (null,?,?,?,?)";
    $resultado_insercion=$conexion->prepare($consulta_insercion);

    

    $resultado_insercion->bind_param("ssss", $titulo, $contenido, $imagen, $fecha_publicacion);
    $resultado_insercion->execute();
    echo "$conexion->insert_id";
    $resultado_insercion->close();
    $conexion->close();

   
 ?>