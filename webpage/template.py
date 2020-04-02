template = f'''
<!DOCTYPE html>
<html>
  <head>
    <!-- Google Tag Manager -->
    <script>
      (function(w, d, s, l, i) {{
        w[l] = w[l] || [];
        w[l].push({{
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        }});
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src =
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      }})(window, document, 'script', 'dataLayer', 'GTM-NBS8V8V');
    </script>
    <!-- End Google Tag Manager -->
    <link rel='stylesheet' type='text/css' href='style/mystyle.css'>
    <title>aassumpcao's website</title>
  </head>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src='https://www.googletagmanager.com/gtag/js?id=UA-131557431-1'></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'UA-131557431-1');
    </script>

  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-NBS8V8V'
    height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- top navigation menu -->
    <div class='topnav' id='myTopnav'>
    <a href='/'>.home</a>
    <a href='cv.html'>.cv</a>
    <a href='publications.html'>.publications</a>
    <a href='software.html'>.software</a>
    <a href='data.html'>.data</a>
    <a href='javascript:void(0);' class='icon' onclick='myFunction()'>
      <i class="fa fa-bars"></i>
    </a>
    </div>

    <br> <br> <hr>

    <div class='main'>

    </div>
  </body>
</html>
'''