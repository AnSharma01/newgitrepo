/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System.Collections.Generic;
using System.Web.Mvc;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Models
{
    /// <summary>
    /// Class User Authorization ViewModel.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class UserAuthorizationViewModel<T> : ViewModelBase<T> where T : User, new()
    {
        /// <summary>
        /// Operation modes
        /// </summary>
        public IEnumerable<SelectListItem> OperationModes
        {
            get { return EnumUtility.GetIntItemsList<OperationMode>(); }
        }

        /// <summary>
        /// Gets or sets whether invalid user
        /// </summary>
        public bool InvalidUserId { get; set; }

    }
}