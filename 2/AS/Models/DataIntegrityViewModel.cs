/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Models.Process;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Models
{
    /// <summary>
    ///  Data Integrity  View Model Class
    /// </summary>
    public class DataIntegrityViewModel<T> : ProcessViewModel<T> where T : DataIntegrity, new()
    {
    }
}