/*

A list of terms, where the size and color of each term is determined
by a number (typically numebr of times it appears in some text).
Uses the Google Visalization API.

Data Format
  First column is the text (string)
  Second column is the weight (positive number)
  Third optional column ia a link (string)

Configuration options:
  target Target for link: '_top' (default) '_blank'

Methods
  getSelection

Events
  select

*/

TermCloud = function(container) {
  this.container = container;
}

TermCloud.MIN_UNIT_SIZE = 1;
TermCloud.MAX_UNIT_SIZE = 7;
TermCloud.RANGE_UNIT_SIZE = TermCloud.MAX_UNIT_SIZE - TermCloud.MIN_UNIT_SIZE;

TermCloud.nextId = 0;

TermCloud.prototype.draw = function(data, options) {

  var cols = data.getNumberOfColumns();
  var valid = (cols >= 2 && cols <= 3 && data.getColumnType(0) == 'string' &&
      data.getColumnType(1) == 'number');
  if (valid && cols == 3) {
    valid = data.getColumnType(2) == 'string';
  }

  if (!valid) {
    this.container.innerHTML = '<span class="term-cloud-error">TermCloud Error: Invalid data format. First column must be a string, second a number, and optional third column a string</span>';
    return;
  }

  options = options || {};
  var linkTarget = options.target || '_top';

  // Compute frequency range
  var minFreq = 999999;
  var maxFreq = 0;
  for (var rowInd = 0; rowInd < data.getNumberOfRows(); rowInd++) {
    var f = data.getValue(rowInd, 1);
    if (f > 0) {
      minFreq = Math.min(minFreq, f);
      maxFreq = Math.max(maxFreq, f);
    }
  }

  if (minFreq > maxFreq) {
    minFreq = maxFreq;
  }
  if (minFreq == maxFreq) {
    maxFreq++;
  }
  var range = maxFreq - minFreq;
  range = Math.max(range, 4);

  var html = [];
  var id = TermCloud.nextId++;
  html.push('<div class="term-cloud">');
  for (var rowInd = 0; rowInd < data.getNumberOfRows(); rowInd++) {
    var f = data.getValue(rowInd, 1);
    if (f > 0) {
      var text = data.getValue(rowInd, 0);
      var link = cols == 3 ? data.getValue(rowInd, 2) : null;
      var freq = data.getValue(rowInd, 1);
      var size = TermCloud.MIN_UNIT_SIZE +
           Math.round((freq - minFreq) / range * TermCloud.RANGE_UNIT_SIZE);
      html.push('<a class="term-cloud-link" href="', (link || '#'), '" id="_tc_', id, '_', rowInd , '"');
      if (link) {
        html.push(' target="', linkTarget, '"');
      }
      html.push('>');
      html.push('<span class="term-cloud-', size, '">');
      html.push(this.escapeHtml(text));
      html.push('</span>');
      html.push('</a>');
      html.push(' ');
    }
  }
  html.push('</div>');

  this.container.innerHTML = html.join('');
  
  // Add event listeners
  var self = this;
  for (var rowInd = 0; rowInd < data.getNumberOfRows(); rowInd++) {
    var f = data.getValue(rowInd, 1);
    if (f > 0) {
      var text = data.getValue(rowInd, 0);
      var link = cols == 3 ? data.getValue(rowInd, 2) : null;
      var anchor = document.getElementById('_tc_' + id + '_' + rowInd);
      anchor.onclick = this.createListener(rowInd, !!link);
    }
  }
};

TermCloud.prototype.createListener = function(row, hasLink) {
  var self = this;
  return function() { 
    self.selection = [{row: row}];
    google.visualization.events.trigger(self, 'select', {});
    return hasLink;
  }
};

TermCloud.prototype.selection = [];

TermCloud.prototype.getSelection = function() {
  return this.selection;
};

TermCloud.prototype.escapeHtml = function(text) {
  if (text == null) {
    return '';
  }
  return text.replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;').
      replace(/"/g, '&quot;');
};
