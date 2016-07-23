/*
This file is part of hidedit.
(C) Copyright 2012 Ilan Tayari

hidedit is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

hidedit is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with hidedit.  If not, see http://www.gnu.org/licenses/
*/

var ToolbarButton = {
    New:        { value: 0, name: "New",        title: "New descriptor" },
    Load:       { value: 1, name: "Load",       title: "Load descriptor..." },
    Save:       { value: 2, name: "Save",       title: "Save descriptor..." },
    AddItem:    { value: 3, name: "AddItem",    title: "Add item..." },
    DelItem:    { value: 4, name: "DelItem",    title: "Delete selected item" },
    EditItem:   { value: 5, name: "EditItem",   title: "Edit selected item..." },
    AddReport:  { value: 6, name: "AddReport",  title: "Add report..." },
    DelReport:  { value: 7, name: "DelReport",  title: "Delete report..." },
    name: "ToolbarButton"
};

// Dialogs
var editItemDlg = null;
var addItemDlg = null;

function Toolbar() {
	this.elem = document.createElement("DIV");
	this.elem.id = "toolbar";
	hidedit.appendChild(this.elem);

	this.curButton = null;
    for (var typeName in ToolbarButton)
    {
        var typeObj = ToolbarButton[typeName];
        if (typeof typeObj !== 'object')
            continue;

        var buttonElem = document.createElement('DIV');
        buttonElem.className = "tbbtn";
        buttonElem.id = typeObj.name;
        buttonElem.title = typeObj.title;
        buttonElem.onclick = function() {toolbar.onClick(this);};
        buttonElem.onmousedown = function() {toolbar.onMouseDown(this);};
        buttonElem.onmouseup = function() {toolbar.onMouseUp(this);};
        buttonElem.onmouseenter = function() {toolbar.onMouseEnter(this);};
        buttonElem.onmouseout = function() {toolbar.onMouseOut(this);};
        buttonElem.style.backgroundPosition = "-" + (typeObj.value*32) + "px 0px";

        this.elem.appendChild(buttonElem);
    }

    editItemDlg = new Dialog("Edit item", "dlg-edititem.html", new EditItemDialogUI(onEditItemOK));
    editItemDlg.setSize(500, 300);

    addItemDlg = new Dialog("Add item", "dlg-edititem.html", new EditItemDialogUI(onAddItemOK));
    addItemDlg.setSize(500, 300);
}

Toolbar.prototype.clearState = function () {
    if (this.curButton == null)
        return;
    delClass(this.curButton, "pressed");
};

Toolbar.prototype.enableButton = function (btn, enable) {
	this.clearState();
	var o = this.elem.childNodes[btn.value];
	if (enable)
		delClass(o, "disabled");
	else
		addClass(o, "disabled");
}

Toolbar.prototype.isEnabled = function (btn) {
	return !hasClass(btn, "disabled");
}

Toolbar.prototype.onMouseDown = function (o) {
	this.clearState();
	if (!this.isEnabled(o))
		return;
	this.curButton = o;
	addClass(this.curButton, "pressed");
}

Toolbar.prototype.onMouseUp = function (o) {
    this.clearState();
	if (!this.isEnabled(o))
		return;
    this.curButton = null;
}

Toolbar.prototype.onMouseEnter = function (o) {
    this.clearState();
	if (!this.isEnabled(o))
		return;
    this.curButton = o;
}

Toolbar.prototype.onMouseOut = function (o) {
    this.clearState();
	if (!this.isEnabled(o))
		return;
    this.curButton = null;
}

Toolbar.prototype.onClick = function (o) {
	if (!this.isEnabled(o))
		return;
	eval('on' + o.id + 'Clicked()');
}

function onNewClicked()
{
    // Empty descriptor
    descriptor = new HIDDescriptor();
    onDescriptorChanged();
}

    /* Another fine example:
    USAGE_PAGE (Generic Desktop)
USAGE (Game Pad)
COLLECTION (Application)
    COLLECTION (Physical)
        REPORT_ID (1)
        USAGE_PAGE (Button)
        USAGE_MINIMUM (Button 1)
        USAGE_MAXIMUM (Button 16)
        LOGICAL_MINIMUM (0)
        LOGICAL_MAXIMUM (1)
        REPORT_COUNT (16)
        REPORT_SIZE (1)
        INPUT (Data,Var,Abs)
        USAGE_PAGE (Generic Desktop)
        USAGE (X)
        USAGE (Y)
        USAGE (Z)
        USAGE (Rx)
        LOGICAL_MINIMUM (-127)
        LOGICAL_MAXIMUM (127)
        REPORT_SIZE (8)
        REPORT_COUNT (4)
        INPUT (Data,Var,Abs)
    END COLLECTION
END COLLECTION
USAGE_PAGE (Generic Desktop)
USAGE (Game Pad)
COLLECTION (Application)
    COLLECTION (Physical)
        REPORT_ID (2)
        USAGE_PAGE (Button)
        USAGE_MINIMUM (Button 1)
        USAGE_MAXIMUM (Button 16)
        LOGICAL_MINIMUM (0)
        LOGICAL_MAXIMUM (1)
        REPORT_COUNT (16)
        REPORT_SIZE (1)
        INPUT (Data,Var,Abs)
        USAGE_PAGE (Generic Desktop)
        USAGE (X)
        USAGE (Y)
        USAGE (Z)
        USAGE (Rx)
        LOGICAL_MINIMUM (-127)
        LOGICAL_MAXIMUM (127)
        REPORT_SIZE (8)
        REPORT_COUNT (4)
        INPUT (Data,Var,Abs)
    END COLLECTION
END COLLECTION
*/

var examples = {
    // Mouse with wheel and 8 buttons
    7: "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 08 15 00 25 01 75 01 95 08 81 02 05 01 09 30 09 31 09 38 09 B8 15 81 25 7F 75 08 95 04 81 06 C0 C0",
    // Mouse with wheel and 5 buttons
    1: "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 05 15 00 25 01 95 05 75 01 81 02 95 01 75 03 81 01 05 01 09 30 09 31 09 38 15 81 25 7F 75 08 95 03 81 06 C0 C0",
    // Game pad with 32 buttons
    2: "05 01 09 05 A1 01 05 09 19 0A 29 29 15 00 25 01 95 20 75 01 81 02 C0",
    // Mouse with wheel, 3 buttons, and a wakeup feature
    3: "05 01 09 02 A1 01 05 09 19 01 29 03 15 00 25 01 95 03 75 01 81 02 95 01 75 05 81 03 05 01 09 01 A1 00 09 30 09 31 15 81 25 7F 75 08 95 02 81 06 C0 09 38 95 01 81 06 09 3c 15 00 25 01 75 01 95 01 b1 22 95 07 b1 01 C0",
    // Digital Thermometer
    4: "0600FF0901A101050919012901150025019501750181029501750781010501094615BD257F67030003005500950175088100050809421500250F950175049100950175049101C0",
    // HIDMaker FS example
    5: "0600FF0AF1FFA1011580257F950175080901810226820075090902810216008026FF7F950F7510090381021600F026FF0F9501750D0904810215F0250F7505090581021580257F9506750809069102953F0907810295017505810315C0253F950175070600FF09089102950175019103C0",
    // HIDMacros example
	6: "A1028502050815002501750195010917910295079103C0",
    // CP1500PFCLCD:
	0:"05840904a1010924a100850109fe75089501150026ff00b123850209ffb123850305850989b1238504098fb1238505098bb1238506092cb12385077508950625640983098d098e098c09290967b1238508750895016500096681230966b1a30968751027ffff000066011081230968b1a3092a2658028123092ab1a28509750826ff00058409406721d1f0005506b123850a0930b1a30902a10265005500850b750195062501058509d009440945094209460943812309d009440945094209460943b1a3750295018101b101c0850c0584095a750815012503b1a2095a8122850d09fd150026ff00b123c00584091aa100850e0584094075086721d1f0005507b123850f75100930b1a385100953154e2558b1a2095381230954168800268e00b1a209548123c0091ca10085120930b1a37508150026ff006500550085130935b1a3851409582506b1a20958812285150957751015ff26ff7f35c447c4ff1d00660110b1a285160956b1a28517096e750115002501350045006500b1a30965b1a37506b1018518751009442684036621d15507b1a3851a0601ff650055007508150025020943b1a209438123c0c0"
};

var curExample = 0;
function onLoadClicked()
{
    var s = new ReadStream(prompt("Paste a descriptor hex dump below:",examples[curExample]));

	var newDesc = new HIDDescriptor();

	try
	{
		newDesc.parse(s);
	}
	catch (error)
	{
		alert(error);
		return;
	}

    descriptor = newDesc;
    onDescriptorChanged();

    curExample++;
    if (typeof examples[curExample] !== 'string')
        curExample = 0;
}

function onSaveClicked()
{
    var hex = descriptor.pack();
    prompt("The current descriptor's hex dump is below. You may copy it if you want to use it elsewhere:",hex);
}

function onAddItemClicked() {
	var item = new HIDItem(0);
	addItemDlg.show(item);
}

function onAddItemOK() {
	treeView.saveSelectionIndex();

	addItemDlg.close(true);
	descriptor.items.push(addItemDlg.ui.data);

	onDescriptorChanged();
	treeView.restoreSelectionIndex();
}

function onDelItemClicked()
{
	if (treeView.selectedItem == null)
		return;

	treeView.saveSelectionIndex();
	descriptor.items.splice(treeView.selectedItem.itemIndex, 1);
    onDescriptorChanged();
    treeView.restoreSelectionIndex();
}

function onEditItemClicked() {
	if (treeView.selectedItem == null)
		return;

	var index = treeView.selectedItem.itemIndex;
	editItemDlg.show(descriptor.items[treeView.selectedItem.itemIndex]);
}

function onEditItemOK() {
	treeView.saveSelectionIndex();

	editItemDlg.close(true);

	onDescriptorChanged();
	treeView.restoreSelectionIndex();
}

function onAddReportClicked()
{
}

function onDelReportClicked()
{
}
