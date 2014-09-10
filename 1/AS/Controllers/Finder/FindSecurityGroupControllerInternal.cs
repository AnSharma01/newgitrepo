/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using System;
using System.Collections.Generic;
using System.Linq;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.Common.Interfaces.Repository;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Finder;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Finder;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers.Finder
{
    /// <summary>
    /// Class FindSecurityGroupControllerInternal.
    /// </summary>
    /// <typeparam name="T">security group model</typeparam>
    public class FindSecurityGroupControllerInternal<T> : BaseFindControllerInternal<T, ISecurityGroupService<T>>, IFinder
        where T : SecurityGroup, new()
    {
        /// <summary>
        /// Constructor to initialize FindSecurityGroupControllerInternal
        /// </summary>
        /// <param name="context">Request context</param>
        public FindSecurityGroupControllerInternal(Context context)
            : base(context)
        {
        }

        /// <summary>
        /// Gets ModelBase
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>First or Default Security Group</returns>
        public ModelBase Get(string id)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Gets the data from service
        /// </summary>
        /// <param name="finderOptions">Finder Options</param>
        /// <param name="totalResultsCount">out - totalResultCount</param>
        /// <returns></returns>
        public override IEnumerable<ModelBase> Get(FinderOption finderOptions, out int totalResultsCount)
        {
            if (finderOptions == null)
            {
                finderOptions = new FinderOption();
            }

            var filterToApply = GetFilterToApply<T>(finderOptions);
            var orderBy = new OrderBy
            {
                SortDirection = finderOptions.SortAsc ? SortDirection.Descending : SortDirection.Ascending
            };
            var model = Service.Get(finderOptions.PageNumber, finderOptions.PageSize, filterToApply, orderBy);
            totalResultsCount = model.TotalResultsCount;
            return model.Items;
        }

        /// <summary>
        /// Fetches Columns
        /// </summary>
        /// <returns>List of Security Group fields</returns>
        public virtual IEnumerable<ModelBase> GetColumns()
        {
            var column = new List<GridField>
            {
                new GridField
                {
                    field = "GroupId",
                    title = SecurityGroupsResx.SecurityGroupID,
                    attributes = " class = gird_culm_4 ",
                    headerAttributes = " class = gird_culm_4 ",
                    dataType = "string",
                    customAttributes = 
                       new Dictionary<string, string>
                       {
                           {"class","txt-upper"},
                           {"maxLength", "8"},
                           {"formatTextbox", "alphaNumeric"}
                       }
                },
                new GridField
                {
                    field = "GroupDescription",
                    title = SecurityGroupsResx.SecurityGroupDesc,
                    attributes = " class = gird_culm_8 ",
                    headerAttributes = " class = gird_culm_8 ",
                    dataType = "string",
                     customAttributes =
                        new Dictionary<string, string>
                        {
                            {"maxLength", "60"}
                        }
                },
            };
            return column.AsEnumerable();
        }

        /// <summary>
        /// Gets SchemaModel Fields
        /// </summary>
        /// <returns>List of Security Group Fields</returns>
        public virtual IEnumerable<ModelBase> GetSchemaModelFields()
        {
            var schemaField = new List<ModelBase>
            {
                new GridSchemaModelField {field = "GroupID", type = "string"},
                new GridSchemaModelField {field = "GroupDescription", type = "string"}
            };
            return schemaField.AsEnumerable();
        }

    }
}