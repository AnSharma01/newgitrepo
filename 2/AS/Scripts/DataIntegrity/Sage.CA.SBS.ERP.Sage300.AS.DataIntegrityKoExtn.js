/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";
function DataIntegrityObservableExtension(dataIntegrityeModel) {
    var model = dataIntegrityeModel;
    var self = this;
    self.UIMode = dataIntegrityUI.UIMode; //mode = 0 Load 1 New , 2 Save, 3 Delete
    model.FromIndex = window.ko.observable(0);
    model.ToIndex = window.ko.observable(0);
    model.IsIncludeBtnDisable = window.ko.computed(function () {
        if (model.DataIntegrityList() != null && model.DataIntegrityList().length <= 0) {
            return true;
        }
        return false;
    });
    model.IsExcludeBtnDisable = window.ko.computed(function () {
        if (model.Data.SelectedApplication() != null && model.Data.SelectedApplication().length <= 0) {
            return true;
        }
        return false;
    });
    model.AvailableItemsList = new Array();
    model.DataIntegritySelectedItems = window.ko.computed(
    {
        read: function () {
            model.AvailableItemsList = new Array();
            if (model.AvailableItemsList && model.AvailableItemsList.length == 0) {
                if (model.DataIntegrityList() != null && model.DataIntegrityList().length > 0) {
                    model.AvailableItemsList.push(model.DataIntegrityList()[model.FromIndex()]);
                }
            }
            return window.ko.utils.arrayMap(model.AvailableItemsList, function (item) {
                return item;
            });
        },
        write: function (value) {
            model.AvailableItemsList.push(value);
        }
    });
    model.SelectedAvailableItemsList = new Array();
    model.SelectedDataIntegritySelectedItems = window.ko.computed(
        {
            read: function () {
                model.SelectedAvailableItemsList = new Array();
                if (model.SelectedAvailableItemsList && model.SelectedAvailableItemsList.length == 0) {
                    if (model.Data.SelectedApplication() != null && model.Data.SelectedApplication().length > 0) {
                        model.SelectedAvailableItemsList.push(model.Data.SelectedApplication()[model.ToIndex()]);
                    }
                }
                return window.ko.utils.arrayMap(model.SelectedAvailableItemsList, function (item) {
                    return item;
                });
            },
            write: function (value) {
                model.SelectedAvailableItemsList.push(value);
            }
        });
}