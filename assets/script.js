/*******************************************************************
***
***							MASTER OBJECT
***
*******************************************************************/
F_NN  = ( navigator.appName=='Netscape' ) && ( parseInt( navigator.appVersion ) < 5 );
F_MAC = ( navigator.appVersion.indexOf('Macintosh') > -1 );
F_DOM_NN = false;
F_DOM_IE = false;
F_DOM    = false;

//TODO add a complete browser snifer here
var agt  = navigator.userAgent.toLowerCase();
is_opera =  ( agt.indexOf("opera") != -1 );

  
if ( document.getElementById && ( navigator.appName=='Netscape' ) )
  F_DOM_NN = true;
if ( document.getElementById )
  F_DOM = true;	
if ( document.getElementById && ( navigator.appName == "Microsoft Internet Explorer" ) )
  F_DOM_IE = true;

document.objectModel = new Array(0);
document.F_loaded    =false;
document.F_dragLayer =null;
window.NOFevent      = new F_cNOFevent();
top.F_curObj         = null;
var NOFparameters    = null;
var params           = NOFparameters;
window.defaultStatus = "";

// F_cMain gets created as document.main inline in HTML file
function F_cMain() {
  this.commands = this.initCommands();

  this.commandsInit();
//	this.styles = null; 												 	//** use this with stylesheet
//	if(navigator.appName!='Netscape') this.styles = new F_cStyles(); 	 	//** use this with stylesheet
 
  if( ( navigator.appName != 'Netscape' ) || F_DOM )  F_cStyles(); 	 	//** use this with stylesheet
//	window.NOFevent = new F_cNOFevent();
  if(!F_NN && F_MAC) { 	//cancel anchor drags for IE Mac so dragging of elements works better
    var t = document.all.tags("A");
    for( var i = 0; i < t.length; i++ ) {
      t[i].ondragstart = F_dragCancel;
    }
  }
  //alert("end of main")
}

function F_dragCancel() {
  event.cancelBubble = true;
  event.returnValue = false;
}

/**
**	 add prototypes to F_cMain
**/

F_prototype("F_cMain.prototype.", 
  "initCommands", "F_initCommands",
  "commandsInit", "F_dummy",
  "cObject", "F_cObject",
  "closing", false,
//	"assignStyles", "F_assignStyles",
//	"getParm", "F_getParm",
  "closingObjects", 0
  );

/**
**	 NOFevent constructor
**/

function F_cNOFevent() {
  this.altKey =  false;
  this.button =  0;
  this.ctrlKey =  false;
  this.keyCode =  null;
  this.shiftKey =  false;
  this.pageY =  null;
  pageY =  null;
}

function F_cStyles() { 	 	//** use this with stylesheet to copy style to containers
  if( is_opera )
    return;		
  var ss = document.styleSheets["NOF_STYLE_SHEET"];
    
  if( !ss ) ss = document.styleSheets[0];

  obj =  ss.rules;
  if( ! obj )
    obj = ss.cssRules;

  for ( var i = 0; i < obj.length; i++ ) {
    var t = obj[i].selectorText;
    var theID = t.substring(t.indexOf("#")+1,999);
    var theContainer ;
      if ( document.all )
        theContainer = document.all.tags('SPAN')[theID];
      else if ( document.getElementById )
        theContainer = document.getElementsByTagName('SPAN')[theID];
    if(typeof theContainer == "undefined") {
      if ( document.all )
        theContainer = document.all.tags('DIV')[theID];
      else if ( document.getElementById )
        theContainer = document.getElementsByTagName('DIV')[theID];					
    }
    
    var s = obj[i].style
    if(typeof theContainer != "undefined") {
     if (typeof(theContainer.style) != "undefined")
      with(theContainer.style) {
        left  = s.left;
        top  = s.top;
        clip  = s.clip;				
        zIndex  = s.zIndex;
        visibility  = s.visibility;
      }
    }
    
  }
}

/*
function F_assignStyles() {
  var styleSheet = 	document.main.styles[('#'+theLayerID)].style; 	 
  var theDiv = document.all.tags('DIV')[theLayerID];
}
*/
/*******************************************************************
***
***							OBJECT DATA STRUCTURE
***
*******************************************************************/

var F_bar="Initializing ";
var F_count = 1;
var F_barError = "";
var F_bar="Initializing ";

function F_cObject(theLayerID, theType, theParent, theHandler, isRelative, objectID, formName, objectName, theValue)  {
  if( F_bar.length > 63 ) F_bar="Initializing " + F_count++;
  F_bar += "|";
  window.status=F_barError + F_bar;

//	var isLayer = (theType != "tln") && (theType != "frm") && (theType != "frs") && (theType != "fra") && (theType != "map");
  this.formObj = (theType == "chk") || (theType == "rad") || (theType == "tfd") || (theType == "sel") || (theType == "btn");

  // INITIALIZE DATA STRUCTURE //	
  this.styleID = objectID;
  this.name = objectID;
  this.type = theType;
  this.childObjects = new Object();
  
  if(theParent == "")
    this.parent = null;
  else {
    this.parent = document.objectModel[theParent];
    if(this.parent != null) {
      this.parent.childObjects[this.styleID] = this;  // add to parents children array
      this.level = this.parent.level + 1;
    }
  }
  
  this.timeoutTest = "document.objectModel";
  if(parent!=self) {	//In frames
    var f = self;
    while(f!=top) {
      this.timeoutTest="frames['"+f.name+"']."+this.timeoutTest;
      f = f.parent;
    }
    this.timeoutTest="top."+this.timeoutTest;
  }
  this.textRef = this.timeoutTest + "['"+ this.styleID+ "']";
  this.timeoutTest = "("+this.timeoutTest + "&&"+this.textRef+")";
  
  // ASSIGN HANDLER FOR GIVEN TYPE	//
//	this.commandHandler = F_commandHandler;
  this.commands = document.main.commands[theType];
  
  // ASSIGN REFERENCES TO BROWSER OBJECT, FORM AND STYLE SHEET/LAYER
  if( navigator.appName=='Netscape' && !F_DOM_NN )
  {
    // ** Netscape Navigator **
    var theForm = (formName == "")? "" : ".forms['" + formName + "']";
    //build the "document.layers[]..." string
    this.style = (this.parent != null) ? this.parent.style : document;
    if(theLayerID != "") {
      var IDarray = theLayerID.split(":");
      this.style =  this.style.layers[IDarray[0]];
    }
    this.objRef = this.style.document[objectID];
    
    
    this.formRef = (formName == "")? null : this.style.document.forms[formName];
    if ((theForm != "") && (objectName!="")) {
      if(this.formRef) {		//catch netscape bug
        if(objectName == (parseInt(objectName)+"")) {		//name is a number
          for (var i = 0; i < this.formRef.length; i++) {
              if (this.formRef[i].name == objectName) {	
              if(((theType == "rad") && (this.formRef[i].value == theValue)) || (theType != "rad")) {
                this.objRef = this.formRef[i];
                break;
              }
            }
          }
        } else {
          this.objRef = this.formRef[objectName];  //this doesn't work if form name is a number
          if(theType == "rad") {
            this.objRef = this.radioButtonByValue(this.objRef, theValue);
          }
        }
      } else {
        F_debug(this.styleID +": the form isn't displaying due to a Netscape bug.");
      }
    }
    if((theType == "snd")  || (theType == "vrm")) {
//			this.objRef = eval(this.styleTextRef + ".document.embeds[0]");
      if((this.style.document.embeds.length>0)&&(this.style.document.embeds[0])) {
        this.objRef = this.style.document.embeds[0];
      } else {
        this.objRef = null;
//				if(this.style.document.images.length==0)
//					F_debug("actions on sounds might have problems with nested tables");
//				if(this.style.document.images.length==1)
//					F_debug("play actions only work on inline sounds");
      }
    }
    if(theType == "fra") this.objRef = eval(objectID+".document");
//		if(theType == "tln") this.styleTextRef = "";
    if(theType == "img") {
//			this.objRef = eval(this.styleTextRef + ".document.images" + "['" + objectName + "']");  //### will need this if more than one image on a layer
//			this.objRef = eval(this.styleTextRef + ".document.images" + "[0]");
//			alert(this.style.document.images[0]+" "+this.style.document.images[objectName]+" "+this.style.document.objectName);
      this.objRef = this.style.document.images[0];
      if ( !this.objRef ) {	//Netscape bug where image can't be referenced in Nested Tables
        this.objRef = new Image();
//				F_debug("actions on images might have problems with nested tables");
      }
    }
    if(this.type =='jbn'){
      if(typeof this.objRef == "undefined")
        this.objRef = this.style.document.applets[0];
    }
    
    this.styleDiv = this.style;

    if(theLayerID == "LayoutLYR") {		
      document.F_layout_left = parseInt(this.style.left); 
      document.F_layout_top  = parseInt(this.style.top);
    }
    if(this.formObj && this.formRef && (typeof(this.objRef) == "undefined"))	
      F_debug(this.styleID +": either the form or the form element doesn't have a name.");
    this.savedPosition = new F_cPoint(this.style.left,this.style.top);
    // ** END Netscape Navigator **

  } else {// ** InternetExplorer & NN6+** - DOM compliant browserrs
    
//		var styleTextRef = "document";
    if( theLayerID == "" ) {
      if( this.parent != null ) {
        this.styleDiv = this.parent.styleDiv
        this.style 	  = this.parent.style;
      } else {
        this.styleDiv = document;
        this.style 	  = document.style;
      }		
    } else {
      if ( F_DOM_NN  )
        this.styleDiv = document.getElementsByTagName('SPAN')[theLayerID];
      else if( is_opera ) {				
        nodeList = document.getElementsByTagName('SPAN');
        this.styleDiv = nodeList.item(theLayerID);
      } else 
        this.styleDiv = document.all.tags('SPAN')[theLayerID];
        
      if(typeof this.styleDiv == "undefined" || this.styleDiv == null ) {				
        if ( F_DOM_NN ) {
          this.styleDiv = document.getElementById(theLayerID);
          //this.styleDiv = styleDiv[theLayerID];
          //alert("ID = " + theLayerID + " , style = " + this.styleDiv.style +
          //	" :: NN setting top = " + this.styleDiv.style.top);					
        }
        else if( is_opera ) {									
          nodeList = document.getElementById(theLayerID);
          //debug.traceln('nodeList.style = ' + nodeList.style )
          this.styleDiv = nodeList;
        } else
          this.styleDiv = document.all.tags('DIV')[theLayerID];
      }
      this.style = this.styleDiv.style;						
    }
    //alert("setting top = " + this.style.top)

    //BUG fixed : bottom nav bar is not appear inline
    if ( theLayerID.indexOf("NavigationBar") > -1 && theLayerID.indexOf("LYR") > -1  && document.all ) {	 
      var nof = document.body.NOF;
      layoutWidth = nof.split("L=(");			
      layoutWidth = layoutWidth[1].split(",");			
      this.style.width = layoutWidth[1]; 
    }
    
    if ( F_DOM_NN ) {
      this.objRef = ((objectID != "")&&(theType != "doc")&&(theType != "lyr")&&(theType != "nav")&&(theType != "txt")&&(theType != "map"))? 
        document.getElementById(objectID) : null;
      this.formRef = (formName == "")? null : document.forms[formName];
    }
    else {
      this.objRef = ((objectID != "")&&(theType != "doc")&&(theType != "lyr")&&(theType != "nav")&&(theType != "txt")&&(theType != "map"))? 
        document.all.item(objectID) : null;		
      this.formRef = (formName == "")? null : document.forms[formName];
    }
//		if((theType == "snd")&&(F_MAC)&&(typeof this.objRef.play=="undefined"))  this.objRef=null;  //Mac IE does not support play method
    if(theLayerID == "LayoutLYR") {
      if ( F_DOM_NN ) {
        document.F_layout_left = ( this.style.left.indexOf('pt') > 0 ) ? this.style.left.substring(0,this.style.left.indexOf('pt') ) :
                                                                         this.style.left;
        document.F_layout_top  = ( this.style.top.indexOf('pt') > 0 ) ? this.style.top.substring(0,this.style.top.indexOf('pt') ) :
                                                                         this.style.top;				
      } else {
        document.F_layout_left = this.style.pixelLeft;
        document.F_layout_top  = this.style.pixelTop;				
      }
    }
    if ( F_DOM_NN ) {
      if (typeof(this.style) != "undefined")
        this.savedPosition = new F_cPoint(this.style.left,this.style.top);
    } else {
      if (typeof(this.style) != "undefined")
        this.savedPosition = new F_cPoint(this.style.pixelLeft,this.style.pixelTop);
    }
    // ** END InternetExplorer && NS7+ **
  }	
  if((theType == "img") && (typeof this.objRef != "undefined") && (this.objRef != null)){
    this.images =  new Object();		//for storing preloaded images
//		this.images['Image 1 (Normal)'] =  new Image();
//		this.images['Image 1 (Normal)'].src = this.objRef.src;
//		alert(this.objRef.name);
    var i = 'Image 1 (Normal)';
    this.images[i] = new Object();
    this.images[i].source = this.objRef.src;
    this.images[i].complete = true;
  }


  // INITIALIZE MESSAGING SYSTEM	//
//	if(theHandler!=null && (typeof theHandler != "function")) {  //If array, we are passing messages
    this.localhandler = F_actionHandler;
    this.actions = new Object;

    //ADD ACTIONS
    if(theHandler!=null) {
    
      for( var i =  0; i < (theHandler.length - 4); i = i + 5) {
        //create an array for each message trigger
        if(typeof this.actions[theHandler[i]]=="undefined"){	//first action with this trigger
          this.actions[theHandler[i]] = new Array();

          /*
          //handle JavaBean events for NN
          if((this.type == "jbn") && (theHandler[i].substring(0,5) == "BEAN ")) {
            var theEvent = theHandler[i].substring(5,theHandler[i].length);
  //						alert("Bean event: " + theEvent);
            if(F_NN) {
              var theHandlerObject = new Object(); 
              theHandlerObject['on'+theEvent] = new Function("alert('"+theEvent+"')");
              var e = new netscape.javascript.adapters.JSTargetAdapter(theHandlerObject);
               this.objRef.setCommand(theEvent);
              this.objRef.setTarget(e);	
            }
          } 
          */
          
        }
        var theArray = this.actions[theHandler[i]];
        for(var k =  i+1; k < i+5; k++) {				
          theArray[theArray.length] = theHandler[k];
        }
      }
    }
//	} else {  //either null or a function reference
//		this.localhandler = theHandler;
//	} 
  this.lastMessage = this;
  this.messageQueue = new F_cQueue();
  
/*
  //Add events
  for (var i in this.actions) {
    switch(i) {
      case F_A: 				//onAbort event
      case F_B:				//onBlur event
      case F_CH:				//onChange event
      case F_C:				//onClick event
      
        break;
      case F_DB:				//onClick event
      case F_E:				//onError event
      case F_F:				//onFocus event
      case F_L:				//onLoad event
      case F_MT:				//onMouseOut event
      case F_MV:				//onMouseOver event
      case F_MU:				//onMouseUp event
      case F_MD:				//onMouseDown event
      case F_R:				//onReset event
      case F_SE:				//onSelect event
      case F_S:				//onSubmit event
      case F_U:				//onUnload event
      case F_HR:				//image map click
    }
  }	
*/

}


/**
**	 add prototypes to F_cObject
**/
  F_prototype("F_cObject.prototype.", 
    "draggable",		false, 
    "clickable",		true,
    "level",			"1",
    "commandHandler",	"F_commandHandler",
    "dragBoundries",	"'none'",
    "dropCollision",	null,
    "dragCollision",	null,
    "moveCollision",	null,
    "clickLayer",		null,
    "masked",			false,
    "move",				null,
    "transition",		null,

    // messaging system
    "nextMessage",		null,
    "currentMessage",	null,
    "handler",			"F_handler",						//called by message.send()
    "checkHandler",		"F_checkHandler",					//sets timeout to check for more messages
    "closing",			false);								//indicates running a closing transition or move

  F_prototypeF("F_cObject.prototype.", 
    //utilities
//		"addCommands",
    "getObjectValue",
    "setObjectValue",
//		"paramObject",
    
    // methods for manipulating objects
    "hide",
    "show",
    "bringToFront",
    "sendToBack",
    "shiftZindex1",
//		"bringForward",
//		"sendBackward",
    "setSource",
    "writeSource", 
    "offset",
    "setPosition",
    "getPosition",
    "restorePosition",
    "setTop",
    "setLeft",
    "setClipTop",
    "setClipLeft",
    "setClipRight",
    "setClipBottom",
    "setVisibility",
    "isVisible",
    "getzIndex",
    "setzIndex",
    "setIndex",
    "getTop",
    "getLeft",
    "getPageTop",
    "getPageLeft",
    "getPageTop",
    "getWidth",
    "getHeight",
    "getClipTop",
    "getClipLeft",
    "getClipRight",
    "getClipBottom",
    "getClipWidth",
    "getClipHeight",
    "gotoURL",
    "framesetGotoURL",
    "getPageXOffset",
    "getPageYOffset",
    "getWindowInnerHeight",
    "getWindowInnerWidth",
    "radioButtonByValue",
    "getFormObj",
    "setClosing",
    "resetClosing",
    "checkClosing");
  if( ( navigator.appName == 'Netscape' ) && !F_DOM_NN )	{
  } else {													// InternetExplorer
      F_prototypeIE("F_cObject.prototype.",
        "getTop",
        "getLeft",
        "getPageTop",
        "getPageLeft",
        "setClipRect",
        "setClipTop",
        "setClipLeft",
        "setClipRight",
        "setClipBottom",
        "getClipRect",
        "getClipTop",
        "getClipLeft",
        "getClipRight", 
        "getClipBottom",
        "getClipWidth",
        "getClipHeight",
        "getPageXOffset",
        "getPageYOffset", 
        "setIndex",
        "shiftZindex1",
        "bringToFront",
        "sendToBack",
        "getWindowInnerHeight",
        "getWindowInnerWidth",
        "radioButtonByValue",
        "setSource",
        "writeSource", 
        "offset");
  }
/*
      F_prototype("F_cObject.prototype.",
//				"setTop", "F_IE_setTop",
//				"setLeft", "F_IE_setLeft",
        "getTop", "F_IE_getTop",
        "getLeft", "F_IE_getLeft",
        "getPageTop", "F_IE_getPageTop",
        "getPageLeft", "F_IE_getPageLeft",
        "setClipRect", "F_IE_setClipRect",
        "setClipTop", "F_IE_setClipTop",
        "setClipLeft", "F_IE_setClipLeft",
        "setClipRight", "F_IE_setClipRight",
        "setClipBottom", "F_IE_setClipBottom",
        "getClipRect", "F_IE_getClipRect",
        "getClipTop", "F_IE_getClipTop",
        "getClipLeft", "F_IE_getClipLeft",
        "getClipRight", "F_IE_getClipRight",
        "getClipBottom", "F_IE_getClipBottom",
        "getClipWidth", "F_IE_getClipWidth",
        "getClipHeight", "F_IE_getClipHeight",
        "getPageXOffset", "F_IE_getPageXOffset",
        "getPageYOffset", "F_IE_getPageYOffset",
        "setIndex",	"F_IE_setIndex",
        "shiftZindex1",	"F_IE_shiftZindex1",
        "bringToFront",	"F_IE_bringToFront",
        "sendToBack",	"F_IE_sendToBack",
//				"bringForward",	"F_IE_bringForward",
//				"sendBackward",	"F_IE_sendBackward",
        "getWindowInnerHeight", "F_IE_getWindowInnerHeight",
        "getWindowInnerWidth", "F_IE_getWindowInnerWidth",
        "radioButtonByValue", 		"F_IE_radioButtonByValue",
        "setSource", 		"F_IE_setSource",
        "writeSource", 		"F_IE_writeSource",
        "offset", "F_IE_offset");
  }
*/
function F_getFormObj(theName) {
  for ( var obj in document.objectModel) {
    if ((document.objectModel[obj].type == "frm") && (document.objectModel[obj].formRef.name == theName)) {
      return (document.objectModel[obj]);
    }
  }
  return(null);
}


/*******************************************************************
***
***					METHODS FOR MANIPULATING BROWSER OBJECT
***
*******************************************************************/


function F_offset(theLeft, theTop) {
  this.style.offset(theLeft, theTop);
}

function F_setIndex(newIndex)				{
  var oldIndex = this.getzIndex();
  if(this.parent == null) {
    this.setzIndex(newIndex);
  } else {
    with(this.parent.style) {
      if(oldIndex>newIndex) {
        for (var i=0;i<layers.length;i++) {
          var theIndex = layers[i].zIndex;
          if((theIndex >= newIndex) && (theIndex < oldIndex)) {
            layers[i].zIndex=theIndex + 1;
          }
        }
      } 
      if(oldIndex<newIndex) {
        for (var i=0;i<layers.length;i++) {
          var theIndex = layers[i].zIndex;
          if((theIndex <= newIndex) && (theIndex > oldIndex)) {
            layers[i].zIndex=theIndex - 1;
          }
        }
      }
      this.setzIndex(newIndex);
    }
  }
}

function F_IE_setIndex(newIndex)				{
  var oldIndex = this.getzIndex();
  if(this.parent == null) {
    this.setzIndex(newIndex);
  } else {
    if ( F_DOM_NN ) {
      var obj = document.getElementsByTagName("div");		
        if(oldIndex>newIndex) {
          for ( var i = 0; i < obj.length; i++ ) {
            var theIndex = obj[i].style.zIndex;
            if((theIndex >= newIndex) && (theIndex < oldIndex)) {
              obj[i].style.zIndex=theIndex + 1;
            }
          }
        } 
        if(oldIndex<newIndex) {
          for (var i=0;i<obj.length;i++) {
            var theIndex = children[i].style.zIndex;
            if((theIndex <= newIndex) && (theIndex > oldIndex)) {
              obj[i].style.zIndex=theIndex - 1;
            }
          }
        }
        this.setzIndex(newIndex);
    } else {
      with(this.parent.styleDiv) {
        if(oldIndex>newIndex) {
          for (var i=0;i<children.length;i++) {
            var theIndex = children[i].style.zIndex;
            if((theIndex >= newIndex) && (theIndex < oldIndex)) {
              children[i].style.zIndex=theIndex + 1;
            }
          }
        } 
        if(oldIndex<newIndex) {
          for (var i=0;i<children.length;i++) {
            var theIndex = children[i].style.zIndex;
            if((theIndex <= newIndex) && (theIndex > oldIndex)) {
              children[i].style.zIndex=theIndex - 1;
            }
          }
        }
        this.setzIndex(newIndex);
      }
    }
  }
}


function F_bringToFront() {
  var theIndex = this.getzIndex();	
  var O = new Array(0);
  with(this.parent.style) {
    for (var i=0;i<layers.length;i++) {
      var theChildIndex = layers[i].zIndex;
      if(theChildIndex >= theIndex) {
        O[theChildIndex] = layers[i];
      }
    }
    this.setzIndex(O.length);
    for (var i=theIndex+1; i<O.length; i++) {
      if(O[i] && O[i].zIndex)		//catch instance where missing z-index in sequence
        O[i].zIndex=i-1;
    }
  }
  this.setzIndex(O.length-1);
}

function F_IE_bringToFront() {
  var theIndex = this.getzIndex();
  //alert('theIndex = ' + theIndex)
  var A = new Array(0);		
  if ( F_DOM_NN ) {
        obj = document.getElementsByTagName("div");
        for ( var i = 0; i < obj.length; i++ ) {
          //if((childNodes[i].tagName=="DIV")||(childNodes[i].tagName=="SPAN")) {
            var theChildIndex = obj[i].style.zIndex;
            if( theChildIndex >= theIndex ) 
              A[theChildIndex] = i;
          //}
        }
        this.setzIndex( A.length );
        for ( var i  =theIndex + 1 ; i < A.length; i++ ) {
          obj[A[i]].style.zIndex=i-1;
        }
  } else {
    //alert("IE :: = "+this.parent.styleDiv.children.length);	
    with(this.parent.styleDiv) {
      for ( var i = 0; i < children.length; i++ ) {
        if((children[i].tagName=="DIV")||(children[i].tagName=="SPAN")) {
          var theChildIndex = children[i].style.zIndex;
          if(theChildIndex >= theIndex) A[theChildIndex] = i;					
        }
      }
      this.setzIndex(A.length);
      for (var i=theIndex+1; i< A.length; i++) {
        children[A[i]].style.zIndex=i-1;
      }
    }
  }
  var l = A.length-1;
  //alert("A.length-1=" + l);
  this.setzIndex(A.length-1);
}

function F_sendToBack()				{
  var theIndex = this.getzIndex();
  var O = new Array(0);
  with(this.parent.style) {
    for (var i=0;i< layers.length;i++) {
      var theChildIndex = layers[i].zIndex;
      if(theChildIndex <= theIndex) {
        O[theChildIndex] = layers[i];
      }
    }
    this.setzIndex(1);
    for (var i=1; i< theIndex; i++) {
      if(O[i] && O[i].zIndex)		//catch instance where missing z-index in sequence
        O[i].zIndex=i+1;
    }
  }
}

function F_IE_sendToBack() {
  var theIndex = this.getzIndex();
  var A = new Array(0);
  if ( F_DOM_NN ){
    obj = document.getElementsByTagName("div");
      for ( var i=0; i < obj.length; i++ ) {
        if((obj[i].tagName=="DIV")||(obj[i].tagName=="SPAN")) {
          var theChildIndex = obj[i].style.zIndex;
          if(theChildIndex <= theIndex) A[theChildIndex] = i;
        }
      }
      this.setzIndex(1);
      for (var i=1; i< theIndex; i++) {
  //			if(children[A[i]].style)
          obj[A[i]].style.zIndex=i+1;
      }
  } else {
    with(this.parent.styleDiv) {
      for (var i=0;i<children.length;i++) {
        if((children[i].tagName=="DIV")||(children[i].tagName=="SPAN")) {
          var theChildIndex = children[i].style.zIndex;
          if(theChildIndex <= theIndex) A[theChildIndex] = i;
        }
      }
      this.setzIndex(1);
      for (var i=1; i< theIndex; i++) {
  //			if(children[A[i]].style)
          children[A[i]].style.zIndex=i+1;
      }
      }
  }
}

function F_shiftZindex1(dir)	{
  var theIndex = this.getzIndex() + dir;
  with(this.parent.style) {
    for (var i=0;i< layers.length;i++) {
      if(layers[i].zIndex == theIndex) {
        layers[i].zIndex = theIndex - dir;
        this.setzIndex(theIndex);
        return(true);
      }
    }
  }
  return(false);
}

function F_IE_shiftZindex1(dir)	{
  var theIndex = this.getzIndex() + dir;
  if ( F_DOM_NN ) {
    obj = document.getElementsByTagName("div");
    for (var i=0;i<obj.length;i++) {
      if((obj[i].tagName=="DIV")||(obj[i].tagName=="SPAN")) {
        if(obj[i].style.zIndex == theIndex) {
          obj[i].style.zIndex = theIndex - dir;
          this.setzIndex(theIndex);
          return(true);
        }
      }
    }
  } else {		
    with(this.parent.styleDiv) {
      for (var i=0;i<children.length;i++) {
        if((children[i].tagName=="DIV")||(children[i].tagName=="SPAN")) {
          if(children[i].style.zIndex == theIndex) {
            children[i].style.zIndex = theIndex - dir;
            this.setzIndex(theIndex);
            return(true);
          }
        }
      }
    }
  }
  return(false);
}


function F_show() {
  sendMsg(this.styleID, 'Shown', '',  '', false);
  this.setVisibility('inherit');
}

function F_hide() {
  this.setVisibility('hidden');
  sendMsg(this.styleID, 'Hidden', '',  '', false);
}

function F_setVisibility(theValue)		{
  if(theValue == "toggle") {
    this.style.visibility = ((this.style.visibility == "hidden") || (this.style.visibility == "hide"))? "inherit" : "hidden";
  } else {
    this.style.visibility = theValue;
  }
}
function F_isVisible()		{
  theLayer = this;
  while(theLayer.type != "doc") {
//		if(theLayer.style.visibility == "hidden") F_debug(this.styleID + " hidden");
    if((theLayer.style.visibility == "hidden") || (theLayer.style.visibility == "hide")) return(false);
    theLayer = theLayer.parent;
  }
  return(true);
}
function F_setPosition(parm)
{
//	this.style.top = parm.y;
//	this.style.left = parm.x;
  this.setTop(parm.y);
  this.setLeft(parm.x);
}

function F_restorePosition(parm)
{
  this.style.top = parm.y;
  this.style.left = parm.x;
}
function F_getPosition(parm)				{
    return(new F_Parm('x',this.getLeft(parm),'y',this.getTop(parm)));
}

function F_setTop(theValue)				{	
  if((this.parent != null) && ((this.parent.type == 'lyr') || (this.parent.type == 'doc'))) {
    this.style.top =  parseInt(theValue) - parseInt(this.getTop('absolute')) + parseInt(this.getTop('style'));
  } else
    this.style.top = parseInt(theValue);
}



function F_setLeft(theValue)			{
  if((this.parent != null) && ((this.parent.type == 'lyr') || (this.parent.type == 'doc'))) {
    this.style.left =  (parseInt(theValue) - parseInt(this.getLeft('absolute')) + parseInt(this.getLeft('style')));
  } else
    this.style.left = parseInt(theValue);		
}

function F_setClipTop(theValue)			{this.style.clip.top = theValue;}
function F_setClipLeft(theValue)		{this.style.clip.left = theValue;}
function F_setClipRight(theValue)		{this.style.clip.right = theValue;}
function F_setClipBottom(theValue)		{this.style.clip.bottom = theValue;}

function F_getzIndex()					{
  if((this.type == "map") || (this.formObj))
    return(parseInt(this.parent.style.zIndex));
//alert('this.style.visibility=' + this.style.visibility);		
  return(parseInt(this.style.zIndex));
}
function F_setzIndex(theIndex)			{this.style.zIndex = theIndex;}

function F_getLeft(parm)				{
  if(parm=='screen') {	
    return(this.style.pageX);
  }
  if(parm=='absolute') {
    return(this.style.pageX-document.F_layout_left);
  }
  if(parm=='style')
    return(this.style.left);
  //relative
  return(parseInt(this.style.left));

}
function F_getTop(parm)	{
  if(parm=='screen') {
    return(this.style.pageY);
  }
  if(parm=='absolute') {
    return(this.style.pageY-document.F_layout_top);
  }
  if(parm=='style')
    return(this.style.top);
  //relative
    return(parseInt(this.style.top));
}

function F_getPageTop() {
  var theTop = this.getTop();
  theLayer = this.parent;
  while (theLayer != null) {
    theTop += theLayer.getTop();
    theLayer = theLayer.parent;
  }
  //alert('theTop='+theTop);
  return(theTop);
}

function F_getPageLeft() {
  var theLeft = this.getLeft();
  theLayer = this.parent;
  while (theLayer != null) {
    theLeft += theLayer.getLeft();
    theLayer = theLayer.parent;
  }
  return(theLeft);

}

function F_getClipTop()			{return(parseInt(this.style.clip.top));}
function F_getClipLeft()			{return(parseInt(this.style.clip.left));}
function F_getClipRight()		{return(parseInt(this.style.clip.right));}
function F_getClipBottom()		{return(parseInt(this.style.clip.bottom));}
function F_getClipWidth()		{return(parseInt(this.style.clip.right) - parseInt(this.style.clip.left));}
function F_getClipHeight()		{return(parseInt(this.style.clip.bottom) - parseInt(this.style.clip.top));}



function F_NOP()						{return(0);}

function F_getWidth() {			//####### needs better for IE
  return(parseInt(this.getClipWidth()));	 //** this should be width, not clip.width	**//
}

function F_getHeight() {			//####### needs better for IE
  return(parseInt(this.getClipHeight()));		 //** this should be height, not clip.height  **//
}

function F_getPageXOffset()  			{return(window.pageXOffset);}
function F_getPageYOffset()				{return(window.pageYOffset);}
function F_getWindowInnerHeight()		{return(window.innerHeight);}
function F_getWindowInnerWidth()		{return(window.innerWidth);}


function F_setSource(s) {
  if(s!="")
    this.style.src=s;
}

function F_writeSource(s) {
  this.style.document.open();
  this.style.document.write(s);
  this.style.document.close();
}

/**
** IE & NS6+ Versions 
**/

function F_IE_setSource(s) {
  if(s!="")
    this.styleDiv.innerHTML = "<OBJECT TYPE='text/x-scriptlet' WIDTH="+this.getWidth()+" HEIGHT="+this.getHeight()+" DATA='"+s+"'></OBJECT>";
}


function F_IE_writeSource(s) {
  this.styleDiv.innerHTML = s;
}

function F_getZero() { return(0); }

function F_IE_offset( theLeft, theTop ) {
  //alert( "begin :: theLeft="+theLeft + "  ::  theTop="+theTop);
    //alert( "this.style.top="+this.style.top);
  if ( F_DOM_NN ) {
    var left = this.style.left;
    var top  = this.style.top;
    //alert( "begin NS :: left="+left + "  ::  top="+top);
    if ( left.indexOf("pt") > 0 || left.indexOf("px") > 0 ) {
       var pos = ( left.indexOf("pt") > 0 ) ? left.indexOf("pt") : left.indexOf("px");
       left = left.substring( 0 , pos );			 			 
    }
    if ( top.indexOf("pt") > 0 || top.indexOf("px") > 0 ) {
       var pos = ( top.indexOf("pt") > 0 ) ? top.indexOf("pt") : top.indexOf("px");
       top = top.substring( 0 , pos );			 			 
    }				
        
    this.style.left = (parseInt(left) + theLeft) + "px";
    this.style.top = (parseInt(top) + theTop) + "px";
    //alert( "NN :: this.style.left="+this.style.left + "  - NN :: this.style.top="+this.style.top);
  
  } else {
    //alert('IE :: this.style.pixelLeft	= ' + this.style.pixelLeft);
    this.style.left = (this.style.pixelLeft + theLeft);
    this.style.top = (this.style.pixelTop + theTop);
  }
  //alert("left="+this.style.left);	
}

function F_IE_setTop(theValue) {
  if((this.parent != null) && ((this.parent.type == 'lyr') || (this.parent.type == 'doc'))) {
    var t =  this.parent.getTop('absolute') - this.getTop('absolute') + this.style.top + parseInt(theValue);
    this.style.top =  t;
  } else
    this.style.top = theValue;		
}

function F_IE_setLeft(theValue)	{
  this.style.left = theValue;
}

function F_IE_getLeft(parm)				{
  if(parm=='screen') {
    return(this.getPageLeft());
  }
  if(parm=='absolute') {
    var t = parseInt(this.getPageLeft())  - parseInt(document.F_layout_left);		
    return t;
  }
    
  if(parm=='style') {
    if ( F_DOM_NN ) {
      //alert("NN :: this.style.left="+this.style.left);
      return(this.style.left);
    }
    else {
      //alert("IE :: this.style.left="+this.style.left);
      return(this.style.pixelLeft);
    }
  }
  
  //relative
  if ( F_DOM_NN )
    return(parseInt(this.style.left));
  
  //alert( "relative left = " + this.style.pixelLeft);
  return(parseInt(this.style.pixelLeft));
}

function F_IE_getTop(parm) {
  if(parm=='screen') {
    return(this.getPageTop());
  }
  if(parm=='absolute') {
    var t = parseInt(this.getPageTop()+0)  - parseInt(document.F_layout_top+0);
    //alert('top = '+ t);			
    return t;
  }
  if(parm=='style') {
    if ( F_DOM_NN )
      return(this.style.top);
    else
      return(this.style.pixelTop);
  }
    
  //relative
//		return(this.styleDiv.offsetTop);
  //alert( "relative top = " + this.style.pixelTop);
  if ( F_DOM_NN )
    return(this.style.top);
  else
    return(this.style.pixelTop);
}

function F_IE_getPageTop() {		//######## IE needs work
  var theTop = this.styleDiv.offsetTop;
  theLayer = this.parent;
  while (theLayer != null) {
    theTop += theLayer.styleDiv.offsetTop;
    theLayer = theLayer.parent;
  }	
  //alert('theTop = ' + theTop)
  return(theTop);
}

function F_IE_getPageLeft() {		//######## IE needs work
  // doesn't work with text blocks since they have no width and height in style
  var theLeft = this.styleDiv.offsetLeft;
  theLayer = this.parent;
  while (theLayer != null) {		
    theLeft += theLayer.styleDiv.offsetLeft;
//		F_debug(this.styleID + " " + theLayer.styleID +" "+theLayer.styleDiv.offsetLeft + " "+ theLeft);
    theLayer = theLayer.parent;
  }
  //alert('getPageLeft  = ' + theLeft)
  return(theLeft);

}

function F_IE_getClipRect()		{
    //this.style.clip = "rect(0px 20px 20px 0px)";
  var clip = this.style.clip;
  //alert('clip before = ' + clip)
  if( clip == 'rect()' )
    clip = '';
  if((clip.substring(0,4) == "rect") && (clip.charAt(clip.length-1) == ")")){
    //Opera7.0b2 bug fixed here. Why is he put that ',' ?????????
    //On Opera6.05 it is always = w/ rect(). There is no support for clip property.
    if( clip.indexOf( "," > -1 ) ) {
      buf = clip.split("," );
      clip = "";
      for( i = 0; i < buf.length; i++ ) {
        clip = clip + buf[i];
      }
    }
    //alert("clip after= " + clip);
    var theRect=clip.substring(5,999).split("px");				
    return( new F_cRect( parseInt(theRect[3]), parseInt(theRect[0]), parseInt(theRect[1]), parseInt(theRect[2]) ) );
  }
  if ( this.styleID == "Layout" ) 	return ( new F_cRect( 0,0,1000,1000 ) );  //##### bug work around where layout gets no height	
  //debug.traceln('this.styleDiv.offsetWidth = ' + this.styleDiv.offsetWidth);
  offsetWidth  = ( F_DOM_NN && ( this.type == 'txt' ) ) ? parseInt(this.styleDiv.offsetWidth) * 2 : this.styleDiv.offsetWidth;
  offsetHeight = ( F_DOM_NN && ( this.type == 'txt' ) ) ? parseInt(this.styleDiv.offsetHeight) * 2 : this.styleDiv.offsetHeight;	
  obj = new F_cRect(0 ,0, offsetWidth, offsetHeight );	
  return obj;
}


function F_IE_getClipTop()				{return(this.getClipRect().top);}
function F_IE_getClipLeft()				{return(this.getClipRect().left);}
function F_IE_getClipRight()			{return(this.getClipRect().right);}
function F_IE_getClipBottom()			{return(this.getClipRect().bottom);}
function F_IE_getClipWidth()			{return(this.getClipRect().right - this.getClipRect().left);}
function F_IE_getClipHeight()			{return(this.getClipRect().bottom - this.getClipRect().top);}

function F_IE_setClipRect(theRect) {
  this.style.clip = "rect(" + theRect.top + "px " + theRect.right + 
        "px " + theRect.bottom + "px " + theRect.left +"px)";
}

function F_IE_setClipTop(theValue) {
  theValue = ( theValue == "" ) ? 0 : theValue;
  var theRect = this.getClipRect();
  theRect.top = theValue;
  this.setClipRect(theRect);
}

function F_IE_setClipLeft(theValue) {
  theValue = ( theValue == "" ) ? 0 : theValue;
  var theRect = this.getClipRect();
  theRect.left = theValue;
  this.setClipRect(theRect);
}

function F_IE_setClipRight(theValue) {
  theValue = ( theValue == "" ) ? 0 : theValue;
  var theRect = this.getClipRect();
  theRect.right = theValue;
  this.setClipRect(theRect);
}

function F_IE_setClipBottom(theValue) {
  theValue = ( theValue == "" ) ? 0 : theValue;
  var theRect = this.getClipRect();
  theRect.bottom = theValue;
  this.setClipRect(theRect);
}

function F_IE_getPageXOffset() {
  if( F_DOM_NN ) 
    return window.pageXOffset;
  else 
    return(parseInt(document.body.scrollLeft));
}

function F_IE_getPageYOffset() {
  if( F_DOM_NN ) 
    return window.pageYOffset;
  else 
    return(parseInt(document.body.scrollTop));
}

function F_IE_getWindowInnerHeight() {
  if( F_DOM_NN )
    return self.innerHeight;
  else 
    return document.body.clientHeight;
}

function F_IE_getWindowInnerWidth()	{
  if( F_DOM_NN )
    return self.innerWidth;
  else 
    return document.body.clientWidth;
}

/*******************************************************************
***
***							MESSAGING
***
*******************************************************************/

/**
**	 F_handler(msg)
**/

function F_handler(msg)
{
  top.F_curObj = this;
  if(this.formObj && (typeof(this.objRef) == "undefined")) { //this is due to a missing form or element name
    return(null);		
  }
  if(msg != null)  //add to queue
  {
    this.lastMessage.nextMessage = msg;
    this.lastMessage = msg;
  } 

  if(this.nextMessage != null)
  {
      this.messageQueue.push(this.currentMessage);  // push currentMessage in case we have recursion
    
      this.currentMessage = this.nextMessage;
      this.nextMessage = this.currentMessage.nextMessage; //delete from stack
      this.currentMessage.nextMessage = null;
      if (this.nextMessage == null) this.lastMessage = this;
      
      // check messages recognized by this layer
      if(this.localhandler != null) this.localhandler(this.currentMessage);
      if(this.commandHandler != null) this.commandHandler(this.currentMessage);
      
      //Are we a JavaBean and is this a method?
      if((this.type == "jbn") && (msg.message.substring(0,5) == "BEAN ")) {
        var m = msg.message.substring(5,msg.message.length);
        var o = this.objRef;
        var P = msg.data;
        var R = ''
    //		if("P === ''") {	//this throws an error in Navigator
        if (F_NN) {
          var ParmIsJava = ((typeof P == "object")&& (P.getClass));
        } else {
          var ParmIsJava = ((typeof P == "object")&&(typeof P.constructor=="undefined"));
        }
    //		alert(ParmIsJava);
        if (P == '') {	//no parameters  #### I think this has problems in IE ?? which prefers ===
          var R = this.objRef[m]();
        } else if(ParmIsJava) {	//parameter is a java object
          o[m](P);				
        } else {
          if (typeof P == "object")  {  //if an object with multiple parameters
            var S = 'o[m](';
            var A = [];
            for (var i in P) {
              S += 'A['+A.length+'],';
              A[A.length] = P[i];
            }
            S = S.substr(0, S.length-1)+')';
            //alert(A.length);
            if(A.length > 0)
              var R = eval(S);
            else
              var R = o[m](P);		// this deals with font object		
          } else {
            var R = o[m](P);
          }
        }
        this.currentMessage.returnValue = R;
      }

      // cascade message to sublayers
      if(this.currentMessage.cascade)
        for (var child in this.childObjects) {
          this.currentMessage.send(this.childObjects[child]);
        }
      var returnValue = this.currentMessage.returnValue;
      this.currentMessage = null;	 //purge
      this.checkHandler();

      this.currentMessage = this.messageQueue.pop();	 // pop currentMessage 
      return(returnValue);
  }
}

/**
**	called by F_handler to reenter F_handler and check for more messages
**/

function F_checkHandler() {
  setTimeout( this.timeoutTest+'?'+this.textRef + '.handler(null):null;',	 1);
}


function F_actionHandler(msg) {
  var t = null;
  if(typeof this.actions[msg.message] != "undefined") { //is there an action for this message?
//		F_debug(msg.message + " "+typeof this.actions[msg.message]);
    top.F_curObj = this;
    NOFparameters = F_paramObject(msg, top.F_curObj);
    params = NOFparameters;
    var theArray = this.actions[msg.message];
    if(theArray) {
      for( var i =  0; i < (theArray.length - 3); i = i + 4) {		
        if(F_ckM(msg, msg.message)) { //if so, we need to call F_ckM() anyway to be sure we should be handling
          if(typeof theArray[i] == "function")  //a function
            msg.returnValue = theArray[i]();
          else { //a message
            var P = theArray[i + 2]; //the parameter
            var Parm = P;
//						if((typeof P == "object") && (!P.getClass)) {
            if((typeof P == "object") && (!F_NN || !P.getClass)) {
              if (P[0] == "msg")
                Parm = sendMsg(P[1], P[2], P[3], null);
              if (P[0] == "exp") {
                var func = new Function("return("+(P[1] == ''?"''":P[1])+")");
                Parm = func();
                if(typeof Parm == "undefined") Parm = new Object();
                if((typeof Parm == "object")&&(Parm != null)) Parm.getParm=F_getParm2;
              }
            }
            t = sendMsg(theArray[i], theArray[i + 1], Parm,  this, theArray[i + 3]);
            msg.returnValue = t;
          }
        }
      }
    }
  }
  return(t);
}


function F_errorMessage (errorMessage,errorURL,errorLineNo) {
  alert("Error with user added action: '"+msg.message+"'.");
  return false;
}

function F_commandHandler(msg) {
  if(typeof this.commands[msg.message] != "undefined") { //is there an action for this message?
    if(F_ckM(msg, msg.message)) {  //if so, we need to call F_ckM() anyway to be sure we should be handling
      // create an object contain properties to be used by action extensions
      NOFparameters = F_paramObject(msg, top.F_curObj);
      params = NOFparameters;

      window.onerror = F_errorMessage;
      with(this) {
      //alert("Command : " + commands[msg.message] + " -- message :  " + msg.message );
        eval(commands[msg.message]); //function caller.
      }
      window.onerror = new Function("return(false)");
    }
  }	
}

function F_ckM(msg, theString) {
//	if(msg == null) F_debug("null message" +  this);  //**assert	
  if((msg.message == theString) && (msg.relay == false)) msg.canceled = true;
  return(msg.message == theString);
}

/* not in yet

// F_subHandler(msg) - method for behaviors to be enabled/disabled

function F_subHandler(msg)
{	
  if (msg.message == this.enableMessage) {this.enabled = true;}	// enable or disable message?
  if (msg.message == this.disableMessage) {this.enabled = false;}
  return(this.enabled);	// return state of enable	
}

// F_cBehavior()

function F_cBehavior(theLayer, isEnabled, theEnableMessage, theDisableMessage)	
{
  this.enabled = isEnabled;
  this.theLayer = theLayer;
  this.enableMessage = theEnableMessage;
  this.disableMessage = theDisableMessage;
  this.F_subHandler = F_subHandler;
  
}
*/

/**
**	 F_send()
**/

function F_send(theTarget)	{
//alert(theTarget.handler);
  //theTarget: object to send to
  if(this.canceled == false) {
    if(typeof theTarget == "undefined") {
      F_debug("bad target; msg: '" + this.message + "'");  //#######
    } else {
      if(!theTarget.handler) {
        F_debug("bad target; msg: '" + this.message + "'");  //#######
      } else {
        var t = theTarget.handler(this);
        return(t);
      }
    }
  } else {
    return(null);
  }
}

/**
**	 sendMsg()
**/

function sendMsg(theTargetName, msgText, msgData,  theSender, theCascade)	{
  if (sendMsg.arguments.length == 4)
     msg = new F_cMessage(msgText, msgData,false, theSender);
  else if (sendMsg.arguments.length == 5) 
      msg = new F_cMessage(msgText, msgData,theCascade, theSender);
    else
      msg = new F_cMessage(msgText, new F_Parm(),false, null);  //2
      
  if (document.F_loaded) {  //page has been inited
    var targetArray = theTargetName.split(":");
    //### deal with frameset here
    if(targetArray[0]=="_parent") {	//targeting frameset
      if(msgText=="Go To") {
        F_framesetGotoURL(msgData);
//				parent.document.location.href = msgData;
        return(false);
      } else {
        F_debug("targeting frameset with an invalid message");
        return(false);
      }
    }		
    
    if(targetArray.length == 2) {		//targeting another frame
      var d = parent[targetArray[0]].document;
      if ((d.objectModel) && (d.objectModel[targetArray[1]]) && (d.F_loaded)) {
        var target = parent[targetArray[0]].document.objectModel[targetArray[1]];
      } else { //other frame not loaded yet or not enabled with actions		
        if(msgText=="Go To") {
          parent[targetArray[0]].document.location.href=msg.data;
        } else {
          msg.target = targetArray[1];
          msg.targetFrame = targetArray[0];
          frameQueue.push(msg);  // push currentMessage until document loaded
          return(null);
        }
      }
//			var target = eval("parent."+targetArray[0]+".document.objectModel['" + targetArray[1]+"']");
    } else {
      var target = document.objectModel[theTargetName];
    }				
    var t = msg.send(target);		
    // message object is not correct any more after send

    return(t);
  } else {  //page not loaded yet
    msg.target = theTargetName;
    messageQueue.push(msg);  // push currentMessage until document loaded
    return(null);
  }
}

function F_checkFrameQueue() {
  while (frameQueue.index > 0) { // send messages queued while loading  #### wrong order
    var msg = frameQueue.pop()
    var d = parent[msg.targetFrame].document;
    if ((d.objectModel) && (d.objectModel[msg.target]) && (d.F_loaded)) {
      var target = parent[msg.targetFrame].document.objectModel[msg.target];
      msg.send(target); 
    } else {
      frameQueue.push(msg);
//			top.setTimeout("top.frames['"+self.name+"'].F_checkFrameQueue();", 100);
      top.setTimeout("top.frames['"+self.name+"'].F_checkFrameQueue?top.frames['"+self.name+"'].F_checkFrameQueue():null;", 100);	//continue to try to send messages to frames not loaded yet
      break;
    }
  }
}

/**
**	 sendMsgToFrame()
**/

function sendMsgToFrame(theTargetName, msgText, msgData,  theSender, theCascade, theTargetFrame)	{
  if (document.objectModel != null) {  //page has been inited
    msg = new F_cMessage(msgText, msgData,theCascade, theSender);
//		msg.senderFrame = theSenderFrame;
    var target = eval(theTargetFrame+".document.objectModel[" + theTargetName+"]");
    return(msg.send(target));
  }
}

/**
**	 F_cMessage() - constructor for message objects
**/

function F_cMessage(msg, theData,  theCascade, theSender)  {
  this.message = msg;
  this.data = theData;
  this.cascade = theCascade;
  this.relay = true;
  this.canceled = false;
  this.nextMessage = null;
//	this.returnValue = false;
  this.sender = theSender;
  this.senderFrame = null;
  this.send = F_send;
//	this.messageType = F_messageType;
}


/*******************************************************************
***
***							COMMANDS
***
*******************************************************************/

/*******************************************************************
  ********** HTML TYPES MAPPED TO LAYOUT TYPES *****

  img = image		   	// picture, navbutton, banner, drawobjects
  txt = text block			// text
  chk = checkbox				// FormCheckbox
  rad = radio button		 	// FormRadio
  frm = form					// ****
  tfd = text field			// FormEdit, FormMultiEdit
  sel = selection object	 	// FormComboBox
  btn = button				// FormButton
  doc = document				// layout
  win = window				// ****
  fra = frame					// ****
  fst = frameset				// ****
  wht = white board			// whiteboard

  shk = shockwave				// ShockWave
  snd = Sound					// Sound
  vid = Video					// Video
  act = ActiveX				// ActiveX
  nav = NavBar				// NavBar, VertBar
  nbt = NavButton				// NavButton
  tbl = Table					// Table
  jav = Java					// ???
  com = Component				// ???
  jbn = JavaBean				// ??
  map	= imageMap				//
  tln = text link				//

  vrm = VRML					// ???

  vis = visible object 	(doc, img, txt, wht, shk, snd, vid, act, nav, jav, jbn, tbl)
  all = all object			//

*******************************************************************/

/*
**	message/command pairs, assigned to object data structure
*/

function F_initCommands() {
  var F_commands = new Object();
  var a = new Array("img","txt","chk","rad","frm","tfd","sel","btn","doc","lyr","wht","win","map", "tln",
             "shk", "snd", "vid", "act", "nav", "tbl", "jav", "com", "jbn", "frm", "vrm", "nbt", "fra", "fst");
  for (var i = 0; i < a.length; i++)
    F_commands[a[i]] = new F_cCommands(a[i]);	
  return(F_commands);
}

/*
**	constructor for commands objects, used to store message/command pairs
*/

function F_cCommands(theType) {
//	this.addCommands = F_addCommands;
//	this.addCommands(theType);
}

function F_dummy() {		//dummy function
}

function F_addCommandsLoop (theObject, theCommands) {
    for( var i =  0; i < (theCommands.length - 1); i = i + 2) 
      theObject[theCommands[i]] = theCommands[i + 1];	
}

function F_addCommands_method(theObject, theMethod) {
  var s = "Set ";
  if (theMethod == "getObjectValue") s = "Get ";
//	var t = theProperty.charAt(0).toLowerCase()+theProperty.substring(1,999);
  
  for(var i=2; i < F_addCommands_method.arguments.length; i++) {
    var t = F_addCommands_method.arguments[i];
    theObject[s+t] = "this." + theMethod+ "('" + t.toLowerCase() + "', msg)";
  }
}


function F_selectRestoreDefault(theLayer) {
    for (var i = 0; i < theLayer.objRef.length; i++) {
      if (theLayer.objRef.options[i].defaultSelected == true) {
        theLayer.objRef.options[i].selected = true;
      } else {
        theLayer.objRef.options[i].selected = false;
      }
    }

}


/**
**	 command utilities
**/


function F_getObjectValue(theProperty, msg) {
  msg.returnValue = this.objRef[theProperty];
}

function F_setObjectValue(theProperty, msg) {
  this.objRef[theProperty] = msg.data;
}

function F_radioButtonRef(theRadioButton) {
  for(var i = 0; i < theRadioButton.length ; i++)
    if(theRadioButton[i].checked) 
      return(theRadioButton[i]);
  return(theRadioButton[0]);
}

function F_radioButtonByValue(theRadioButton, theValue) {
  if(theRadioButton) {
    if((typeof theRadioButton.length)=="undefined"){	//one radio button
      return(theRadioButton)
    } else {
      for(var i = 0; i < theRadioButton.length ; i++)
        if(theRadioButton[i])
          if(theRadioButton[i].value==theValue)  {
            return(theRadioButton[i]);
          }
    }
  }
  return(null);
}

function F_IE_radioButtonByValue(theRadioButton, theValue) {
  return(theRadioButton);
}



/*******************************************************************
***
***		UTILITIES
***
*******************************************************************/

/**
**	 utility to add prototype to an object
**/

function F_prototype (theRef){
  for(var i=1; i < F_prototype.arguments.length; i = i + 2)
    eval(theRef +  F_prototype.arguments[i] +" = " + F_prototype.arguments[i+1]);
}
function F_prototypeF (theRef){
  for(var i=1; i < F_prototypeF.arguments.length; i++)
    eval(theRef +  F_prototypeF.arguments[i] +" = F_" + F_prototypeF.arguments[i]);
}
function F_prototypeIE (theRef){
  for(var i=1; i < F_prototypeIE.arguments.length; i++)
    eval(theRef +  F_prototypeIE.arguments[i] +" = F_IE_" + F_prototypeIE.arguments[i]);
}

/*
**	F_gotoURL(theURL)  - used by docu
*/

function F_gotoURL(parm) {
  var theURL = parm;
  var theTarget = "This";
  if(typeof parm == "object") { //need this for migration from 3.0
    var theURL = parm.URL; 
    theTarget = parm["Target Frame"];
//			theTarget = parm["Other Target"];
  }
  if(theURL == "") return(false);
  if(theTarget == "Top") {
    F_framesetGotoURL(theURL);
    return(true);
  }
  if(theTarget == "Other") {
    var n = parm["Other Target"];
    var t = top.frames[n];
    if(t){
      t.document.location.href = theURL;
    } else {
      window.open(theURL, n);
    }
    return(true);
  }
  var relative = theURL.indexOf(':') < 0;
  var p = theURL.split(':')[0];
  var f = theURL.split('.');
  var t = f[f.length-1].toLowerCase();
  if((relative ||(p=="http")||(p=="shttp")||(p=="https")||(p=="file"))&&((t!="wav")&&(t!="au")&&(t!="aif")&&(t!="mid")&&(t!="rmf")&&(t!="avi")&&(t!="mov")&&(t!="mpg"))) {
    if(!document.main.closing) {
      document.main.closing = true;
      this.theURL = F_getCompleteURL (theURL);
      if(document.F_topObject) {
        sendMsg(document.F_topObject, 'Page Exiting', '',  null, true);
        sendMsg(document.F_topObject, 'Check Closing', '',  null);
      }
    }
  } else {  //link which doesn't effect current browser page window
    if(theURL!="Javascript:void(0)")
      document.location.href = theURL;
  }
  return(true);
}

top.closing = false;

function F_framesetGotoURL(theURL) {
  if(!top.closing) {
    top.closing = true;
    top.theURL = F_getCompleteURL (theURL);
    for(var i = 0; i < parent.frames.length; i++) {
      with(top.frames[i].document) {
        if(document.F_topObject) {
          document.main.closing = true;
          sendMsg(top.frames[i].name+":"+document.F_topObject, 'Page Exiting', '',  null, true);
        }
      }
    }
    sendMsg(document.F_topObject, 'Check Closing', '',  null);
  }
}

function F_getCompleteURL (theURL) {
  var relative = theURL.indexOf(':') < 0;
  if(relative) {
    var loc = top.location.href;
    var newURL = loc.substring(0,loc.lastIndexOf('/')+1)
    var urlStart = theURL.substring(0,2);
    if(urlStart == './') {
      newURL += theURL.substring(2,theURL.length)
    }
    var clippedURL = newURL;
    while(urlStart == '..') {
      clippedURL = clippedURL.substring(0,clippedURL.lastIndexOf('/',clippedURL.length-2)+1);
      theURL     = theURL.substring(3,theURL.length);
      newURL     = clippedURL + theURL;
      urlStart   = theURL.substring(0,2);
    }
    return(newURL);
  }
  return(theURL);
}


function F_checkClosing() {
  if(!top.closing) {	//no frameset
    if (document.main.closingObjects == 0) {
      document.location.href = this.theURL;
      document.main.closing = false;
    }
  } else {	//frameset
    var c = 0;
    for(var i = 0; i < parent.frames.length; i++) {
      with(top.frames[i].document) {
        if(document.F_topObject) {
          c += document.main.closingObjects;
        }
      }
    }
    if(c == 0)
      top.location.href = top.theURL;
  }
}



/*
**	constructors for internal data types
*/

function F_cRect(theLeft, theTop, theRight, theBottom) {
  this.left   = theLeft ;	
  this.top    = theTop; 
  this.right  = theRight ;
  this.bottom = theBottom;
}

function F_cPoint(theX, theY) {
  this.x = parseInt(theX);
  this.y = parseInt(theY);
}

/*
function F_getParm(theObject, theParamter, theDefault) {
  return(typeof(theObject[theParamter]) != "undefined"?theObject[theParamter]:theDefault);
}
*/
/**
**	 F_cQueue - constructor for lifo queue
**/

function F_cQueue () {
  this.theQueue = new Array(0);
  this.index = 0;
  this.push = F_queuePush;
  this.pop = F_queuePop;
}

function F_queuePop() {
  var theValue = this.theQueue[--this.index];
  this.theQueue[this.index] = null;
  return(theValue);
}

function F_queuePush(theObject) {
  this.theQueue[this.index++] = theObject;
}


/**
**	 F_roundOff
**/

function F_roundOff ( theNumber) {
  if (theNumber > 0)return(Math.ceil(theNumber)); else return(Math.floor(theNumber));
}

/*******************************************************************
***
***		CLOSING
***
*******************************************************************/

/**
**	 F_setClosing
**/

function F_setClosing()
{
  if(document.main.closing) {
    this.closing = true;
    document.main.closingObjects++;
  }
}

/**
**	 F_resetClosing
**/

function F_resetClosing()
{
  if(this.closing) {
    document.main.closingObjects--;
    sendMsg(document.F_topObject, 'Check Closing', '',  null);
  }
}


/*******************************************************************
***
***		MOUSE EVENTS
***
*******************************************************************/

/**
**	 F_setupDrag - sets up event capturing at the window level.
**/

function F_setupDrag() {
  document.F_dragLayer = null;
  if(navigator.appName=='Netscape')
  { 
    document.captureEvents(Event.MOUSEUP|Event.MOUSEDOWN); 

    //document.captureEvents(Event.MOUSEUP);
    //document.captureEvents(Event.MOUSEDOWN);

    document.onmousedown = F_nn_mouseDown;
    document.onmouseup = F_mouseUp;

//window.onDragDrop  = F_ie_dragStart;
//		window.ondblclick = F_nn_DblClick;


    document.onmousemove = F_nn_mouseMove;
    window.offscreenBuffering=true;
    
  } else {  //IE
//		window.offscreenBuffering=false;

    document.onmousemove = F_ie_mouseMove;
    document.ondragstart = F_ie_dragStart;
    document.onmouseup = F_IE_mouseUp;


//		document.onmousedown = F_ie_cancelBubble;
//		document.onmouseover = F_ie_cancelBubble;
//		document.onmouseoout = F_ie_cancelBubble;
  }
}
/**
**	 generic event object
**/
var e;
function F_setEvent(e) {		
  
  //click on menu from a page with action scripts seted - only in N4.x
  target = e.target;		
  if ( F_NN  && (target.indexOf(".htm") > -1) )   {		
    document.location.href = target;
    return ;
  }
  
  if ( navigator.appName == 'Netscape' ) {
    F_nn_setEvent( e );
  } else {
    F_ie_setEvent();
  }
}

function F_nn_setEvent(e) {
//	window.NOFevent.altKey = e.modifiers & Event.ALT_MASK;
//	window.NOFevent.button = e.which;
//	window.NOFevent.ctrlKey = e.modifiers & Event.CONTROL_MASK;
//	window.NOFevent.keyCode = e.which;
//	window.NOFevent.shiftKey = e.modifiers & Event.SHIFT_MASK;	
  window.NOFevent.pageX = e.pageX;
  window.NOFevent.pageY = e.pageY;
}

function F_ie_setEvent() {
//	window.NOFevent.altKey = window.event.altKey;
//	window.NOFevent.button = window.event.button;
//	window.NOFevent.ctrlKey = window.event.ctrlKey;
//	window.NOFevent.keyCode = window.event.keyCode;
//	window.NOFevent.shiftKey = window.event.shiftKey;	
  window.NOFevent.pageX = window.event.clientX;
  window.NOFevent.pageY = window.event.clientY;
}

/**
**	 updates the position of the item being dragged
**/

function F_nn_mouseMove (e) {
  //F_nn_setEvent(e);
  if ( ( document.F_dragLayer != null ) && ( document.F_dragLayer.length > 0 ) ) {
    // If simple drag with no collision, messages, etc.		 
    var d = document.F_dragLayer[0].layer;
    //alert(parseInt(d.oldx + 0) + 0);		
    d.oldx = isNaN(d.oldx) ? 0 : d.oldx;
    d.oldy = isNaN(d.oldy) ? 0 : d.oldy;
    if ( ( document.F_dragLayer.length == 1 ) && ( d.fastDrag ) ) {
      var xMove = parseInt(d.oldx) - e.pageX ;			
      var yMove = parseInt(d.oldy) - e.pageY;			
      d.oldx = parseInt(d.oldx) - xMove ;
      d.oldy = parseInt(d.oldy) - yMove;			
      d.offset (-xMove, -yMove);					 
    } else {
      F_drag ( e.pageX, e.pageY );
    }
    //return false;
//		event.cancelBubble = true;
    if ( e )
      e.returnValue = false;		
  }
}

function F_clickedOnImage (mouseX, mouseY, imageRef) {
  var theRef = null;
  var topRef = imageRef;
  for (var i in imageRef.childObjects) {
    theRef = imageRef.childObjects[i];
      if (F_pointInObject(theRef, mouseX, mouseY))
//				if( (topRef == null) || F_isAbove(theRef, topRef) )  //##### not dealing with hotspot order!!
          topRef = theRef;
  }
  return(topRef);
}

/*
function F_clickedOn (mouseX, mouseY) {
  var theRef, topRef = null;
  for (var i in document.objectModel) {
    theRef = document.objectModel[i];
    if (theRef.clickable) 
      if (!theRef.masked) 
        if (F_pointInObject(theRef, mouseX, mouseY))
          if( (topRef == null) || F_isAbove(theRef, topRef) )
            topRef = theRef;
  }
  return(topRef);
}
*/

function F_pointInObject(obj, mouseX, mouseY) {	
  if (obj.clickable && obj.isVisible() && !obj.masked && obj.type != "map") {
    var theLeft = obj.getLeft('screen') + obj.getClipLeft();
    var theTop = obj.getTop('screen') + obj.getClipTop();
    //############## IE is a little off!!!
    if ( (mouseX >= theLeft) 
      && (mouseX <= (theLeft + obj.getWidth() - 1)) 
      && (mouseY >= theTop) 
      && (mouseY <= (theTop + obj.getHeight() - 1)) ) 
        return(true)
      else	return(false);
  }
  if (obj.type == "map" && obj.parent.isVisible()) {
    var x = obj.parent.getLeft('screen');
    var y = obj.parent.getTop('screen');
    if(obj.maptype == "rect") {
      var theLeft = x + obj.map.left;
      var theTop = y + obj.map.top;
      var theRight = x + obj.map.right;
      var theBottom = y + obj.map.bottom;
      if ( (mouseX >= theLeft) 
        && (mouseX <= theRight) 
        && (mouseY >= theTop) 
        && (mouseY <= theBottom) )
        return(true)
      else
        return(false);
    } else
      if(obj.maptype == "poly") {
        var theX = mouseX - x;
        var theY = mouseY - y;
        if ( F_clickedOnPolygon(theX, theY, obj.map) )
          return(true)
        else
          return(false);
      } else
        if(obj.maptype == "circ") {			
          var theX = mouseX - x - obj.map.x;
          var theY = mouseY - y - obj.map.y;
          if ( Math.sqrt((theX * theX) + (theY * theY)) <= obj.map.radius)
            return(true)
          else
            return(false);
        }
  }
}
    
function F_clickedOnPolygon(x, y, polygon) {
  var c = false;
  var p1 = polygon[polygon.length-1];
  for (var i=0;i<polygon.length;i++) {
    p2 = polygon[i];
    if((((p1.y<=y) && (y<p2.y)) ||
      ((p2.y<=y) && (y<p1.y))) &&
      (x< (p2.x - p1.x) * (y - p1.y) / (p2.y - p1.y) + p1.x))
              c=!c;;
    p1 = p2;
  }
  return(c);
}

/*
function F_isAbove (objOne, objTwo) {	
  // get how many levels down in nested tables objs are
  objOneLevel = objOne.level;
  objTwoLevel = objTwo.level;
  
  //find level where they are siblings
  while (objOneLevel > objTwoLevel) {
    objOne = objOne.parent;
    objOneLevel--;
  }
  while (objOneLevel < objTwoLevel) {
    objTwo = objTwo.parent;
    objTwoLevel--;
  }
  while (objOne.parent != objTwo.parent) {
    objOne = objOne.parent;
    objTwo = objTwo.parent;
  }
  return(objOne.getzIndex() >= objTwo.getzIndex())
}
*/

function F_nn_mouseDown (e) {
  F_setEvent(e);
  var retval = routeEvent(e);
  
  if ( typeof retval == "undefined" )
    return false;
  else
    return retval;
/*
  var L = F_clickedOn(e.pageX, e.pageY);
  document.clickLayer = L;
  if (L != null) {
    setTimeout( "sendMsg('"+ L.styleID +"', 'Mouse Down','', null);",  1);
  }
  return true;
*/
}

/*
function F_ie_cancelBubble () {
  event.cancelBubble = true;
  event.returnValue = false;
}
*/

/*
function F_ie_mouseDown () {
//	F_ie_setEvent();
  event.cancelBubble = true;
  if(window.event.button == 1) {
    var L = F_clickedOn(window.event.clientX + F_IE_getPageXOffset(), window.event.clientY + F_IE_getPageYOffset());
    document.clickLayer = L;
    if (L != null) {
      sendMsg(L.styleID, 'Mouse Down', '', null);
    }
  }
}
*/


function F_ie_mouseMove () {
  if ((document.F_dragLayer != null)&&(document.F_dragLayer.length>0)) {
    // If simple drag with no collision, messages, etc.
    var d = document.F_dragLayer[0].layer;
    if((document.F_dragLayer.length==1)&&(d.fastDrag)) {
      if(typeof d.oldx=="undefined"){
        d.oldx = event.clientX;
        d.oldy = event.clientY;
      }
      var xMove = d.oldx - event.clientX;
      var yMove = d.oldy - event.clientY;
      d.oldx = d.oldx - xMove ;
      d.oldy = d.oldy - yMove;
      d.style.left = (d.style.pixelLeft -xMove);
      d.style.top = (d.style.pixelTop -yMove);
    } else {
      F_drag (event.clientX, event.clientY);
    }
//		event.cancelBubble = true;
    event.returnValue = false;
  }
}



function F_ie_dragStart () {
//	if (document.dragLayer != null) {
    event.returnValue = false;
//	}
}

function F_mouseUp (e) {
  F_setEvent(e);
  if(document.F_dragLayer != null) {
    for(var i=(document.F_dragLayer.length-1);i>-1;i--) {
      if(document.F_dragLayer)
        if(document.F_dragLayer[i]) {
          var dObj = document.F_dragLayer[i];
          if(dObj.type == "Until Mouse Up") {
            dObj.layer.endDrag();
          }
        }
    }
  }
  var retval = routeEvent(e);	

 // if (typeof(HideMenu) != "undefined") 
 //   HideMenu();
//	if (document.clickLayer!=null) sendMsg(document.clickLayer.styleID, 'Mouse Up', '', null);
  return true;
}


function F_IE_mouseUp (e) {
  F_ie_setEvent();
  if(document.F_dragLayer != null) {
    for(var i=(document.F_dragLayer.length-1);i>-1;i--) {
      if(document.F_dragLayer)
        if(document.F_dragLayer[i]) {
          var dObj = document.F_dragLayer[i];
          if(dObj.type == "Until Mouse Up") {
            dObj.layer.endDrag();
          }
        }
    }
  }
  
  if (typeof(HideMenu) != "undefined") 
    HideMenu();
//	return true;
}


/*******************************************************************
***
***		FUNCTIONS USED IN HTML OR EXPOSED TO USER: encode with care!
***
*******************************************************************/

  var	messageQueue = new F_cQueue();	// used before document loaded
  var	frameQueue = new F_cQueue();	// used before document loaded for messages to other frames

/*
**	F_pageLoaded()  - called when page is loaded and data structure built
*/

function F_pageLoaded(theID) {
  window.status="Finishing";
  F_setupDrag();
  if(theID == null) F_debug("ERROR: no parameter passed to F_pageLoaded()");  //### assert
  document.F_topObject = theID;
  document.clickLayer = null;
  F_addCommandCallback ();  //finish registering extra commands
  
  document.F_loaded=true;
  while (messageQueue.index > 0) { // send messages queued while loading  #### wrong order
    var msg = messageQueue.pop()
    msg.send(document.objectModel[msg.target]); 
  }
  document.F_windows=new Object();
  window.status=F_barError;		//clear status line or show error message
  sendMsg(theID ,'Page Loaded', '',  null, true);

  if(parent!=self) {	//In frames
    if(F_NN || !F_MAC) {		//IE Mac
      if(top.setTimeout) {
  //			top.setTimeout("top.frames['"+self.name+"'].F_checkFrameQueue();", 100);	//continue to try to send messages to frames not loaded yet
        top.setTimeout("top.frames['"+self.name+"'].F_checkFrameQueue?top.frames['"+self.name+"'].F_checkFrameQueue():null;", 100);	//continue to try to send messages to frames not loaded yet
      }
    } else {
      setTimeout("F_checkFrameQueue?F_checkFrameQueue():null;", 100);	//continue to try to send messages to frames not loaded yet		
    }
  }
  
  //add a mouseover to all links so as to clear status bar of javascript:void() link display
//	if(!F_NN) {
//		for(var i = 0;i < document.links.length;i++) {
//			if((null == document.links[i].onmouseover)&&(null != document.links[i].onclick)) {
//  				var a = /[^']*'([^']*)'.*/.exec(document.links[i].onclick);  
//				document.links[i].onmouseover = new Function("return(F_e('"+ a[1] +"', F_MV))");
//			}
//		}
//	} else {
//		F_addEventToLinks (document)
//	}
}

//used to add a mouseover to all links so as to clear status bar of javascript:void() link display
function F_addEventToLinks (theHandle) {
  for (var layerNo = 0; layerNo < theHandle.layers.length; layerNo++) {
    docHandle = theHandle.layers[layerNo].document;
    for(var i = 0;i < docHandle.links.length;i++) {  //visit each link in this layer
      if(("undefined" == typeof docHandle.links[i].onmouseover)&&("undefined" != typeof docHandle.links[i].onclick)) {
          var l = docHandle.links[i].onclick + "";
        var t = l.split('"');
        docHandle.links[i].onmouseover = new Function("return(F_e('"+ t[1] +"', F_MV))");
      }
    }
    F_addEventToLinks (docHandle) //handle nested layers
  }
}


function F_paramObject(msg, obj) {
/*
     used to create a parameter object used for custom actions and in action extensions

    element:			the HTML element
    container:		the layer or div containing the element, or null(undefined?) (for layers = style)
    containerStyle:	the containing layer or div.style or null(undefined?)
    id:				the ID of the element
    type:				the 3 letter type code
    objectRef:				reference to javascript object
    childRefs:	array of reference to children (should be children paramObjects?)
    parentRef:		refence to parent javascript object (should be children paramObjects?)
    form:				form containing form element or null (undefined?)
    message:			message object
*/
//	var obj = top.F_curObj;
  if(obj==null) obj=new Object();
  var t = {element:obj.objRef, container:obj.styleDiv,containerStyle:obj.style,id:obj.styleID,type:obj.type,objectRef:obj,childRefs:obj.childObjects,parentRef:obj.parent,form:obj.formRef,message:msg};
//	F_debug(t);
  return(t);
}

/***** Public interface  ************/

//Given an Id return reference to JavaScript object
function F_getReference(id) {
  return(window.document.objectModel[id]);
}

//Send a message to an object
function F_sendMessage(theTargetID, msgText, msgData, theCascade) {
  if(typeof msgData == "object")
    msgData.getParm=F_getParm2;
  return(sendMsg(theTargetID, msgText, msgData,  null, theCascade));
}

/***** End Public interface  ************/

function F_e(theTarget, theEvent) {
//	if(document.F_loaded) {
    var d = document.objectModel[theTarget];
    //alert(theTarget + '  -  ' +theEvent);
    if( !F_NN && !F_DOM_NN && !is_opera && event.srcElement != null) {  //IE		
      var t = event.srcElement.tagName;
      var isFontTag = ( (t=='B') || (t=='I') || (t=='FONT') || (t=='SUB') || (t=='SUP') || (t=='STRIKE') || (t=='U') );
  //		var a = ['B','I','FONT','SUB','SUP','STRIKE','U'];
  //		alert(a[1]);
      if   ( ( document.F_loaded ) && ( event.srcElement )
        &&  !( ( event.srcElement.id == theTarget ) || (event.srcElement.id == theTarget+"LYR") || ( isFontTag ) )
        &&  (d.type!="map" ) && ( d.type!="img" ) && ( d.type!="b" ) )  {		
        //stop event from cascading + workaround for image maps and font tags
        event.cancelBubble = true;
        return(false);
      }
    }
    
    if( navigator.appName != 'Netscape' && !is_opera ) {		
//			event.cancelBubble = true;
      F_ie_setEvent();
    }
        
    if( theEvent == F_MD ) {			//mouse down
      var t = theTarget;			
      if(d.type=="img")
        t = F_clickedOnImage(window.NOFevent.pageX,window.NOFevent.pageY , d).styleID;
//			setTimeout( "F_sndMsg('"+theTarget+"','"+theEvent+"', '');",  1);
      F_sndMsg(t, theEvent, '');
      if(F_MAC)
        return(t!=theTarget);		//return false to deal with Mac drag; true for image map clicks
      else
        return(true)
    }
    
    if(theEvent == F_MU) {			//mouse up		
      //if in drag
      if(document.F_dragLayer != null) {
        for(var i=(document.F_dragLayer.length-1);i>-1;i--) {
          if(document.F_dragLayer) {
            if(document.F_dragLayer[i]) {
              var dObj = document.F_dragLayer[i];
              if(dObj.type == "Until Mouse Up") {
                dObj.layer.endDrag();
              }
            }
          }
        }
      }

      if((document.F_loaded)&&(d.type=="img"))
        theTarget = F_clickedOnImage(window.NOFevent.pageX,window.NOFevent.pageY , d).styleID;
      F_sndMsg(theTarget, theEvent, '');			
      return(true);
    }
    
    if(theEvent == F_MV) {			//mouse over
      if (document.F_loaded) {
        var c = true;
        var d = document.objectModel[theTarget];
        if (typeof d.actions!="undefined") {	//don't show window.status if blank link
          var A = d.actions['Clicked'];					
          if (typeof A!="undefined") {
            for( var i =  0; i < (A.length - 3); i = i + 4) {		
              if(A[i+1]=="Go To")
                c= false;
                    
            }
          }
        }				
        if(c) { //this link is blank
          window.status="";					
          F_sndMsg(theTarget, theEvent, '');
          return(true)
        }
      }
    }
    
    if(theEvent == F_HR) {			//image map click
      F_sndMsg(theTarget, F_CL, '')
      return(void(0));
    }

    F_sndMsg(theTarget, theEvent, '');
    if((typeof document.objectModel != "undefined") && (typeof document.objectModel[theTarget] != "undefined") && 
        (document.objectModel[theTarget].formObj)) return(true);
//		return(msg.returnValue)
    return(false);
//	}
}	

//CLEAR WINDOW STATUS
function F_c() {
  window.status="";
}

function F_n(theTarget, theURL) {
  if(document.F_loaded) {
    F_sndMsg(theTarget, 'Go To', theURL);
  }
  return(false);
}	

function F_sndMsg(theTarget, theEvent, theParm) {
//	if (typeof theFrame!="undefined")
//		sendMsgToFrame(theTarget, theEvent, theParm,  null, false, theFrame);
//	else
    sendMsg(theTarget, theEvent, theParm,  null, false);
}

function F_s(p,l,t,i,v,c) {	
  return("position: " + p + "; left:" + l + "; top:" + t + "; z-index: " + i + "; visibility: " + v + "; clip: rect(" + c + ")");
}	

var F_A = "Abort"; 				//onAbort event
var F_B = "Blur";				//onBlur event
var F_CH = "Change";			//onChange event
var F_CL = "Clicked";			//onClick event
var F_DB = "Double Clicked";	//onClick event
var F_E = "Error";				//onError event
var F_F = "Focus";				//onFocus event
var F_L = "Loaded";				//onLoad event
var F_MT = "Mouse Out";			//onMouseOut event
var F_MV = "Mouse Over";		//onMouseOver event
var F_MU = "Mouse Up";			//onMouseUp event
var F_MD = "Mouse Down";		//onMouseDown event
var F_R = "Reset";				//onReset event
var F_SE = "Select";			//onSelect event
var F_SU = "Submit";			//onSubmit event
var F_U = "Unload";				//onUnload event
var F_HR = "Map";				//image map click

/*
**	F_Parm()  - used to create an object with parameter pairs passed as arguments
*/

function F_Parm() {
  var ob = new Object();
  ob[0] = "parm";
  for(var i=0; i < F_Parm.arguments.length; i = i + 2)
    ob[F_Parm.arguments[i]] = F_Parm.arguments[i+1];
  ob.getParm = F_getParm2;
  return(ob);
}

function F_getParm2(theParamter, theDefault) {
  return(typeof(this[theParamter]) != "undefined"?this[theParamter]:theDefault);
}

/*
**	F_Exp()  - used when the parameter is an expression
*/


function F_Exp(t) {
  var ob = new Object();
  ob[0] = "exp";
  ob[1] = t;
  ob.getParm=F_getParm2;
  return(ob);
}

/*
**	F_Action()  - used for calling actions
*/

function F_Action(theTargetName, msgText, msgData, theCascade) {
  var P = msgData;
  if(typeof P == "object") {
    if (P[0] == "msg") {
      P = sendMsg(P[1], P[2], P[3], null);
    }
    if (P[0] == "exp") {
      var func = new Function("return("+P[1]+")");
      NOFparameters = F_paramObject(msg, top.F_curObj);
      params = NOFparameters;
      var P = func();
      if(typeof P == "undefined") P = new Object();
      if((typeof P == "object")&&(P != null)) P.getParm=F_getParm2;
    }
  }
  var t = sendMsg(theTargetName, msgText, P,  null, theCascade);
  return(t);
}

function F_Msg(a, b, c) {
  var ob = new Array();
  ob[0] = "msg";
  ob[1] = a;
  ob[2] = b;
  ob[3] = c;
  return(ob);
}

function F_OM(objectID, theLayerID, theType, theParent) {
  var parms = F_OM.arguments.length;
  var theHandler = (parms<5) ? null : F_OM.arguments[4];
  var formName = (parms<6) ? "" : F_OM.arguments[5];
  var isRelative = (parms<7) ? false : F_OM.arguments[6];
  var objectName = (parms<8) ? false : F_OM.arguments[7];
  var theValue = (parms<9) ? null : F_OM.arguments[8];
  if(typeof document.objectModel[objectID] != "undefined") 
    F_debug("Duplicate Object ID: " + objectID);  //##### assert
  // create object
  document.objectModel[objectID] = new document.main.cObject(theLayerID, theType, theParent, theHandler, isRelative, objectID, formName, objectName, theValue);
}

function F_OM_Map(objectID, theMapType, theParent, theHandler) {
  F_OM(objectID, "", "map", theParent, theHandler);
  document.objectModel[objectID].maptype = theMapType;
  if(theMapType == "rect") {
    document.objectModel[objectID].map = new F_cRect(F_OM_Map.arguments[4], F_OM_Map.arguments[5], F_OM_Map.arguments[6], F_OM_Map.arguments[7]);
  }
  if(theMapType == "circ") {
    document.objectModel[objectID].map = new Object();
    document.objectModel[objectID].map.x = F_OM_Map.arguments[4];
    document.objectModel[objectID].map.y = F_OM_Map.arguments[5];
    document.objectModel[objectID].map.radius = F_OM_Map.arguments[6];
  }
  if(theMapType == "poly") {
    document.objectModel[objectID].map = new Array(0);
    var index = 0;	
    for(var i=4; i < F_OM_Map.arguments.length; i = i + 2)
      document.objectModel[objectID].map[index++] = new F_cPoint(F_OM_Map.arguments[i], F_OM_Map.arguments[i+1]);
  }
}

// used to add custom commands loaded from JSB file
var F_commandObjects = new Array();
var F_commandCommands = new Array();
var F_commandExpression = new Array();
var F_commandType = new Array();

//called by third party actions to register themselves

function F_addCommand (theObject, theCommand, theExpression) {
  F_commandObjects[F_commandObjects.length] = theObject;
  F_commandCommands[F_commandCommands.length] = theCommand;
  F_commandExpression[F_commandExpression.length] = theExpression;
  F_commandType[F_commandType.length] = "obj";
}

//called by components to register actions for a specific ID

function F_addCommandForID (theID, theCommand, theFunction) {
  F_commandObjects[F_commandObjects.length] = theID;
  F_commandCommands[F_commandCommands.length] = theCommand;
  F_commandExpression[F_commandExpression.length] = theFunction;
  F_commandType[F_commandType.length] = "id";
}

// 	called after page loads to finish adding actions registered with
//		F_addCommand and F_addCommandForID

function F_addCommandCallback () {
  for(var j=0; j < F_commandObjects.length; j++) {
    var cmd = F_commandCommands[j];
    var exp = F_commandExpression[j];
    var obj = F_commandObjects[j];
    if(F_commandType[j] == "obj") {
      var a =  obj.split(",");
      for(var i=0; i < a.length; i++) {
        if( typeof document.main.commands[a[i]]  != "undefined")
          document.main.commands[a[i]][cmd] = exp;
        if(a[i] == "vis") {
          var b = new Array ("img","txt","lyr","nav","tbl","jbn");
          for (var k = 0; k < b.length; k++) {
            document.main.commands[b[k]][cmd] = exp;	
          }	
        }	
      }
    } else {  //id type, used by components
      if(typeof document.objectModel[obj].actions=="undefined") document.objectModel[obj].actions = new Object();		
      var act = document.objectModel[obj].actions;
      if(typeof act[cmd]=="undefined") act[cmd] = new Array();
      act[cmd] = act[cmd].concat([exp,'','',0]);
    }
  }
}

//returns reference to current frame

function F_getFrameRef() {
  var t =	'';
//	if(parent!=self) {	//In frames
    var f = self;
    while(f!=top) {
      t=".frames['"+f.name+"']"+t;
      f = f.parent;
    }
    t="top"+t;
//	}
  return(t);
}


function F_setTimeout(timeoutTest, textRef, functionName, theDelay) {
  if( F_NN || !F_MAC ) {	//not IE Mac
    if( top.setTimeout ) {			
      var r = top.setTimeout(timeoutTest+'?'+textRef + '.' + functionName+':null;',  theDelay);	
    }
  } else {
    var r = setTimeout(textRef + '.' + functionName,  theDelay);
  }
  return(r);

/*
  if(parent!=self) {	//In frames
    if((F_NN || !F_MAC)) 
      return(top.setTimeout(F_getFrameRef()+functionName, theDelay));
    else //IE mac
      return(setTimeout(functionName, theDelay));
  } else {
    return(setTimeout( functionName, theDelay));
  }
*/
}

function F_setInterval(timeoutTest, textRef, functionName, theDelay) {
  if(F_NN || !F_MAC) {		//not IE Mac
    if(top.setTimeout) {
      var r = top.setInterval(timeoutTest+'?'+textRef + '.' + functionName+':null;',  theDelay);
    }
  } else {
    var r = setInterval(textRef + '.' + functionName,  theDelay);
  }
  return(r);
}

function F_onLoaded(){
  // we can thank Netscape for this uglyness :~) and don't even ask me why

  window.F_doLoaded = F_doLoaded;

  if(parent!=self) {	//In frames
    if((F_NN || !F_MAC)) {
      return(top.setTimeout(F_getFrameRef() + '.F_doLoaded();', 100));
    } else { //IE mac
      return(setTimeout('window.F_doLoaded();', 100));
    }
  } else {
    return(setTimeout( 'window.F_doLoaded();', 100));
  }
}

document.F_debugEnabled = false;

function F_debug(m) {
  if(document.F_debugEnabled){
  //	alert(m);
    F_barError = '**** ERROR **** ' + m
    window.status = F_barError;
    window.defaultStatus = F_barError;
  }
}
