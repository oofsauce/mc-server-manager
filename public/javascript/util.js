const timeTransforms = [
    [60, 'second'], 
    [60, 'minute'], 
    [24, 'hour'], 
    [7, 'day'], 
    [31, 'week'], 
    [12, 'month'],  // fuck months
    [10000000, 'year'], 
];

const parseTime = t => {
    let curTrans = 0;
    while(true) {
        if(t >= timeTransforms[curTrans][0]) {
            t /= timeTransforms[curTrans][0];
            curTrans += 1
        } else {
            t = Math.round(t)
            return t + ' ' + timeTransforms[curTrans][1] + ((t > 1) ? 's' : '');
        }
            
    }
}