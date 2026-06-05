using Microsoft.AspNetCore.Mvc;

namespace SecureLoginRBAC.Controllers.AdmissionConfiguration
{
    public class ProgressTrackingController : Controller
    {
        public IActionResult ProgressTrackingView()
        {
            return View();
        }
    }
}
