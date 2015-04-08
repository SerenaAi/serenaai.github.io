	var water_img = createImage("water.png");
	var boat_img = createImage("boat3.png");
	var glass_img = createImage("glass3.png");
    var han_img=createImage("han.png");

	function createImage(url)
	{
	    var image = new Image();
	    image.src="Scripts/boat/image/"+url;    
	    return image;
	}
	
	
    var width=500;
   	var height=400;

    var startTime,endTime,duration;
    var end=false;
    
    var physics = new Physics();
	var content;

    function Loop() 
    {         	
 	    endTime=new Date().getTime();        
        duration= (endTime-startTime)/1000;

        physics.debug();
        physics.update();	

 		if(end==false){
        	content.setContent(duration);
    	}    		
    	requestAnimationFrame(Loop);
    	
  	};
	function init()
  	{	
  	(function() { var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
 					  window.requestAnimationFrame = requestAnimationFrame;})(); 
 					  
 					  
  	    physics = new Physics(); 	    
 	    content=new Content(physics);
  	    physics.addBody();       
  	    physics.buoyancy();
  	    physics.drag();
  	    startTime=new Date().getTime();
  	    requestAnimationFrame(Loop);
 	}


