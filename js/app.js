"use strict"

//HAMBURGUESA
const hamburguesa = document.querySelector('#hamburguesa');
const nav= document.querySelector("nav");

// Abrir y cerrar nav y movil
hamburguesa.addEventListener('click', () => {
  hamburguesa.classList.toggle('nav-open');
  nav.classList.toggle('nav-open');
});

//--------------------------------------------------------------------------------------------------------------------
//API EXTERNA

const galeria = document.querySelector("#fotos");

if(galeria!==null){

  rellenarGaleria("https://dog.ceo/api/breeds/image/random/6");

  const crearFila = (imagen) => {
    const caja = document.createElement("div");
    caja.classList.add("col-12","col-md-4");

    const ima = document.createElement("img");
    ima.src = imagen;
    ima.classList.add("w-100","shadow-1-strong","rounded","mb-4","img-fluid");
    ima.style.height="250px";

    caja.appendChild(ima);

    return caja;
  }


  async function rellenarGaleria(url) {
    const respuesta = await fetch(url);
  
    const datos = await respuesta.json();
    const lista_perros = datos["message"];
    lista_perros.forEach(
      (perro) => {
        galeria.appendChild(crearFila(perro));
      });
  }
}


//----------------------------------------------------------------------------------------------------------
//API INTERNA

//TABLA DE NOTICIAS
const tabla_noticias = document.querySelector("#lista_noticias");

//LAZY LOADING
let imageOptions={threshold:0};

const observer= new IntersectionObserver((entries,observer)=>{
  entries.forEach(
    (entry)=>{
      if(!entry.isIntersecting) return;
      const image=entry.target;
      const newURL= image.getAttribute("data-src");
      image.src=newURL;
      observer.unobserve(image);
    }
  );
}, imageOptions);


  const nuevaNoticia = (json) => {
    let articulo=document.createElement("article");
    articulo.classList.add("noticia");
    articulo.id = "ID_" + json["titulo"].toUpperCase().replaceAll(" ", "");
  
    //CREA LA CELDA CON LA IMAGEN
    let imagen = document.createElement("img");
    imagen.setAttribute("data-src",json["imagen"]);
    let td_imagen = document.createElement("div");
    td_imagen.appendChild(imagen);
    articulo.appendChild(td_imagen);
    observer.observe(imagen);
  
    //CREA LA CELDA CON EL TITULO
    let td_titulo = document.createElement("h3");
    td_titulo.innerText = json["titulo"];
    articulo.appendChild(td_titulo);
  
    //CREA LA CELDA CON LA FECHA DE PUBLICACION
    let td_fecha = document.createElement("span");
    const fecha_formateada=json["fecha_publicacion"].split("-");
    td_fecha.innerText = fecha_formateada[2]+"-"+fecha_formateada[1]+"-"+fecha_formateada[0];
  
    articulo.appendChild(td_fecha);
  
      //CREA LA CELDA CON EL CONTENIDO
    let td_contenido = document.createElement("p");

    const textoCrudo=json["contenido"];

    let textoAreaDividido = textoCrudo.split(" ");
    let numeroPalabras = textoAreaDividido.length;

    if(numeroPalabras>20){
      for (let i = 0; i < 20; i++) {
        td_contenido.innerText += textoAreaDividido[i]+" ";
    }
      td_contenido.innerText += "...";
    }else{
      td_contenido.innerText = textoCrudo;
    }
  
  
    articulo.appendChild(td_contenido);
  
    //CREA LA CELDA CON EL BOTON DE VER LA NOTICIA
    let formulario=document.createElement("form");
    formulario.action="noticia.php";
    formulario.method="POST";
  
    let input_hidden=document.createElement("input");
    input_hidden.type="hidden";
    input_hidden.name="id";
    input_hidden.id="id";
    input_hidden.value=json["id"];
  
    let input_submit=document.createElement("input");
    input_submit.type="submit";
    input_submit.value="Ver noticia completa";
  
    formulario.appendChild(input_hidden);
    formulario.appendChild(input_submit);
  
    articulo.appendChild(formulario);
    //================================================================================================
  
    return articulo;
  }

//=========AÑADIR NUEVA NOTICIA COMPROBANDO ANTES LOS DATOS=======================
const form_añadir = document.querySelector("#insertar_noticia_form");

if(form_añadir!==null){
  const titulo = document.querySelector("#titulo");
  const contenido = document.querySelector("#contenido");
  const imagen = document.querySelector("#imagen");
  const fecha_publicacion = document.querySelector("#fecha_publicacion");
  const b_nuevo=document.querySelector("#enviarNoticia");


  b_nuevo.addEventListener("click",async (evento) => {
    evento.preventDefault();
    if (titulo.value.trim().length <= 0 || titulo.value.trim().length > 50) {
      mensajeError("Título incorrecto");
    } else if (contenido.value.trim().length <= 0 || contenido.value.trim().length > 5000) {
      mensajeError("Contenido incorrecto");
    } else if (imagen.value.trim().length <= 0) {
      mensajeError("Imagen vacia");
    } else if (fecha_publicacion.value.trim().length <= 0) {
      mensajeError("Fecha vacia");
    } else if (sessionStorage.getItem("ID_" + titulo.value.trim().toUpperCase().replaceAll(" ", "")) !== null) {
      mensajeError("La noticia ya existe");
    } else {
      //MANDAR LOS DATOS DEL FORMULARIO A LA API DE INSERTAR
      const datos_formulario=new URLSearchParams(new FormData(form_añadir));
      const respuesta=await fetch("noticiaInsertar.php",
      {
        method:"POST",
        body:datos_formulario
      });
  
      const id_noticia=await respuesta.json();
      
      const datos_noticia = {
        "id":id_noticia,
        "titulo": titulo.value.trim(),
        "contenido": contenido.value.trim(),
        "imagen": imagen.value.trim(),
        "fecha_publicacion": fecha_publicacion.value.trim()
      };
  
      const nuevo = nuevaNoticia(datos_noticia);
      tabla_noticias.appendChild(nuevo);
      sessionStorage.setItem("ID_" + titulo.value.trim().toUpperCase().replaceAll(" ", ""), JSON.stringify(datos_noticia));
  
      form_añadir.reset();
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
      mensajeOk("Añadida correctamente");
    }
  });
}



//AÑADIR LOS DATOS DEL STORAGE PARA MANEJAR LA APLICACION A TRAVES DE ELLOS Y NO TENER QUE USAR SIEMPRE LA BASE DE DATOS
if(tabla_noticias!==null){
  if (sessionStorage.length === 0) {
    //LA PRIMERA VEZ QUE SE CARGUE LA PAGINA-->METERLO TODO EN EL SESSION

    (async () => {
      const respuesta = await fetch("noticiaTabla.php");
      //DATOS_NOTICIAS SE OBTIENE DE LA API INTERNA QUE NOS DEVUELVE LO QUE HAY EN LA BASE DE DATOS
      const datos_noticias = await respuesta.json();

      datos_noticias.forEach((noticia) => {
        sessionStorage.setItem("ID_" + noticia["titulo"].
          toUpperCase()
          .replaceAll(" ", ""),
          JSON.stringify(noticia))
      });
      //METER LOS DATOS EN LA TABLA DEL INTERFAZ
      Object.values(sessionStorage).forEach(
        (noticia) => {
          tabla_noticias.appendChild(nuevaNoticia(JSON.parse(noticia)));
        }
      )
    })();
    
  } else {
    //CARGAR LA PAGINA DESPUES DE LA PRIMERA VEZ EL SESSION YA TIENE QUE TENER DATOS
    //METER LOS DATOS EN LA TABLA DEL INTERFAZ
    Object.values(sessionStorage).forEach(
      (noticia) => {
        tabla_noticias.appendChild(nuevaNoticia(JSON.parse(noticia)));
      }
    )
  }
}