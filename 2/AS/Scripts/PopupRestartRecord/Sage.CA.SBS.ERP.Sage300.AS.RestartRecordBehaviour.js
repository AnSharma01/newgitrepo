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
        debugger;
        restartRecordsUI.intiButtons();
        restartRecordsUI.bindData(restartRecordsViewModel);
        var grid = $('#RestartRecordGrid').data("kendoGrid");
        //grid.dataSource.read();
    },
    intiButtons: function () {
        $("#btnDelete").bind("click", function () {
            var selectedItems = restartRecordsUIGrid.deleteLine();
                sg.utls.showKendoConfirmationDialog(function () {
                    restartRecordsRepository.deleteRestartRecord(selectedItems);
                }, null, jQuery.validator.format(DeleteConfirm, RestartRecordTitle), Delete);
            
        });

        $("#btnRestart").bind("click", function () {
            var selectedItems = restartRecordsUIGrid.getLine();
            if (selectedItems.length > 0)
                return selectedItems;
        });

        $("#btnCancel").bind("click", function () {
            return false;

        });

        $("#btnContinue").bind("click", function () {
            return true;

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
$("#frmRestartRecord").submit(function (event) {
    event.preventDefault();
});
var RestartRecordHeader = {

    RestartNumberTitle: 'Restart',
    RestartNumberHidden: $(restartRecordsGridColumns.headerRestartNumber).attr("hidden") ? $(restartRecordsGridColumns.headerRestartNumber).attr("hidden") : false,

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
        pageUrl: sg.utls.url.buildUrl("AS", "PopupRestartRecord", "GetPagedRestartRecord"),
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
            debugger;
            var grid = $('#RestartRecordGrid').data("kendoGrid");
            var pageNumber = grid.dataSource.page();
            var pageSize = grid.dataSource.pageSize();
            var model = ko.mapping.toJS(restartRecordsUI.restartRecordsModel);

            var restartRecords = model.DataList;

            //$.each(restartRecords, function (key, value) {
            //    if (value.IsNewLine = true && (value.SegmentCode == "" || value.SegmentCode == null || value.SegmentCode == undefined)) {
            //        value.IsDeleted = true;
            //    }
            //});

            restartRecords = sg.utls.kndoUI.assignDisplayIndex(restartRecords, restartRecordsUI.currentPageNumber, pageSize);
            model.DataList = restartRecords;

            var parameters = {
                pageNumber: pageNumber - 1,
                pageSize: pageSize,
                viewName: 'GL5400IM'
            };
            return parameters;
        },
        afterDataBind: function () {
            
        },
        scrollable: true,
        resizable: true,
        navigatable: true,
        selectable: true,
        sortable: false,
        autoBind:true,
        columns: [
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
            field: "Date",
            attributes: { "class": "w100" },
            headerAttributes: { "class": "w100" },
            hidden: RestartRecordHeader.DateHidden,
            title: RestartRecordHeader.DateTitle,
            editable: false,
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
    },
    deleteLine: function () {
        var grid = null;
        var model = restartRecordsKoExtn.getRestartRecordData(restartRecordsUI.ModelData.Data);
        grid = $('#RestartRecordGrid').data("kendoGrid");
        return restartRecordsUI.restartRecordsModel.SelectedRow(restartRecordsUI.restartRecordsModel.DataList()[0]).SelectedRow().RestartNumber();
        
    },
    getLine: function () {
    return restartRecordsUI.restartRecordsModel.SelectedRow(restartRecordsUI.restartRecordsModel.DataList()[0]).SelectedRow();
    }
}

var restartRecordsUISuccess = {
    afterDelete: function (data) {
        if (data.UserMessage.IsSuccess) {
            var grid = $('#RestartRecordGrid').data("kendoGrid");
            restartRecordsUI.page = grid.dataSource.page();
            $('#RestartRecordGrid').data("kendoGrid").dataSource.read();
            sg.utls.showMessageInfo(sg.utls.msgType.SUCCESS, data.UserMessage.Message);
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

