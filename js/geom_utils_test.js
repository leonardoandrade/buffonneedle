/*include file by reading and eval'ing*/
var fs = require('fs');
eval(fs.readFileSync('geom_utils.js')+'');

var assert = require('assert');

describe('test intersection', function(){
    it('crossing lines should return true',function(){
        var fixtures = [
            [
                {
                    x0: 1,
                    y0: 1,
                    x1: 5,
                    y1: 5
                },
                {
                    x0: 2,
                    y0: 0,
                    x1: 2,
                    y1: 5

                }
            ],
            [
                {
                    x0: 0,
                    y0: 7,
                    x1: 7,
                    y1: 0
                },
                {
                    x0: 0,
                    y0: 0,
                    x1: 100,
                    y1: 100

                }
            ]
        ];
        for(var i=0; i<fixtures.length; i++){
            assert(GEOM_UTILS.linesIntersect(fixtures[i][0],fixtures[i][1]));
        }
    });


    it('parallel lines should return false',function(){
        var fixtures = [
            [
                {
                    x0: 1,
                    y0: 1,
                    x1: 5,
                    y1: 5
                },
                {
                    x0: 2,
                    y0: 2,
                    x1: 6,
                    y1: 6

                }
            ],
            [
                {
                    x0: 0,
                    y0: 0,
                    x1: 10,
                    y1: 0
                },
                {
                    x0: 1,
                    y0: 1,
                    x1: 10,
                    y1: 1

                }
            ]
        ];
        for(var i=0; i<fixtures.length; i++){
            assert(!GEOM_UTILS.linesIntersect(fixtures[i][0],fixtures[i][1]));
        }
    });
});
