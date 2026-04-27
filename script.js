let dataList = JSON.parse(localStorage.getItem("dataList")) || [];

let filteredData = [...dataList];

let currentPage = 1;

let rowsPerPage = 5;

showTable();

function addData(){

let input = document.getElementById("dataInput").value.trim();
if(input===""){
    alert('Please insert the value');
    return;
}

let parts = input.split(",");

let obj = {
name:"",
email:"",
phone:"",
product:"",
price:""
};

parts.forEach(p=>{
p = p.trim();

// EMAIL
if(p.includes("@") && p.includes(".")){
    obj.email = p;
}

// PHONE
else if(/^\d{8,15}$/.test(p)){
    obj.phone = p;
}

// PRICE
else if(/^\d+(\.\d+)?$/.test(p)){
    obj.price = p;
}

// PRODUCT or NAME (fallback)
else if(/^[a-zA-Z]/.test(p)){
    if(!obj.name){
        obj.name = p; // first text = name
    } else {
        obj.product = p;
    }
}

});

dataList.push(obj);
save();

document.getElementById("dataInput").value="";
}


function showTable(){

let body = document.getElementById("tableBody");

body.innerHTML="";

let start = (currentPage-1)*rowsPerPage;

let end = start + rowsPerPage;

let pageData = filteredData.slice(start,end);

pageData.forEach((d,index)=>{

let realIndex = start + index;

body.innerHTML += `
<tr>

<td>${d.name}</td>
<td>${d.email}</td>
<td>${d.phone}</td>
<td>${d.product}</td>
<td>${d.price}</td>
<td>

<button style="background-color:yellow; padding:5px; border-radius:10px;" onclick="editRow(${realIndex})">
Edit
</button>

<button style="background-color:red; padding:5px; border-radius:10px;" onclick="deleteRow(${realIndex})">
Delete
</button>

</td>

</tr>
`;

});

showPagination();

}
function deleteRow(i){

dataList.splice(i,1);

save();

}

function editRow(i){

let d = dataList[i];

let input =
prompt(
"Edit data comma separated",
`${d.name},${d.email},${d.phone},${d.product},${d.price}`
);

if(!input) return;

dataList.splice(i,1);

document.getElementById("dataInput").value = input;

addData();

}

function save(){

localStorage.setItem("dataList",JSON.stringify(dataList));

filteredData = [...dataList];//copy array into the variable- to create copy of datas

showTable();

}

function searchData(){

let text = document.getElementById("searchInput").value.toLowerCase();

let field = document.getElementById("filterField").value;

filteredData = dataList.filter(d=>{

if(!field){

return Object.values(d).join(" ").toLowerCase().includes(text);

}

return d[field].toLowerCase().includes(text);

});

currentPage = 1;

showTable();

}

function showPagination(){

let div = document.getElementById("pagination");

div.innerHTML ="";

let pages = Math.ceil(filteredData.length /rowsPerPage);//calculate and round 

for(let i=1;i<=pages;i++){

div.innerHTML += `<button style="background-color:rgb(212, 19, 230); padding:5px; border-radius:10px;" onclick="goPage(${i})">
Page ${i}
</button>`;

}

}

function goPage(p){

currentPage = p;

showTable();

}


function exportExcel(){

let csv = "Name,Email,Phone,Product,Price\n";

dataList.forEach(d=>{
csv += `${d.name},${d.email},${d.phone},${d.product},${d.price}\n`;
});

let blob = new Blob([csv]);

let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "data.csv";
a.click();

}

function clearData(){

localStorage.removeItem("dataList");//single data entity
dataList = [];

showTable();

}

localStorage.setItem(
"dataList",
JSON.stringify(dataList)
);

showTable();



