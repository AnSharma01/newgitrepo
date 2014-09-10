/* Copyright (c) 1994-2014 Sage Software, Inc.  All rights reserved. */

#region

using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using Sage.CA.SBS.ERP.Sage300.AS.Web.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Models.ExportImport;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Controllers.ExportImport;
using Sage.CA.SBS.ERP.Sage300.Common.Web.Utilities;
using System;
using System.Linq.Expressions;

#endregion

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    /// <summary>
    /// Class UserAthorizationsControllerInternal.
    /// </summary>
    /// <typeparam name="T">User</typeparam>
    public class UserAthorizationControllerInternal<T> : BaseExportImportControllerInternal<T, IUserAuthorizationService<T>>
        where T : User, new()
    {
        #region Constructor

        /// <summary>
        /// UserAuthorization ControllerInternal Constructor
        /// </summary>
        /// <param name="context">Context</param>
        public UserAthorizationControllerInternal(Context context)
            : base(context)
        {
        }

        #endregion

        #region Service Methods

        /// <summary>
        /// Retrieve the user by Id
        /// </summary>
        /// <param name="filter">filter</param>
        /// <returns>User Details</returns>
        internal UserAuthorizationViewModel<T> Get(Expression<Func<T, bool>> filter)
        {

            #region Get Options information

           
            var userAuthorizationViewModel = new UserAuthorizationViewModel<T>();

            // If filter expression is not null retrieve the User details
            if (filter!=null)
            {
                var userService = Utilities.Resolve<IUserService<T>>(Context);
                
                var user = userService.GetByUserId(filter);

                if (user!=null && user.Exists)
                {
                    userAuthorizationViewModel.InvalidUserId = false;
                    userAuthorizationViewModel.Data = user;
                }
                else
                {
                    // If user is invalid
                    var userAuthorization = Service.GetById(string.Empty);
                    userAuthorizationViewModel.TotalResultsCount = userAuthorization.TotalActiveApplication;
                    userAuthorizationViewModel.Data = userAuthorization;
                    userAuthorizationViewModel.InvalidUserId = true;
                }
            }
            // Retrieve User Authorization for default
            else
            {
                var userAuthorization = Service.GetById(string.Empty);
                userAuthorizationViewModel.TotalResultsCount = userAuthorization.TotalActiveApplication;
                userAuthorizationViewModel.Data = userAuthorization;
                userAuthorizationViewModel.InvalidUserId = false;
            }
            #endregion

            userAuthorizationViewModel.UserAccess = GetAccessRights();

            return userAuthorizationViewModel;
        }

        /// <summary>
        /// Retrieves User Authorization by User Id
        /// </summary>
        /// <param name="pageNumber">Page Number</param>
        /// <param name="pageSize">Page Size</param>
        /// <param name="userAuthFilter">filters</param>
        /// <returns>Returns UserAutorizationByUserId</returns>
        internal EnumerableResponse<UserAuthorization> GetUserAuthorizationByUser(int pageNumber, int pageSize,
            Expression<Func<T, bool>> userAuthFilter)
        {
            return Service.GetUserAuthorizationByUser(userAuthFilter);
        }

        /// <summary>
        /// Retrieves Security Group based on Program Id and version Id and Security Group ID
        /// </summary>
        /// <param name="programId">programId</param>
        /// <param name="versionId">versionId</param>
        /// <param name="securityGroupId">securityGroupId</param>
        /// <returns>Returns SecurityGroup</returns>
        internal UserAuthorization GetSecurityGroup(string programId, string versionId, string securityGroupId)
        {
            var securityGroupService = Utilities.Resolve<ISecurityGroupService<SecurityGroup>>(Context);
            var userAuthorization = new UserAuthorization { ProgramID = programId, ProgramVersion = versionId, GroupID = securityGroupId, SecurityGroupExists = false};
            var securityGroup = securityGroupService.GetSecurityGroup(programId, versionId, securityGroupId);
            if (securityGroup != null)
            {
                userAuthorization.GroupID = securityGroup.GroupId;
                userAuthorization.GroupDescription = securityGroup.GroupDescription;
                userAuthorization.SecurityGroupExists = true;
            }
            return userAuthorization;
        }

        #endregion

        #region Export/Import

        /// <summary>
        /// Export Items - Loacation + optional Field
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public override ExportRequest ExportItems(ExportRequest request)
        {
            request.DataMigrationList.Add(GetDataMigrationItem<UserAuthorization>(request.Name));
            return request;
        }

        #endregion
    }
}