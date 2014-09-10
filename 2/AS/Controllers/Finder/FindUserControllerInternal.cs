/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.Common.Interfaces.Repository;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Finder;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Finder;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers.Finder
{
    /// <summary>
    /// Finder User Controller Internal
    /// </summary>
    public class FindUserControllerInternal<T> : BaseFindControllerInternal<T, IUserService<T>>, IFinder
        where T : User, new()
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public FindUserControllerInternal(Context context)
            : base(context)
        {
        }

        /// <summary>
        /// Gets ModelBase
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>First or Default Security Group</returns>
        public virtual ModelBase Get(string id)
        {
            Expression<Func<T, bool>> filter = user => user.UserID == id;
            return Service.GetById(filter);
        }

        /// <summary>
        /// Get Paged ModelBase
        /// </summary>
        /// <param name="currentPageNumber">Current PageNumber</param>
        /// <param name="pageSize">Page Size</param>
        /// <param name="totalResultsCount">Total ResultsCount</param>
        /// <param name="filter">Filter</param>
        /// <param name="orderBy">Order By</param>
        /// <param name="field">Field</param>
        /// <param name="filters">Criteria Filters</param>
        /// <returns>Paged list of Security Group</returns>
        public virtual IEnumerable<ModelBase> Get(int currentPageNumber, int pageSize, out int totalResultsCount,
            string filter, OrderBy orderBy, string field, IList<IList<Filter>> filters)
        {
            var filterToApply = ExpressionBuilder<T>.CreateExpression(filters);
            var model = Service.Get(currentPageNumber, pageSize, filterToApply, orderBy);
            totalResultsCount = model.TotalResultsCount;
            return model.Items;
        }

        /// <summary>
        /// Get the finder data
        /// </summary>
        /// <param name="finderOptions">Finder options</param>
        /// <param name="totalResultsCount">out - total result count</param>
        /// <returns>IEnumerable&lt;ModelBase&gt;.</returns>
        public override IEnumerable<ModelBase> Get(FinderOption finderOptions, out int totalResultsCount)
        {
            var filterToApply = GetFilterToApply<T>(finderOptions);
            var users = Service.GetUsers(finderOptions.PageNumber, finderOptions.PageSize, filterToApply);
            totalResultsCount = users.TotalResultsCount;
            return users.Items;
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
                    field = "UserID",
                    title = UserAuthorizationResx.UserID,
                    attributes = " class = gird_culm_4 ",
                    headerAttributes = " class = gird_culm_4 ",
                    dataType = "string",
                    customAttributes =
                                new Dictionary<string, string> {{"maxLength", "8"},{"formatTextbox", "alphaNumeric"}}
                    
                },
                new GridField
                {
                    field = "UserName",
                    title = UserAuthorizationResx.UserName,
                    attributes = " class = gird_culm_10 ",
                    headerAttributes = " class = gird_culm_10 ",
                    dataType = "string"
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
                new GridSchemaModelField {field = "UserID", type = "string"},
                new GridSchemaModelField {field = "UserName", type = "string"}
            };
            return schemaField.AsEnumerable();
        }
    }
}