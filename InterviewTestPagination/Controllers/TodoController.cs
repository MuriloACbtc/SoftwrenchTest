using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Services.Description;

namespace InterviewTestPagination.Controllers
{
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/>
    /// model.
    /// 
    /// TODO: implement the pagination Action
    /// </summary>
    public class TodoController : ApiController
    {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo> _service = new TodoService();

        [HttpGet]
        public IHttpActionResult Get(int page = 1, int pageSize = 20)
        {
            int totalCount;
            var todos = _service.List(page, pageSize, out totalCount);

            return Ok(new
            {
                items = todos,
                totalCount
            });



        }
    }
}
