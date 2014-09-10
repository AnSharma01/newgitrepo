/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

"use strict";


var restartRecordsUI = {
    restartRecordsModel: {},
    resetPage: 0,
    valueUpdate: false,
    bindingApplied: false,
    ModelData: [],
    currentPageNumber: 0,
    isDelete: false,
    isLastRecord: false,
    page:0,
    init: function () {
        
        restartRecordsUI.intiButtons();
        restartRecordsUI.bindData(restartRecordsViewModel);
        var grid = $('#RestartRecordGrid').data("kendoGrid");
        grid.dataSource.read();
        $(document).on("change", "#selectAllChk", function () {
            var checkbox = $(this);
            grid.tbody.find("tr").find("td:first input")
                .prop("checked", checkbox.is(":checked")).applyCheckboxStyle();
            if ($("#selectAllChk").is(":checked")) {
                sg.controls.enable("#btnDelete");

            } else {
                sg.controls.disable("#btnDelete");

            }
        });
       
        $("#frmRestartRecord").submit(function (event) {
            event.preventDefault();
        });

        $(document).on("change", ".selectChk", function () {
            var allChecked = true;
            var hasChecked = false;
            grid.tbody.find(".selectChk").each(function (index) {
                if (!($(this).is(':checked'))) {
                    $("#selectAllChk").prop("checked", false).applyCheckboxStyle();
                    allChecked = false;
                    return;
                } else {
                    hasChecked = true;
                }
            });
            if (allChecked) {
                $("#selectAllChk").prop("checked", true).applyCheckboxStyle();
            }

            if (hasChecked) {
                sg.controls.enable("#btnDelete");

            } else {
                sg.controls.disable("#btnDelete");

            }
        });
    },
    intiButtons: function () {
        $("#btnDelete").bind("click", function () {
            var selectedItems = restartRecordsUIGrid.deleteLine();
            if (selectedItems.length > 0) {
                sg.utls.showKendoConfirmationDialog(function () {
                    restartRecordsRepository.deleteRestartRecord(selectedItems);
                }, null, jQuery.validator.format(DeleteConfirm, RestartRecordTitle), Delete);
            }
        });


    },
    bindData: function (result) {
        if (result != null) {
            if (!restartRecordsUI.bindingApplied) {
                restartRecordsUI.bindingApplied = true;
                restartRecordsUI.restartRecordsModel = ko.mapping.fromJS(result);
                RestartRecordObservableExtension(restartRecordsUI.restartRecordsModel);
                ko.applyBindings(restartRecordsUI.restartRecordsModel);
            } else {
                ko.mapping.fromJS(result, restartRecordsUI.restartRecordsModel);
                RestartRecordObservableExtension(restartRecordsUI.restartRecordsModel);
                if (restartRecordsUI.restartRecordsModel.DataList() != undefined && restartRecordsUI.restartRecordsModel.DataList().length > 0) {
                    restartRecordsUI.restartRecordsModel.SelectedRow(restartRecordsUI.restartRecordsModel.DataList()[0]);
                }
            }

            sg.utls.showMessage(result);
        }
    },


};

var RestartRecordHeader = {

    DatabaseIDTitle: $(restartRecordsGridColumns.headerDatabaseID).text(),
    DatabaseIDHidden: $(restartRecordsGridColumns.headerDatabaseID).attr("hidden") ? $(restartRecordsGridColumns.headerDatabaseID).attr("hidden") : false,

    RestartNumberTitle: $(restartRecordsGridColumns.headerRestartNumber).text(),
    RestartNumberHidden: $(restartRecordsGridColumns.headerRestartNumber).attr("hidden") ? $(restartRecordsGridColumns.headerRestartNumber).attr("hidden") : false,

    ProgramNameTitle: $(restartRecordsGridColumns.headerProgramName).text(),
    ProgramNameHidden: $(restartRecordsGridColumns.headerProgramName).attr("hidden") ? $(restartRecordsGridColumns.headerProgramName).attr("hidden") : false,

    UserIDTitle: $(restartRecordsGridColumns.headerUserID).text(),
    UserIDHidden: $(restartRecordsGridColumns.headerUserID).attr("hidden") ? $(restartRecordsGridColumns.headerUserID).attr("hidden") : false,

    DateTitle: $(restartRecordsGridColumns.headerDate).text(),
    DateHidden: $(restartRecordsGridColumns.headerDate).attr("hidden") ? $(restartRecordsGridColumns.headerDate).attr("hidden") : false,

    TimeTitle: $(restartRecordsGridColumns.headerTime).text(),
    TimeHidden: $(restartRecordsGridColumns.headerTime).attr("hidden") ? $(restartRecordsGridColumns.headerTime).attr("hidden") : false,

    MessageTitle: $(restartRecordsGridColumns.headerMessage).text(),
    MessageHidden: $(restartRecordsGridColumns.headerMessage).attr("hidden") ? $(restartRecordsGridColumns.headerMessage).attr("hidden") : false,
};

var restartRecordsGridUtility = {
    restartRecordsModel: ko.observableArray([]),
    restartRecordsList: null,
    restartNumber: null,
    selectedRowIndex: null,

    grid: $('#RestartRecordGrid').data("kendoGrid"),
    restartRecordsConfig: {
        buildGridData: function (successData) {
            if (successData.UserMessage.IsSuccess) {
                var gridData = [];
                restartRecordsUI.ModelData.Data = successData;
                restartRecordsUI.bindData(successData);
                gridData.data = successData.DataList,
                gridData.totalResultsCount = successData.TotalResultsCount;
            }
            else {
                sg.utls.showMessage(successData);
            }

            //Get the Current Page Number
            var restartRecordsGrid = $('#RestartRecordGrid').data("kendoGrid");
            var pageNumber = restartRecordsGrid.dataSource.page();
            restartRecordsUI.currentPageNumber = pageNumber;

            return gridData;
        },
        pageUrl: sg.utls.url.buildUrl("AS", "RestartRecord", "GetPagedRestartRecord"),
        isServerPaging: true,
        pageSize: sg.utls.gridPageSize,
        pageable: {
            input: true,
            numeric: false,
            refresh: true
        },
        param: null,
        schema: {
            model: {
                fields: {
                    IsDeleted: { editable: false }
                }

            }
        },
        filters: null,
        getParam: function () {
            var grid = $('#RestartRecordGrid').data("kendoGrid");
            var pageNumber = 0;
            if (restartRecordsUI.isDelete) {
                if (restartRecordsUI.isLastRecord) {
                    pageNumber = restartRecordsUI.page - 1;
                }else {
                    pageNumber = restartRecordsUI.page;
                }
                
                restartRecordsUI.isDelete = false;
                restartRecordsUI.isLastRecord = false;
                grid.dataSource.page(pageNumber);
            }else{
            pageNumber= grid.dataSource.page();
            }
            var pageSize = grid.dataSource.pageSize();
            var model = ko.mapping.toJS(restartRecordsUI.restartRecordsModel);

            var restartRecords = model.DataList;
            restartRecords = sg.utls.kndoUI.assignDisplayIndex(restartRecords, restartRecordsUI.currentPageNumber, pageSize);
            model.DataList = restartRecords;
            var paramPaging = {
                pageNumber: pageNumber - 1,
                pageSize: pageSize,
                filters: null,
            };
            return paramPaging;
        },
        afterDataBind: function () {
            sg.controls.disable("#btnDelete");
            $("#selectAllChk").prop("checked", false).applyCheckboxStyle();
        },
        scrollable: true,
        resizable: true,
        navigatable: true,
        selectable: true,
        sortable: false,
        autoBind:false,
        columns: [
            {
                field: "IsDeleted", attributes: { "class": "first-cell" }, headerAttributes: { "class": "first-cell" },
                template: sg.controls.ApplyCheckboxStyle("<span class='icon checkBox'><input type='checkbox' class='selectChk' /></span>"),
                headerTemplate: sg.controls.ApplyCheckboxStyle("<span class='icon checkBox'><input type='checkbox' id='selectAllChk' /></span>"),
                editor: function (container, options) {
                    var grid = $('#RestartRecordGrid').data("kendoGrid");
                    $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
                }
            },
        {
            field: "DatabaseID",
            attributes: { "class": "w140" },
            headerAttributes: { "class": "w140" },
            hidden: RestartRecordHeader.DatabaseIDHidden,
            title: RestartRecordHeader.DatabaseIDTitle,
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").select(container.closest("tr"));
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            }
        },

        {
            field: "RestartNumber",
            attributes: { "class": "w100" },
            headerAttributes: { "class": "w100" },
            hidden: RestartRecordHeader.RestartNumberHidden,
            title: RestartRecordHeader.RestartNumberTitle,
            editable: false,
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            }
        },
        {
            field: "ProgramName",
            attributes: { "class": "w150" },
            headerAttributes: { "class": "w150" },
            hidden: RestartRecordHeader.ProgramNameHidden,
            title: RestartRecordHeader.ProgramNameTitle,
            editable: false,
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            }
        },
        {
            field: "UserID",
            attributes: { "class": "w100" },
            headerAttributes: { "class": "w100" },
            hidden: RestartRecordHeader.UserIDHidden,
            title: RestartRecordHeader.UserIDTitle,
            editable: false,
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            }
        },
        {
            field: "Date",
            attributes: { "class": "w100" },
            headerAttributes: { "class": "w100" },
            hidden: RestartRecordHeader.DateHidden,
            title: RestartRecordHeader.DateTitle,
            editable: false,
            template: function(obj) {
                return sg.utls.kndoUI.getFormattedDate(obj.Date);
            },
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            },
        },
        {
            field: "Time",
            attributes: { "class": "w100" },
            headerAttributes: { "class": "w100" },
            hidden: RestartRecordHeader.TimeHidden,
            title: RestartRecordHeader.TimeTitle,
            editable: false,
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            },
        },
        {
            field: "Message",
            attributes: { "class": "w200" },
            headerAttributes: { "class": "w200" },
            hidden: RestartRecordHeader.MessageHidden,
            title: RestartRecordHeader.MessageTitle,
            editable: false,
            editor: function (container, options) {
                $('#RestartRecordGrid').data("kendoGrid").closeCell(container);
            }
        }
        ],

        editable: false,
    }
};

var restartRecordsUIGrid =
{
    init: function () {
        var grid = $("#RestartRecordGrid").data("kendoGrid");
        $(document).on("change", "#selectAllChk", function () {
            var checkbox = $(this);
            grid.tbody.find("tr").find("td:first input")
                .prop("checked", checkbox.is(":checked")).applyCheckboxStyle();
            
        });
        $(document).on("change", ".selectChk", function () {
            var allChecked = true;
            var hasChecked = false;
            grid.tbody.find(".selectChk").each(function (index) {
                if (!($(this).is(':checked'))) {
                    $("#selectAllChk").prop("checked", false).applyCheckboxStyle();
                    allChecked = false;
                    return;
                } else {
                    hasChecked = true;
                }
            });
            if (allChecked) {
                $("#selectAllChk").prop("checked", true).applyCheckboxStyle();
            }

            if (hasChecked) {
                sg.controls.enable("#btnDelete");

            } else {
                sg.controls.disable("#btnDelete");

            }
        });
    },
    deleteLine: function () {
        var grid = null, row = null, gridData = null, dataSource;
        var list = [];
        var model = restartRecordsKoExtn.getRestartRecordData(restartRecordsUI.ModelData.Data);
        grid = $('#RestartRecordGrid').data("kendoGrid");
        grid.tbody.find(":checked").closest("tr").each(function (index) {
            gridData = grid.dataItem($(this));
            var rowIndex = grid.dataSource.indexOf(gridData);
            var uniqueId = restartRecordsUI.ModelData.Data.DataList[rowIndex].RestartNumber;
            
            $.each(model.model.DataList, function (key, value) {
                if (value.RestartNumber == uniqueId) {
                    list.push(value.RestartNumber);
                }
            });
        });
        return list;
    }
}

var restartRecordsUISuccess = {
    afterDelete: function (data) {
        if (data.UserMessage.IsSuccess) {
            var grid = $('#RestartRecordGrid').data("kendoGrid");
            //handling the delete operation of last record of the page.
            restartRecordsUI.isDelete = true;
            if ($("#selectAllChk").is(':checked')) {
                restartRecordsUI.isLastRecord = true;
            }
            
            restartRecordsUI.page = grid.dataSource.page();
            $('#RestartRecordGrid').data("kendoGrid").dataSource.read();
            
        }else
        {
            sg.utls.showMessage(data);
        }
    }
};

$(function () {
    restartRecordsUI.init();
    restartRecordsUIGrid.init();
});

