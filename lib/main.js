var $ = require('jquery');
var ics = require('ical.js');

function makeTwoDigits(num) {
  return num <= 9 ? "0" + num.toString() : num.toString();
}

function formatDate(date) {
  var year = date.getUTCFullYear();
  var month = makeTwoDigits(date.getUTCMonth() + 1); // Because months are zero based
  var day = makeTwoDigits(date.getUTCDay());
  return year + '-' + month + '-' + day;
}

function duration(d) {
  return d.toSeconds() / 60; // minutes
}

// Main Function
module.exports = function(tableau) {
  var connector = tableau.makeConnector();
  connector.getColumnHeaders = function() {
    var fields = {
      'summary': 'string',
      'details': 'string',
      'duration': 'float',
      'endDate': 'date',
      'startDate': 'date',
      'id': 'string'
    };
    var fieldNames = [];
    var fieldTypes = [];

    for(var k in fields) {
      fieldNames.push(k);
      fieldTypes.push(fields[k]);
    }
    tableau.headersCallback(fieldNames, fieldTypes);
  };

  connector.getTableData = function (lastRecordToken) {
    var dataToReturn = [];
    var lastRecordToken = 0;
    var hasMoreData = false;
    $.get(tableau.connectionData, function (data) {
      var componentData = new ics.Component(ics.parse(data));
      var events = componentData.getAllSubcomponents('vevent').map( function (x) { return new ics.Event(x); });
      var dataToReturn = events.map(function (v) {
        return {
          'summary': v.summary,
          'details': v.description,
          'id': v.uid,
          'startDate': formatDate(v.startDate.toJSDate()),
          'endDate': formatDate(v.endDate.toJSDate()),
          'duration': duration(v.duration)
        };
      });

      tableau.dataCallback(dataToReturn, lastRecordToken.toString(), hasMoreData);

    }).fail(function (xhr, textStatus, errorThrown) {
      tableau.log("Connection Error: " + textStatus + "\n" + errorThrown);
      tableau.abortWithError("Error while trying to connect to ICS stream\n" + xhr.statusText + "\n" + xhr.statusCode() + "\n" + errorThrown);
    });
  };

  tableau.registerConnector(connector);

  $(document).ready(function () {
    $('#submitButton').click(function () {
      var url = $("#streamUrl").val().trim();
      if (url) {
        tableau.connectionName = 'ICS feed ' + url;
        tableau.connectionData = url;
        tableau.submit();
      }
    });
  });
};

