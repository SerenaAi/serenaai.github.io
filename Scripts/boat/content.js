    function Content(physics)
    {	
        this.canvas = document.getElementById("content");
    	this.context = this.canvas.getContext("2d");
        this.doWrite=false;
        this.doDraw=false;
        this.doDrawEx=false;   
        this.bDraw=false;         
        this.alpha=0;

  	};
  	Content.prototype.drawEx = function() 
    {   
        if(this.doDrawEx==true)
        {
        	this.context.save();
      		this.context.drawImage(han_img ,physics.boat.position().x, physics.boat.position().y-50); //img:80,50
      		this.context.restore(); 
            this.doDrawEx=false;
      	}   
    };
    Content.prototype.black=function()
    {       
    	     physics.box_context.fillStyle = "rgba(0, 0, 0, " + this.alpha + ")";
             physics.box_context.fillRect(0,0, width, height);
            if (this.alpha < 1) 
            {
                this.alpha = this.alpha + 0.12;
            }
    
    }
    Content.prototype.white=function()
    {
    	    physics.box_context.fillStyle = "rgba(0, 0, 0, " + this.alpha + ")";
             physics.box_context.fillRect(0,0, width, height);
            if (this.alpha > 0) 
            {
                this.alpha = this.alpha - 0.12;
            }
    }
    Content.prototype.write = function() 
    {   
        this.context.clearRect(0,0,width,height);
        if(this.doWrite==true)
        {
       		this.context.fillText(this.text, width/2, 170);   
            this.context.fillText(this.text2, width/2, 220);
            this.doWrite=false;
        } 
    };
    Content.prototype.draw = function() 
    {   
        if(this.doDraw==true)
        {
            this.context.save();
      	    this.context.drawImage(this.img ,this.w ,this.h ); //img:80,50
      	    this.context.restore();    
            this.doDraw=false;
        } 
    };
    Content.prototype.bgDraw = function(w,h) 
    {   
        if(this.bDraw==true)
        {
            physics.box_context.save();
      	    physics.box_context.drawImage(fr_img ,(width-150)/2 ,height*2/3-150/2 ); //img:150,150
      	    physics.box_context.restore();    

            physics.bgcontext.save();
      	    physics.bgcontext.drawImage(paint ,(width-122)/2 ,height*2/3-130/2 ); //img:122,122
      	    physics.bgcontext.restore();    
        } 
    };

     Content.prototype.changeLayer = function()
     { 
         var self=this;
         physics.box_canvas.style.zIndex="3";
         self.canvas.style.zIndex="4";
     };
     

    Content.prototype.setText = function(t1,t2,c)
     { 
         this.text=t1;
         this.text2=t2;
         this.context.fillStyle = c;
         this.context.font="17px Verdana"; 
         this.context.textAlign="center"; 
     };        
     Content.prototype.setPic = function(img,w,h)
     { 
		this.img=img;
		this.w=w;
		this.h=h;
     }; 


     Content.prototype.setContent= function(duration)
     {	         
         this.write();        
         this.draw(); 
         this.bgDraw();        
         this.drawEx();
         
         
      this.trans=function()
      {          	
          var mat22=new b2Mat22();
          mat22.Set(0);   

          physics.box.body.SetTransform(   new b2Transform( new b2Vec2(width/2/physics.scale,(height*2)/3/physics.scale), mat22)  );
          physics.box.body.SetLinearVelocity(new b2Vec2(0,0));
          for (var b = physics.world.GetBodyList(); b; b = b.GetNext())
      	  if (b.GetType() == b2Body.b2_dynamicBody) 
      		{			
    			var fl = b.GetFixtureList();
   				var shape=fl.GetShape();
				if (shape.GetType() == 0)
				{         
					if(b.GetUserData().constructor===Water)
					{
	    				b.SetTransform(   new b2Transform( new b2Vec2(width/2/physics.scale,(height*2+140)/3/physics.scale), mat22)  );
      	 				b.SetLinearVelocity(new b2Vec2(0,0));
      	 			}
  				}	
  			}	

             	physics.boat.body.SetTransform( new b2Transform( new b2Vec2(width/2/physics.scale,(height+100)/2/physics.scale), mat22)  );
         	 	physics.boat.body.SetLinearVelocity(new b2Vec2(0,0));
             }
        
     	 physics.doListen=true;

     }