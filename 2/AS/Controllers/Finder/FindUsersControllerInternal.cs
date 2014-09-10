using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.Common.Interfaces.Repository;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models.Finder;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.Finder;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers.Finder
{
    public class FindUsersControllerInternal<T> : BaseFindControllerInternal<T, IUserService<T>>, IFinder
       where T : User, new()
    {
        /// <summary>
        /// Constructor to intailize FindSecurityGroupControllerInternal
        /// </summary>
        /// <param name="context">Request context</param>
        public FindUsersControllerInternal(Context context)
            : base(context)
        {
        }

        /// <summary>
        /// Gets ModelBase
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>First or Default user</returns>
        public virtual ModelBase Get(string id)
        {
            Expression<Func<T, bool>> filter = userId => userId.UserID == id;
            return Service.FirstOrDefault(filter);
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
        /// <returns>Paged list of Users</returns>
        //public virtual IEnumerable<ModelBase> Get(int currentPageNumber, int pageSize, out int totalResultsCount,
        //    string filter, OrderBy orderBy, string field, IList<IList<Common.Models.Filter>> filters)
        //{
        //    var filterToApply = ExpressionBuilder<T>.CreateExpression(filters);
        //    var model = Service.Get(currentPageNumber, pageSize, filterToApply, orderBy);
        //    totalResultsCount = model.TotalResultsCount;
        //    return model.Items;
        //}

        //public IEnumerable<ModelBase> Get(FinderOption finderOptions, out int totalResultsCount)
        //{
        //    var filterToApply = GetFilterToApply(finderOptions);
        //    var orderBy = new OrderBy { SortDirection = finderOptions.SortAsc ? SortDirection.Descending : SortDirection.Ascending };
        //    var model = Service.Get(finderOptions.PageNumber, finderOptions.PageSize, filterToApply, orderBy);

        //    #region Get Security Group

        //    var usersService = Context.Container.Resolve<IUserService<User>>(new ParameterOverride("context", Context));
        //    var users = usersService.FirstOrDefault();

        //    #endregion

        //    totalResultsCount = model.TotalResultsCount;

        //    return model.Items;
        //}

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
                    title = UsersResx.UserID,
                    attributes = " class = gird_culm_10 ",
                    headerAttributes = " class = gird_culm_10 ",
                    dataType = "string"
                },
                new GridField
                {
                    field = "UserName",
                    title = UsersResx.UserName,
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