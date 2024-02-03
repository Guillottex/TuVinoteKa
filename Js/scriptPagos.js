let carrito = [];
let total = 0;
let $templateCarrito = document.getElementById("template-carrito").content;
let $fragment = document.createDocumentFragment();

//VARIABLES QUE APUNTAN AL NOMBRE EN EL FORMULARIO
let $insertName = document.querySelector(".details-name");
let $nameInput = document.querySelector("#name");
let $divErrorName = document.querySelector(".name-error");

//VARIABLES QUE APUNTAN AL NUMERO DE TARJETA EN EL FORMULARIO
let $insertNumber = document.querySelector(".card-number");
let $numberInput = document.querySelector("#number");
let $divErrorNumber = document.querySelector(".number-error");

//VARIABLES QUE APUNTAN AL MES EN EL FORMULARIO
let $insertMonth = document.querySelector(".details-month");
let $monthInput = document.querySelector("#months");
let $divMonthError = document.querySelector(".months-errors");

//VARIABLES QUE APUNTAN AL AÑO EN EL FORMULARIO
let $insertYear = document.querySelector(".details-year");
let $yearInput = document.querySelector("#year");
let $divYearError = document.querySelector(".year-errors");

//VARIABLES QUE APUNTAN AL CVC EN EL FORMULARIO
let $insertCvc = document.querySelector(".card-code");
let $cvcInput = document.querySelector("#cvc");
let $divCvcError = document.querySelector(".cvc-errors");

//VARIABLES CON LAS QUE SE MUESTRA EL MENSAJE DE PAGO EXITOSO
let $btnConfirm = document.querySelector(".submit");
let $form = document.querySelector(".form");
let $payMsg = document.querySelector(".pay-completed");

//FUNCION QUE TRAE DEL LOCALSTORAGE LOS PRODUCTOS AL CARRITO
let getProducts = () => {
  carrito = JSON.parse(localStorage.getItem("carrito"));
};

//FUNCION QUE PINTA EL CARRITO EN EL HTML
let injectProducts = () => {
  let divCarrito = document.querySelector(".carrito-window");
  for (let item of carrito) {
    $templateCarrito.querySelector(".img").setAttribute("src", item.img);
    $templateCarrito.querySelector(".title").textContent = item.title;
    $templateCarrito.querySelector(
      ".items"
    ).textContent = `Cantidad: ${item.items}`;
    $templateCarrito.querySelector(
      ".price"
    ).textContent = `Precio: $${item.subPrice}`;
    let clone = $templateCarrito.cloneNode(true);
    $fragment.appendChild(clone);
  }
  divCarrito.appendChild($fragment);
};

//FUNCION QUE PINTA EL TOTAL
let injectTotal = () => {
  total = 0;
  let divCarrito = document.querySelector(".carrito-window");
  let div = document.createElement("div");
  div.classList.add("carrito-total");
  let p = document.createElement("p");
  p.classList.add("total-p");
  div.appendChild(p);

  carrito.forEach((obj) => {
    total += obj.subPrice;
  });
  p.textContent = `Total a pagar: $${total}`;
  divCarrito.insertAdjacentElement("beforeend", div);
};

//FUNCION QUE MUESTRA UN ERROR EN UN INPUT DEL FORMULARIO
//param { divError } recibe un div donde se mostrara el error
//param { inputError } recibe un input al cual se le cambiara el estilo
//param { error } recibe el error que es un string
//param { show } recibe show que es un booleano
let showError = (divError, inputError, error, show) => {
  if (show) {
    divError.textContent = error;
    inputError.style.borderColor = "#ff0000";
  } else {
    divError.textContent = "";
    inputError.style.borderColor = "#ffffff";
  }
};

//ESTA FUNCION EVALUA QUE LOS INPUT DEL FORMULARIO NO QUEDEN EN BLANCO
//param { divError } recibe un div donde se mostrara un error
//para { input } recibe un input el cual sera evaluado
let emptyInput = (divError, input) => {
  if (input.value.length > 0) {
    showError(divError, input, "", false);
    return true;
  } else {
    showError(divError, input, "No puede estar vacio", true);
    return false;
  }
};

//ESTA FUNCION VALIDA QUE NO EXISTAN LETRAS EN LOS INPUT NUMERICOS
//param { divError } recibe un div donde se mostrara un error
//para { input } recibe un input el cual sera evaluado
let validateLetter = (input, divError) => {
  let regExp = /[A-z]/g;
  if (regExp.test(input.value)) {
    showError(divError, input, "Formato incorrecto, solo numeros", true);
  } else {
    showError(divError, input, "", false);
  }
};

//EVENTO DE LA CARGA DEL DOM
document.addEventListener("DOMContentLoaded", (e) => {
  //CON UN LOADER SIMULA EL TIEMPO DE ESPERA PARA PROCESAR UN PAGO
  setTimeout(() => {
    document.querySelector(".loader").classList.add("fade-out");
  }, 1800);
  setTimeout(() => {
    document.querySelector(".loader").classList.add("display");
  }, 2500);
  //PINTO LOS PRODUCTOS Y EL TOTAL EN EL HTML
  getProducts();
  injectProducts();
  injectTotal();
});

//CARGA DINAMICA DEL NOMBRE EN LA TARJETA DE CREDITO
$nameInput.addEventListener("input", (e) => {
  let regExp = /^[A-z ,.'-]+$/i;
  //HACE UN TEST DE LA EXPRECION REGULAR
  if (!regExp.test($nameInput.value)) {
    showError(
      $divErrorName,
      $nameInput,
      "Formato incorrecto, solo letras",
      true
    );
  } else {
    showError($divErrorName, $nameInput, "", false);
  }

  if ($nameInput.value === "") {
    showError($divErrorName, $nameInput, "", false);
  }

  if ($nameInput.value === "") {
    $insertName.textContent = "XXXXXXX";
  } else {
    $insertName.textContent = $nameInput.value.toUpperCase();
  }
});

//CARGA DINAMICA DEL NUMERO DE LA TARJETA
$numberInput.addEventListener("input", (e) => {
  let eValue = e.target.value;
  console.log(eValue);
  let regExp = /[A-z]/g;
  if (regExp.test($numberInput.value)) {
    showError(
      $divErrorNumber,
      $numberInput,
      "Formato incorrecto, solo numeros",
      true
    );
  } else {
    //GENERA UN ESPACIO EN BLANCO CADA 4 NUMERO INGRESADOS
    $numberInput.value = eValue
      .replace(/\s/g, "")
      .replace(/([0-9]{4})/g, "$1 ")
      .trim();
    showError($divErrorNumber, $numberInput, "", false);
  }

  if ($numberInput.value === "") {
    $insertNumber.textContent = "0000 0000 0000 0000";
  } else {
    $insertNumber.textContent = $numberInput.value;
  }
});

//CARGA DINAMICA DEL MES EN LA TARJETA DE CREDITO
$monthInput.addEventListener("input", (e) => {
  if ($monthInput.value === "") {
    $insertMonth.textContent = "00";
  } else {
    $insertMonth.textContent = $monthInput.value;
    validateLetter($monthInput, $divMonthError);
  }
});

//CARGA DINAMICA DEL AÑO EN LA TARJETA DE CREDITO
$yearInput.addEventListener("input", (e) => {
  if ($yearInput.value === "") {
    $insertYear.textContent = "/00";
  } else {
    $insertYear.textContent = `/${$yearInput.value}`;
    validateLetter($yearInput, $divYearError);
  }
});

//CARGA DINAMICA DEL CVC EN LA TARJETA DE CREDITO
$cvcInput.addEventListener("input", (e) => {
  if ($cvcInput.value === "") {
    $insertCvc.textContent = "000";
  } else if ($cvcInput.value.length === 1) {
    $insertCvc.textContent = "*";
    validateLetter($cvcInput, $divCvcError);
  } else if ($cvcInput.value.length === 2) {
    $insertCvc.textContent = "**";
    validateLetter($cvcInput, $divCvcError);
  } else if ($cvcInput.value.length === 3) {
    $insertCvc.textContent = "***";
    validateLetter($cvcInput, $divCvcError);
  }
});

//ESTOS VALORES DEBERAN SER TODOS TRUE PARA VALIDAR QUE TODOS LOS INPUT SEAN CORRECTOS
let nameValidate = false;
let numberValidate = false;
let monthValidate = false;
let yearValidate = false;
let cvcValidate = false;

$btnConfirm.addEventListener("click", (e) => {
  e.preventDefault();
  //VALIDANDO QUE EL INPUT DEL NOMBRE NO ESTE VACIO
  if (emptyInput($divErrorName, $nameInput)) {
    nameValidate = true;
  } else {
    nameValidate = false;
  }

  //VALIDANDO QUE EL INPUT DE LA TARJETA NO ESTE VACIO
  if (emptyInput($divErrorNumber, $numberInput)) {
    //VALIDANDO QUE LA TARJETA TENGA 16 NUMEROS
    if ($numberInput.value.length < 19) {
      showError(
        $divErrorNumber,
        $numberInput,
        "La tarjeta debe tener 16 numeros",
        true
      );
      numberValidate = false;
    } else {
      showError($divErrorNumber, $numberInput, "", false);
      numberValidate = true;
    }
  } else {
    numberValidate = false;
  }

  //VALIDANDO QUE EL INPUT DEL MES NO ESTE VACIO
  if (emptyInput($divMonthError, $monthInput)) {
    //VALIDANDO QUE EL MES SEA UN NUMERO ENTRE 1 Y 12
    if ($monthInput.value > 0 && $monthInput.value <= 12) {
      showError($divMonthError, $monthInput, "", false);
      monthValidate = true;
    } else {
      showError($divMonthError, $monthInput, "Mes incorrecto", true);
      monthValidate = false;
    }
  } else {
    monthValidate = false;
  }

  //VALIDANDO QUE EL INPUT DEL AÑO NO ESTE VACIO
  if (emptyInput($divYearError, $yearInput)) {
    //VALIDO QUE LA TARJETA ESTE EN EL RANGO DE 5 AÑOS
    if ($yearInput.value >= 22 && $yearInput.value <= 27) {
      showError($divYearError, $yearInput, "", false);
      yearValidate = true;
    } else {
      showError($divYearError, $yearInput, "Año incorrecto", true);
      yearValidate = false;
    }
  } else {
    yearValidate = false;
  }

  //VALIDANDO QUE EL CVC NO ESTE VACIO
  if (emptyInput($divCvcError, $cvcInput)) {
    //VALIDO QUE EL CVC TENGA 3 NUMEROS
    if ($cvcInput.value.length === 3) {
      showError($divCvcError, $cvcInput, "", false);
      cvcValidate = true;
    } else {
      showError($divCvcError, $cvcInput, "CVC incorrecto", true);
      cvcValidate = false;
    }
  } else {
    cvcValidate = false;
  }

  //SI TODOS LOS VALORES SON CORRECTOS OCULTO EL FORMULARIO ,MUESTRO EL MENSAJE DE PAGO REALIZADO, VACIO EL CARRITO Y LIMPIO EL LOCALSTORAGE
  if (
    nameValidate === true &&
    numberValidate === true &&
    monthValidate === true &&
    yearValidate === true &&
    cvcValidate === true
  ) {
    //SIMULO LA CARGA DEL PAGO CON UN LOADER
    $form.classList.add("display");
    document.querySelector(".form-container").style.height = "100vh";
    document.querySelector(".loader2").classList.remove("display");
    setTimeout(() => {
      document.querySelector(".loader2").classList.add("display");
      $payMsg.classList.remove("display");
      $payMsg.classList.add("fade-in");
      carrito = [];
      localStorage.clear();
    }, 2000);
  }
});
