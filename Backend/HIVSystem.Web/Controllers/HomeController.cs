using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using HIVSystem.Web.Models;

namespace HIVSystem.Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    // Show the integrated homepage with all features
    public IActionResult Index()
    {
        return View();
    }

    // Single appointment booking page using the original wizard
    public IActionResult AppointmentBooking()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
