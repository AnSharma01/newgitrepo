/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
"use strict";

var userAuthorizationsKoExtn = userAuthorizationsKoExtn || {};

userAuthorizationsKoExtn = {

    getUserAuthorizationData: function (model) {
        var data = {
            model: ko.mapping.toJS(model)
        };
        return data;
    }
}