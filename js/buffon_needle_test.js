/*include files by reading and eval'ing*/
var fs = require('fs');
eval(fs.readFileSync('geom_utils.js')+'');
eval(fs.readFileSync('buffon_needle.js')+'');


var assert = require('assert');

describe('buffon needle', function(){
    this.timeout(5000000);
    it('object creation and 100 needles should work',function() {

        var sum=0.0, samples = 1000000, count=0;
        for(var i=0; i<samples; i++) {
            var bn = new BuffonNeedle(300, 300, 10, 10);
            bn.run();
            //console.log(bn.dump());
            bn.computePI();

            console.log("PI: " + bn.getPI());
            if(bn.getPI()!=Infinity) {
                sum = sum + bn.getPI();
                count++;

            }
        }
        console.log("total: ",sum/count)
    });

    it('on new needle event should be fired', function() {


        var bn = new BuffonNeedle(300, 300, 10, 1000);
        var needle_count = 0;
        bn.setHandlerOnNewNeedle(function(needle){
                //console.log(needle);
                needle_count++;
            }
        );
        bn.run();

        assert(needle_count == 1000)

    });
});



