using System.Collections.Generic;
using System.Linq;

namespace InterviewTestPagination.Models.Todo {
    /// <summary>
    /// TODO: Implement methods that enable pagination
    /// </summary>
    public class TodoService : IModelService<Todo> {

        private IModelRepository<Todo> _repository = new TodoRepository();

        public IModelRepository<Todo> Repository {
            get { return _repository; }
            set { _repository = value; }
        }

        /// <summary>
        /// Example implementation of List method: lists all entries of type <see cref="Todo"/>
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Todo> List(int page, int pageSize, out int totalCount)
        {
            var allTodos = Repository.All().ToList();
            totalCount = allTodos.Count;

            if (pageSize <= 0 || pageSize == int.MaxValue)
                return allTodos;

            return allTodos.Skip((page - 1) * pageSize).Take(pageSize);
        }
    }
}
