/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System.Web.Mvc;
using System.Web.Optimization;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web
{
    /// <summary>
    /// Class ASAreaRegistration.
    /// </summary>
    public class ASAreaRegistration : AreaRegistration
    {
        /// <summary>
        /// Gets Area Name
        /// </summary>
        public override string AreaName
        {
            get { return "AS"; }
        }

        /// <summary>
        /// Registers Area
        /// </summary>
        /// <param name="context">Encapsulates the information that is required in order to register the area.</param>
        public override void RegisterArea(AreaRegistrationContext context)
        {
            RegisterRoutes(context);
            RegisterBundles();
        }

        /// <summary>
        /// Register routes
        /// </summary>
        /// <param name="context">The context.</param>
        private void RegisterRoutes(AreaRegistrationContext context)
        {
            context.MapRoute("AS_newdefault", "AS/{controller}/{action}/{id}",
                new {action = "Index", id = UrlParameter.Optional});
        }

        /// <summary>
        /// Register bundles
        /// </summary>
        private void RegisterBundles()
        {
            BundleRegistration.RegisterBundles(BundleTable.Bundles);
        }
    }
}