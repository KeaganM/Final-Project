
var variable_choices = [[],[]];

function fillVariableArray(){
  var i;
  var j;
  var new_field_names = ["b_col_","per_ed","med_ag","med_in","num_po","num_fa","w_col_"];
  var date  = [2000,2010];
  for (i=0;i<2;i++){
    for(j=0;j<7;j++){
      variable_choices[i][j] = date[i]+new_field_names[j];
    }
  }
}


fillVariableArray();

//***** Basic Variables *****
  var map = [];
  var view = [];
  var basemapGalley = [];
  var compass = [];
  var home = [];
  var scalebar = [];
  var bgExpand = [];
  var searchwidget = [];

//***** Layer Variables *****
  var rendered_layers = [[],[]];
  var render = [];
  var feature_url = ["https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/test_multi_var/FeatureServer/0",
                     "https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/test_multi_var2/FeatureServer/0"]

  var per_change = [];
  var per_colors = ["blue","yellow","orange","red","purple"];

//***** Query/Popup Variables *****
  //var popUrl = "https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/2010_austin_census_tract_pop/FeatureServer/0";
  var popupTemplate = {
    title: "{title}",
    content: [{
      type:"fields",
      fieldInfos: [{
        fieldName: "per_edcu",
        label: "Education",
        visible: true
      }]
    }]
  };
  var resultsLayer = [];
  var params = [];


//***** Field Variables *****

//***** Event Variables *****
  var dropdownchange = document.getElementById("fields");
  var dropdownvalue = fields.value;
  var slider = document.getElementById("htmlslider");
  var slidervalue = htmlslider.value;

  function updateSliderValue(){
  	slidervalue = htmlslider.value;
  	if (slidervalue == 0){
  		document.getElementById("slidervalue").innerHTML = 2000;
  	}else {
  		document.getElementById("slidervalue").innerHTML = 2010;
  	}
  }

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
 "esri/widgets/BasemapGallery",
  //"esri/tasks/QueryTask",
  //"esri/tasks/support/Query",
  //"dojo/_base/array",
  //"dojo/dom",
  //"dojo/on",
  //"dojo/domReady!",
  "esri/widgets/Expand",
  "esri/widgets/Compass",
  "esri/widgets/Home",
  "esri/widgets/ScaleBar",
  "esri/widgets/Search",
 "esri/widgets/Legend",
  "esri/widgets/Print",
//  "esri/renderers/smartMapping/creators/univariateColorSize",
//  "esri/renderers/smartMapping/statistics/histogram",
//  "esri/widgets/UnivariateColorSizeSlider",
//  "esri/core/lang",
  "esri/renderers/smartMapping/statistics/classBreaks",
  "esri/renderers/ClassBreaksRenderer",
  "esri/renderers/smartMapping/creators/color"
  //"esri/layers/GraphicsLayer",
], function(
	Map,
	MapView,
	FeatureLayer,
	BasemapGallery,
  //GraphicsLayer,
  //QueryTask,
  //Query,
  //arrayUtils,
  //dom,
  //on,
	Expand,
	Compass,
	Home,
	ScaleBar,
	Search,
	Legend,
  Print,
//  colorAndSizeRendererCreator,
//  histogram,
//  UnivariateColorSizeSlider,
  //esriLang,
  classBreaks,
  ClassBreaksRenderer,
  colorRendererCreator
  ){


  var master_layer = new FeatureLayer({
        url: "https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/combined_years_2000_to_2010/FeatureServer/0",

  });

//**** Create a new Map and MapView instance *****
  map = new Map({
    basemap: "dark-gray",
	});

  view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 10,
    center: [-97.7431, 30.2672],
    highlightOptions:{color:"orange"}
	});

var front_layer = [];

//*****Search Widget*****
  searchwidget = new Search({
  	view: view
	});

  view.ui.add(searchwidget, {
  	position: "top-right"
	});
//***** Print Widget *****
var print = new Print({
  view: view,
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});

var pbgExpand = new Expand({
view: view,
content: print
});

view.ui.add(pbgExpand, "top-right");

//*****BasemapGallery Widget*****
  basemapGallery= new BasemapGallery({
  	view: view,
  	container: document.createElement("div")
  	});

  bgExpand = new Expand({
  	view:view,
  	content: basemapGallery
  	});

  view.ui.add(bgExpand,"top-right");

//*****Compass Widget*****
    compass = new Compass({
    	view: view
  	});

    view.ui.add(compass, "top-left");

//*****Home Widget*****
     home = new Home({
     	view:view
     	});

     view.ui.add(home,"top-left");

 //*****ScaleBar Widget*****
      scaleBar = new ScaleBar({
      	view: view
      	});

      view.ui.add(scaleBar, {
      	position: "bottom-left"
    	});


 //***** Legend Widget *****
 var legend = new Legend({
  view: view,
});

var lbgExpand = new Expand({
view: view,
content: legend
});

view.ui.add(lbgExpand, "bottom-right");






var stopvaluesmed = [50,50,4000,75000]
  function fillRenders(){
    var i;
    var function_fstate;
    for (i = 0; i<4;i++){
      function_fstate = field[i];
      render[i] = {
          type:"simple",
          symbol:{type: "simple-fill"},
          visualVariables: [{
            type:"color",
            field:function_fstate,
            stops: [{value:stopvaluesmin[i], color: "yellow"},{value:stopvaluesmed[i], color: "red"}, // ------------------fix for idividual factors
                {value:stopvaluesmax[i], color: "purple"}]
            }]
      };
    }
  }

  fillRenders();

  function createRenderedLayers(){
    var i;
    var j;

    for (i = 0;i<2;i++){
      for(j=0;j<4;j++){
        rendered_layers[i][j] = new FeatureLayer({
        	url:feature_url[i],
          renderer: render[j],
          popupTemplate: popupTemplate
        });
        map.add(rendered_layers[i][j]);
      }
    }
  }


  function removeVisible() {
    var i;
    var j;
    for(i=0;i<2;i++){ // -----------------------------------create global variables for the cols and rows
      for(j=0;j<4;j++){
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
    if(dropdownvalue == "per_edcu"){
      if(slidervalue == 0){ pullLayerForward(0,0); } else {pullLayerForward(1,0);}
    }else if (dropdownvalue == "age"){
      if(slidervalue == 0){ pullLayerForward(0,1);} else {pullLayerForward(1,1);}
    }else if (dropdownvalue == "num_pop"){
      if(slidervalue == 0){ pullLayerForward(0,2);} else {pullLayerForward(1,2);}
    }else{
      if(slidervalue == 0){ pullLayerForward(0,3);} else {pullLayerForward(1,3);}
    }
  }

  function hearEvents(){
    dropdownchange.addEventListener("change", displayIndividualLayers);
    slider.addEventListener("change", displayIndividualLayers);
  }


  createRenderedLayers();
  hearEvents();


//********************************!!!!!!!!!!!!!TESTING!!!!!!!!!!!***************


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

fillSymbol("simple-fill",per_colors,"solid","white");

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
                minValue: -100,
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
  return "(($feature.F"+year_two+" - $feature.F"+year_one+")/$feature.F"+year_one+")*100";
}

renderChange(createExpression(agevariables[1],agevariables[0]));


      /*  var params = {
  layer: master_layer,
  field: "F2000med_ag",
  basemap: map.basemap,
  classificationMethod: "natural-breaks", // -------------- keep this for normal layers
  numClasses: 5,
  legendOptions: {
    title: "% population with a college degree"
  }
};

// generate the renderer and set it on the layer
colorRendererCreator.createClassBreaksRenderer(params)
  .then(function(response){
    master_layer.renderer = response.renderer;
  });


  /* working natural color renderer

  var master_layer = new FeatureLayer({
    url: "https://services9.arcgis.com/6UFiRNGaGhS09LMr/arcgis/rest/services/combined_years_2000_to_2010/FeatureServer/0",

  });

map.add(master_layer);


          var params = {
    layer: master_layer,
    field: "F2000med_ag",
    basemap: map.basemap,
    classificationMethod: "natural-breaks",
    numClasses: 5,
    legendOptions: {
      title: "% population with a college degree"
    }
  };

  // generate the renderer and set it on the layer
  colorRendererCreator.createClassBreaksRenderer(params)
    .then(function(response){
      master_layer.renderer = response.renderer;
    });
  */

});

/* Resources:
 * 	basemapGallery widget: https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=widgets-expand
 * 	draggable div element: https://www.w3schools.com/howto/howto_js_draggable.asp
 * possible hotspot analysis: http://proceedings.esri.com/library/userconf/unic16/papers/un_19.pdf
 *Arcade:
        https://www.esri.com/arcgis-blog/products/arcgis-online/mapping/try-arcade-expression/
 *      https://developers.arcgis.com/arcade/playground/

 class breaks: https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-smartMapping-statistics-classBreaks.html#ClassBreaksResult
 *
 *
 *
 *
 *
 */

//***** Make a Div Element draggable *****
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
}
