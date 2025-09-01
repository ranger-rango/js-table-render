function renderTable(tableCols, tableData)
{
    const tHead = document.querySelector(".tableHead");
    tHead.innerHTML = ``;
    const headerRow = document.createElement("tr");
    headerRow.className = "rowHeader";

    tableCols.forEach(col => 
    {

        if (!col.hide)
        {
            th = document.createElement("th");
            th.innerText = col.columnName;
            headerRow.appendChild(th);
        }
    });
    tHead.appendChild(headerRow);

    const tBody = document.querySelector(".tableBody");
    tBody.innerHTML = ``;
    tableData.forEach(row => 
    {
        const tableRow = document.createElement("tr");
        tableCols.forEach(col => 
        {
            if (!col.hide)
            {
                const dataHolder = document.createElement("td");
                dataHolder.innerText = row[col.columnName];
                tableRow.appendChild(dataHolder);
            }
        });
        tBody.appendChild(tableRow);
    });
}

function fetchData(url)
{
    return fetch(url)
    .then(response => 
    {
        if (!response.ok)
        {
            throw new Error("HTTP Error: " + response.status);
        }
        return response.json();
    });
}

async function main(pageSize = 5, currentPage = 0, filter = [], sort = [])
{
    const skip = currentPage * pageSize;
    // let orderUrl = `https://services.odata.org/v4/TripPinServiceRW/People?$orderby=LastName asc`;
    // let filterUrl = `https://services.odata.org/v4/TripPinServiceRW/People?$filter=FirstName eq 'Russell'`;
    let siteUrl = `https://services.odata.org/v4/TripPinServiceRW/People?$top=${pageSize}&$skip=${skip}${filter.length === 2 ? `&$filter=${filter[0]} eq '${filter[1]}'` : ""}${sort.length === 2 ? `&$orderby=${sort[0]} ${sort[1]}` : ""}`;
    
    const data = await fetchData(siteUrl);

    const tableCols = [
        {
            "id" : 'user_name',
            "columnName" : "UserName",
            "hide" : false
        },
        {
            "id" : 'first_name',
            "columnName" : "FirstName",
            "hide" : false
        },
        {
            "id" : 'last_name',
            "columnName" : "LastName",
            "hide" : false
        },
        {
            "id" : 'middle_name',
            "columnName" : "MiddleName",
            "hide" : false
        },
        {
            "id" : 'gender',
            "columnName" : "Gender",
            "hide" : false
        },
        {
            "id" : 'age',
            "columnName" : "Age",
            "hide" : false
        }
    ];

    const tableData = [];

    data.value.forEach(rowData =>
    {
        rowObj = {}
        tableCols.forEach(col => 
        {
            rowObj[col.columnName] = rowData[col.columnName];
        });
        tableData.push(rowObj);
    });

    renderTable(tableCols, tableData);
}

let currentPage = 0;
let pageSize = 5;
let currentFilter = [];
let currentSort = [];
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nextBtn").addEventListener("click", () => {
        currentPage++;
        main(pageSize, currentPage, currentFilter, currentSort);
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            main(pageSize, currentPage, currentFilter, currentSort);
        }
    });

    document.getElementById("filterSortForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const filterField = document.getElementById("filterField").value;
        const filterValue = document.getElementById("filterValue").value.trim();
        const sortField = document.getElementById("sortField").value;
        const sortDir = document.getElementById("sortDir").value;

        currentFilter = filterField && filterValue ? [filterField, filterValue] : [];
        currentSort = sortField ? [sortField, sortDir] : [];

        currentPage = 0;
        main(pageSize, currentPage, currentFilter, currentSort);
    });

    main(pageSize, currentPage, currentFilter, currentSort);
});

// main(5, 0, [], []);