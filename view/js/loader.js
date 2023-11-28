document.onreadystatechange = () => {
    if (document.readyState === 'loading') {
      document.getElementById('loader').style.display = 'block';
    }
  }
  
  window.onload = function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main-app").style.display = "block";
  };