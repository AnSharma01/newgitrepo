/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System.Collections.Generic;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using System.Web.Mvc;
using Sage.CA.SBS.ERP.Sage300.Common.Web;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Models
{
    /// <summary>
    /// Security Group View Model
    /// </summary>
    /// <typeparam name="T">Security Group</typeparam>
    public class SecurityGroupViewModel<T> : ViewModelBase<T> where T : SecurityGroup, new()
    {
        /// <summary>
        /// List of Segment
        /// </summary>
        public List<SelectListItem> Application { get; set; }

        /// <summary>
        /// List of Selected Security Access
        /// </summary>
        public List<ApplicationSecurityResources> selectedSecurityAccess { get; set; }

        /// <summary>
        /// selected application
        /// </summary>
        public string selectedApplication { get; set; }

    }
}