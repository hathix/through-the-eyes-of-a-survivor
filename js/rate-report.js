/**
 * Shows the change in sexual assault rates over time.
 * Has no data, needs to be updated to do anything
 */
RateReport = function(_parentElement) {
  this.parentElement = _parentElement;
  this.data = null;

  this.margin = {
    top: 40,
    right: 30,
    bottom: 60,
    left: 60
  };
  this.width = 500 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;

  this.initVis();
}

RateReport.prototype.initVis = function() {
  var vis = this;
};

/**
 * _data contains an array of:
 *  type {String}
 *  change {Float}
 */
RateReport.prototype.updateVis = function(_data) {
  var vis = this;
  vis.data = _data;

  // TODO properly draw bars or at least percentages for each item here
  $('#' + vis.parentElement).html(vis.data[0].type + ":" + vis.data[0].change);

  vis.data = _data;

};
