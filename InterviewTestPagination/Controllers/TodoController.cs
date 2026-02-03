using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace InterviewTestPagination.Controllers
{

    /// <summary>
    /// Controller responsável pelo modelo Todo.
    /// Implementa endpoint GET /api/todo?page=1&pageSize=20&sortField=CreatedDate&sortDir=desc
    /// Retorna um JSON: { Items: [...], Total: N, Page: p, PageSize: s }
    /// </summary>
    public class TodoController : ApiController
    {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo> _todoService = new TodoService();

        [HttpGet]
        [Route("api/todo")]
        public IHttpActionResult Get(int page = 1, int pageSize = 20, string sortField = "CreatedDate", string sortDir = "desc")
        {
            // consulta todos
            var all = _todoService.Repository.All();

            // total
            var total = all.Count();

            // sort (básico por campos conhecidos)
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    case "createddate":
                        all = sortDir.ToLower() == "desc" ? all.OrderByDescending(t => t.CreatedDate) : all.OrderBy(t => t.CreatedDate);
                        break;
                    case "id":
                        all = sortDir.ToLower() == "desc" ? all.OrderByDescending(t => t.Id) : all.OrderBy(t => t.Id);
                        break;
                    case "task":
                        all = sortDir.ToLower() == "desc" ? all.OrderByDescending(t => t.Task) : all.OrderBy(t => t.Task);
                        break;
                    default:
                        // fallback: keep original order
                        break;
                }
            }

            IEnumerable<Todo> items;
            if (pageSize <= 0)
            {
                // "all"
                items = all;
            }
            else
            {
                items = all.Skip((page - 1) * pageSize).Take(pageSize);
            }

            var result = new
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return Ok(result);
        }
    }
}
