using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace HIVSystem.API.Controllers
{
    public class HealthController : BaseApiController
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Health check requested at {time}", DateTimeOffset.Now);
            
            return Ok(new { 
                Status = "Healthy", 
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0"
            });
        }
    }
} 