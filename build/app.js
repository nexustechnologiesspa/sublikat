(function () {
  'use strict';

  var RAIZ = document.documentElement;
  var CLAVE = 'sublikat-tema';

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
    // La etiqueta escrita solo se ve dentro del menu movil.
    var etiqueta = boton.querySelector('.od-tema-etiqueta');
    if (etiqueta) etiqueta.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
  }

  // Se aplica antes del primer pintado para evitar el destello de color.
  var temaInicial = leerTema() || preferenciaSistema();
  RAIZ.setAttribute('data-theme', temaInicial);

  function conectarBoton() {
    var boton = document.getElementById('theme-toggle');
    if (!boton || boton.getAttribute('data-listo') === '1') return;
    boton.setAttribute('data-listo', '1');
    aplicarTema(RAIZ.getAttribute('data-theme') || temaInicial);
    boton.addEventListener('click', function () {
      var siguiente = RAIZ.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      aplicarTema(siguiente);
      guardarTema(siguiente);
    });
  }

  /* ---------------------------------------------------------
     Formulario de contacto: validación en el navegador,
     resumen de errores con enlaces y confirmación simulada.
     No se envía ningún dato a ningún servidor.
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
        etiqueta: 'Nombre completo',
        validar: function (valor) {
          return valor.trim().length >= 2 ? '' : 'Escribe tu nombre para poder dirigirnos a ti.';
        }
      },
      {
        id: 'contacto-email',
        etiqueta: 'Correo electrónico',
        validar: function (valor) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
            ? ''
            : 'Introduce una dirección válida con terminación de dominio (por ejemplo: .com o .es).';
        }
      },
      {
        id: 'contacto-producto',
        etiqueta: 'Producto o soporte',
        validar: function (valor) {
          return valor ? '' : 'Elige el producto o soporte que te interesa.';
        }
      },
      {
        id: 'contacto-mensaje',
        etiqueta: 'Detalles del encargo',
        validar: function (valor) {
          return valor.trim().length >= 10
            ? ''
            : 'Cuéntanos cuántas unidades necesitas y qué quieres estampar (10 caracteres mínimo).';
        }
      }
    ];

    function entradaDe(campo) {
      return document.getElementById(campo.id);
    }

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
      if (ayuda && ayuda.parentNode) {
        ayuda.parentNode.insertBefore(caja, ayuda);
      } else {
        entrada.parentNode.appendChild(caja);
      }
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
      var valor = entrada ? (entrada.value || '') : '';
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
          mensaje: 'Marca la casilla para poder gestionar tu consulta.'
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
        if (mensaje) {
          marcarCampo(campo, mensaje);
        } else {
          limpiarCampo(campo);
        }
        refrescarResumen();
      });
    });

    var casilla = document.getElementById('contacto-privacidad');
    if (casilla) {
      casilla.addEventListener('change', refrescarResumen);
    }

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      campos.forEach(function (campo) {
        var mensaje = errorDe(campo);
        if (mensaje) {
          marcarCampo(campo, mensaje);
        } else {
          limpiarCampo(campo);
        }
      });
      var errores = refrescarResumen();
      if (errores.length) {
        var primero = document.getElementById(errores[0].campo.id);
        if (primero) primero.focus();
        return;
      }
      // Confirmación simulada: no hay envío a ningún servidor.
      form.setAttribute('hidden', 'hidden');
      if (resumen) resumen.setAttribute('hidden', 'hidden');
      if (exito) {
        var nombre = (document.getElementById('contacto-nombre') || {}).value || '';
        var saludo = document.getElementById('exito-nombre');
        if (saludo) saludo.textContent = nombre.trim();
        exito.removeAttribute('hidden');
        exito.classList.remove('hidden');
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

  function iniciarCotizacion() {
    var enlaces = document.querySelectorAll('a[data-producto]');
    Array.prototype.forEach.call(enlaces, function (enlace) {
      enlace.addEventListener('click', function () {
        var campo = document.getElementById('contacto-mensaje');
        if (!campo) return;
        var producto = enlace.getAttribute('data-producto');
        if (campo.value.trim() === '') {
          campo.value = 'Consulta sobre: ' + producto + '\n';
        }
        campo.focus();
      });
    });
  }
  function iniciarCategorias() {
    var pestanas = Array.prototype.slice.call(document.querySelectorAll('[role="tab"][data-categoria]'));
    if (!pestanas.length) return;

    /* Techo de la lista: lo que ocupa la barra de pestanas fija (su `top`
       mas su alto) y un respiro, para que el titulo de la categoria quede
       entero por debajo y no medio tapado. */
    function techoDeLaLista() {
      var barra = document.querySelector('.od-tablist');
      if (!barra) return 0;
      var pegado = parseFloat(window.getComputedStyle(barra).top);
      return (isNaN(pegado) ? 0 : pegado) + barra.offsetHeight + 12;
    }

    /* Al cambiar de categoria la vista vuelve al principio de la lista: si
       se estaba mirando el ultimo producto de una categoria larga y la
       nueva tiene menos, la pagina quedaba a media altura y lo que se veia
       era el bloque siguiente. */
    function volverAlaLista(panel) {
      if (!panel) return;
      var techo = techoDeLaLista();
      var arriba = panel.getBoundingClientRect().top;
      if (arriba >= techo - 1) return;
      var suave = true;
      try { suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      var corregido = false;
      function ajustar() {
        if (corregido || !panel.isConnected) return;
        corregido = true;
        var desvio = panel.getBoundingClientRect().top - techoDeLaLista();
        if (Math.abs(desvio) > 2) window.scrollBy({ top: desvio, behavior: 'auto' });
      }
      window.scrollTo({
        top: Math.max(0, window.pageYOffset + arriba - techo),
        behavior: suave ? 'smooth' : 'auto'
      });
      if (!suave) {
        window.setTimeout(ajustar, 60);
      } else {
        window.addEventListener('scrollend', ajustar, { once: true });
        window.setTimeout(ajustar, 900);
      }
    }

    function mostrar(indice, moverFoco, desplazar) {
      var activo = null;
      pestanas.forEach(function (pestana, i) {
        var activa = i === indice;
        pestana.setAttribute('aria-selected', activa ? 'true' : 'false');
        pestana.setAttribute('tabindex', activa ? '0' : '-1');
        var panel = document.getElementById(pestana.getAttribute('aria-controls'));
        if (!panel) return;
        if (activa) {
          panel.removeAttribute('hidden');
          activo = panel;
        } else {
          panel.setAttribute('hidden', 'hidden');
        }
      });
      if (moverFoco) { pestanas[indice].focus(); }
      if (desplazar) { volverAlaLista(activo); }
      try {
        window.localStorage.setItem('sublikat-categoria', pestanas[indice].getAttribute('data-categoria'));
      } catch (e) {}
    }

    pestanas.forEach(function (pestana, i) {
      pestana.addEventListener('click', function () { mostrar(i, false, true); });
      pestana.addEventListener('keydown', function (evento) {
        var destino = null;
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') destino = (i + 1) % pestanas.length;
        else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') destino = (i - 1 + pestanas.length) % pestanas.length;
        else if (evento.key === 'Home') destino = 0;
        else if (evento.key === 'End') destino = pestanas.length - 1;
        if (destino === null) return;
        evento.preventDefault();
        mostrar(destino, true, true);
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
    mostrar(inicial, false, false);

    // Un enlace como pie.html#cat-textiles abre la categoria correspondiente.
    function activarPorHash() {
      var hash = (window.location.hash || '').replace('#', '');
      if (!hash) return false;
      var indice = -1;
      pestanas.forEach(function (pestana, i) {
        if (pestana.getAttribute('aria-controls') === hash) indice = i;
      });
      if (indice < 0) return false;
      mostrar(indice, false, false);
      return true;
    }
    activarPorHash();
    window.addEventListener('hashchange', activarPorHash);
  }
  /* ---------------------------------------------------------
     Mejoras de navegacion: menu movil, carruseles, pestana
     activa centrada, enlace activo por seccion y WhatsApp
     compacto. Vienen del script suelto que vivia al final del
     cuerpo; ahora forman parte del origen.
     --------------------------------------------------------- */
  function iniciarMedidaCabecera() {
    var head = document.getElementById('site-header');
    function medir() { if (head) RAIZ.style.setProperty('--hh', head.offsetHeight + 'px'); }
    medir();
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
    return medir;
  }

  function iniciarMenuMovil(medir) {
    var boton = document.getElementById('menu-btn');
    var panel = document.getElementById('menu-movil');
    if (!boton || !panel) return;
    function alternar(abrir) {
      panel.hidden = !abrir;
      boton.setAttribute('aria-expanded', abrir);
      boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
      setTimeout(medir, 0);
    }
    boton.addEventListener('click', function () { alternar(panel.hidden); });
    Array.prototype.slice.call(panel.querySelectorAll('a')).forEach(function (a) {
      a.addEventListener('click', function () { alternar(false); });
    });
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && !panel.hidden) { alternar(false); boton.focus(); }
    });
  }

  /* El conmutador de tema, dentro del menu en movil: se muda el MISMO nodo
     (conserva listener y `aria-pressed`) y vuelve a la barra al ensanchar. */
  function iniciarTemaEnMenu(medir) {
    var boton = document.getElementById('theme-toggle');
    var hueco = document.getElementById('menu-tema');
    var barra = document.getElementById('site-header');
    var hamburguesa = document.getElementById('menu-btn');
    if (!boton || !hueco || !barra || !hamburguesa || !hamburguesa.parentNode) return;
    if (!window.matchMedia) return;
    var consulta = window.matchMedia('(max-width: 767px)');
    var origen = null;

    function ubicar() {
      if (consulta.matches) {
        if (boton.parentNode !== hueco) {
          if (!origen) origen = { padre: boton.parentNode, siguiente: boton.nextSibling };
          hueco.hidden = false;
          hueco.appendChild(boton);
        }
      } else if (boton.parentNode === hueco) {
        var padre = (origen && origen.padre) || barra;
        var siguiente = origen && origen.siguiente;
        padre.insertBefore(boton, siguiente && siguiente.parentNode === padre ? siguiente : null);
        hueco.hidden = true;
      }
      if (typeof medir === 'function') medir();
    }

    ubicar();
    if (consulta.addEventListener) consulta.addEventListener('change', ubicar);
    else if (consulta.addListener) consulta.addListener(ubicar);
  }

  function iniciarCarruseles() {
    Array.prototype.slice.call(document.querySelectorAll('.swipe')).forEach(function (el) {
      var total = el.children.length;
      var puntos = document.createElement('div');
      puntos.className = 'dots';
      puntos.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < total; i++) puntos.appendChild(document.createElement('span'));
      el.after(puntos);
      function act() {
        var max = el.scrollWidth - el.clientWidth;
        var k = max > 0 ? Math.round(el.scrollLeft / max * (total - 1)) : 0;
        Array.prototype.slice.call(puntos.querySelectorAll('span')).forEach(function (s, j) {
          s.classList.toggle('on', j === k);
        });
      }
      el.addEventListener('scroll', act, { passive: true });
      act();
    });
  }

  function centrarPestanaActiva() {
    Array.prototype.slice.call(document.querySelectorAll('[role="tab"]')).forEach(function (pestana) {
      pestana.addEventListener('click', function () {
        var lista = pestana.parentNode;
        lista.scrollTo({
          left: pestana.offsetLeft - (lista.clientWidth - pestana.offsetWidth) / 2,
          behavior: 'smooth'
        });
      });
    });
  }

  function iniciarEnlaceActivo() {
    var enlaces = Array.prototype.slice.call(document.querySelectorAll('header nav a[href^="#"]'));
    if (!('IntersectionObserver' in window)) return;
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlaces.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + entrada.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ['tienda', 'proceso', 'resenas', 'contacto'].forEach(function (id) {
      var seccion = document.getElementById(id);
      if (seccion) observador.observe(seccion);
    });
  }

  function iniciarWhatsAppCompacto() {
    var widget = document.querySelector('.od-was');
    if (!widget) return;
    window.addEventListener('scroll', function () {
      widget.classList.toggle('compact', window.scrollY > 400);
    }, { passive: true });
  }

  function iniciar() {
    conectarBoton();
    iniciarFormulario();
    iniciarCotizacion();
    iniciarCategorias();    var medir = iniciarMedidaCabecera();
    iniciarMenuMovil(medir);
    iniciarTemaEnMenu(medir);
    iniciarCarruseles();
    centrarPestanaActiva();
    iniciarEnlaceActivo();
    iniciarWhatsAppCompacto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
  
