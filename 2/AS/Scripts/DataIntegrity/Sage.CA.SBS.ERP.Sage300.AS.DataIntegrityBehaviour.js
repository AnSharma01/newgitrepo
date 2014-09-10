/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";
var dataIntegrityUI = dataIntegrityUI || {};
var dataIntegrityUI = {
    processUrl: window.sg.utls.url.buildUrl("AS", "DataIntegrity", "Check"),
    hasKoApplied: false,
    ignoreProperties: [],
    computedProperties: ["IsDisable", "FromIndex", "ToIndex", "DataIntegritySelectedItems", "SelectedDataIntegritySelectedItems"],
    activeApplications: ["Accounts Payable 6.2A", "Accounts Receivable 6.2A", "Bank Services 6.2A"],
    dataIntegrityModel: {},
    UIMode: ko.observable(0),
    isKendoControlNotInitialised: false,
    tokenId: null,
    fromList: null,
    toList: null,
    chkValue: null,
    isInclude: false,
    initDataIntegrity: function () {
        dataIntegrityUI.initDataIntegrityButtons();
        //dataIntegrityRepository.loadDataIntegrity(0);
        dataIntegrityOnSuccess.loadDataIntegrity(dataIntegrityViewModel);
        //window.ko.applyBindings(dataIntegrityUI.dataIntegrityModel);
    },
    initDataIntegrityButtons: function () {
        $("#btnInclude").click(function () {
            dataIntegrityUI.isInclude = true;
            dataIntegrityUI.moveSegmentItem(dataIntegrityUI.fromDataIntegrityList, dataIntegrityUI.toDataIntegrityList, dataIntegrityUI.isInclude);
        });

        $("#btnExclude").click(function () {
            dataIntegrityUI.isInclude = false;
            dataIntegrityUI.moveSegmentItem(dataIntegrityUI.toDataIntegrityList, dataIntegrityUI.fromDataIntegrityList, dataIntegrityUI.isInclude);
        });
        
        $("#btnIncludeAll").click(function () {
            dataIntegrityUI.isInclude = true;
            dataIntegrityUI.moveAllDataIntegrityItems(dataIntegrityUI.fromDataIntegrityList, dataIntegrityUI.toDataIntegrityList, dataIntegrityUI.isInclude);
        });

        $("#btnExcludeAll").click(function () {
            dataIntegrityUI.isInclude = false;
            dataIntegrityUI.moveAllDataIntegrityItems(dataIntegrityUI.toDataIntegrityList, dataIntegrityUI.fromDataIntegrityList, dataIntegrityUI.isInclude);
        });

        $("#fromDataIntegrityList").delegate("div", "dblclick", function () {
            dataIntegrityUI.isInclude = true;
            dataIntegrityUI.moveSegmentItem(dataIntegrityUI.fromDataIntegrityList, dataIntegrityUI.toDataIntegrityList, dataIntegrityUI.isInclude);
        });
        $("#toDataIntegrityList").delegate("div", "dblclick", function () {
            dataIntegrityUI.isInclude = false;
            dataIntegrityUI.moveSegmentItem(dataIntegrityUI.toDataIntegrityList, dataIntegrityUI.fromDataIntegrityList, dataIntegrityUI.isInclude);
        });
        $("#btnCheckOption").click(function (e) {
            dataIntegrityRepository.process(dataIntegrityUI.dataIntegrityModel);
        });
    },


    initListView: function () {
        dataIntegrityUI.fromDataIntegrityList = dataIntegrityUI.initKendoListView("fromDataIntegrityList", dataIntegrityUI.segmentDataSource())
        dataIntegrityUI.fromDataIntegrityList.select(dataIntegrityUI.fromDataIntegrityList.element.children().first());

        dataIntegrityUI.toDataIntegrityList = dataIntegrityUI.initKendoListView("toDataIntegrityList", dataIntegrityUI.selectedSegmentDataSource())
        dataIntegrityUI.toDataIntegrityList.select(dataIntegrityUI.toDataIntegrityList.element.children().first());
    },

    initKendoListView: function (listViewId, dataToBind) {
        var kendoListview = $("#" + listViewId).kendoListView({
            dataSource: dataToBind,
            selectable: "single",
            template: kendo.template($("#" + listViewId + "_Template").html())
        }).data("kendoListView");

        return kendoListview;
    },
    intiListviewDataSource: function (dataList) {
        var dataSource = new kendo.data.DataSource({
            data: dataList
        });
        return dataSource;
    },

    segmentDataSource: function () {
        return dataIntegrityUI.intiListviewDataSource(dataIntegrityUI.dataIntegrityModel.Data.DataIntegrityList());
    },
    selectedSegmentDataSource: function () {
        return dataIntegrityUI.intiListviewDataSource(dataIntegrityUI.dataIntegrityModel.Data.SelectedApplication());
    },

    moveSegmentItem: function (fromList, toList, isInclude) {
        var selected = fromList.select();
        var index = selected.index();
        if (selected.length > 0) {
            var fromLength = fromList.dataSource.data().length - 1;
            var items = [];
            $.each(selected, function (idx, elem) {
                items.push(fromList.dataSource.at(selected.index()));
            });
            var fromDS = fromList.dataSource;
            var toDS = toList.dataSource;
            $.each(items, function (idx, elem) {
                toDS.add(elem);
                fromDS.remove(elem);
            });
            toDS.sync();
            fromDS.sync();
            if (index < fromLength) {
                fromList.select(fromList.element.children()[index]);
            } else if (fromLength > 0) {
                fromList.select(fromList.element.children().last());
            }
            toList.select(toList.element.children().last());
            dataIntegrityUI.dataIntegrityModel.Data.DataIntegrityList(toDS.data());
            dataIntegrityUI.dataIntegrityModel.Data.SelectedApplication(fromDS.data());
            dataIntegrityUI.checkListView(toList);

        }
    },
    moveAllDataIntegrityItems: function (fromList, toList, isInclude) {
            if (fromList.dataSource.data().length > 0) {
            var fromLength = fromList.dataSource.data().length - 1;
            var items = [];
            $.each(fromList.dataSource.data(), function (idx, elem) {
                items.push(fromList.dataSource.at(idx));
            });
            var fromDS = fromList.dataSource;
            var toDS = toList.dataSource;
            $.each(items, function (idx, elem) {
                toDS.add(elem);
                fromDS.remove(elem);
            });
            toDS.sync();
            fromDS.sync();
            toDS.sort();
            toList.select(toList.element.children().first());
            dataIntegrityUI.dataIntegrityModel.Data.DataIntegrityList(toDS.data());
            dataIntegrityUI.dataIntegrityModel.Data.SelectedApplication(fromDS.data());
            dataIntegrityUI.checkListView(toList);

        }
    },
    checkListView: function (chkValue) {
        var count = 0;
        var dataList = chkValue.dataSource._data;
        $.each(dataIntegrityUI.activeApplications, function (index, value) {
            $.each(dataList, function (index, listValue) {
                if (listValue.ProgramName() == value)
                    count = count + 1;
            })
            if (count <= 0) {
                $("#btnApplicationOption").attr("disabled", true);
            } else {
                {
                    $("#btnApplicationOption").attr("disabled", false);
                }
            }
        });
    }
};
var dataIntegrityOnSuccess = {
    loadDataIntegrity: function (result, uiMode) {
        if (result.UserMessage.IsSuccess) {
            if (!dataIntegrityUI.hasKoApplied) {
                dataIntegrityUI.dataIntegrityModel = ko.mapping.fromJS(result);
                dataIntegrityUI.hasKoApplied = true;
                // DataIntegrityObservableExtension.UIMode(uiMode);
                dataIntegrityOnSuccess.initProcessUI();
                ko.applyBindings(dataIntegrityUI.dataIntegrityModel);
            } else {
                ko.mapping.fromJS(result, dataIntegrityUI.dataIntegrityModel);
                dataIntegrityUI.UIMode(uiMode);
            }
            dataIntegrityUI.initListView();
        }
    },
    initProcessUI: function () {
        var progressUrl = window.sg.utls.url.buildUrl("AS", "DataIntegrity", "Progress");
        var cancelUrl = window.sg.utls.url.buildUrl("AS", "DataIntegrity", "Cancel");
        progressUI.init(progressUrl, cancelUrl, dataIntegrityUI.dataIntegrityModel, "Data Integrity", dataIntegrityOnSuccess.onProcessComplete);
    },
    process: function (jsonResult) {
        dataIntegrityUI.abortPollRequest = false;
        var model = dataIntegrityUI.dataIntegrityModel;
        ko.mapping.fromJS(jsonResult.WorkflowInstanceId, {}, model.WorkflowInstanceId);
        window.progressUI.progress();
    },

    onProcessComplete: function () {
        dataIntegrityRepository.loadDataIntegrityReport(dataIntegrityUI.dataIntegrityModel);
    },
}
$(function () {
    dataIntegrityUI.initDataIntegrity();
});

