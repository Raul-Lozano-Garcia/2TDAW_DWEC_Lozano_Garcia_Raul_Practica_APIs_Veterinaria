<?php
    session_start();

    if(isset($_COOKIE["mantener"])){
        $_SESSION["dni"]=$_COOKIE["mantener"];
    }

    if(!isset($_SESSION["dni"])){
        header('Location: ../acceder/acceder.php');
    }else if($_SESSION["dni"]!=="000000000"){
        header('Location: ../acceso_denegado.php');
    }
    
?>

<?php
    
	//Cabeceras
	header('Content-Type: application/json');
	header("Access-Control-Allow-Origin: *");
	require_once("../../php/funciones.php");
    
    $conexion=conectarServidor();
    
    $datos=[];
    $sentencia=$conexion->query("SELECT * FROM noticia");

    if($sentencia->num_rows>0){

        while($fila=$sentencia->fetch_array(MYSQLI_ASSOC)){ 
        	$datos[]=$fila;
        }
    
        echo json_encode($datos);

    }

    $conexion->close();
 ?>



        
 