
//***** Basic Variables *******************************************************

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

//***** Layer Variables ********************************************************
  var master_layer = [];
  var rendered_layers = [[],[]];
  var per_change = [];
  var per_colors = ["blue","green","yellow","orange","red","purple"];
  var popUrl = "https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/combined_years_2000_to_2010/FeatureServer/0";
  var params = [];
  var renders = [[],[]];
  var field_number_value;

//*****Query Releated Variables ************************************************

var popuptemp = [[],[]];
var popupTemplate = []; //************* fix
var resultsLayer = [];
var qTask = [];
var params = [];
var	layer = []

//***** Event Related Variables ************************************************
  var dropdownchange = document.getElementById("fields");
  var dropdownvalue = fields.value;
  var dropdowndate1 = document.getElementById("date_one");
  var dropdowndatevalue1 = date_one.value;
  var dropdowndate2 = document.getElementById("date_two");
  var dropdowndatevalue2 = date_two.value;
  var slider = document.getElementById("htmlslider");
  var slidervalue = htmlslider.value;
  var analyzebutton = document.getElementById("changebutton");


//*****Function Definitions*****************************************************
  function updateSliderValue(){
  	slidervalue = htmlslider.value;
  	if (slidervalue == 0){
  		document.getElementById("slidervalue").innerHTML = 2000;
  	}else {
  		document.getElementById("slidervalue").innerHTML = 2010;
  	}
  }

  function loaderTimeout(){
    document.getElementById("body").style.opacity = 1.0;
  }

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

fillVariableArray();

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "dojo/dom",
  "esri/layers/GraphicsLayer",

  "dojo/on",
//  "dojo/domReady!",

// "esri/widgets/BasemapGallery",

  "esri/tasks/QueryTask",		   // the esri/tasks/QueryTask allows for the execution of different types of query operations on a layer: ***https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-QueryTask.html***
 "esri/tasks/support/Query",	   // the esri/tasks/support/Query defines parameters for executing queries for a features from a layer: ***https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html***
  "dojo/_base/array",			   // the dojo/_base/array provides enhancements to native array functions: ***https://dojotoolkit.org/reference-guide/1.8/dojo/_base/array.html***
			   // the dojo/dom defines the core Dojo Dom API: ***https://dojotoolkit.org/reference-guide/1.9/dojo/dom.html***
					   // the dojo/on is a general purpose event handler: ***https://dojotoolkit.org/reference-guide/1.10/dojo/on.html***

  /*"esri/widgets/Expand",
  "esri/widgets/Compass",
  "esri/widgets/Home",
  "esri/widgets/ScaleBar",
  "esri/widgets/Search",
 "esri/widgets/Legend",
  "esri/widgets/Print",*/
  "esri/renderers/smartMapping/statistics/classBreaks",

  "esri/renderers/smartMapping/creators/color"

], function(
	Map,
	MapView,
	FeatureLayer,
  ClassBreaksRenderer,
  dom,
  GraphicsLayer,
  on,
 QueryTask,
  Query,
  arrayUtils,


//	BasemapGallery,
/*	Expand,
	Compass,
	Home,
	ScaleBar,
	Search,
	Legend,
  Print,*/
  classBreaks,

  colorRendererCreator

  ){

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

function pushRendering(layer,renders){
  colorRendererCreator.createClassBreaksRenderer(renders)
  .then(function(response){
    layer.renderer=response.renderer;
  });
}

function pushRenderIntoLayers(){
  var i;
  var j;
  for (i = 0;i<2;i++){
    for (j = 0; j<7; j++){
        pushRendering(rendered_layers[i][j],renders[i][j])
    }

  }
}

function addMaps(){
  var i;
  var j;
  for (i = 0;i<2;i++){
    for (j = 0; j<7; j++){
      map.add(rendered_layers[i][j]);
    }
  }
}

function removeVisible() {
  var i;
  var j;
  for(i=0;i<2;i++){ // -----------------------------------create global variables for the cols and rows
    for(j=0;j<7;j++){
        rendered_layers[i][j].visible = false;
    }
  }
}

function pullLayerForward(year, data) {
removeVisible();
rendered_layers[year][data].visible = true;
}


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


function createExpression(year_two,year_one){
return "(($feature."+year_two+" - $feature."+year_one+")/$feature."+year_one+")*100";
}

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

function hearEvents(){
  dropdownchange.addEventListener("change", displayIndividualLayers);
  slider.addEventListener("change", displayIndividualLayers);
  analyzebutton.addEventListener("click",runAnalyze);
}


var popupTemplate = {			  // declare a new var variable (popupTemplate) that has several attributes set; defines a layout: ***https://developers.arcgis.com/javascript/latest/sample-code/intro-popuptemplate/index.html***
  title: "{name}",			  // title property that will display at the top of the popup
  fieldInfos: [{				  // fieldinfos property that provides a template to define the content of the popup
    fieldName: "F2000med_ag",  // field name set to a string "population"
    label: "F2000med_ag",	  // label name set to a string "population"
    format: {				  // format property that allows a number/date fields to be formatted
      places: 0,			  // the number of decimal places set to 0
      digitSeperator: true  // a comma seperates numbers if they are greater than 999
    }
  }, {
    fieldName: "Shape_area",
    label: "Shape_area",
    format: {
      places: 0,
      digitSeperator: true
    }
  }],
  content:								  // content property that provides a template defining the content of the popup
  "<b>Median Age:" + "</b> {F2000med_ag}" // population field displayed with the population amount next to it
  };
/*
 resultsLayer = new GraphicsLayer();  // declare a new var variable (resultsLayer) set to a new instatnce of GraphicsLayer

 qTask = new QueryTask({	 // declare a new var variable (qTask) set to a new QueryTask instance
  url:popUrl				 // url set to the popurl variable found above
});

 params = new Query({	 // declare a new var variable (params) set to a new instance of Query
  returnGeometry: true,	 // returns the geometry
  outFields: ["*"]		 // output fields set to *
});


/*layer = new FeatureLayer({
    url: popUrl,
  popupTemplate: popupTemplate
});*/


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


/*
//Query Code********************************************************************

  view.when(function(){							// view object for the query
    view.ui.add("optionsDiv", "bottom-right");	// adds the objec to the bottem right, uses optionsDiv for the drop downs, info, etc.
    on(dom.byId("doBtn"), "click", doQuery);    // click event that will run the doQuery function
  });

  var attributeName = dom.byId("attSelect");		// declare new var variable (attributeName) set to the element (by id) attSelect
  var expressionSign = dom.byId("signSelect");    // declare new var variable (expressionSign) set to the element (by id) signSelect
  var value = dom.byId("valSelect")				// declare new var variable (value) set to the element (by id) valSelect

  function doQuery() {
     			// declare new var variable (value) set to the element (by id) valSelect
    resultsLayer.removeAll();												 // remove all results
    params.where = dropdownvalue + expressionSign.value + value.value;  // paramaters where the value of the attribute name + the value of the expression sign + the value of the value chosen
    qTask.execute(params)													 // execute with the  parameter
      .then(getResults)													 // get results from execution calling on the getResults function
      .catch(promiseRejected);											 // handles erros
  }

  function getResults(response) {										// function definition getResults
    var popResults = arrayUtils.map(response.features, function(	// declare a new var variable (popResults) which is set to an arrayUtils.map object
      feature) {
      feature.popupTemplate = popupTemplate;						// feature object that is set to the popupTemplate found above
      return feature;												// returns a feature
    });

    resultsLayer.addMany(popResults);		  // the results layer that shows each point found in the query

    view.goTo(popResults).then(function() {	  // sets the view to the given target
      view.popup.open({					  // open the popup
        features: popResults,			  // features in the pop up set to popResults
        featureMenuOpen: true,			  // enables multiple features in a popup to display in a list
        updateLocationEnabled: true		  // popup should update the location for each paginated feature
      });
    });

    dom.byId("printResults").innerHTML = popResults.length +  // gets the element id "printResults" and sets it to the popResults and adds a string saying results found
      " results found!";
  }

  function promiseRejected(error) {							// a function definition promiseRejected
    console.error("Promise rejected: ", error.message);		// error that displays to console and an error message
  }

*/



/*
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

*/

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
  }
//***************************************************************harpers



};
