function RandomColorHex()
{
    var lightness=220;
    var r=Math.floor((Math.random()*(256-lightness))+lightness).toString(16);
    var g=Math.floor((Math.random()*(256-lightness))+lightness).toString(16);
    var b=Math.floor((Math.random()*(256-lightness))+lightness).toString(16);
    var ret="#"+r+g+b;
    return ret;
}
