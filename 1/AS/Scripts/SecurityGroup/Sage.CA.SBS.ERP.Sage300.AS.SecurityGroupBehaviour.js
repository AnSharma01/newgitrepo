"use strict";
var securityGroupUI = securityGroupUI || {};
securityGroupUI = {
    securityGroupModel: {},
    isKendoControlNotInitialised: false,
    ignoreIsDirtyProperties: ["ProgramId", "ProgramVersion", "selectedSecurityAccess", "UIMode", "GroupId", ],
    securityGroup: null,
    groupId: null,
    programId: null,
    finderData: null,
    grid: null,
    init: function () {
        securityGroupUI.initButtons();
        securityGroupUI.initFinders();
        onUISuccess.initialLoad(securityGroupViewModel);
        securityGroupUI.initOnBlur();
        securityGroupUI.initCheckbox();

    },
    initButtons: function () {
        sg.exportHelper.setExportEvent("btnOptionExport", sg.dataMigration.SecurityGroup, false, $.noop);
        sg.importHelper.setImportEvent("btnOptionImport", sg.dataMigration.SecurityGroup, false, $.noop);

        $("#btnNew").bind("click", function () {
            sg.utls.SyncExecute(securityGroupUI.createNew);
        });
        $("#btnSave").bind('click', function () {
            sg.utls.SyncExecute(securityGroupUI.save);
        });
        $("#btnDelete").bind('click', function (event) {
            sg.utls.SyncExecute(securityGroupUI.delete);
        });
    },
    initFinders: function () {
        var title = window.$.validator.format(securityGroupResources.FinderTitle, securityGroupResources.SecurityGroupTitleForFinder);
        window.sg.finderHelper.setFinder("btnGroupIdFinder", window.sg.finder.SecurityGroup, onUISuccess.finderSuccess, $.noop, title, securityGroupFilter.getFilter);
    },
    initDropDownList: function () {
        sg.utls.kndoUI.dropDownList("Data_ActiveApplication");
    },
    initOnBlur: function () {
        $("#Data_GroupId").change(function () {
            sg.utls.SyncExecute(securityGroupUI.loadGroupOnTextChange);
        });

    },
    initCheckbox: function () {


        $(document).on("change", "#selectAllChk", function () {
            if (securityGroupUI.grid != null) {
                securityGroupUI.grid = $("#SecurityAccessGrid").data("kendoGrid");
            }
            var checkbox = $(this);
            securityGroupUI.grid.tbody.find("tr").find("td:first input")
                .prop("checked", checkbox.is(":checked")).applyCheckboxStyle();

            if ($("#selectAllChk").is(":checked")) {
                securityGroupUI.grid.tbody.find(".selectChk").each(function (index) {
                    securityGroupUI.grid.tbody.find("tr").addClass("k-state-active");
                    securityGroupUI.securityGroupModel.Data.ApplicationSecurityResources.Items()[index].HasChanged(true);
                });
            } else {
                securityGroupUI.grid.tbody.find("tr").removeClass("k-state-active");
            }
        });

        $(document).on("change", ".selectChk", function () {
            var allChecked = true;
            $(this).closest("tr").toggleClass("k-state-active");
            securityGroupUI.grid.tbody.find(".selectChk").each(function (index) {

                if (!($(this).is(':checked'))) {
                    $("#selectAllChk").prop("checked", false).applyCheckboxStyle();
                    allChecked = false;
                    securityGroupUI.securityGroupModel.Data.ApplicationSecurityResources.Items()[index].HasChanged(false);
                    return;
                } else {
                    securityGroupUI.securityGroupModel.Data.ApplicationSecurityResources.Items()[index].HasChanged(true);
                }
            });
            if (allChecked) {
                $("#selectAllChk").prop("checked", true).applyCheckboxStyle();
            }
        });
    },
    checkIsDirty: function (funcionToCall, Id) {
        if (securityGroupUI.securityGroupModel.isModelDirty.isDirty()) {

            var errorMessage = $.validator.format(globalResource.SaveConfirm, securityGroupResources.SecurityGroupLabel, sg.utls.toUpperCase(securityGroupUI.groupId));
            sg.utls.showKendoConfirmationDialog(
                function () { // Yes
                    sg.utls.clearValidations("securityGroupForm");
                    funcionToCall(Id);
                },
                function () { // No
                    if (sg.controls.GetString(Id) != sg.controls.GetString(securityGroupUI.securityGroupModel.Data.GroupId())) {
                        securityGroupUI.securityGroupModel.Data.GroupId(securityGroupUI.groupId);
                    }
                    if (securityGroupUI.programId != securityGroupUI.securityGroupModel.Data.ProgramId()) {
                        var dropdown = $("#Data_ActiveApplication").data("kendoDropDownList");
                        if (dropdown != undefined) {
                            // selects item if its text is equal to "test" using predicate function
                            dropdown.select(function (dataItem) {
                                return dataItem.value === securityGroupUI.securityGroupModel.Data.ProgramId();
                            });
                        }
                    }
                    return;
                },
                errorMessage);
        } else {
            funcionToCall(Id);
        }
    },
    createNew: function () {
        if (securityGroupUI.securityGroupModel.Data.GroupId() == "") {
            securityGroupUI.groupId = null;
        } 
        securityGroupUI.checkIsDirty(securityGroupUI.create, securityGroupUI.groupId);
       
    },
    create: function () {
        sg.utls.clearValidations("securityGroupForm");
        securityGroupRepository.create(securityGroupUI.securityGroupModel.Data);
    },
    save: function () {
        if (!$(this).is(':disabled') && $("#securityGroupForm").valid() && $("#message")[0].textContent === "") {
            var data = sg.utls.ko.toJS(securityGroupUI.securityGroupModel.Data, securityGroupKoExtn.computedProperties);
            if (securityGroupUI.securityGroupModel.Data.UIMode() === sg.utls.OperationMode.SAVE) {
                securityGroupRepository.update(data);
            } else {
                securityGroupRepository.add(data);
            }
        }
    },
    delete: function () {
        if (!$(this).is(':disabled') && $("#message")[0].textContent === "") {
            if ($("#securityGroupForm").valid()) {
                var message = $.validator.format(securityGroupResources.DeleteConfirmMessage, securityGroupResources.SecurityGroupLabel, securityGroupUI.securityGroupModel.Data.GroupId);
                sg.utls.showKendoConfirmationDialog(function () {
                    sg.utls.clearValidations("securityGroupForm");
                    securityGroupRepository.delete(securityGroupUI.securityGroupModel.Data.ProgramId(), securityGroupUI.securityGroupModel.Data.ProgramVersion(), securityGroupUI.securityGroupModel.Data.GroupId());
                },
                    null, message,
                    securityGroupResources.DeleteTitle);
            }
        }
    },
    getByGroupId: function (groupId) {
        var modelData = securityGroupUI.securityGroupModel.Data;
        modelData.GroupId(groupId);
        securityGroupUI.groupId = groupId;
        securityGroupRepository.getById(modelData);
    },
    loadGroupOnTextChange: function () {
        sg.delayOnChange("btnGroupIdFinder", $("#Data_GroupId"), function () {
            if ($("#Data_GroupId").val() != "") {
                SecurityGroupUtility.onTabOut($("#Data_GroupId").val().toUpperCase());
            }
        });
    }
};

var securityAccessGridHeader = {
    rescDescTitle: $(secAccessGridColumns.headerResourceDesc).text(),
    rescDescHidden: $(secAccessGridColumns.headerResourceDesc).attr("hidden") ? $(secAccessGridColumns.headerResourceDesc).attr("hidden") : false,
    rescIdTitle: $(secAccessGridColumns.headerResourceId).text(),
    rescIdHidden: $(secAccessGridColumns.headerResourceId).attr("hidden") ? $(secAccessGridColumns.headerResourceId).attr("hidden") : false,
};
var onUISuccess = {
    initialLoad: function (result) {
        if (result) {
            var uiMode;
            securityGroupUI.securityGroupModel = ko.mapping.fromJS(result);
            if (onUISuccess.isNew(securityGroupUI.securityGroupModel.Data)) {
                uiMode = sg.utls.OperationMode.NEW;
            }
            else {
                uiMode = sg.utls.OperationMode.SAVE;
            }
            SecurityGroupModelExtension(securityGroupUI.securityGroupModel.Data, uiMode);
            securityGroupUI.securityGroupModel.isModelDirty = new ko.dirtyFlag(securityGroupUI.securityGroupModel.Data, securityGroupUI.ignoreIsDirtyProperties);
            ko.applyBindings(securityGroupUI.securityGroupModel);
            securityGroupUI.grid = $("#SecurityAccessGrid").data("kendoGrid");
            if (result.selectedSecurityAccess != null && result.selectedSecurityAccess.length > 0) {
                securityGroupUI.securityGroupModel.Data.selectedSecurityAccess = result.selectedSecurityAccess;
                SecurityGroupUtility.setSelectedDataForGroupId();
                securityGroupUI.groupId = securityGroupUI.securityGroupModel.Data.GroupId();

            }
        }
        else {
            // Error Message 
            ko.mapping.fromJS(result, securityGroupUI.securityGroupModel);
            //Reset Is Dirty
            securityGroupUI.securityGroupModel.isModelDirty.reset();
        }

        if (!securityGroupUI.isKendoControlNotInitialised) {
            securityGroupUI.isKendoControlNotInitialised = true;
            securityGroupUI.initDropDownList();
        }
        var dropdown = $("#Data_ActiveApplication").data("kendoDropDownList");
        if (dropdown != undefined) {
            dropdown.bind("select", SecurityGroupUtility.selectionChanged);
            // selects item if its text is equal to "test" using predicate function
            dropdown.select(function (dataItem) {
                return dataItem.text === result.selectedApplication;
            });
        }
    },
    isNew: function (model) {
        if (model.GroupDescription() === null || model.GroupDescription() === "") {
            return true;
        }
        return false;
    },
    displayResult: function (result) {
        if (result.UserMessage && result.UserMessage.IsSuccess) {
            if (result.Data != null) {
                ko.mapping.fromJS(result, securityGroupUI.securityGroupModel);
                if (onUISuccess.isNew(securityGroupUI.securityGroupModel.Data)) {
                    securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.NEW);
                }
                else {
                    securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.SAVE);
                }
                securityGroupUI.securityGroupModel.Data.ProgramId(result.Data.ProgramId);
                securityGroupUI.securityGroupModel.Data.ProgramVersion(result.Data.ProgramVersion);

                if (result.selectedSecurityAccess != null && result.selectedSecurityAccess.length > 0) {
                    securityGroupUI.securityGroupModel.Data.selectedSecurityAccess = result.selectedSecurityAccess;
                    SecurityGroupUtility.setSelectedDataForGroupId();
                    securityGroupUI.groupId = securityGroupUI.securityGroupModel.Data.GroupId();
                }
            } else {
                securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.NEW);
            }
        }
        if (securityGroupUI.grid != " " || securityGroupUI.grid != undefined) {
            securityGroupUI.grid = $("#SecurityAccessGrid").data("kendoGrid");
        }
        $("#SecurityAccessGrid").data("kendoGrid").dataSource.read({
            pageNumber: 0,
            pageSize: sg.utls.gridPageSize,
            filter: securityGroupFilter.createGridFilter(),
        });
    },
    finderSuccess: function (result) {
        sg.utls.clearValidations("securityGroupForm");
        securityGroupUI.finderData = result;
        if (securityGroupUI.securityGroupModel.Data.GroupId() === null || securityGroupUI.securityGroupModel.Data.GroupId() === "") {
            securityGroupUI.securityGroupModel.isModelDirty.reset();
        }
        securityGroupUI.checkIsDirty(securityGroupUI.getByGroupId, result.GroupId);
    },
    finderSuccessforSelectedGroup: function (result) {
        sg.utls.clearValidations("securityGroupForm");
        securityGroupUI.groupId = securityGroupUI.securityGroupModel.Data.GroupId();
        if (result.Data.GroupId !== null && result.Data.GroupId !== "" && result.Data.GroupDescription!=null && result.Data.GroupDescription != "") {
            securityGroupUI.securityGroupModel.Data.GroupDescription(result.Data.GroupDescription);

        }
        securityGroupUI.securityGroupModel.Data.selectedSecurityAccess = result.selectedSecurityAccess;
        SecurityGroupUtility.setSelectedDataForGroupId();

        if (onUISuccess.isNew(securityGroupUI.securityGroupModel.Data)) {
            securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.NEW);
        }
        else {
            securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.SAVE);
        }
        securityGroupUI.securityGroupModel.isModelDirty.reset();
    },
    create: function (result) {
        if (result.UserMessage && result.UserMessage.IsSuccess) {
            ko.mapping.fromJS(result, securityGroupUI.securityGroupModel);
            securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.NEW);
            sg.controls.Focus($("#Data_ActiveApplication"));
            SecurityGroupUtility.clearCheckbox();
            securityGroupUI.grid.refresh();
            securityGroupUI.securityGroupModel.isModelDirty.reset();
        }
    },
    update: function (result) {
        if (result.UserMessage && result.UserMessage.IsSuccess) {
            securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.SAVE);
            securityGroupUI.securityGroupModel.Data.selectedSecurityAccess = result.Data.ApplicationSecurityResources.Items;
            securityGroupUI.securityGroupModel.isModelDirty.reset();
            sg.controls.Focus($("#Data_ActiveApplication"));
        }
        sg.utls.showMessage(result);
    },
    delete: function (result) {
        if (result) {
            if (result.UserMessage && result.UserMessage.IsSuccess) {
                securityGroupUI.securityGroupModel.Data.UIMode(sg.utls.OperationMode.NEW);
                securityGroupUI.securityGroupModel.isModelDirty.reset();
                SecurityGroupUtility.setSelectedDataForGroupId();
            }
            sg.utls.showMessage(result);
        } else {
            sg.utls.showMessageInfo(sg.utls.msgType.ERROR, securityGroupResources.ProcessFailedMessage);
        }
    },

};

var SecurityGroupUtility = {
    securityAccessGridColumns: [
        {
            field: "Delete",
            attributes: {
                "class": "first-cell newcontrol"
            },
            headerAttributes: {
                "class": "first-cell newcontrol"
            },
            template: sg.controls.ApplyCheckboxStyle("<input type='checkbox' class='selectChk' />"),
            headerTemplate: sg.controls.ApplyCheckboxStyle("<input type='checkbox' id='selectAllChk' />"),
            editor: function (container, options) {

                var grid = $("#SecurityAccessGrid").data("kendoGrid");
                grid.select(container.closest("tr"));
                sg.utls.kndoUI.nonEditable(grid, container);
            }
        },
    {
        field: "ResourceID", hidden: true, title: securityAccessGridHeader.rescIdTitle,
        attributes: {
            disabled: "true", "class": "gird_culm_6"
        },
        headerAttributes: {
            "class": "gird_culm_6"
        }
    },
      {
          field: "ResourceDescription",
          hidden: securityAccessGridHeader.rescDescHidden,
          title: securityAccessGridHeader.rescDescTitle,
          attributes: {
              "class": "gird_culm_18 "
          },
          headerAttributes: {
              "class": "gird_culm_18 "
          },
          editor: function (container, options) {

          }
      },
    ],
    setSecurityAccessGridData: function (successData) {
        var gridData = null;
        if (successData != null) {
            gridData = [];
            //Update the Knockout observable array.
            ko.mapping.fromJS(successData, {}, securityGroupUI.securityGroupModel.Data.ApplicationSecurityResources);
            //Notify the grid which part of the returned data contains the items for the grid. 
            gridData.data = successData.Items;
            //Notify the grid which part of the returned data contains the total number of items for the grid.
            gridData.totalResultsCount = successData.TotalResultsCount;

            securityGroupUI.securityGroupModel.isModelDirty.reset();

            return gridData;
        }
    },
    setSelectedSecurityAccess: function () {
        if (securityGroupUI.securityGroupModel.Data.selectedSecurityAccess != null && securityGroupUI.securityGroupModel.Data.UIMode() != sg.utls.OperationMode.NEW) {
            SecurityGroupUtility.setSelectedDataForGroupId();
        }
        if (securityGroupUI.grid._data.length === 0) {
            $("#selectAllChk").attr("disabled", true);
        }
        else {
            $("#selectAllChk").attr("disabled", false);
        }
    },
    selectionChanged: function (e) {
        var dataItem = this.dataItem(e.item.index());
        if (dataItem.value != securityGroupUI.securityGroupModel.Data.ProgramId()) {
            sg.utls.clearValidations("securityGroupForm");
            securityGroupUI.programId = dataItem.value;
            securityGroupUI.checkIsDirty(SecurityGroupUtility.onDropDownChange, securityGroupUI.securityGroupModel.Data.ProgramId());
        }
    },
    setSelectedDataForGroupId: function () {
        var IsChecked = false;
        securityGroupUI.grid.tbody.find(".selectChk").closest("tr").each(function (index) {
            var gridVal = $(this).find(".gird_culm_6")[0].innerText;
            $.each(securityGroupUI.securityGroupModel.Data.selectedSecurityAccess, function (index, row) {
                if (row.ResourceID === gridVal) {
                    IsChecked = true;
                }
            });

            securityGroupUI.securityGroupModel.Data.ApplicationSecurityResources.Items()[index].HasChanged(IsChecked);
            if (IsChecked) {
                $(this).closest("tr").addClass("k-state-active");
                $(this).find(".selectChk").prop("checked", true).applyCheckboxStyle();
                IsChecked = false;
            }
            else {
                $(this).closest("tr").removeClass("k-state-active");
                $(this).find(".selectChk").prop("checked", false).applyCheckboxStyle();
            }
        });
        if (securityGroupUI.grid._data != undefined && securityGroupUI.securityGroupModel.Data.selectedSecurityAccess != null) {
            if (securityGroupUI.grid._data.length === securityGroupUI.securityGroupModel.Data.selectedSecurityAccess.length && securityGroupUI.grid._data.length != 0) {
                $("#selectAllChk").prop("checked", true).applyCheckboxStyle();
            }
            else {
                $("#selectAllChk").prop("checked", false).applyCheckboxStyle();
            }
        }
    },
    clearCheckbox: function () {
        securityGroupUI.grid.tbody.find(".selectChk").closest("tr").each(function (index) {
            $(this).find(".selectChk").prop("checked", false).applyCheckboxStyle();
            $(this).closest("tr").removeClass("k-state-active");
        });
        $("#selectAllChk").prop("checked", false).applyCheckboxStyle();
    },
    onDropDownChange: function () {
        securityGroupUI.securityGroupModel.Data.ProgramId(securityGroupUI.programId);
        securityGroupUI.securityGroupModel.Data.GroupId("");
        securityGroupUI.securityGroupModel.Data.GroupDescription("");
        securityGroupUI.groupId = "";
        SecurityGroupUtility.clearCheckbox();
        securityGroupRepository.get(securityGroupUI.securityGroupModel.Data);

    },
    onTabOut: function (Id) {
        if(securityGroupUI.securityGroupModel.Data.UIMode() == sg.utls.OperationMode.NEW)
        {
            securityGroupUI.securityGroupModel.isModelDirty.reset();
        }
        securityGroupUI.securityGroupModel.Data.GroupId(securityGroupUI.groupId);
        securityGroupUI.checkIsDirty(securityGroupUI.getByGroupId, Id);
    }
};

var securityGroupFilter = {
    getFilter: function () {
        var filters = [[]];
        var securityGroup = $("#Data_GroupId").val();

        filters[0][0] = sg.finderHelper.createFilter("GroupId", sg.finderOperator.StartsWith, securityGroup);

        filters[0][1] = sg.finderHelper.createFilter("ProgramId", sg.finderOperator.Equal, securityGroupUI.securityGroupModel.Data.ProgramId());
        filters[0][1].IsMandatory = true;

        filters[0][2] = sg.finderHelper.createFilter("ProgramVersion", sg.finderOperator.Equal, securityGroupUI.securityGroupModel.Data.ProgramVersion());
        filters[0][2].IsMandatory = true;

        filters[0][3] = sg.finderHelper.createFilter("ResourceId", sg.finderOperator.Equal, " ");
        filters[0][3].IsMandatory = true;
        return filters;
    },
    createGridFilter: function () {
        var filters = [[]];
        filters[0][1] = sg.finderHelper.createFilter("ProgramId", sg.finderOperator.Equal, securityGroupUI.securityGroupModel.Data.ProgramId());

        filters[0][2] = sg.finderHelper.createFilter("ProgramVersion", sg.finderOperator.Equal, securityGroupUI.securityGroupModel.Data.ProgramVersion());
        return filters;
    }
};

var SecurityAccessUIGrid = {

    securityGroupConfig: {
        scrollable: true,
        navigatable: true, //enable grid cell tabbing
        resizable: true,
        selectable: true,
        pageable: false,
        pageUrl: sg.utls.url.buildUrl("AS", "SecurityGroup", "GetSecurityAccess"),
        columns: SecurityGroupUtility.securityAccessGridColumns,
        isServerPaging: true,
        param: null,
        getParam: function () {
            var param = {
                pageNumber: 1,
                pageSize: sg.utls.gridPageSize,
                filter: securityGroupFilter.createGridFilter(),
            };
            return param;
        },
        buildGridData: SecurityGroupUtility.setSecurityAccessGridData,
        //Call back function after data is bound to the grid. Is used to set the added line as editable
        afterDataBind: SecurityGroupUtility.setSelectedSecurityAccess,
    }

};

$(function () {
    securityGroupUI.init();
    $(window).bind('beforeunload', function () {
        if (securityGroupUI.securityGroupModel != "") {
            if (globalResource.AllowPageUnloadEvent && securityGroupUI.securityGroupModel.isModelDirty.isDirty()) {
                return jQuery('<div />').html($.validator.format(globalResource.SaveConfirm2, securityGroupResources.SecurityGroupLabel)).text();
            }
        }
    });
});