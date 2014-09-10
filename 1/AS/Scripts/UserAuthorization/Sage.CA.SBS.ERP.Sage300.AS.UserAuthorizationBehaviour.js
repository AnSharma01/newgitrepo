/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

"use strict";

var operationMode = { None: 0, Add: 1, Update: 2, Delete: 3 };
var admin = "ADMIN";

var userAuthorizationUI = {
    userAuthorizationModel: {},
    hasKoBindingApplied: false,
    groupModel: {},
    isAdmin: false,
    isKendoControlNotInitialised: false,
    ChangeSortOrderModel: {},
    operationModes: {},
    userID: "",
    isFirstLoad: true,
    selectedRecord: null,
    securityGroupStartWithText: "",
    ignoreProperties: ["UserID", "OperationMode"],
    loadedUserID: "",
    oldSecurityGroupID: "",
    isValidUser: true,

    init: function () {
        userAuthorizationUI.initButtons();
        userAuthorizationUI.initFinder();
        userAuthorizationUI.bindData(userAuthorizationModel);
        userAuthorizationUI.initTextBox();
        sg.controls.Focus($("#Data_UserID"));
    },

    initButtons: function () {
        sg.exportHelper.setExportEvent("btnOptionExport", sg.dataMigration.UserAuthorization, false, $.noop);
        sg.importHelper.setImportEvent("btnOptionImport", sg.dataMigration.UserAuthorization, false, $.noop);

        $("#btnLoadUser").click(function () {
            if ($("#frmUserAuthorization").valid()) {
                var userID = userAuthorizationUI.userAuthorizationModel.Data.UserID();
                userAuthorizationUIData.loadUser(userID);
            }
        });

        $("#btnSave").click(function () {
            sg.utls.SyncExecute(userAuthorizationUIData.saveUser);
        });
    },

    initTextBox: function () {
        $("#Data_UserID").bind('blur', function (e) {
            sg.utls.SyncExecute(userAuthorizationUIData.loadUserOnTextChange);
        });
    },

    initFinder: function () {
        var title = jQuery.validator.format(userAuthorizationResources.FinderTitle, userAuthorizationResources.UsersTitle);
        sg.finderHelper.setFinder("btnFinderUser", sg.finder.User, userAuthorizationsUISuccess.userFinderSuccess, function () { sg.controls.Focus($("#Data_UserID")); }, title, userAuthorizationFitler.getFilter);
    },

    bindData: function (result) {
        if (!userAuthorizationUI.hasKoBindingApplied) {
            userAuthorizationUI.userAuthorizationModel = ko.mapping.fromJS(result);
            userAuthorizationUI.hasKoBindingApplied = true;
            ko.applyBindings(userAuthorizationUI.userAuthorizationModel);
            userAuthorizationUI.userAuthorizationModel.isModelDirty = new ko.dirtyFlag(userAuthorizationUI.userAuthorizationModel.Data, userAuthorizationUI.ignoreProperties);
        } else {
            if (result.UserMessage.IsSuccess) {
                ko.mapping.fromJS(result, userAuthorizationUI.userAuthorizationModel);
                userAuthorizationUI.userAuthorizationModel.isModelDirty.reset();
            }
        }

        userAuthorizationsUISuccess.setKey();

        if (userAuthorizationUI.userAuthorizationModel.Data.UserID() != "") {
            userAuthorizationUI.isFirstLoad = false;
        }

        var userAuthFilter = null;
        if (userAuthorizationUI.userAuthorizationModel.Data.UserID() != null || userAuthorizationUI.userAuthorizationModel.Data.UserID() == "") {
            userAuthFilter = userAuthorizationFitler.userFilter(userAuthorizationUI.userAuthorizationModel.Data.UserID());
        }

        if (userAuthorizationUI.isValidUser && result.UserMessage.IsSuccess) {
            $("#UserAuthorizationGrid").data("kendoGrid").dataSource.read({
                pageNumber: 0,
                pageSize: sg.utls.gridPageSize,
                filter: userAuthFilter,
            });
        }

        if (userAuthorizationUI.userAuthorizationModel.Data.UserID() == admin) {
            sg.utls.showMessageInfo(sg.utls.msgType.ERROR, userAuthorizationResources.MsgAdminAuthorized);
            userAuthorizationUI.isAdmin = true;
        } else {
            userAuthorizationUI.isAdmin = false;
        }

        if (userAuthorizationUI.userAuthorizationModel.InvalidUserId()) {
            sg.utls.showMessageInfo(sg.utls.msgType.ERROR, userAuthorizationResources.InvalidInput);
        } else {
            if (!userAuthorizationUI.isAdmin) {
                sg.utls.showMessage(result);
            }
        }
        userAuthorizationUI.operationModes = userAuthorizationUI.userAuthorizationModel.OperationModes();
    }
};

var userAuthorizationFitler = {
    getFilter: function () {
        var filters = [[]];
        filters[0][0] = sg.finderHelper.createFilter("UserID", sg.finderOperator.StartsWith, sg.utls.toUpperCase(userAuthorizationUI.userAuthorizationModel.Data.UserID()));

        return filters;
    },

    userFilter: function (userId) {
        var filters = [[]];
        filters[0][0] = sg.finderHelper.createFilter("UserID", sg.finderOperator.Equal, sg.utls.toUpperCase(userId));
        return filters;
    }
};

var userAuthorizationUIData = {

    getRowIndex: function (programId, programVersion, grid) {
        var rowIndex = 0
        $.each(grid._data, function (index, item) {
            if (item.ProgramID == programId && item.ProgramVersion == programVersion) {
                rowIndex = index;
                return;
            }
        });
        return rowIndex;
    },

    getGridDataItem: function (grid, programID, programVersion) {
        var dataItem;
        $.each(grid.dataSource.data(), function (index, item) {
            if (item.ProgramID == programID && item.ProgramVersion == programVersion) {
                dataItem = item;
            }
        });
        return dataItem;
    },

    loadUser: function () {
        var userID = $("#Data_UserID").val();
        if (userID != null && userID != "") {
            userAuthorizationUI.userAuthorizationModel.Data.UserID(userID.toUpperCase());
            userAuthorizationUI.userID = userAuthorizationUI.userAuthorizationModel.Data.UserID();
            userAuthorizationsRepository.getByUserId(userAuthorizationFitler.userFilter(userID));
        }
    },

    getUserAuthorizationModel: function (programId, programversion) {
        var userAuthorization = null;
        $.each(userAuthorizationUI.userAuthorizationModel.Data.UserAuthorizations.Items(), function (index, item) {
            if (item.ProgramID() == programId && item.ProgramVersion() == programversion) {
                userAuthorization = item;
                return;
            }
        });
        return userAuthorization;
    },

    checkIfModelDirty: function (functionToCall, data) {
        if (!userAuthorizationUI.isFirstLoad && userAuthorizationUI.userAuthorizationModel.isModelDirty.isDirty()) {
            sg.utls.showKendoConfirmationDialog(
                function () {
                    functionToCall(data);
                },
                function () {
                    userAuthorizationUI.userAuthorizationModel.Data.UserID(userAuthorizationUI.loadedUserID);
                },
                jQuery.validator.format(globalResource.SaveConfirm, userAuthorizationResources.UsersTitle, userAuthorizationUI.loadedUserID));
        } else {
            functionToCall(data);
        }
    },

    loadUserOnTextChange: function () {
        sg.delayOnBlur("btnFinderUser", function () {
            var txtUserIdVal = $("#Data_UserID").val();
            if (txtUserIdVal != "" && txtUserIdVal.toUpperCase() != userAuthorizationUI.userID) {
                if ($("#frmUserAuthorization").valid()) {
                    var userID = userAuthorizationUI.userAuthorizationModel.Data.UserID();
                    userAuthorizationUIData.checkIfModelDirty(userAuthorizationUIData.loadUser);
                }
            }
        });
    },

    saveUser: function () {
        if (!$(this).is(':disabled') && $("#frmUserAuthorization").valid() && $("#message")[0].textContent == "") {
            userAuthorizationsRepository.saveUserAuthorization(userAuthorizationUI.userAuthorizationModel.Data);
        } else {
            if (userAuthorizationUI.userAuthorizationModel.Data.UserID() == null || userAuthorizationUI.userAuthorizationModel.Data.UserID() == ""
                && userAuthorizationUI.isValidUser) {
                var blankUserIDMessage = jQuery.validator.format(userAuthorizationResources.BlankUserID, userAuthorizationResources.UserID);
                sg.utls.showMessageInfo(sg.utls.msgType.ERROR, blankUserIDMessage);
            }
            userAuthorizationUI.isValidUser = true;
        }
    },

};

var UserAuthorizationHeader = {
    ApplicationTitle: $(userAuthorizationGridColumns.headerApplication).text(),
    ApplicationHidden: $(userAuthorizationGridColumns.headerApplication).attr("hidden") ? $(userAuthorizationGridColumns.headerApplication).attr("hidden") : false,

    GroupDescriptionTitle: $(userAuthorizationGridColumns.headerGroupDescription).text(),
    GroupDescriptionHidden: $(userAuthorizationGridColumns.headerGroupDescription).attr("hidden") ? $(userAuthorizationGridColumns.headerGroupDescription).attr("hidden") : false,

    GroupIDTitle: $(userAuthorizationGridColumns.headerGroupId).text(),
    GroupIDHidden: $(userAuthorizationGridColumns.headerGroupId).attr("hidden") ? $(userAuthorizationGridColumns.headerGroupId).attr("hidden") : false,

};


var userAuthorizationUIGrid = {
    userAuthorizationLineId: null,
    changeFromServer: false,

    getSecGroupFilter: function() {
        $("#message").empty();
        var filters = [[]];
        var secGroup = "";
        if (userAuthorizationUI.securityGroupStartWithText == null) {
            userAuthorizationUI.securityGroupStartWithText = sg.utls.toUpperCase(sg.utls.toUpperCase($("#txtGroupIdField").val()));
        } else if (userAuthorizationUI.securityGroupStartWithText != "") {
            userAuthorizationUI.securityGroupStartWithText = sg.utls.toUpperCase(userAuthorizationUI.securityGroupStartWithText);
        }
        filters[0][0] = sg.finderHelper.createFilter("GroupId", sg.finderOperator.StartsWith, userAuthorizationUI.securityGroupStartWithText);

        var userAuthorizationsData = sg.utls.kndoUI.getSelectedRowData($('#UserAuthorizationGrid').data("kendoGrid"));

        filters[0][1] = sg.finderHelper.createFilter("ProgramId", sg.finderOperator.Equal, userAuthorizationsData.ProgramID);
        filters[0][1].IsMandatory = true;

        filters[0][2] = sg.finderHelper.createFilter("ProgramVersion", sg.finderOperator.Equal, userAuthorizationsData.ProgramVersion);
        filters[0][2].IsMandatory = true;

        filters[0][3] = sg.finderHelper.createFilter("ResourceId", sg.finderOperator.Equal, " ");
        filters[0][3].IsMandatory = true;

        return filters;
    },

    entryDetailsConfig: {
        scrollable: true,
        sortable: false,
        resizable: true,
        selectable: true,
        pageSize: sg.utls.gridPageSize,
        navigatable: true,
        isServerPaging: true,
        pageable: false,
        editable: {
            mode: "incell",
            confirmation: false
        },
        pageUrl: sg.utls.url.buildUrl("AS", "UserAuthorization", "GetUserAuthorizationByUser"),
        buildGridData: function(result) {
            var gridData = [];

            ko.mapping.fromJS(result, {}, userAuthorizationUI.userAuthorizationModel.Data.UserAuthorizations);

            gridData.data = result.Items;
            gridData.totalResultsCount = result.TotalResultsCount;
            userAuthorizationUI.userAuthorizationModel.isModelDirty.reset();
            return gridData;
        },
        save: function(e) {
            var grid = '';
            if (e.values.GroupID == "") {
                e.model.GroupDescription = "";
            }
        },
        filters: null,
        columns: [
            {
                field: "ProgramName",
                title: UserAuthorizationHeader.ApplicationTitle,
                hidden: UserAuthorizationHeader.ApplicationHidden,
                attributes: { "class": "gird_culm_4" },
                headerAttributes: { "class": "gird_culm_4" },
                editor: function(container, options) {
                    var grid = $('#UserAuthorizationGrid').data("kendoGrid");
                    grid.select(container.closest("tr"));
                    sg.utls.kndoUI.nonEditable(grid, container);
                }
            },
            {
                field: "GroupID",
                title: UserAuthorizationHeader.GroupIDTitle,
                hidden: UserAuthorizationHeader.GroupIDHidden,
                attributes: { "class": "gird_culm_4" },
                headerAttributes: { "class": "gird_culm_4" },
                editor: function(container, options) {
                    if (userAuthorizationUI.userAuthorizationModel.Data.UserID() == null
                        || userAuthorizationUI.userAuthorizationModel.Data.UserID() == "" || userAuthorizationUI.isAdmin
                        || !userAuthorizationUI.isValidUser) {
                        var grid = $('#UserAuthorizationGrid').data("kendoGrid");
                        sg.utls.kndoUI.nonEditable(grid, container);
                    } else {
                        userAuthorizationUI.selectedRecord = options.model;
                        userAuthorizationUI.oldSecurityGroupID = sg.utls.toUpperCase(options.model.GroupID);

                        var html = userAuthorizationGridFields.txtGroupIdField + userAuthorizationGridFields.finderGroupIdField;
                        $(html).appendTo(container);

                        var title = jQuery.validator.format(userAuthorizationResources.FinderTitle, userAuthorizationResources.SecurityGroupTitle);
                        sg.finderHelper.setFinder(
                            "btnGroupIdFinder",
                            sg.finder.SecurityGroup,
                            userAuthorizationsUISuccess.securityGroupfinderSuccess,
                            userAuthorizationsUISuccess.securityGroupfinderCancel,
                            title,
                            userAuthorizationUIGrid.getSecGroupFilter
                        );

                        userAuthorizationUI.securityGroupStartWithText = sg.utls.toUpperCase(options.model.GroupID);
                    }
                },
            },
            {
                field: "GroupDescription",
                title: UserAuthorizationHeader.GroupDescriptionTitle,
                hidden: UserAuthorizationHeader.GroupDescriptionHidden,
                attributes: { "class": "gird_culm_8" },
                headerAttributes: { "class": "gird_culm_8" },
                editor: function(container, options) {
                    var grid = $('#UserAuthorizationGrid').data("kendoGrid");
                    grid.select(container.closest("tr"));
                    sg.utls.kndoUI.nonEditable(grid, container);
                }
            },
            {
                field: "SecurityGroupExists",
                title: UserAuthorizationHeader.GroupDescriptionTitle,
                attributes: { "class": "gird_culm_8" },
                headerAttributes: { "class": "gird_culm_8" },
                hidden: true
            }
        ],
        dataChange: function(changedValue) {
            if (changedValue.columnName === "GroupID") {
                if (!userAuthorizationUIGrid.changeFromServer) {
                    userAuthorizationUI.securityGroupStartWithText = changedValue.rowData.GroupID;
                    sg.delayOnDataChange("btnGroupIdFinder", changedValue.rowData, changedValue.columnName, function() {
                        if (sg.utls.toUpperCase(userAuthorizationUI.securityGroupStartWithText) != userAuthorizationUI.oldSecurityGroupID) {
                            if (userAuthorizationUI.securityGroupStartWithText == "" && userAuthorizationUI.oldSecurityGroupID != null) {
                                var gridData = userAuthorizationUIData.getGridDataItem($('#UserAuthorizationGrid').data("kendoGrid"), changedValue.rowData.ProgramID, changedValue.rowData.ProgramVersion);
                                gridData.set("GroupDescription", null);
                                var userAuthmodelData = userAuthorizationUIData.getUserAuthorizationModel(changedValue.rowData.ProgramID, changedValue.rowData.ProgramVersion);
                                if (userAuthmodelData != null) {
                                    if (userAuthmodelData.OperationMode() == operationMode.None) {
                                        userAuthmodelData.OperationMode(operationMode.Delete);
                                        userAuthmodelData.GroupDescription("");
                                    }
                                }
                            } else if (userAuthorizationUI.securityGroupStartWithText != null && userAuthorizationUI.securityGroupStartWithText != "") {
                                userAuthorizationsRepository.getSecurityGroup(changedValue.rowData.ProgramID, changedValue.rowData.ProgramVersion, sg.utls.toUpperCase(userAuthorizationUI.securityGroupStartWithText));
                            }
                        }
                    });
                } else {
                    userAuthorizationUIGrid.changeFromServer = false;
                }
            }
        },
      
    },
};

var onFinderSuccess = {
    users: function (data) {
        if (data != null) {
            userAuthorizationUI.userAuthorizationModel.Data.UserID(data.UserID);
        }
    }
};

var userAuthorizationsUISuccess = {
    bindData: function (result) {
        if (result.Data != null && result.Data.UserID == null) {
            userAuthorizationUI.isValidUser = false;
            sg.utls.showMessageInfo(sg.utls.msgType.ERROR, userAuthorizationResources.InvalidInput);
            userAuthorizationUI.bindData(result);
            userAuthorizationUI.userAuthorizationModel.Data.UserID("")
            userAuthorizationUI.userID = "";
            sg.controls.Focus($("#Data_UserID"));
        } else {
            userAuthorizationUI.isValidUser = true;
            userAuthorizationUI.bindData(result);
            if (!userAuthorizationUI.isAdmin) {
                sg.utls.showMessage(result);
            }

        }
    },

    userFinderSuccess: function (result) {
        if (result != null) {
            userAuthorizationUIData.checkIfModelDirty(userAuthorizationsRepository.getByUserId, userAuthorizationFitler.userFilter(result.UserID));
        }
    },

    securityGroupfinderSuccess: function (result, id) {
        if (result != null) {
            if (result.GroupId != "") {
                userAuthorizationsUISuccess.setSecurityGroup(result, $('#UserAuthorizationGrid').data("kendoGrid"), userAuthorizationUI.selectedRecord.ProgramID, userAuthorizationUI.selectedRecord.ProgramVersion);
                var grid = $('#UserAuthorizationGrid').data("kendoGrid");
                var gridData = userAuthorizationUIData.getGridDataItem(grid, userAuthorizationUI.selectedRecord.ProgramID, userAuthorizationUI.selectedRecord.ProgramVersion);
                var index = userAuthorizationUIData.getRowIndex(gridData.ProgramID, gridData.ProgramVersion, grid);
                userAuthorizationsUISuccess.editCell(index, 1);

                grid.select(grid.tbody.find(">tr:eq(" + index + ")"))
            }
        }
    },

    securityGroupfinderCancel: function () {
        sg.controls.Focus($("#txtGroupIdField"));

        userAuthorizationUI.securityGroupStartWithText = userAuthorizationUI.oldSecurityGroupID;
        var userAuthorizationData = userAuthorizationUIData.getUserAuthorizationModel(userAuthorizationUI.selectedRecord.ProgramID, userAuthorizationUI.selectedRecord.ProgramVersion);
        if (userAuthorizationData != null) {
            userAuthorizationData.OperationMode(operationMode.Update);
        }
        var grid = $('#UserAuthorizationGrid').data("kendoGrid");
        var gridData = userAuthorizationUIData.getGridDataItem(grid, userAuthorizationUI.selectedRecord.ProgramID, userAuthorizationUI.selectedRecord.ProgramVersion);
        var index = userAuthorizationUIData.getRowIndex(gridData.ProgramID, gridData.ProgramVersion, grid);
        userAuthorizationsUISuccess.editCell(index, 1);
    },

    getSecurityGroup: function (result) {
        if (result) {
            $("#message").empty();
            var grid = $('#UserAuthorizationGrid').data("kendoGrid");
            
            var gridData = sg.utls.kndoUI.getRowByKey(grid.dataSource.data(), "ProgramID", result.ProgramID);
            var index = userAuthorizationUIData.getRowIndex(result.ProgramID, result.ProgramVersion, grid);
            if (result.SecurityGroupExists) {
                userAuthorizationUI.oldSecurityGroupID = result.GroupID;
                userAuthorizationsUISuccess.setSecurityGroup(result, grid, result.ProgramID, result.ProgramVersion);
                index++;
            } else {
                grid.closeCell();
                sg.utls.showMessageInfo(sg.utls.msgType.ERROR,
                    jQuery.validator.format(userAuthorizationResources.InvalidSecurityGroup, userAuthorizationResources.SecurityGroupRecTitle,
                    sg.utls.toUpperCase(result.GroupID)));

                if (gridData != null) {
                    var modelData = userAuthorizationUIData.getUserAuthorizationModel(result.ProgramID, result.ProgramVersion);
                    userAuthorizationUIGrid.changeFromServer = true;
                    gridData.set("GroupID", sg.utls.toUpperCase(modelData.GroupID()));
                    gridData.set("GroupDescription", "");
                    userAuthorizationUIGrid.changeFromServer = false;
                    modelData.OperationMode(operationMode.Update);
                    userAuthorizationsUISuccess.editCell(index, 2);
                    userAuthorizationsUISuccess.editCell(index, 1);
                }
            }
            
        }
    },

    editCell: function (rowIndex, cellIndex) {
        var grid = $('#UserAuthorizationGrid').data("kendoGrid");
        var cell = grid.tbody.find("tr:eq(" + rowIndex + ") > td:eq(" + cellIndex + ")");
        if (cell != undefined && cell != null) {
            grid.editCell(cell);
        }
        grid.select(grid.tbody.find("tr:eq(" + rowIndex + ")"));
    },

    setSecurityGroup: function (result, grid, programId, programVersion) {
        if (userAuthorizationUI.selectedRecord.GroupID != "") {
            userAuthorizationUI.selectedRecord.OperationMode = operationMode.Update;
        } else {
            userAuthorizationUI.selectedRecord.OperationMode = operationMode.Add;
            userAuthorizationUI.selectedRecord.IsNewLine = true;
        }
        var gridData = sg.utls.kndoUI.getRowByKey(grid.dataSource.data(), "ProgramID", programId);
        userAuthorizationUIGrid.changeFromServer = true;
        var groupId = result.GroupId === undefined ? result.GroupID : result.GroupId;
        gridData.set("GroupID", groupId);
        userAuthorizationUIGrid.changeFromServer = false;
        gridData.set("GroupDescription", result.GroupDescription);
        gridData.set("OperationMode", userAuthorizationUI.selectedRecord.OperationMode);
        
        var userAuthorizationData = userAuthorizationUIData.getUserAuthorizationModel(userAuthorizationUI.selectedRecord.ProgramID, userAuthorizationUI.selectedRecord.ProgramVersion);
        if (userAuthorizationData != null) {
            userAuthorizationData.GroupID(groupId);
            userAuthorizationData.GroupDescription(result.GroupDescription);
            userAuthorizationData.OperationMode(userAuthorizationUI.selectedRecord.OperationMode);
        }

    },

    setKey: function () {
        userAuthorizationUI.loadedUserID = userAuthorizationUI.userAuthorizationModel.Data.UserID();
    },
}

$(function () {
    userAuthorizationUI.init();
    $(window).bind('beforeunload', function () {
        if (userAuthorizationUI.userAuthorizationModel.isModelDirty.isDirty()) {
            return jQuery('<div />').html(jQuery.validator.format(globalResource.SaveConfirm2, userAuthorizationResources.UserAuthorization)).text();
        }
    });
});


