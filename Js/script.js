//CODIGO DE LA LIBRERIA SWIPER JS,GENERA UN SLIDER
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  autoplay: {
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    500: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1020: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
    1500: {
      slidesPerView: 4,
      spaceBetween: 60,
    },
  },
});

// DECLARACION DE VARIABLES//////////////////////////////////////////////////////////////////
let total = 0;
let contador = 0;
let carrito = [];
// LAS VARIABLES QUE LLEVAN $ ADELANTE APUNTAN AL DOM
let $productsMalbec = document.querySelector(".products-Malbec");
let $productsCabernet = document.querySelector(".products-Cabernet");
let $templateCard = document.getElementById("template-card").content;
let $carritoWindow = document.querySelector(".carrito-window");
let $templateCarrito = document.getElementById("template-carrito").content;
let $modalContainer = document.querySelector(".modal-container");
let $modalWindow = document.querySelector(".modal");
let $fragmentCarrito = document.createDocumentFragment();
let $fragmentMalbec = document.createDocumentFragment();
let $fragmentCabernet = document.createDocumentFragment();
let $divContador = document.querySelector(".circle");
let $divCarrito = document.querySelector(".carrito-window");
let $seccionTotal = document.querySelector(".carrito-total");
let $modalWindowCart = document.querySelector(".modal-cart");

// DECLARACION DE FUNCIONES////////////////////////////////////////////////////////////////////

//PINTA LOS PRODUCTOS EN EL HTML
let injectProducts = () => {
  fetch("Js/productos.json")
    .then((response) => response.json())
    .then((juegos) => {
      for (let juego of juegos) {
        //USANDO DESTRUCTURACION
        let { id, nombre, precio, imagen, info, consola } = juego;
        if (consola === "Malbec") {
          $templateCard.querySelector(".main-img").setAttribute("src", imagen);
          $templateCard.querySelector(".sec-img").setAttribute("src", imagen);
          $templateCard.querySelector("pre").textContent = info;
          $templateCard.querySelector(".title-card").textContent = nombre;
          $templateCard.querySelector(".price-card").textContent = precio;
          $templateCard.querySelector("button").setAttribute("id", id);
          let clone = $templateCard.cloneNode(true);
          $fragmentMalbec.appendChild(clone);
        } else {
          $templateCard.querySelector(".card").classList.add("card-Cabernet");
          $templateCard.querySelector(".back").classList.add("back-Cabernet");
          $templateCard.querySelector(".main-img").classList.add("Cabernet-img");
          $templateCard.querySelector("button").classList.add("button-Cabernet");
          $templateCard.querySelector(".main-img").setAttribute("src", imagen);
          $templateCard.querySelector(".sec-img").setAttribute("src", imagen);
          $templateCard.querySelector("pre").textContent = info;
          $templateCard.querySelector(".title-card").textContent = nombre;
          $templateCard.querySelector(".price-card").textContent = precio;
          $templateCard.querySelector("button").setAttribute("id", id);
          let clone = $templateCard.cloneNode(true);
          $fragmentCabernet.appendChild(clone);
        }
      }
      $productsMalbec.appendChild($fragmentMalbec);
      $productsCabernet.appendChild($fragmentCabernet);
    });
};

// FUNCION PRINCIPAL PARA AGREGAR UN PRODUCTO AL CARRITO
// @param { obj } es un nodo con los elementos de la card del producto
// @param { carrito } es el array donde se van pusheando los productos
let setCarrito = (obj, carrito) => {
  let producto = {
    id: obj.querySelector("button").getAttribute("id"),
    img: obj.querySelector(".main-img").getAttribute("src"),
    title: obj.querySelector(".title-card").textContent,
    price: obj.querySelector(".price-card").textContent,
    subPrice: 0,
    items: 1,
  };
  let existe = carrito.some((obj) => obj.id === producto.id);
  console.log(existe);
  if (existe) {
    carrito.forEach((obj) => {
      if (obj.id === producto.id) {
        obj.items++;
        obj.subPrice = obj.price * obj.items;
      }
    });
  } else {
    producto.subPrice = producto.price * producto.items;
    carrito.push(producto);
    console.log(carrito);
  }
  injectCarrito();
  injectTotal();
};

//PINTA EL TOTAL EN LA VENTANA DEL CARRITO
let injectTotal = () => {
  total = 0;
  let div = document.createElement("div");
  div.classList.add("carrito-total");
  let p = document.createElement("p");
  p.classList.add("total-p");
  let button = document.createElement("a");
  button.classList.add("total-buy");
  button.setAttribute("href", "pagos.html");

  div.appendChild(p);
  div.appendChild(button);

  carrito.forEach((obj) => {
    total += obj.subPrice;
  });

  p.textContent = `Total a pagar: ${total}`;
  button.textContent = "Comprar";
  $carritoWindow.insertAdjacentElement("beforeend", div);
};

//REFRESCA EL TOTAL EN LA VENTANA DEL CARRITO
//esta funcion se usara cuando se le sumen o resten cantidades al producto o cuando se elimine
let refreshTotal = () => {
  let $parrafoTotal = document.querySelector(".total-p");
  total = 0;
  carrito.forEach((obj) => {
    total += obj.subPrice;
  });
  $parrafoTotal.textContent = `Total a pagar: ${total} `;
};

//PINTA EN LA VENTANA DEL CARRITO, LOS PRODUCTOS QUE VALLAN AGREGANDO
let injectCarrito = () => {
  carrito.forEach((producto) => {
    //USANDO DESTRUCTURACION
    let { id, img, title, items, price, subPrice } = producto;
    $carritoWindow.innerHTML = "";
    $templateCarrito.querySelector(".id").textContent = id;
    $templateCarrito
      .querySelector(".main-img-carrito")
      .setAttribute("src", img);
    $templateCarrito.querySelector(".title-carrito").textContent = title;
    $templateCarrito.querySelector(".mid-p").textContent = items;
    $templateCarrito.querySelector(".price").textContent = `Precio: ${price}`;
    $templateCarrito.querySelector(".sub-price").textContent = `Sub Total:
    ${subPrice} `;
    $templateCarrito
      .querySelector(".delete")
      .setAttribute("src", "./Assets/delete-trash-svgrepo-com.svg");
    let clone = $templateCarrito.cloneNode(true);
    $fragmentCarrito.appendChild(clone);
  });
  $carritoWindow.appendChild($fragmentCarrito);
};

//AUMENTA EL CONTADOR SI EL PRODUCTO NO EXISTE EN EL CARRITO
// @param { obj } es un nodo con los elementos de la card del producto para poder sacar el id del boton
// @param { carrito } es el array donde se van pusheando los productos
let addCounter = (obj, carrito) => {
  let id = obj.querySelector("button").getAttribute("id");
  let existe = carrito.some((obj) => obj.id === id);
  // USANDO OPERADOR LOGICO AND
  !existe && contador++;
};

//MUESTRA EL DIV CONTADOR (ELIMINANDO LA PROPIEDAD DISPLAY-NONE) DONDE SE VA A IR MOSTRANDO LA CANTIDAD DE PRODUCTOS
//@param { cont } es el contador
let injectCounter = (cont) => {
  if (cont !== 0) {
    $divContador.classList.add("active");
    $divContador.textContent = cont;
  } else {
    $divContador.textContent = cont;
  }
};

//MUESTRA LA VENTANA MODAL (ELIMINANDO LA PROPIEDAD DISPLAY-NONE)  QUE SE ABRIRA CUANDO HAGAN CLICK EN EL BOTON AGREGAR CARRITO
let showModal = (obj) => {
  let img = obj.querySelector(".sec-img").getAttribute("src");
  let title = obj.querySelector(".title-card").textContent;
  let card = $modalContainer.querySelector(".modal");
  $modalWindow.querySelector(".main-img-modal").setAttribute("src", img);
  $modalWindow.querySelector(".msg-modal").textContent =
    "Agregaste correctamente!";
  $modalWindow.querySelector(".title-modal").textContent = title;
  $modalContainer.classList.remove("visible");
  card.classList.add("fade-in");
  setTimeout(() => {
    $modalContainer.classList.add("visible");
  }, 2000);
};

//MUESTRA LA VENTANA MODAL (ELIMINANDO LA PROPIEDAD DISPLAY-NONE) QUE SURGIRA CUANDO ACTUALIZEMOS LA PAGINA Y TENGAMOS PRODUCTOS DEL CARRITO GUARDADOS EN LOCALSTORAGE
let showModalCart = () => {
  let card = $modalWindowCart.querySelector(".modal");
  $modalWindowCart.classList.remove("visible");
  card.classList.add("slide-in-top");
  setTimeout(() => {
    $modalWindowCart.classList.add("visible");
  }, 2000);
};

//ELIMINA UN PRODUCTO DEL CARRITO Y DISMINUYE EN 1 EL CONTADOR
//SI EL CONTADOR LLEGA A 0 PINTA UN MENSAJE QUE DICE "CARRITO VACIO"
// @param { obj } es un nodo con los elementos de la card del producto para poder sacar el id del boton
// @param { carrito } es el array donde se van pusheando los productos
// @param { ventana } es una variable que apunta al DOM que con el metodo removeChild() se eliminara el div del producto seleccionado
let removeProduct = (obj, carrito, ventana) => {
  let id = obj.querySelector(".id").textContent;
  for (let index = 0; index < carrito.length; index++) {
    if (carrito[index].id === id) {
      ventana.removeChild(obj);
      carrito.splice(index, 1);
      contador--;
      if (contador === 0) {
        $divContador.classList.remove("active");
        $carritoWindow.innerHTML = `<div class="carrito-visible">
      <p>VinoteKa</p>
      <p>Tu carrito esta vacio</p>
    </div>`;
      } else {
        $divContador.textContent = contador;
      }
    }
  }
};

//INCREMENTA EN 1 LA CANTIDAD DEL PRODUCTO SELECCIONADO,CALCULA EL SUBTOTAL Y LO VA ACTUALIZANDO EN EL HTML
// @param { obj } es un nodo con los elementos de la card del producto para poder sacar el id del boton
// @param { carrito } es el array donde se van pusheando los productos
let increaseProduct = (obj, carrito) => {
  let id = obj.querySelector(".id").textContent;
  let cantidad = obj.querySelector(".mid-p");
  let precio = obj.querySelector(".sub-price");
  carrito.forEach((obj) => {
    if (obj.id === id) {
      obj.items++;
      obj.subPrice = obj.items * obj.price;
      cantidad.textContent = obj.items;
      precio.textContent = textContent = `Sub Total: ${obj.subPrice}`;
    }
  });
};

//DISMINUYE EN 1 LA CANTIDAD DEL PRODUCTO SELECCIONADO,CALCULA EL SUBTOTAL Y LO VA ACTUALIZANDO EN EL HTML
//LA CANTIDAD DE PRODUCTOS NO PUEDE DISMINUIR DE 1
// @param { obj } es un nodo con los elementos de la card del producto para poder sacar el id del boton
// @param { carrito } es el array donde se van pusheando los productos
let decreaseProduct = (obj, carrito) => {
  let id = obj.querySelector(".id").textContent;
  let cantidad = obj.querySelector(".mid-p");
  let precio = obj.querySelector(".sub-price");
  carrito.forEach((obj) => {
    if (obj.id === id) {
      if (obj.items > 1) {
        obj.items--;
        obj.subPrice = obj.items * obj.price;
        cantidad.textContent = obj.items;
        precio.textContent = textContent = `Sub Total: ${obj.subPrice}`;
      }
    }
  });
};

//GUARDA EL CARRITO EN EL LOCALSTORAGE
let storageCarrito = () => {
  let json = JSON.stringify(carrito);
  localStorage.setItem("carrito", json);
};

//GUARDA EL CONTADOR EN EL LOCALSTORAGE
let storageCounter = () => {
  let json = JSON.stringify(contador);
  localStorage.setItem("contador", json);
};

//FUNCION DE LA LIBRERIA TOASTIFY PARA MOSTRAR UNA NOTIFICACION CUANDO SE ELIMINE UN PRODUCTO
let toastify = () => {
  Toastify({
    text: "Producto eliminado correctamente",
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background:
        "linear-gradient(90deg, rgba(241,12,36,1) 0%, rgba(252,48,12,1) 100%)",
    },
  }).showToast();
};

// EJECUCION DEL SCRIPT//////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", (e) => {
  //EN EL EVENTO DE CARGA DEL DOM PINTA LOS PRODUCTOS Y PREGUNTA SI CARRITO EXISTE EN LOCALSTORAGE
  //SI EXISTE CARRITO TOMA ESOS VALORES GUARDADOS Y SE MUESTRAN EN LA VENTANA DEL CARRITO
  injectProducts();
  let carritoStorage = localStorage.getItem("carrito");
  let contadorStorage = localStorage.getItem("contador");
  if (carritoStorage !== null) {
    carrito = JSON.parse(carritoStorage);
    contador = JSON.parse(contadorStorage);
  }
  if (carrito.length !== 0) {
    showModalCart();
    injectCarrito();
    injectTotal();
    injectCounter(contador);
  }
});

document.addEventListener("click", (e) => {
  //EVENTO QUE SUCEDERA SI HACEN CLICK EN EL BOTON DE AGREGAR PRODUCTO AL CARRITO DE CUALQUIER CARD
  if (e.target.matches("button")) {
    showModal(e.target.parentElement);
    addCounter(e.target.parentElement, carrito);
    injectCounter(contador);
    console.log(contador);
    setCarrito(e.target.parentElement, carrito);
    storageCarrito();
    storageCounter();
  }

  //EVENTO QUE SUCEDERA SI HACEN CLICK EN EL CARRITO
  if (e.target.matches(".carrito")) {
    $divCarrito.classList.toggle("transform");
  }

  //EVENTO QUE SUCEDERA SI HACEN CLICK EN LA FLECHITA APUNTANDO HACIA ARRIBA QUE AUMENTA LA CANTIDAD DE UN PRODUCTO
  if (e.target.matches(".up")) {
    increaseProduct(e.target.parentNode.parentElement, carrito);
    refreshTotal();
    storageCarrito();
  }

  //EVENTO QUE SUCEDERA SI HACEN CLICK EN LA FLECHITA APUNTANDO HACIA ABAJO QUE DISMINUYE LA CANTIDAD DE UN PRODUCTO
  if (e.target.matches(".down")) {
    decreaseProduct(e.target.parentNode.parentElement, carrito);
    refreshTotal();
    storageCarrito();
  }

  //EVENTO QUE SUCEDERA SI HACEN CLICK EN LA PAPELERA QUE PERMITE ELIMINAR UN PRODUCTO
  if (e.target.matches(".delete")) {
    removeProduct(e.target.parentElement, carrito, $carritoWindow);
    // USANDO OPERADOR LOGICO AND
    carrito.length !== 0 && refreshTotal();
    toastify();
    storageCarrito();
    storageCounter();
  }

  if (e.target.matches(".total-buy")) {
    // USANDO OPERADOR LOGICO AND
    carrito.length === 0 && e.preventDefault();
  }
});
