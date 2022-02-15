<?php
    session_start();

    if(isset($_GET["cerrar_sesion"])){
        if(isset($_COOKIE['mantener'])){
            setcookie("mantener",null,time()-60,"/");
        }
        $_SESSION=array();
        session_destroy();
        header('Location: ../../index.php');
    }else{
        if(isset($_COOKIE["mantener"])){
            $_SESSION["dni"]=$_COOKIE["mantener"];
        }
    
        if(!isset($_SESSION["dni"]) || $_SESSION["dni"]!=="000000000"){
            header('Location: ../acceder/acceder.php');
        }

    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Noticias</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
    <link rel="icon" href="../../assets/imagenes/logo_negro.png" type="image/png"/>
    <link rel="stylesheet" type="text/css" href="../../css/bootstrap.min.css">
    <link rel="stylesheet" href="../../css/estilos.css">
    <script type="text/javascript" src="../../js/jquery.min.js"></script>
    <script type="text/javascript" src="../../js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../../js/toast.js"></script>
    <script type="text/javascript" src="../../js/app.js" defer></script>
</head>
<body>

    <!-- ENLAZO PARA PODER USAR FUNCIONES -->
    <?php
        require_once("../../php/funciones.php");
    ?>

    <!-- INSERTO EL HEADER -->
    <?php
        crearHeader('../..');
    ?>

    <?php
        //SACAMOS EL SIGUIENTE ID
        $id=siguienteId('noticia');
    ?>

    <main>

    <section id="insertar_modificar">

    <h1>Nueva noticia</h1>
    <form id="insertar_noticia_form" action="#" method="POST">
    <div>
        <label for="id_siguiente">Id</label>
        <input type="text" value="<?php echo $id ?>" id="id_siguiente" readonly>
    </div>
    <div>
        <label for="titulo">Título de la noticia</label>
        <input type="text" name="titulo" id="titulo" maxlength="50" required>
    </div>
    <textarea name="contenido" id="contenido" rows="15" placeholder="Contenido de la noticia" maxlength="5000" required></textarea>
    <div>
        <label for="imagen">Subir URL imagen</label>
        <input type="text" name="imagen" id="imagen" required>
    </div>
    <div>
        <label for="fecha_publicacion">Fecha de publicación de la noticia</label>
        <input type="date" name="fecha_publicacion" id="fecha_publicacion" required>
    </div>
    <input type="submit" value="Insertar" name="enviarNoticia" id="enviarNoticia">
    <input type="reset" value="Borrar" name="borrar" id="borrar">
    </form>

    </section>

    <section id="noticiasPagina">

    <div id='lista_noticias'></div>; 

    </section>

    <!-- MENSAJE EMERGENTE-->
    <div id="mensaje" style="z-index: 9999;" class="fixed-top  mx-auto mt-5 toast text-center" data-delay="3000"
      role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header w-100">
        <strong class="w-100 mr-auto">Mensaje informativo</strong>
      </div>
    </div>

    </main>

    <!-- INSERTO EL FOOTER -->
    <?php
        crearFooter('../..');
    ?>
</body>
</html>