using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sage.CA.SBS.ERP.Sage300.AS.Models;
using enums = Sage.CA.SBS.ERP.Sage300.AS.Models.Enums;
using Sage.CA.SBS.ERP.Sage300.Common.Models;
using Sage.CA.SBS.ERP.Sage300.Common.Web;


namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Models
{
    public class UserAthorizationViewModel<T>: ViewModelBase<T> where T: User, new()
    {
        /// <summary>
        /// 
        /// </summary>
        public IEnumerable<SelectListItem> OperationModes
        {
            get { return EnumUtility.GetIntItemsList<enums.OperationMode>(); }
        }
    }
}