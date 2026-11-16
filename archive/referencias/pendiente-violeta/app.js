(function () {
  'use strict';

  var RAIZ = document.documentElement;
  var CLAVE = 'sublikat-tema';

  /* ---------------------------------------------------------
     Modo claro y oscuro
     --------------------------------------------------------- */
  function leerTema() {
    try { return window.localStorage.getItem(CLAVE); } catch (e) { return null; }
  }
  function guardarTema(valor) {
    try { window.localStorage.setItem(CLAVE, valor); } catch (e) {}
  }
  function preferenciaSistema() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  }
  function aplicarTema(tema) {
    RAIZ.setAttribute('data-theme', tema);
    var boton = document.getElementById('theme-toggle');
    if (!boton) return;
    var oscuro = tema === 'dark';
    boton.setAttribute('aria-pressed', oscuro ? 'true' : 'false');
    boton.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    boton.setAttribute('title', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    var sol = boton.querySelector('[data-icon="sol"]');
    var luna = boton.querySelector('[data-icon="luna"]');
    if (sol) sol.classList.toggle('hidden', oscuro);
    if (luna) luna.classList.toggle('hidden', !oscuro);
  }
  function conectarBoton() {
    var boton = document.getElementById('theme-toggle');
    if (!boton || boton.getAttribute('data-listo') === '1') return;
    boton.setAttribute('data-listo', '1');
    aplicarTema(RAIZ.getAttribute('data-theme') || preferenciaSistema());
    boton.addEventListener('click', function () {
      var siguiente = RAIZ.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      aplicarTema(siguiente);
      guardarTema(siguiente);
    });
  }

  /* ---------------------------------------------------------
     Navegación: marcar la página actual y menú de móvil
     --------------------------------------------------------- */
  function paginaActual() {
    var ruta = window.location.pathname.split('/').pop();
    return ruta === '' ? 'index.html' : ruta;
  }
  function marcarPaginaActual() {
    var actual = paginaActual();
    var enlaces = document.querySelectorAll('.site-nav__link, .menu-panel__link');
    Array.prototype.forEach.call(enlaces, function (enlace) {
      var destino = enlace.getAttribute('href');
      if (!destino) return;
      var archivo = destino.split('#')[0].split('/').pop();
      if (archivo && archivo === actual) {
        enlace.setAttribute('aria-current', 'page');
      } else {
        enlace.removeAttribute('aria-current');
      }
    });
  }
  function iniciarMenu() {
    var boton = document.getElementById('menu-toggle');
    var panel = document.getElementById('menu-panel');
    if (!boton || !panel || boton.getAttribute('data-listo') === '1') return;
    boton.setAttribute('data-listo', '1');

    function abrir() {
      panel.removeAttribute('hidden');
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar el menú de navegación');
    }
    function cerrar() {
      panel.setAttribute('hidden', 'hidden');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir el menú de navegación');
    }
    boton.addEventListener('click', function () {
      if (boton.getAttribute('aria-expanded') === 'true') { cerrar(); } else { abrir(); }
    });
    panel.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) { cerrar(); }
    });
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
        cerrar();
        boton.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && boton.getAttribute('aria-expanded') === 'true') { cerrar(); }
    });
  }

  /* ---------------------------------------------------------
     Formulario de cotización: validación en el navegador.
     No hay backend: el panel final lo dice con claridad.
     --------------------------------------------------------- */
  function iniciarFormulario() {
    var form = document.getElementById('form-contacto');
    if (!form || form.getAttribute('data-listo') === '1') return;
    form.setAttribute('data-listo', '1');

    var resumen = document.getElementById('error-summary');
    var lista = document.getElementById('error-summary-list');
    var exito = document.getElementById('exito-contacto');

    var campos = [
      {
        id: 'contacto-nombre',
        etiqueta: 'Nombre',
        validar: function (valor) {
          return valor.trim().length >= 2 ? '' : 'Escriba su nombre para poder dirigirnos a usted.';
        }
      },
      {
        id: 'contacto-email',
        etiqueta: 'Correo electrónico',
        validar: function (valor) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
            ? ''
            : 'Escriba un correo válido, por ejemplo nombre@correo.cl.';
        }
      },
      {
        id: 'contacto-producto',
        etiqueta: 'Producto',
        validar: function (valor) {
          return valor ? '' : 'Elija el producto que le interesa.';
        }
      },
      {
        id: 'contacto-cantidad',
        etiqueta: 'Cantidad',
        validar: function (valor) {
          var n = parseInt(valor, 10);
          if (!n || n < 1) { return 'Indique cuántas unidades necesita.'; }
          if (n > 500) { return 'Para más de 500 unidades, escríbanos por WhatsApp: lo cotizamos a medida.'; }
          return '';
        }
      },
      {
        id: 'contacto-mensaje',
        etiqueta: 'Descripción del pedido',
        validar: function (valor) {
          return valor.trim().length >= 10
            ? ''
            : 'Cuéntenos qué necesita, al menos 10 caracteres.';
        }
      },
      {
        id: 'contacto-diseno',
        etiqueta: 'Información del diseño',
        validar: function (valor) {
          return valor.trim().length >= 10
            ? ''
            : 'Describa su diseño o la idea que tiene en mente.';
        }
      },
      {
        id: 'contacto-contacto',
        etiqueta: 'Medio de contacto',
        validar: function (valor) {
          return valor ? '' : 'Elija por dónde prefiere que le contactemos.';
        }
      }
    ];

    function entradaDe(campo) { return document.getElementById(campo.id); }

    function cajaDeError(campo) {
      var existente = document.getElementById(campo.id + '-error');
      if (existente) return existente;
      var entrada = entradaDe(campo);
      if (!entrada || !entrada.parentNode) return null;
      var caja = document.createElement('div');
      caja.className = 'field-error-msg';
      caja.id = campo.id + '-error';
      caja.setAttribute('role', 'status');
      var texto = document.createElement('span');
      caja.appendChild(texto);
      var ayuda = entrada.parentNode.querySelector('.field-help-text');
      if (ayuda && ayuda.parentNode) { ayuda.parentNode.insertBefore(caja, ayuda); }
      else { entrada.parentNode.appendChild(caja); }
      return caja;
    }

    function limpiarCampo(campo) {
      var entrada = entradaDe(campo);
      if (entrada) {
        entrada.classList.remove('has-error');
        entrada.removeAttribute('aria-invalid');
      }
      var caja = document.getElementById(campo.id + '-error');
      if (caja && caja.parentNode) caja.parentNode.removeChild(caja);
    }

    function marcarCampo(campo, mensaje) {
      var entrada = entradaDe(campo);
      if (entrada) {
        entrada.classList.add('has-error');
        entrada.setAttribute('aria-invalid', 'true');
      }
      var caja = cajaDeError(campo);
      if (caja) {
        var texto = caja.querySelector('span');
        if (texto) texto.textContent = 'Error: ' + mensaje;
      }
    }

    function errorDe(campo) {
      var entrada = entradaDe(campo);
      if (!entrada) { return ''; }
      var valor = entrada.value || '';
      return campo.validar(valor);
    }

    function privacidadPendiente() {
      var casilla = document.getElementById('contacto-privacidad');
      return casilla && !casilla.checked;
    }

    function refrescarResumen() {
      if (!resumen || !lista) return [];
      var errores = [];
      campos.forEach(function (campo) {
        var mensaje = errorDe(campo);
        if (mensaje) errores.push({ campo: campo, mensaje: mensaje });
      });
      if (privacidadPendiente()) {
        errores.push({
          campo: { id: 'contacto-privacidad', etiqueta: 'Aceptación de la política de privacidad' },
          mensaje: 'Marque la casilla para que podamos gestionar su consulta.'
        });
      }
      lista.innerHTML = '';
      if (!errores.length) {
        resumen.setAttribute('hidden', 'hidden');
        return errores;
      }
      errores.forEach(function (item) {
        var li = document.createElement('li');
        var enlace = document.createElement('a');
        enlace.setAttribute('href', '#' + item.campo.id);
        enlace.textContent = item.campo.etiqueta + ': ' + item.mensaje;
        enlace.addEventListener('click', function (evento) {
          evento.preventDefault();
          var destino = document.getElementById(item.campo.id);
          if (destino) destino.focus();
        });
        li.appendChild(enlace);
        lista.appendChild(li);
      });
      resumen.removeAttribute('hidden');
      return errores;
    }

    campos.forEach(function (campo) {
      var entrada = entradaDe(campo);
      if (!entrada) return;
      entrada.addEventListener('blur', function () {
        var mensaje = errorDe(campo);
        if (mensaje) { marcarCampo(campo, mensaje); } else { limpiarCampo(campo); }
        refrescarResumen();
      });
    });

    var casilla = document.getElementById('contacto-privacidad');
    if (casilla) { casilla.addEventListener('change', refrescarResumen); }

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      campos.forEach(function (campo) {
        var mensaje = errorDe(campo);
        if (mensaje) { marcarCampo(campo, mensaje); } else { limpiarCampo(campo); }
      });
      var errores = refrescarResumen();
      if (errores.length) {
        var primero = document.getElementById(errores[0].campo.id);
        if (primero) primero.focus();
        return;
      }
      // Sin backend no hay envío: el panel lo explica y ofrece las vías reales.
      form.setAttribute('hidden', 'hidden');
      if (resumen) resumen.setAttribute('hidden', 'hidden');
      if (exito) {
        var nombre = (document.getElementById('contacto-nombre') || {}).value || '';
        var saludo = document.getElementById('exito-nombre');
        if (saludo) saludo.textContent = nombre.trim();
        exito.removeAttribute('hidden');
        exito.focus();
      }
    });

    var reiniciar = document.getElementById('form-reiniciar');
    if (reiniciar) {
      reiniciar.addEventListener('click', function () {
        form.reset();
        campos.forEach(limpiarCampo);
        if (resumen) resumen.setAttribute('hidden', 'hidden');
        if (exito) exito.setAttribute('hidden', 'hidden');
        form.removeAttribute('hidden');
        var primero = document.getElementById('contacto-nombre');
        if (primero) primero.focus();
      });
    }
  }

  /* ---------------------------------------------------------
     Botones «Cotizar»: prellenan el formulario de pedido
     --------------------------------------------------------- */
  function iniciarCotizacion() {
    var enlaces = document.querySelectorAll('a[data-producto]');
    Array.prototype.forEach.call(enlaces, function (enlace) {
      enlace.addEventListener('click', function () {
        var campo = document.getElementById('contacto-mensaje');
        var producto = enlace.getAttribute('data-producto');
        var seleccion = document.getElementById('contacto-producto');
        if (seleccion && producto) {
          for (var i = 0; i < seleccion.options.length; i++) {
            if (seleccion.options[i].textContent.trim() === producto.trim()) {
              seleccion.selectedIndex = i;
              break;
            }
          }
        }
        if (!campo) return;
        if (campo.value.trim() === '') {
          campo.value = 'Necesito cotizar: ' + producto + '\n';
        }
        campo.focus();
      });
    });
  }

  /* ---------------------------------------------------------
     Pestañas de categoría (catálogo de personalizados)
     --------------------------------------------------------- */
  function iniciarCategorias() {
    var pestanas = Array.prototype.slice.call(document.querySelectorAll('[role="tab"][data-categoria]'));
    if (!pestanas.length) return;

    function mostrar(indice, moverFoco) {
      pestanas.forEach(function (pestana, i) {
        var activa = i === indice;
        pestana.setAttribute('aria-selected', activa ? 'true' : 'false');
        pestana.setAttribute('tabindex', activa ? '0' : '-1');
        var panel = document.getElementById(pestana.getAttribute('aria-controls'));
        if (!panel) return;
        if (activa) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', 'hidden'); }
      });
      if (moverFoco) { pestanas[indice].focus(); }
      try {
        window.localStorage.setItem('sublikat-categoria', pestanas[indice].getAttribute('data-categoria'));
      } catch (e) {}
    }

    pestanas.forEach(function (pestana, i) {
      pestana.addEventListener('click', function () { mostrar(i, false); });
      pestana.addEventListener('keydown', function (evento) {
        var destino = null;
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') destino = (i + 1) % pestanas.length;
        else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') destino = (i - 1 + pestanas.length) % pestanas.length;
        else if (evento.key === 'Home') destino = 0;
        else if (evento.key === 'End') destino = pestanas.length - 1;
        if (destino === null) return;
        evento.preventDefault();
        mostrar(destino, true);
      });
    });

    var guardada = null;
    try { guardada = window.localStorage.getItem('sublikat-categoria'); } catch (e) {}
    var inicial = 0;
    if (guardada) {
      pestanas.forEach(function (pestana, i) {
        if (pestana.getAttribute('data-categoria') === guardada) inicial = i;
      });
    }
    mostrar(inicial, false);

    // Si la URL trae el identificador de una categoría, esa gana
    function activarPorHash() {
      var hash = (window.location.hash || '').replace('#', '');
      if (!hash) return false;
      var indice = -1;
      pestanas.forEach(function (pestana, i) {
        if (pestana.getAttribute('aria-controls') === hash) indice = i;
      });
      if (indice < 0) return false;
      mostrar(indice, false);
      return true;
    }
    activarPorHash();
    window.addEventListener('hashchange', activarPorHash);
  }

  function iniciar() {
    conectarBoton();
    marcarPaginaActual();
    iniciarMenu();
    iniciarFormulario();
    iniciarCotizacion();
    iniciarCategorias();
  }

  // El tema se aplica antes del primer pintado para evitar el parpadeo
  RAIZ.setAttribute('data-theme', leerTema() || preferenciaSistema());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
