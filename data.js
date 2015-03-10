/* Pull data from fusion table
 and display it in table view
 */
function dataInit(){

  drawTable();

};

  function drawTable(){
        // Construct query
        var query = "SELECT 'Type', " +
            "COUNT('Name'), SUM('Capacity')" +
            ' FROM 1AR61AoqCN13Xe-VL6QgxkkNAK_TykMDQ_VEV6Pvg' +
            " GROUP BY 'Type'";
        console.log(query);
        var queryText = encodeURIComponent(query);
        var gvizQuery = new google.visualization.Query(
            'http://www.google.com/fusiontables/gvizdata?tq='  + queryText);

        // Send query and draw table with data in response
        gvizQuery.send(function(response) {
          console.log(response);
          var numRows = response.getDataTable().getNumberOfRows();
          var numCols = response.getDataTable().getNumberOfColumns();


          var tdata = [''];

          for (var i = 0; i < numRows; i++) {
            tdata.push('<tr>');
            for(var j = 0; j < numCols; j++) {
              var rowValue = response.getDataTable().getValue(i, j);
              tdata.push('<td>' + rowValue + '</td>');
            }
            tdata.push('</tr>');

          }

          setTimeout(function() {
            // Avoid flashing loading dialog
            $('#data-loading').hide();
            $('#data-tbody').html(tdata.join());

          }, 1000);


        });
  };
