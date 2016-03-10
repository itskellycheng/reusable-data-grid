//Object Constructor
function DataGrid(obj) {
    var mydata = obj.data;
    this.data = obj.data;
    this.rootElement = obj.rootElement;
    this.columns = obj.columns;
    this.pageSize = obj.pageSize;
    this.onRender = obj.onRender;
    this.columnState = []; //State of each column 0:Ascending 1:descending
    this.totalRows = this.data.length;
    this.page = 0; //What page is currently being displayed.
    this.columnCount = this.columns.length; //How many columns
    this.destroy = function() {
        this.rootElement.innerHTML = "";
    }

    if (this.pageSize != undefined) {
        this.totalPages = Math.ceil(this.totalRows/this.pageSize);
        //console.log("totalPages = " + this.totalPages);
    }

    //if page size isn't specified, just show all data on one page
    else {
        this.pageSize = this.data.length;
        this.totalPages = 1;
    }

    ////////////////////////Initial Render//////////////////////

    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    if (this.onRender != undefined) {
        this.onRender();
    }
  

    //Get the count of columns.
    var columnCount = this.columns.length;

    var keys = [];
    for (var i = 0; i < columnCount; i++) {
        for(var key in this.columns[i]) {
            //first property only
            keys.push(this.columns[i][key]);
            this.columnState.push(0);
            break;
        }
    }

    //comparison function for sorting by ascending order
    function compare(a,b) {
    var aName = a[Object.keys(a)[0]];
    var bName = b[Object.keys(b)[0]];
        if (aName < bName)
            return -1;
        else if (aName > bName)
            return 1;
        else 
            return 0;
    }
    //descendng order
    function compareDes(a,b) {
    var aName = a[Object.keys(a)[0]];
    var bName = b[Object.keys(b)[0]];
        if (aName > bName)
            return -1;
        else if (aName < bName)
            return 1;
        else 
            return 0;
    }

    this.data.sort(compare);

    ////////////////////////////// Page Stuff //////////////////////////////
    //Initial render - Add caption if there are pages
    if (this.totalPages > 1) {
        var caption=table.createCaption();
        //previous
        var a1 = document.createElement('a');
        var linkText1 = document.createTextNode("< Previous ");
        a1.appendChild(linkText1);
        a1.setAttribute("class", "disabled");

        //which page
        var pageText = document.createTextNode(this.page + " of " + this.totalPages);

        //next
        var a2 = document.createElement('a');
        var linkText2 = document.createTextNode(" Next >");
        a2.appendChild(linkText2);
        a2.onclick = function () { next(this); };
        caption.appendChild(a1);
        caption.appendChild(pageText);
        caption.appendChild(a2);
    }

    function next(a) {
        var thisTable = a.parentNode.parentNode;
        if (thisTable.id === "grid1") {
            var grid = this.tester.grid_1;
        }
        else if (thisTable.id === "grid2") {
            var grid = this.tester.grid_2;
        }
        else {
            var grid = this.tester.grid_3;
        }

        if (grid.page < grid.totalPages) {
            grid.page = grid.page + 1;

            renderGeneral(grid);

        }
    }

    function previous(a) {
        var thisTable = a.parentNode.parentNode;
        if (thisTable.id === "grid1") {
            var grid = this.tester.grid_1;
        }
        else if (thisTable.id === "grid2") {
            var grid = this.tester.grid_2;
        }
        else {
            var grid = this.tester.grid_3;
        }

        if (grid.page > 0) {
            grid.page = grid.page - 1;

            renderGeneral(grid);

        }
    }

    function addCaptions(grid, table) {
        var caption=table.createCaption();
        //previous
        var a1 = document.createElement('a');
        var linkText1 = document.createTextNode("< Previous ");
        a1.appendChild(linkText1);
        if (grid.page === 0) { //first page
            a1.setAttribute("class", "disabled");
        }
        else {
            a1.onclick = function () { previous(a1); };
        }
        //which page
        var pageText = document.createTextNode(grid.page + " of " + grid.totalPages);
        //next
        var a2 = document.createElement('a');
        var linkText2 = document.createTextNode(" Next >");
        a2.appendChild(linkText2);
        if (grid.page === grid.totalPages - 1) {
            a2.setAttribute("class", "disabled");
        }
        else {
            a2.onclick = function () { next(a2); };
        }
        caption.appendChild(a1);
        caption.appendChild(pageText);
        caption.appendChild(a2);
    }

    function addRows(grid, table) {
        var startAt = grid.page * grid.pageSize;
        for (var i = startAt; i < (startAt + grid.pageSize); i++) {
            row = table.insertRow(-1);
            var j = 0;
            for(var key in grid.data[i]) {
                j++;
                var cell = row.insertCell(-1);
                cell.innerHTML = grid.data[i][key];
                if (j >= grid.columns.length) {
                    break;
                }
            }
        }
    }
    /////////////////////////// Page Stuff End /////////////////////////////

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        //headerCell.setAttribute("class", "tooltip");
        headerCell.setAttribute("title", "Sort by " + keys[i]);
        headerCell.innerHTML = keys[i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 0; i < this.pageSize; i++) {
        row = table.insertRow(-1);
        var j = 0;
        for(var key in this.data[i]) {
            j++;
            var cell = row.insertCell(-1);
            cell.innerHTML = this.data[i][key];
            if (j >= columnCount) {
                break;
            }
        }
    }

    //set id of grids
    if (this.rootElement === document.getElementById("gridwrapper1")) {
        table.setAttribute('id', 'grid1');
    }
    else if (this.rootElement === document.getElementById("gridwrapper2")) {
        table.setAttribute('id', 'grid2');
    }
    else {
        table.setAttribute('id', 'grid3');
    }
    this.rootElement.appendChild(table);


    var tbl = document.getElementById("grid1");

    if (tbl != null) {
        //console.log("got");
        for (var j = 0; j < tbl.rows[0].cells.length; j++) {
            tbl.rows[0].cells[j].onclick = function () { 
                getval(this); 
            };
        }
    }

    tbl = document.getElementById("grid2");
    if (tbl != null) {
        //console.log("got2");
        for (var j = 0; j < tbl.rows[0].cells.length; j++) {
            tbl.rows[0].cells[j].onclick = function () { getval(this); };
        }
    }

    tbl = document.getElementById("grid3");
    if (tbl != null) {
        //console.log("got3");
        for (var j = 0; j < tbl.rows[0].cells.length; j++) {
            tbl.rows[0].cells[j].onclick = function () { getval(this); };
        }
    }

 //////////////////////// Initial Render End //////////////////////

    //Function called after onclick
    function getval(cel) {
        var thisTable = cel.parentNode.parentNode.parentNode;
        if (thisTable.id === "grid1") {
            var grid = this.tester.grid_1;
        }
        else if (thisTable.id === "grid2") {
            var grid = this.tester.grid_2;
        }
        else {
            var grid = this.tester.grid_3;
        }
        var index = cel.cellIndex;
        if (grid.columnState[index] === 0) {
            //alert(cel.innerHTML + ' howdy column ' + index);
            
            renderDes(grid, index);
            grid.columnState[index] = 1;
        }
        else {
            //alert(cel.innerHTML);
            renderAsc(grid, index);
            grid.columnState[index] = 0;
        }
    }    


    //When changing a page
    function renderGeneral(grid) {
        if (grid.onRender != undefined) {
        grid.onRender();
        }

        var table = document.createElement("TABLE");

        var columnCount = grid.columns.length;

        //Find table headers content
        var keys = [];
        for (var i = 0; i < columnCount; i++) {
            for(var key in grid.columns[i]) {
                //first property only
                keys.push(grid.columns[i][key]);
                break;
            }
        }

        //Add pager if needed
        if (grid.totalPages > 1) {
            addCaptions(grid, table);
        }

        //Add the header row.
        var row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = keys[i];
            row.appendChild(headerCell);
        }

        addRows(grid, table); //Add rows

        grid.rootElement.innerHTML = ""; //clear grid

        //set id
        if (grid.rootElement === document.getElementById("gridwrapper1")) {
                table.setAttribute('id', 'grid1');
            }
            else if (grid.rootElement === document.getElementById("gridwrapper2")) {
                table.setAttribute('id', 'grid2');
            }
            else {
                table.setAttribute('id', 'grid3');
        }
        grid.rootElement.appendChild(table);

        //var tbl = document.getElementById("grid1");
        var tbl = table;
        if (tbl != null) {
            //console.log("got");
            for (var j = 0; j < tbl.rows[0].cells.length; j++) {
                tbl.rows[0].cells[j].onclick = function () { getval(this); };
            }
        }
    }

    //Render in ascending order
    //pass in datagrid object
    //j is the column to sort
    function renderAsc(grid, j) {
        if (grid.onRender != undefined) {
        grid.onRender();
        }

        var table = document.createElement("TABLE");

        //Get the count of columns.
        var columnCount = grid.columns.length;

        var keys = [];
        for (var i = 0; i < columnCount; i++) {
            for(var key in grid.columns[i]) {
                //first property only
                keys.push(grid.columns[i][key]);
                grid.columnState.push(0);
                break;
            }
        }

        //ascending compare
        function compare(a,b) {
        var aName = a[Object.keys(a)[j]];
        var bName = b[Object.keys(b)[j]];
            if (aName < bName)
                return -1;
            else if (aName > bName)
                return 1;
            else 
                return 0;
        }

        grid.data.sort(compare);

        //Add pager if needed
        if (grid.totalPages > 1) {
            addCaptions(grid, table);
        }

        //Add the header row.
        var row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = keys[i];
            row.appendChild(headerCell);
        }

        addRows(grid, table);

        grid.rootElement.innerHTML = "";
        //set id
        if (grid.rootElement === document.getElementById("gridwrapper1")) {
                table.setAttribute('id', 'grid1');
            }
            else if (grid.rootElement === document.getElementById("gridwrapper2")) {
                table.setAttribute('id', 'grid2');
            }
            else {
                table.setAttribute('id', 'grid3');
        }
        grid.rootElement.appendChild(table);

        //var tbl = document.getElementById("grid1");
        var tbl = table;
        if (tbl != null) {
            //console.log("got");
            for (var j = 0; j < tbl.rows[0].cells.length; j++) {
                tbl.rows[0].cells[j].onclick = function () { getval(this); };
            }
        }
    }

    //Render in descending order
    function renderDes(grid, j) {

        if (grid.onRender != undefined) {
        grid.onRender();
        }

        var table = document.createElement("TABLE");

        //Get the count of columns.
        var columnCount = grid.columns.length;

        var keys = [];
        for (var i = 0; i < columnCount; i++) {
            for(var key in grid.columns[i]) {
                //first property only
                keys.push(grid.columns[i][key]);
                grid.columnState.push(0);
                break;
            }
        }

        //descendng
        function compareDes(a,b) {
        var aName = a[Object.keys(a)[j]];
        var bName = b[Object.keys(b)[j]];
            if (aName > bName)
                return -1;
            else if (aName < bName)
                return 1;
            else 
                return 0;
        }

        grid.data.sort(compareDes);

        //Add pager if needed
        if (grid.totalPages > 1) {
            addCaptions(grid, table);
        }

        //Add the header row.
        var row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = keys[i];
            row.appendChild(headerCell);
        }

        //Add the data rows.
        addRows(grid, table);

        grid.rootElement.innerHTML = "";
        //set id
        if (grid.rootElement === document.getElementById("gridwrapper1")) {
                table.setAttribute('id', 'grid1');
            }
            else if (grid.rootElement === document.getElementById("gridwrapper2")) {
                table.setAttribute('id', 'grid2');
            }
            else {
                table.setAttribute('id', 'grid3');
        }
        grid.rootElement.appendChild(table);

        //var tbl = document.getElementById("grid1");
        var tbl = table;
        if (tbl != null) {
            //console.log("got");
            for (var j = 0; j < tbl.rows[0].cells.length; j++) {
                tbl.rows[0].cells[j].onclick = function () { getval(this); };
            }
        }
    }

}