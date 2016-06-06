var $ = require('jquery');
var ics = require('ical.js');

function makeTwoDigits(num) {
  return num <= 9 ? "0" + num.toString() : num.toString();
}

function formatDate(date) {
  var year = date.getUTCFullYear();
  var month = makeTwoDigits(date.getUTCMonth() + 1); // Because months are zero based
  var day = makeTwoDigits(date.getUTCDay());
  return `${year}-${month}-${day}`;
}

function duration(d) {
  return d.toSeconds() / 60; // minutes
}

// Main Function
module.exports = function(tableau) {
  var connector = tableau.makeConnector();
  connector.getColumnHeaders = () => {
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

  connector.getTableData = (lastRecordToken) => {
    var dataToReturn = [];
    var lastRecordToken = 0;
    var hasMoreData = false;
    $.get(tableau.connectionData, (data) => {
      var componentData = new ics.Component(ics.parse(data));
      var events = componentData.getAllSubcomponents('vevent').map((x) => { return new ics.Event(x); });
      var dataToReturn = events.map((v) => {
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

    });
  };

  tableau.registerConnector(connector);

  $(document).ready(() => {
    $('#submitButton').click(() => {
      var url = $("#streamUrl").val().trim();
      if (url) {
        tableau.connectionName = `ICS feed ${url}`;
        tableau.connectionData = url;
        tableau.submit();
      }
    });
  });
};

