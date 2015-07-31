var worker;
var canvas_width;
var canvas_height;


//preload the images to array


var images=[new Image(), new Image()];
images[0].src='img/wood1.jpg';
images[1].src='img/wood2.jpg';

function restart_worker() {

    canvas_height=document.body.clientHeight-200;
    canvas_width=document.body.clientWidth-200;
    var canvas=document.getElementById("theCanvas");
    canvas.width=canvas_width;
    canvas.height=canvas_height;
    //position of divs:
    var div_pi=document.getElementById("div_pi");
    div_pi.style.left= document.body.clientWidth/2-Math.min(300,document.body.clientWidth/2);
    div_pi.style.position= 'relative';
    var div_tosses=document.getElementById("div_tosses");
    div_tosses.style.left= document.body.clientWidth/2-Math.min(300,document.body.clientWidth/2);
    div_tosses.style.position= 'relative';


    // initialize worker and message passing

    if(worker!=undefined)
    {
        worker.terminate();
    }
    worker = new Worker('./js/buffon_needle_worker_script.js');
    worker.addEventListener('message', function(e) {
        switch(e.data.cmd)
        {
            case 'clear_canvas':
                var canvas=document.getElementById("theCanvas");
                canvas.width = canvas.width+0;
                canvas.height = canvas.height+0;
                break;
            case 'draw_strips':
                draw_strips_to_canvas(e.data.strips);
                break;
            case 'draw_needles':
                draw_needles_to_canvas(e.data.needles);
                break;
            case 'set_results':
                //alert(document.getElementById('span_pi'));
                document.getElementById('div_pi_content').innerHTML=e.data.pi;
                document.getElementById('span_tosses_numerator').innerHTML=e.data.number_hits;
                document.getElementById('span_tosses_denominator').innerHTML=e.data.number_needles;
                break;
        }


    }, false);
    start_worker();

}


/*draws the strips to canvas */
function draw_strips_to_canvas(strips)
{


    var canvas=document.getElementById("theCanvas");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.drawImage(images[0], 0,0, strips[0].x1,strips[0].y1);
    for(var i=1; i<strips.length;i++)
    {
        context.drawImage(images[i%2], strips[i-1].x0, strips[i-1].y0 , strips[i].x0-strips[i-1].x0,strips[i].y1-strips[i].y0);
    }

    for(var i=0; i<strips.length;i++)
    {
        context.moveTo(strips[i].x0, strips[i].y0);
        context.lineTo(strips[i].x1, strips[i].y1);
        context.lineWidth = 0.5;
        context.strokeStyle = "#000000";


    }
    context.stroke();
}

function draw_needles_to_canvas(needles)
{
    var canvas=document.getElementById("theCanvas");
    var context = canvas.getContext("2d");
    for(var i=0; i< needles.length; i++)
    {
        var needle=needles[i];
        context.beginPath();
        context.moveTo(needle.x0, needle.y0);
        context.lineTo(needle.x1, needle.y1);
        context.lineWidth = 0.5;
        if(needle.intersects_strip==true)
        {
            context.strokeStyle = "#FFFFFF";
        }
        else
        {
            context.strokeStyle = "#AAAAAA";
        }
        context.stroke();
    }
}


function start_worker()
{


    var number_of_strips=document.getElementById('input_strips').value;
    var number_of_needles=document.getElementById('input_needles').value;

    worker.postMessage({'cmd': 'start', 'width':canvas_width, 'height':canvas_height, 'number_of_strips': number_of_strips, 'number_of_needles': number_of_needles });


}
function debug()
{
    alert(bf.dump());
}

restart_worker();
//window.onload = function() {

//}