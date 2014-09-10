/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Models.Reports;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Models
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class DataIntegrityReportViewModel<T> : ReportViewModel<T> where T : DataIntegrityReport, new()
    {
    }
}