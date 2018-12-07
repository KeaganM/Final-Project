var myVar;
function myFunction() {
    myVar = setTimeout(showPage, 3000);
    document.getElementById("masterid").style.opacity = 1;
}
function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}
