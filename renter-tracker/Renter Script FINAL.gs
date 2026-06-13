// ============================================================
//  RENTER TRACKER — Script
//  📅 Date Picker | 🔍 Search | 🔃 Sort + Auto Hyperlinks
//
//  Column Map:
//  A=Name, B=Status, C=Priority, D=Last Contact, E=Follow-Up Count
//  F=Phone, G=Email, H=Occupation, I=Monthly Budget
//  J=Current Lease End, K=Desired Move-In, L=Num Occupants
//  M=Property Type, N=Bedrooms, O=Desired Neighborhoods
//  P=Pet Friendly, Q=Credit Score, R=Voucher/Sec8
//  S=Special Req, T=Unit Shown, U=Application Submitted
//  V=Lease Signed, W=Placement Date, X=Landlord/Mgmt
//  Y=Referral Source, Z=Agent Notes
//
//  INSTALL: Extensions > Apps Script > paste > save > run > refresh
// ============================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📅 Date Picker')
    .addItem('Pick a Date for Selected Cell', 'openCalendar')
    .addToUi();
  ui.createMenu('🔍 Search')
    .addItem('Search Renter', 'runSearch')
    .addItem('Go to Next Match', 'goToNextMatch')
    .addItem('Clear Highlights', 'runClearSearch')
    .addToUi();
  ui.createMenu('🔃 Sort')
    .addItem('Sort A → Z by Name', 'sortByName')
    .addItem('Sort by Last Contact Date (Oldest First)', 'sortByDate')
    .addToUi();
}

// ════════════════════════════════════════════════════════════
//  AUTO HYPERLINKS ON EDIT
//  F=6 Phone, G=7 Email, T=20 Unit Shown (address)
// ════════════════════════════════════════════════════════════

function onEdit(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "Renter List") return;
  var col = e.range.getColumn();
  var row = e.range.getRow();
  if (row < 3) return;
  var value = e.range.getValue();
  if (!value || value.toString().trim() === "") return;
  var text = value.toString().trim();
  if (e.range.getFormula().indexOf("HYPERLINK") !== -1) return;

  if (col === 6) { // Phone
    if (text.indexOf("/") !== -1) return;
    var digits = text.replace(/\D/g,"");
    if (digits.length < 7) return;
    e.range.setFormula('=HYPERLINK("tel:' + digits + '","' + text.replace(/"/g,"'") + '")');
    e.range.setFontColor("#1155CC");
  }
  if (col === 7) { // Email
    if (text.indexOf("@") === -1) return;
    e.range.setFormula('=HYPERLINK("mailto:' + text + '","' + text.replace(/"/g,"'") + '")');
    e.range.setFontColor("#1155CC");
  }
  if (col === 20) { // Unit Shown — Google Maps
    var encoded = encodeURIComponent(text);
    e.range.setFormula('=HYPERLINK("https://www.google.com/maps/search/?api=1&query=' + encoded + '","' + text.replace(/"/g,"'") + '")');
    e.range.setFontColor("#1155CC");
  }
}

// ════════════════════════════════════════════════════════════
//  SORT
// ════════════════════════════════════════════════════════════

function sortByName() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;
  sheet.getRange(3, 1, lastRow - 2, 26).sort({ column: 1, ascending: true });
  SpreadsheetApp.getUi().alert("✅ Sorted A → Z by renter name.");
}

function sortByDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;
  sheet.getRange(3, 1, lastRow - 2, 26).sort({ column: 4, ascending: true });
  SpreadsheetApp.getUi().alert("✅ Sorted by Last Contact Date — oldest at top.");
}

// ════════════════════════════════════════════════════════════
//  SEARCH — reads from cell C21 on Renter Dashboard
// ════════════════════════════════════════════════════════════

function runSearch() {
  var dash  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("📊 Renter Dashboard");
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  var searchTerm = dash.getRange("C21").getValue().toString().trim();

  if (!searchTerm) {
    SpreadsheetApp.getUi().alert("Please type a renter name in the yellow search box on the Dashboard tab first.");
    return;
  }

  var totalRows = sheet.getLastRow() - 2;
  if (totalRows < 1) return;
  clearSearchFormatting(sheet, totalRows);

  var data    = sheet.getRange(3, 1, totalRows, 1).getValues();
  var term    = searchTerm.toLowerCase();
  var matches = [];

  for (var i = 0; i < data.length; i++) {
    var name = data[i][0] ? data[i][0].toString().toLowerCase() : "";
    if (name.indexOf(term) !== -1) matches.push(i + 3);
  }

  if (matches.length === 0) {
    SpreadsheetApp.getUi().alert('No renter found matching "' + searchTerm + '". Check spelling and try again.');
    return;
  }

  var thick = SpreadsheetApp.BorderStyle.SOLID_MEDIUM;
  for (var m = 0; m < matches.length; m++) {
    var range = sheet.getRange(matches[m], 1, 1, 26);
    range.setFontWeight("bold");
    range.setBorder(true, true, true, true, false, false, "#1F4E79", thick);
  }

  var props = PropertiesService.getScriptProperties();
  props.setProperty("matchRows", JSON.stringify(matches));
  props.setProperty("matchIndex", "0");

  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet);
  sheet.setActiveRange(sheet.getRange(matches[0], 1));

  var msg = matches.length === 1
    ? "✅ Found! " + sheet.getRange(matches[0], 1).getValue() + " is highlighted in bold."
    : "✅ Found " + matches.length + " matches — all highlighted in bold. Use '🔍 Search → Go to Next Match' to jump between them.";
  SpreadsheetApp.getUi().alert(msg);
}

function goToNextMatch() {
  var props = PropertiesService.getScriptProperties();
  var matchRowsJson = props.getProperty("matchRows");
  if (!matchRowsJson) {
    SpreadsheetApp.getUi().alert("No active search. Please run Search Renter first.");
    return;
  }
  var matches    = JSON.parse(matchRowsJson);
  var matchIndex = parseInt(props.getProperty("matchIndex") || "0");
  matchIndex = (matchIndex + 1) % matches.length;
  props.setProperty("matchIndex", matchIndex.toString());
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet);
  sheet.setActiveRange(sheet.getRange(matches[matchIndex], 1));
  SpreadsheetApp.getUi().alert(
    "Match " + (matchIndex + 1) + " of " + matches.length + ": " +
    sheet.getRange(matches[matchIndex], 1).getValue());
}

function runClearSearch() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  var totalRows = sheet.getLastRow() - 2;
  if (totalRows > 0) clearSearchFormatting(sheet, totalRows);
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty("matchRows");
  props.deleteProperty("matchIndex");
  SpreadsheetApp.getUi().alert("✅ Highlights cleared.");
}

function clearSearchFormatting(sheet, totalRows) {
  var range = sheet.getRange(3, 1, totalRows, 26);
  range.setFontWeight("normal");
  range.setBorder(true, true, true, true, true, true, "#CCCCCC", SpreadsheetApp.BorderStyle.SOLID);
}

// ════════════════════════════════════════════════════════════
//  CALENDAR DATE PICKER
//  D=4  Last Contact Date
//  J=10 Current Lease End Date
//  K=11 Desired Move-In Date
//  W=23 Placement Date
// ════════════════════════════════════════════════════════════

function openCalendar() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  var cell  = sheet.getActiveCell();
  var col   = cell.getColumn();
  var row   = cell.getRow();
  if (row < 3) { SpreadsheetApp.getUi().alert("Please click on a date cell first."); return; }
  if (col !== 4 && col !== 10 && col !== 11 && col !== 23) {
    SpreadsheetApp.getUi().alert("Please click on a date column first:\n• Last Contact Date (D)\n• Current Lease End Date (J)\n• Desired Move-In Date (K)\n• Placement Date (W)");
    return;
  }
  var currentVal = cell.getValue();
  var selectedDate = "";
  if (currentVal instanceof Date) {
    selectedDate = Utilities.formatDate(currentVal, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  SpreadsheetApp.getUi().showSidebar(
    HtmlService.createHtmlOutput(getCalendarHTML(selectedDate, cell.getA1Notation()))
      .setTitle("📅 Pick a Date").setWidth(270));
}

function setDateInCell(dateString, cellAddress) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List");
  var cell  = sheet.getRange(cellAddress);
  cell.setValue(new Date(dateString + "T12:00:00"));
  cell.setNumberFormat("MM/DD/YYYY");
}

function clearDateInCell(cellAddress) {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Renter List").getRange(cellAddress).clearContent();
}

// ════════════════════════════════════════════════════════════
//  CALENDAR HTML
// ════════════════════════════════════════════════════════════

function getCalendarHTML(selectedDate, cellAddress) {
  return `<!DOCTYPE html><html><head><style>
  *{box-sizing:border-box;margin:0;padding:0;}body{font-family:Arial,sans-serif;font-size:13px;background:#f9fbff;padding:14px;color:#1F4E79;}
  .header{text-align:center;font-size:11px;color:#888;margin-bottom:10px;background:#EBF3FB;padding:6px;border-radius:4px;}
  .nav{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
  .nav button{background:#2E75B6;color:white;border:none;border-radius:4px;padding:5px 12px;cursor:pointer;font-size:16px;font-weight:bold;}
  .month-label{font-weight:bold;font-size:14px;}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
  .day-hdr{text-align:center;font-weight:bold;font-size:11px;color:#888;padding:4px 0;}
  .day{text-align:center;padding:6px 2px;border-radius:4px;cursor:pointer;font-size:12px;}
  .day:hover{background:#BDD7EE;}.day.today{background:#FFEB9C;font-weight:bold;color:#9C5700;}
  .day.selected{background:#2E75B6;color:white;font-weight:bold;}.day.empty{cursor:default;}
  .actions{display:flex;gap:6px;margin-top:12px;}
  .btn{flex:1;padding:8px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;border:none;}
  .btn-today{background:#C6EFCE;color:#276221;}.btn-clear{background:#f0f0f0;color:#555;}
  .status{text-align:center;margin-top:10px;font-size:11px;color:#276221;font-weight:bold;min-height:16px;}
  </style></head><body>
  <div class="header">Cell: ${cellAddress}</div>
  <div class="nav"><button onclick="prevMonth()">&#8249;</button><span class="month-label" id="monthLabel"></span><button onclick="nextMonth()">&#8250;</button></div>
  <div class="grid" id="calGrid"></div>
  <div class="actions"><button class="btn btn-today" onclick="selectToday()">Today</button><button class="btn btn-clear" onclick="clearIt()">Clear</button></div>
  <div class="status" id="status"></div>
  <script>
  var cellAddress="${cellAddress}",selectedDate="${selectedDate}";
  var today=new Date();today.setHours(0,0,0,0);
  var viewYear=selectedDate?+selectedDate.split("-")[0]:today.getFullYear();
  var viewMonth=selectedDate?+selectedDate.split("-")[1]-1:today.getMonth();
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var days=["Su","Mo","Tu","We","Th","Fr","Sa"];
  function pad(n){return n<10?"0"+n:""+n;}
  function render(){
    document.getElementById("monthLabel").textContent=months[viewMonth]+" "+viewYear;
    var grid=document.getElementById("calGrid");grid.innerHTML="";
    days.forEach(function(d){var h=document.createElement("div");h.className="day-hdr";h.textContent=d;grid.appendChild(h);});
    var firstDay=new Date(viewYear,viewMonth,1).getDay(),totalDays=new Date(viewYear,viewMonth+1,0).getDate();
    for(var i=0;i<firstDay;i++){var b=document.createElement("div");b.className="day empty";grid.appendChild(b);}
    for(var d=1;d<=totalDays;d++){
      var cell=document.createElement("div");cell.className="day";cell.textContent=d;
      var ds=viewYear+"-"+pad(viewMonth+1)+"-"+pad(d);
      var td=new Date(viewYear,viewMonth,d);td.setHours(0,0,0,0);
      if(td.getTime()===today.getTime())cell.classList.add("today");
      if(ds===selectedDate)cell.classList.add("selected");
      (function(s){cell.onclick=function(){pickDate(s);};})(ds);
      grid.appendChild(cell);}
  }
  function pickDate(ds){selectedDate=ds;render();document.getElementById("status").textContent="Saving...";
    google.script.run.withSuccessHandler(function(){document.getElementById("status").textContent="✅ Saved!";})
    .withFailureHandler(function(e){document.getElementById("status").textContent="❌ "+e.message;})
    .setDateInCell(ds,cellAddress);}
  function selectToday(){var ds=today.getFullYear()+"-"+pad(today.getMonth()+1)+"-"+pad(today.getDate());pickDate(ds);}
  function clearIt(){selectedDate="";render();document.getElementById("status").textContent="Clearing...";
    google.script.run.withSuccessHandler(function(){document.getElementById("status").textContent="✅ Cleared!";}).clearDateInCell(cellAddress);}
  function prevMonth(){viewMonth--;if(viewMonth<0){viewMonth=11;viewYear--;}render();}
  function nextMonth(){viewMonth++;if(viewMonth>11){viewMonth=0;viewYear++;}render();}
  render();
  </script></body></html>`;
}
