/*is counterclocwise?*/
function ccw(x1, y1, x2, y2, x3, y3)
{

    return (y3 - y1) * (x2 - x1) > (y2 - y1) * (x3 - x1);

} 

/* check intersection of lines */
function linesIntersect( seg1, seg2 )
{

    if (ccw(seg1.x0, seg1.y0, seg2.x0, seg2.y0, seg2.x1, seg2.y1) != ccw(seg1.x1, seg1.y1, seg2.x0, seg2.y0, seg2.x1, seg2.y1)&& ccw(seg1.x0, seg1.y0, seg1.x1, seg1.y1, seg2.x0, seg2.y0) != ccw(seg1.x0, seg1.y0, seg1.x1, seg1.y1, seg2.x1, seg2.y1))
    {

        return true;
    }
    return false;

}

/*class for Buffon's needle implementation*/
function BuffonNeedle()
{

    var strips;
    var needleLength;
    var needles;
    var width;
    var height;
    var interval;
    var numberMeasurements;
    var currentTotalNeedles;
    var currentTotalHits;
    
    this.init=function(_width, _height, _number_of_strips, _numberMeasurements)
    {
    
        this.strips=new Array();
        this.width=_width;
        this.height=_height;
        this.numberMeasurements=_numberMeasurements;
        this.interval=this.width/(_number_of_strips-1);
        for(var i =0; i< _number_of_strips;i++)
        {     
           this.strips.push({x0:this.interval*(i)+(this.interval/2), y0:0-this.interval, x1: this.interval*(i)+(this.interval/2) , y1:this.height+this.interval});
        }
        

        this.needles=new Array();
        this.needleLength=this.interval/3;
        this.currentTotalNeedles=0;
        this.currentTotalHits=0;

    }
    
    this.run=function()
    {
        //this.drawStripsToCanvas();
        for(var i=0; i<this.numberMeasurements; i++)
        {
            needle=this.addRandomNeedle();
            this.drawNeedleToCanvas(needle);
        }
        
        //this.checkIntersections();
    }
    
    
    
    this.computePI=function()
    {
    

        total_needles=this.needles.length;
        hits=0;
        for(var i =0;i<this.needles.length; i++)
        {
            if(this.needles[i].intersects_strip)
            {
                hits++;
            }
        }
        prob=(hits+this.currentTotalHits)/(total_needles+this.currentTotalNeedles);
        
        this.PI=((2*this.needleLength)/(prob*this.interval));
        
        this.currentTotalNeedles+=total_needles;
        this.currentTotalHits+=hits;
        this.needles=new Array();
        //this.PI=2*total_needles/hits;
    }
    
    this.getPI=function()
    {
        return this.PI;
    }
    
    this.getNumberStrips=function()
    {
        return this.strips.length;
    }
    
    this.getNumberNeedles=function()
    {
       return this.needles.length+this.currentTotalNeedles; 
    }
    this.getNumberHits=function()
    {
       return this.currentTotalHits;
    }
    
    this.getStrips=function()
    {
        return this.strips;
    }
    
    this.addRandomNeedle=function()
    {
        //random_x=(this.needleLength/2)+Math.floor((Math.random()*(this.width-this.needleLength)));
        random_x=Math.random()*this.width;
        random_y=Math.random()*this.height;
        
        var angle = (Math.random()*Math.PI)-1.570796327;
        
        //to the rotation by points in origin
        _tmp_x0=this.needleLength/2;
        _tmp_y0=0;
                   
        rot_x0=(_tmp_x0*Math.cos(angle)) - (_tmp_y0*Math.sin(angle));
        rot_y0=(_tmp_x0*Math.sin(angle)) + (_tmp_y0*Math.cos(angle));
        
        x0=rot_x0+random_x;
        y0=rot_y0+random_y;
        
        x1=random_x-(x0-random_x);
        y1=random_y-(y0-random_y);
        rotation=undefined;
        /*
        if(x0<0 || y0<0 || x1<0 || y1 < 0)
        {
            return this.addRandomNeedle();
        }
        
        if(x0>this.width || y0>this.height || x1>this.width || y1>this.height )
        {
            return this.addRandomNeedle();
        }
        */
        
        needle={x0:x0, y0:y0, x1:x1, y1:y1, intersects_strip: false};
        for(var i=0; i<this.strips.length;i++)
        {
            if(linesIntersect(this.strips[i],needle))
            {
                needle.intersects_strip=true;
            }
        }
        this.needles.push(needle);
        //alert("random_x:"+random_x+" random_y:"+random_y+" rotation angle:"+angle+ "points:"+x0+" "+y0+" "+x1+" "+y1+" ");
        return needle;
        
    }
    
    
    this.checkIntersections=function()
    {
        for(var i=0; i<this.strips.length; i++)
        {
            for(var j=0; j<this.needles.length; j++)
            {
                if(linesIntersect(this.strips[i],this.needles[j]))
                {
                       this.needles[j].intersects_strip=true;
                }
                
            }
        }
    }
    
    
    
    this.drawToCanvas=function(canvas_object)
    {
        canvas_object.height=this.height;
        canvas_object.width=this.width;
        
        var context = canvas_object.getContext("2d");
        context.beginPath();
        for(var i=0; i<this.strips.length;i++)
        {  
            context.moveTo(this.strips[i].x0, this.strips[i].y0);
            context.lineTo(this.strips[i].x1, this.strips[i].y1);
            context.lineWidth = 2;
            context.strokeStyle = "#999999";
        }
        context.stroke();
        

        for(var i=0; i<this.needles.length;i++)
        {  
            //alert(this.needles[i].x0);
            context.beginPath();
            context.moveTo(this.needles[i].x0, this.needles[i].y0);
            context.lineTo(this.needles[i].x1, this.needles[i].y1);
            context.lineWidth = 1;
            if(this.needles[i].intersects_strip==true)
            {
                context.strokeStyle = "#ff0000";
            }
            else
            {
                context.strokeStyle = "#00FF00";
            }
            context.stroke();
        }
       
        //canvas_object.setAttribute(height,this.height);
    }
    
    
    this.averageNeedleLength=function()
    {
        var sum=0.0;
        for(var i=0; i<this.needles.length; i++)
        {   
            l=this.needles[i];
            len=Math.sqrt(Math.pow(l.x1-l.x0,2)+Math.pow(l.y1-l.y0,2));
            sum+=len;
        }
        return sum/this.needles.length;
    }
    
    
    
    this.dump=function()
    {
        ret="";
        ret+=" whidth:"+this.width+" heigth:"+this.height+" number strips:"+this.strips.length+" number needles:"+this.needles.length+" first needle: ["+this.needles[0].x0+" "+this.needles[0].y0+" "+this.needles[0].x1+" "+this.needles[0].y1+"]\n";
        ret+=" official needle length: "+this.needleLength+", computed needle length:"+this.averageNeedleLength();
        return ret;
    }
}
