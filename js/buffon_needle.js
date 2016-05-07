/*class for Buffon's needle implementation*/

var BuffonNeedle = function (_width, _height, _number_of_strips, _numberMeasurements) {

    this.strips = [];
    this.width = _width;
    this.height = _height;
    this.numberMeasurements = _numberMeasurements;
    this.interval = this.width / (_number_of_strips - 1);
    for (var i = 0; i < _number_of_strips; i++) {
        this.strips.push({
            x0: this.interval * (i) + (this.interval / 2),
            y0: 0 - this.interval,
            x1: this.interval * (i) + (this.interval / 2),
            y1: this.height + this.interval
        });
    }

    this.needles = [];
    this.needleLength = this.interval / 3;
    this.currentTotalNeedles = 0;
    this.currentTotalHits = 0;
}

BuffonNeedle.prototype.run = function () {
    for (var i = 0; i < this.numberMeasurements; i++) {
        this.addRandomNeedle();
    }
}

BuffonNeedle.prototype.getStrips = function()
{
    return this.strips;
}


BuffonNeedle.prototype.getNumberNeedles = function()
{
    return this.needles.length;
}

BuffonNeedle.prototype.getNumberHits = function()
{
    return this.currentTotalHits;
}

BuffonNeedle.prototype.computePI = function () {

    /*compute PI */
    var total_needles = this.needles.length;
    var hits = 0;
    for (var i = 0; i < this.needles.length; i++) {
        if (this.needles[i].intersects_strip) {
            hits++;
        }
    }
    //prob = (hits + this.currentTotalHits) / (total_needles + this.currentTotalNeedles);

    this.PI = ((2 * this.needleLength * total_needles) / (hits * this.interval));

    this.currentTotalNeedles = total_needles;
    this.currentTotalHits = hits;
    //this.needles = [];
};

BuffonNeedle.prototype.getPI = function () {
    return this.PI;
};


BuffonNeedle.prototype.addRandomNeedle = function () {
    //random_x=(this.needleLength/2)+Math.floor((Math.random()*(this.width-this.needleLength)));
    var random_x = Math.random() * this.width;
    var random_y = Math.random() * this.height;

    var angle = (Math.random() * Math.PI);

    //to the rotation by points in origin
    var _tmp_x0 = this.needleLength / 2;
    var _tmp_y0 = 0;

    var rot_x0 = (_tmp_x0 * Math.cos(angle)) - (_tmp_y0 * Math.sin(angle));
    var rot_y0 = (_tmp_x0 * Math.sin(angle)) + (_tmp_y0 * Math.cos(angle));

    var x0 = rot_x0 + random_x;
    var y0 = rot_y0 + random_y;

    var x1 = random_x - (x0 - random_x);
    var y1 = random_y - (y0 - random_y);

    var needle = {x0: x0, y0: y0, x1: x1, y1: y1, intersects_strip: false};
    for (var i = 0; i < this.strips.length; i++) {
        if (GEOM_UTILS.linesIntersect(this.strips[i], needle)) {
            needle.intersects_strip = true;
            break;
        }
    }
    this.needles.push(needle);
    //alert("random_x:"+random_x+" random_y:"+random_y+" rotation angle:"+angle+ "points:"+x0+" "+y0+" "+x1+" "+y1+" ");

    return needle;
};

BuffonNeedle.prototype.averageNeedleLength = function () {
    var sum = 0.0;
    for (var i = 0; i < this.needles.length; i++) {
        l = this.needles[i];
        len = Math.sqrt(Math.pow(l.x1 - l.x0, 2) + Math.pow(l.y1 - l.y0, 2));
        sum += len;
    }
    return sum / this.needles.length;
};


BuffonNeedle.prototype.averageXDiff = function () {
    var sum = 0.0;
    for (var i = 0; i < this.needles.length; i++) {
        sum += Math.abs(this.needles[i].x1 - this.needles[i].x0);
    }
    return sum / this.needles.length;
};


BuffonNeedle.prototype.averageYDiff = function () {
    var sum = 0.0;
    for (var i = 0; i < this.needles.length; i++) {
        sum += Math.abs(this.needles[i].y1 - this.needles[i].y0);
    }
    return sum / this.needles.length;
};

BuffonNeedle.prototype.dump = function () {
    ret = "";
    ret += " width:" + this.width + " heigth:" + this.height + " number strips:" + this.strips.length + " number needles:" + this.needles.length + "\n";
    ret += " official needle length: " + this.needleLength + ", computed needle length:" + this.averageNeedleLength() + "average X diff:"+ this.averageXDiff() + "average Y diff:"+ this.averageYDiff();
    return ret;
};
