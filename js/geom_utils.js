/*
 * GEOM_UTILS: module for spatial computations
 */

var GEOM_UTILS = GEOM_UTILS || {};

/* is it counterclockwise?*/
GEOM_UTILS.ccw = function(x1, y1, x2, y2, x3, y3)  {
    return (y3 - y1) * (x2 - x1) > (y2 - y1) * (x3 - x1);

}

/* check intersection of lines */
GEOM_UTILS.linesIntersect = function( seg1, seg2 )  {
    if(GEOM_UTILS.ccw(seg1.x0, seg1.y0, seg2.x0, seg2.y0, seg2.x1, seg2.y1) != GEOM_UTILS.ccw(seg1.x1, seg1.y1, seg2.x0, seg2.y0, seg2.x1, seg2.y1)&& GEOM_UTILS.ccw(seg1.x0, seg1.y0, seg1.x1, seg1.y1, seg2.x0, seg2.y0) != GEOM_UTILS.ccw(seg1.x0, seg1.y0, seg1.x1, seg1.y1, seg2.x1, seg2.y1))
    {

        return true;
    }
    return false;
}