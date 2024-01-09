using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace SignalRSample1.Hubs
{
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; } = 0;
        public static int TotalUsers { get; set; } = 0;

        public override async Task OnConnectedAsync()
        {
            TotalUsers++;
             Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            await base.OnConnectedAsync();
        }   
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            TotalUsers--;
             Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            await base.OnDisconnectedAsync(exception);
        }
        public async Task NewWindowLoaded()
        {
            TotalViews++;
             await Clients.All.SendAsync("updateTotalViews", TotalViews);
            
        }
        public async Task Test(string ipAddress)
        {
       
            await Clients.All.SendAsync("MessageRecevied", $"{ipAddress}-{DateTime.Now.ToString()}");

        }


    }
}
