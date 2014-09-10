using Sage.CA.SBS.ERP.Sage300.AS.Interfaces.Services;
using Sage.CA.SBS.ERP.Sage300.Common.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sage.CA.SBS.ERP.Sage300.AS.Web.Controllers
{
    public class UserControllerInternal<T> : InternalControllerBase<IUserService<T>>
    {
    }
}