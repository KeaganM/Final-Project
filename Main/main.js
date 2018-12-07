
/****** Basic Variables *******************************************************
 Basic variables for various new instances of objects (e.g. MapView,Map)
 */

  var map = [];
  var view = [];
  var basemapGalley = [];
  var compass = [];
  var home = [];
  var scalebar = [];
  var bgExpand = [];
  var searchwidget = [];
  var variable_choices = [[],[]];
  var field_labels = ["Number of Blue Collar Workers",
  "Percent of Population with < Highschool Education",
  "Median Age","Median Income","Number of Total Population",
  "Number of Family Population","Number of White Collar Workers"]

/****** Layer Variables ********************************************************
 Layer variables were used to organize various layers objects and well as
 renderers, colors, and other paramaters.
 */
  var master_layer = [];
  var rendered_layers = [[],[]];
  var per_change = [];
  var per_colors = ["blue","green","yellow","orange","red","purple"];
  var popUrl = "https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/combined_years_2000_to_2010/FeatureServer/0";
  var params = [];
  var renders = [[],[]];
  var field_number_value;

/******Query Releated Variables ************************************************
Query variables are used to organize various query related objects, and parameters
*/
var popuptemp = [[],[]];
var resultsLayer = [];
var qTask = [];
var params = [];
var	layer = []

/***** Event Related Variables ************************************************
 Event Related Variables are used to provide value data for html elements, as
 well as link those elements to a variable. Those linked variables are then
 used in conjunction with addEventListener.
 */

  var dropdownchange = document.getElementById("fields");
  var dropdownvalue = fields.value;
  var dropdowndate1 = document.getElementById("date_one");
  var dropdowndatevalue1 = date_one.value;
  var dropdowndate2 = document.getElementById("date_two");
  var dropdowndatevalue2 = date_two.value;
  var slider = document.getElementById("htmlslider");
  var slidervalue = htmlslider.value;
  var analyzebutton = document.getElementById("changebutton");


/*****Function Definitions*****************************************************
  This section describes various functions that were used in the web mapping
  application. In order to provide some organization, most functions are
  declared here with their respective function calls made later in the script.
  */

/**********updateSliderValue****************************************************
 updateslidervalue is a simple function that takes and html element (id = slidervalue)
 and sets the value to a date based on an if statement. The if statement looks at
 the slidervalue variable and determines what to process next. If the slidervalue
 is 0, then the element value is set to 2000, otherwise it is set to 2010
 */
  function updateSliderValue(){
  	slidervalue = htmlslider.value;
  	if (slidervalue == 0){
  		document.getElementById("slidervalue").innerHTML = 2000;
  	}else {
  		document.getElementById("slidervalue").innerHTML = 2010;
  	}
  }
/**********fillVariableArray****************************************************
 the fillVariableArray takes parts of variables and combines them into an array
 that is often used throughout the application. This was done due to the how the
 fields were named after loading them onto ArcGIS Online (e.g.F2000med_ag). A
loop and nested for loop are used to rotate throughout the arrays of new_field_names
and date, and combine them usedin the + operater. This new variable is then set to
the appropriate array of variable_choices.
*/
  function fillVariableArray(){
    var i;
    var j;
    var new_field_names = ["b_col_","per_ed","med_ag","med_in","num_po","num_fa","w_col_"];
    var date  = [2000,2010];
    for (i=0;i<2;i++){
      for(j=0;j<7;j++){
        variable_choices[i][j] = "F"+date[i]+new_field_names[j];
      }
    }
  }
// fillVariableArray is called to complete the above function.
fillVariableArray();

/* This secion looks at the required modules used for this application. Various
modeules were required to be in a certain position in order to work
*/

/* This secion looks at the required modules used for this application. Various
modeules were required to be in a certain position in order to work
*/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
 "esri/widgets/BasemapGallery",
  "esri/widgets/Expand",
  "esri/widgets/Compass",
  "esri/widgets/Home",
  "esri/widgets/ScaleBar",
  "esri/widgets/Search",
 "esri/widgets/Legend",
  "esri/widgets/Print",
  "esri/renderers/smartMapping/statistics/classBreaks",
  "esri/renderers/ClassBreaksRenderer",
  "esri/renderers/smartMapping/creators/color"

], function(
	Map,
	MapView,
	FeatureLayer,
	BasemapGallery,
	Expand,
	Compass,
	Home,
	ScaleBar,
	Search,
	Legend,
  Print,
  classBreaks,
  ClassBreaksRenderer,
  colorRendererCreator

  ){
/**********fillnewPopups******************************************************
fillnewPopups is a function that utilizes a for loop and a nested for loop to
rotate trough a 2d array. The variable popuptemp is set to the newly created
parameters equalling to a unique field value. This means that there is a
completely seperate popuptemplate for each field, which only contains that one
field. fieldName and label are set to  their respective variables and rotated
through with the loops.
*/
    function fillnewPopups(){
         var i;
         var j;

         for (i = 0; i <2;i++){
           for (j = 0; j <7; j++){
             popuptemp[i][j] = {
               title: "{name}",
               content: [{
                 type:"fields",
                 fieldInfos: [{
                   fieldName: variable_choices[i][j],
                   label:field_labels[j],
                   visible: true
                 }]
               }]
             };
           }
         }
       }

       fillnewPopups();

/*************createRenderedLayers*********************************************
createRenderedLayers is an imporatant function as it creates individual layers
 for each field. This was simply done by running the 2d array through a loop and
 a nested loop, creating a new FeatureLayer
   */
    function createRenderedLayers(){
      var i;
      var j;

      for (i = 0;i<2;i++){
        for(j=0;j<7;j++){
          rendered_layers[i][j] = new FeatureLayer({
            url:popUrl,
          });
        }
      }
    }
    /************createRenders******************************************************
    reateRenderedLayers is an  function that creates
    for each field. This was done by running the 2d array through a loop and
    a nested loop, and applying the set parameters to the 2d array. Other variables
    that house necessary parameter information are also looped through
    (e.g.rendered_layers,variable_choices,field_labels).
    */
    function createRenders(){
      var i;
      var j;
      for (i = 0; i < 2;i++){
        for (j = 0; j <7;j++){
          renders[i][j] = {
          layer: rendered_layers[i][j],
          field: variable_choices[i][j],
          basemap: map.basemap,
          classificationMethod: "natural-breaks", // -------------- keep this for normal layers
          numClasses: 5,
          legendOptions: {
          title: field_labels[j]
          }
        };
      }
    }
}
/*********pushRendering*********************************************************
pushRendering is a function that sets the created renders to the rendered_layers.
The function takes two arguements, a layer variable and a render variable. it
creates a class breaks renderer, and then applies the a promise that sets the render
to a layer.
*/
function pushRendering(layer,renders){
  colorRendererCreator.createClassBreaksRenderer(renders)
  .then(function(response){
    layer.renderer=response.renderer;
  });
}
/********pushRendersIntoLayers**************************************************
pushRenderIntoLayers is a simple function that loops the pushRendering function,
applying the necessary layers and renders as arguements.
*/
function pushRenderIntoLayers(){
  var i;
  var j;
  for (i = 0;i<2;i++){
    for (j = 0; j<7; j++){
        pushRendering(rendered_layers[i][j],renders[i][j])
    }

  }
}
/********addMaps****************************************************************
addMaps is a function that loops through another function, which adds the
appropriate layers.
*/function addMaps(){
  var i;
  var j;
  for (i = 0;i<2;i++){
    for (j = 0; j<7; j++){
      map.add(rendered_layers[i][j]);
    }
  }
}
/********removeVisible**********************************************************
removeVisible is a function that is called to set the all the layers visibility
to false. This is used to reset the map, while forgoing the need to remove rendered_layers
and have them be created again when they are called for.
*/
function removeVisible() {
  var i;
  var j;
  for(i=0;i<2;i++){ // -----------------------------------create global variables for the cols and rows
    for(j=0;j<7;j++){
        rendered_layers[i][j].visible = false;
    }
  }
}
/********pullLayerForward*******************************************************
pullLayerForward is a function that sets the desired layer's visibility to true.
this is a function that is called in another function (displayIndividualLayers).
It accepts two arguements a year (desired year) and data (desired field). This
function will first call the removeVisible function to hide layers and change the
desired layer's visibility to true to show it.
*/
function pullLayerForward(year, data) {
removeVisible();
rendered_layers[year][data].visible = true;
}

/********displayIndividualLayers************************************************
displayIndividualLayers is an major function that changes which layers are
displayed. First the variables dropdownvalue and slidervalue are reset to the
values found in their respective html element. Through a lengthy if statement,
the dropdownvalue is first considered. Once considering the value of the
dropdownvalue another if statement is used to evaluate the slidervalue. Based on
those two values, the pullLayerForward functin is called, with the arguements that
set the year and date variables found the pullLayerForward function defintion
*/
function displayIndividualLayers() {
dropdownvalue = fields.value;
slidervalue = htmlslider.value;
if(dropdownvalue == "F2000b_col_"){
  if(slidervalue == 0){ pullLayerForward(0,0); field_number_value = 0; } else {pullLayerForward(1,0);field_number_value = 0;}
}else if (dropdownvalue == "F2000per_ed"){
  if(slidervalue == 0){ pullLayerForward(0,1);field_number_value = 1;} else {pullLayerForward(1,1);field_number_value = 1;}
}else if (dropdownvalue == "F2000med_ag"){
  if(slidervalue == 0){ pullLayerForward(0,2);field_number_value = 2;} else {pullLayerForward(1,2);field_number_value = 2;}
}else if (dropdownvalue == "F2000med_in"){
  if(slidervalue == 0){ pullLayerForward(0,3);field_number_value = 3;} else {pullLayerForward(1,3);field_number_value = 3;}
}else if (dropdownvalue == "F2000num_po"){
  if(slidervalue == 0){ pullLayerForward(0,4);field_number_value = 4;} else {pullLayerForward(1,4);field_number_value = 4;}
}else if (dropdownvalue == "F2000num_fa"){
  if(slidervalue == 0){ pullLayerForward(0,5);field_number_value = 5;} else {pullLayerForward(1,5);field_number_value = 5;}
}else{
  if(slidervalue == 0){ pullLayerForward(0,6);field_number_value = 6;} else {pullLayerForward(1,6);field_number_value = 6;}
}
}

/********fillsymbol*************************************************************
The fillSymbol function is similar to the createRenders function. It sets an
array variable on a loop to various parameters. This parameters are found as
arguements which can be easily changed out.
*/
function fillSymbol(type,colors,style,outline_color){
var i;
for (i =0;i<6;i++){
  per_change[i] = {
    type: type,
    color: colors[i],
    style:style,
    outline: {
      width: 0.5,
      color:outline_color
    }
  };
}
}

fillSymbol("simple-fill",per_colors,"solid","black");

var per_change_render = [];
/********renderChange***********************************************************
The renderchange function is a hard coded fucntion that is used to determine which
renderer template to use after preforming analysis. Currently it is set to
precentages based from -100 to 100, with -100 to 0, and 0 to -100 in 20% increments.
*/
function renderChange(expression){
per_change_render = {
type:"class-breaks",
valueExpression:expression, // ------------make sure you use "F" at the beginning
defaultSymbol: {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "gray",
      outline: {
        width: 0.5,
        color: "white"
      }
    },
    defaultLabel: "no data",
    classBreakInfos: [
        {
              minValue: -500,
              maxValue: 0,
              symbol: per_change[0],
              label: "-100% - 0%"
        },{
          minValue: 0,
          maxValue: 20,
          symbol: per_change[1],
          label: "0% - 20%"
        },{
          minValue: 20,
          maxValue: 40,
          symbol: per_change[2],
          label: "20% - 40%"
        },{
          minValue: 40,
          maxValue: 60,
          symbol: per_change[3],
          label: "40% - 60%"
        },{
          minValue: 60,
          maxValue: 80,
          symbol: per_change[4],
          label: "60% - 80%"
        },{
          minValue: 80,
          maxValue: 100,
          symbol: per_change[5],
          label: "80% - 100%"
        }]
      };
}

/********createExpression*******************************************************
the createExpression function is a function that creates an arcade function to
be used in finding the amount of change between two layers. The function accepts
two arguements (year_one and year_two). There arguements are then added to a
framework of the arcade function using the + operator.
*/
function createExpression(year_two,year_one){
return "(($feature."+year_two+" - $feature."+year_one+")/$feature."+year_one+")*100";
}
/********runAnalyze*************************************************************
runAnalyze is a function that sets the dropdowndate values of year one and two
too there repective HTML element values. Then through an if state it checks if
those values are the same. If the values are set to the same value, the results may
not appear correctly. An alert window is created if this is the case, otherwrise
if will remove all visibile layers witht he removeVisible function, and call the
renderChange function with an arguments consisting of the createExpression function
(in itself has arguements set to a variable_choices array and the dropdowndatevalue).
*/
function runAnalyze (){


dropdowndatevalue1 = date_one.value;
dropdowndatevalue2 = date_two.value;
if(dropdowndatevalue1 == dropdowndatevalue2){
  window.alert("please choose two valid values");
}else{
  removeVisible();
  renderChange(createExpression(variable_choices[dropdowndatevalue2][field_number_value],variable_choices[dropdowndatevalue1][field_number_value]));
  master_layer.renderer = per_change_render;
  }
}
/*********hearEvents************************************************************
the hearEvents function takes all the necessary event listeners and puts them into
a single function. Other events can then be added.
*/
function hearEvents(){
  dropdownchange.addEventListener("change", displayIndividualLayers);
  slider.addEventListener("change", displayIndividualLayers);
  analyzebutton.addEventListener("click",runAnalyze);
}

//**** Create a new Map and MapView instance ***********************************
  map = new Map({
    basemap: "dark-gray",
    layers: layer
	});

  view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 10,
    center: [-97.7431, 30.2672],
    highlightOptions:{color:"orange"}
	});

  master_layer = new FeatureLayer({
    url: popUrl
  });

  map.add(master_layer);

//*****Search Widget***********************************************************
  searchwidget = new Search({
  	view: view
	});

  view.ui.add(searchwidget, {
  	position: "top-right"
	});
//***** Print Widget ***********************************************************
var print = new Print({
  view: view,
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});

var pbgExpand = new Expand({
view: view,
content: print
});

view.ui.add(pbgExpand, "top-right");

//*****BasemapGallery Widget****************************************************
  basemapGallery= new BasemapGallery({
  	view: view,
  	container: document.createElement("div")
  	});

  bgExpand = new Expand({
  	view:view,
  	content: basemapGallery
  	});

  view.ui.add(bgExpand,"top-right");

//*****Compass Widget***********************************************************
    compass = new Compass({
    	view: view
  	});

    view.ui.add(compass, "top-left");

//*****Home Widget**************************************************************
     home = new Home({
     	view:view
     	});

     view.ui.add(home,"top-left");

 //*****ScaleBar Widget*********************************************************
      scaleBar = new ScaleBar({
      	view: view
      	});

      view.ui.add(scaleBar, {
      	position: "bottom-left"
    	});


 //***** Legend Widget *********************************************************
 var legend = new Legend({
  view: view,
});

var lbgExpand = new Expand({
view: view,
content: legend
});

view.ui.add(lbgExpand, "bottom-right");


//*****Function Calls**********************************************************()
createRenderedLayers();
createRenders();
pushRenderIntoLayers(rendered_layers,renders);
addMaps();
hearEvents();
});

//***** Make a Div Element draggable *******************************************
dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function setattSelectValue (){
  document.getElementById("attSelect").innerHTML = dropdownvalue;
};

};
