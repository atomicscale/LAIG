function MyPatch(scene, args) {
    this.args = args || [
        1, 2, 20, 20, [
            [1, 1, 1],
            [1, -1, 1],
            [-1, 1, 1],
            [1, 1, -1]
        ]
    ];

    this.orderU = this.args[0];
    this.orderV = this.args[1];
    this.partsU = this.args[2];
    this.partsV = this.args[3];
    this.cps = this.getControlPoints(this.args[4]);
    var knot1 = this.getKnots(this.orderU);
    var knot2 = this.getKnots(this.orderV);

    var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knot1, knot2, this.cps);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, this.partsU, this.partsV);
}

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getControlPoints = function(CPList) {
    var finalList = [];
    for (var Uorder = 0; Uorder <= this.orderU; ++Uorder) {
        var vList = [];
        for (var Vorder = 0; Vorder <= this.orderV; ++Vorder) {
            var index = Uorder * (this.orderV+1) + Vorder;
            vList.push(CPList[index]);
        }
        finalList.push(vList);
    }

    return finalList;
};

MyPatch.prototype.getKnots = function(orders) {
    var knot = [];
    for (var i = 0; i < orders+1; ++i)
        knot.push(0);
    for (var i = 0; i < orders+1; ++i)
        knot.push(1);

    return knot;
};

MyPatch.prototype.updateTex = function(ampS, ampT) {};