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

    // All routes now go to React SPA
    public IActionResult Index()
    {
        return View("React");
    }

    public IActionResult About()
    {
        return View("React");
    }

    public IActionResult Dashboard()
    {
        return View("React");
    }

    public IActionResult Privacy()
    {
        return View("React");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
