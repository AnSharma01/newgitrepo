using System.Net.Configuration;
using Microsoft.Practices.Unity;
using System.Linq.Expressions;
using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Resources.Forms;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Resources;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    public class UserAthorizationControllerInternal<T> : InternalControllerBase<IUserAuthorizationService<T>>
        where T : User, new()
    {
        #region Constructor

        /// <summary>
        /// Source Code Constructor
        /// </summary>
        /// <param name="context">Context</param>
        public UserAthorizationControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion

        #region Service Methods
        
        internal UserAthorizationViewModel<T> GetByUser(int pageNumber, int pageCount,
            IList<IList<Filter>> filters = null)
        {
            #region Get Options information

            var userAuthViewModel = new UserAthorizationViewModel<T>();

            if (filters != null && filters.Count>0)
            {
                var userService =
                    Context.Container.Resolve<IUserService<User>>(new ParameterOverride("context", Context));
                var userId = "";
                if (filters[0][0].Value != null)
                {
                    userId = filters[0][0].Value.ToString();
                }
                var user = userService.GetByUserId(userId);

                if (user.Exists)
                {
                    var filExpression = ExpressionBuilder<T>.CreateExpression(filters);

                    var userAuthor = Service.GetByUser(pageNumber, pageCount, filExpression);
                    userAuthViewModel.TotalResultsCount = userAuthor.TotalActiveApplication;
                    userAuthor.UserID = user.UserID;
                    user.UserName = user.UserID;
                    userAuthViewModel.Data = userAuthor;
                }
            }
            else
            {
                var userAuthor = Service.GetByUser(pageNumber, pageCount, null);
                userAuthViewModel.TotalResultsCount = userAuthor.TotalActiveApplication;
                userAuthViewModel.Data = userAuthor;
            }
            #endregion

            return userAuthViewModel;
        }

        #endregion
    }
}   


       
    
