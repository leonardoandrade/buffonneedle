//worker for the buffon needle object
importScripts("BuffonNeedle.js")
var stopped=false;

var buffon_needle_object=undefined;
var number_of_needles=undefined;
var REFRESH_RATE=500;

function initialize(width, height, number_of_strips, _number_of_needles)
{
    number_of_needles=_number_of_needles;
    buffon_needle_object=new BuffonNeedle();
    buffon_needle_object.init(width, height, number_of_strips, _number_of_needles);
    self.postMessage({"cmd": "clear_canvas"});
    self.postMessage({"cmd": "draw_strips", 'strips': buffon_needle_object.getStrips()});
}

//run loop
function run()
{   var count=0;
    var tmp=new Array();
    while(stopped==false && buffon_needle_object.getNumberNeedles()<number_of_needles)
    {
       
       needle=buffon_needle_object.addRandomNeedle();
       tmp.push(needle);
       
       if(count%REFRESH_RATE==0)
       {
           buffon_needle_object.computePI();
           self.postMessage({"cmd": "draw_needles", 'needles': tmp});
           self.postMessage({"cmd": "set_results", 'pi': buffon_needle_object.getPI(), 'number_needles':count, 'number_hits':buffon_needle_object.getNumberHits() });
           tmp=new Array();
       }

       
       count++;
    }
    buffon_needle_object.computePI();
    self.postMessage({"cmd": "draw_needles", 'needles': tmp});
    self.postMessage({"cmd": "set_results", 'pi': buffon_needle_object.getPI(), 'number_needles':count, 'number_hits':buffon_needle_object.getNumberHits() });
    
}

self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':

      initialize(data.width, data.height, data.number_of_strips, data.number_of_needles);
      run();
      break;
    case 'pause':
    buffon_needle_object=undefined;
      stopped=true;
      break;
    case 'resume':
        stopped=false;
        run();
        break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);


