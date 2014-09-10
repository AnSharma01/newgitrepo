/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System.Web.Optimization;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web
{
    /// <summary>
    /// Class BundleRegistration.
    /// </summary>
    public class BundleRegistration
    {
        /// <summary>
        /// Register bundles
        /// </summary>
        /// <param name="bundles">The bundles.</param>
        internal static void RegisterBundles(BundleCollection bundles)
        {
            #region User Authorizations

            bundles.Add(
                new ScriptBundle("~/bundles/UserAuthorization").Include(
                    "~/Areas/AS/Scripts/UserAuthorization/Sage.CA.SBS.ERP.Sage300.AS.UserAuthorizationBehaviour.js",
                    "~/Areas/AS/Scripts/UserAuthorization/Sage.CA.SBS.ERP.Sage300.AS.UserAuthorizationKoExtn.js",
                    "~/Areas/AS/Scripts/UserAuthorization/Sage.CA.SBS.ERP.Sage300.AS.UserAuthorizationRepository.js"));

            bundles.Add(
                new ScriptBundle("~/bundles/SecurityGroup").Include(
                    "~/Areas/AS/Scripts/SecurityGroup/Sage.CA.SBS.ERP.Sage300.AS.SecurityGroupBehaviour.js",
                     "~/Areas/Core/Scripts/Process/Sage.CA.SBS.Sage300.Common.Process.js",
                    "~/Areas/AS/Scripts/SecurityGroup/Sage.CA.SBS.ERP.Sage300.AS.SecurityGroupKoExtn.js",
                    "~/Areas/AS/Scripts/SecurityGroup/Sage.CA.SBS.ERP.Sage300.AS.SecurityGroupRepository.js"
                    ));

            bundles.Add(
                new ScriptBundle("~/bundles/ASRestartRecord").Include(
                    "~/Areas/AS/Scripts/RestartRecord/Sage.CA.SBS.ERP.Sage300.AS.RestartRecordBehaviour.js",
                    "~/Areas/AS/Scripts/RestartRecord/Sage.CA.SBS.ERP.Sage300.AS.RestartRecordKoExtn.js",
                    "~/Areas/AS/Scripts/RestartRecord/Sage.CA.SBS.ERP.Sage300.AS.RestartRecordRepository.js"
                    ));
            bundles.Add(
               new ScriptBundle("~/bundles/ASPopupRestartRecord").Include(
                   "~/Areas/AS/Scripts/PopupRestartRecord/Sage.CA.SBS.ERP.Sage300.AS.RestartRecordBehaviour.js",
                   "~/Areas/AS/Scripts/PopupRestartRecord/Sage.CA.SBS.ERP.Sage300.AS.RestartRecordKoExtn.js",
                   "~/Areas/AS/Scripts/PopupRestartRecord/Sage.CA.SBS.ERP.Sage300.AS.RestartRecordRepository.js"
                   ));  
            new ScriptBundle("~/bundles/DataIntegrityReport").Include(
                    "~/Areas/Core/Scripts/Process/Sage.CA.SBS.Sage300.Common.Process.js",
                    "~/Areas/AS/Scripts/DataIntegrityReport/Sage.CA.SBS.ERP.Sage300.AS.DataIntegrityReportBehaviour.js",
                    "~/Areas/AS/Scripts/DataIntegrityReport/Sage.CA.SBS.ERP.Sage300.AS.DataIntegrityReportKoExtn.js",
                    "~/Areas/AS/Scripts/DataIntegrityReport/Sage.CA.SBS.ERP.Sage300.AS.DataIntegrityReportRepository.js");
            bundles.Add(
                new ScriptBundle("~/bundles/DataIntegrity").Include(
                   "~/Areas/Core/Scripts/Process/Sage.CA.SBS.Sage300.Common.Process.js",
                   "~/Areas/AS/Scripts/DataIntegrity/Sage.CA.SBS.ERP.Sage300.AS.DataIntegrityBehaviour.js",
                   "~/Areas/AS/Scripts/DataIntegrity/Sage.CA.SBS.ERP.Sage300.AS.DataIntegrityKoExtn.js",
                   "~/Areas/AS/Scripts/DataIntegrity/Sage.CA.SBS.ERP.Sage300.AS.DataIntegrityRepository.js"));
            #endregion
        }
    }
}