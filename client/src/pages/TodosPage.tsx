import { useMemo, useState } from "react";;
import { useNavigate } from "react-router-dom";
import { 
   useGetTodosQuery, 
   useAddTodoMutation, 
   useUpdateTodoMutation, 
   useDeleteTodoMutation, 
   type Todo 
} from "../services/api";
import { api } from "../services/api";
import { useAppDispatch } from "../app/hooks";
import { authActions } from "../features/auth/authSlice";
import { getApiErrorMessage } from "../utils/errorMessage";

type Filter = "all" | "active" | "completed";

export default function TodosPage() {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   // --- запрос списка
   const { data, isLoading, isError, error, refetch } = useGetTodosQuery();

   // --- мутации
   const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
   const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
   const [deleteTodo, {isLoading: isDeleting}] = useDeleteTodoMutation();

   // --- локальные состояния
   const [title, setTitle] = useState("");
   const [filter, setFilter] = useState<Filter>("all");

   // --- фильтрация списка
   const filtered = useMemo(() => {
      const todos: Todo[] = data ?? [];
      if (filter === "active") return todos.filter((t) => !t.completed);
      if (filter === "completed") return todos.filter((t) => t.completed);
      return todos;
   }, [data, filter]);

   // --- добавить
   const onAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      const value = title.trim();
      if (!value) return;

      try {
         await addTodo({ title: value }).unwrap();
         setTitle("");
         refetch(); // самый простой способ увидеть обновления
      } catch (err) {
         console.error("add failed:", err);
      }
   };

   // --- переключить completed
   const onToggle = async (t: Todo) => {
      try {
         await updateTodo({ id: t.id, completed: !t.completed }).unwrap();
         refetch();
      } catch (err) {
         console.error("toggle failed:", err);
      }
   };

   // --- удалить
   const onDelete = async (id: number) => {
      try {
         await deleteTodo({ id }).unwrap();
         refetch();
      } catch (err) {
         console.error("delete failed:", err);
      }
   };

   // --- выход
   const onLogout = () => {
      dispatch(authActions.logout());
      dispatch(api.util.resetApiState()); // кэш в ноль
      navigate("/login");
   };

   return (
      <div className="w-full max-w-2xl mx-auto pt-10 px-4">
         {/* header */}
         <div className="mb-6 flex items-center justify-center">
            <h1 className="text-6xl font-bold m-0">TODO list</h1>
         </div>

         {/* AddForm */}
         <form onSubmit={onAdd} className="mb-4 flex gap-2">
            <input
               className="flex-1 border rounded px-3 py-2"
               placeholder="What need to be done?"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               disabled={isAdding || isLoading}
            />
            <button
               className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-50"
               disabled={isAdding || !title.trim()}
               >
               {isAdding ? "Adding..." : "Add"}
            </button>
         </form>

         {/* Filters  */}
         <div className="flex justify-center gap-2">
            <FilterButton current={filter} set={setFilter} value="all">
               All
            </FilterButton>
            <FilterButton current={filter} set={setFilter} value="active">
               Active
            </FilterButton>
            <FilterButton current={filter} set={setFilter} value="completed">
               Completed
            </FilterButton>
         </div>

         {/* Request status */}
         {isLoading && <div className="text-gray-500">Loading...</div>}
         {isError && (
            <div className="text-red-600 text-sm">
               {getApiErrorMessage(error)}
            </div>
         )}

         {/* todo list */}
         {!isLoading && !isError && (
            <ul className="grid gap-2 pt-5">
               {filtered.length === 0 ? (
                  <li className="text-gray-500 text-sm p-10">No todos yet</li>
               ) : (
                  filtered.map((t) => (
                     <li
                        key={t.id}
                        className="flex items-center justify-between rounded bg-white shadow px-3 py-2"
                     >
                        <label className="flex items-center gap-3">
                           <input
                              type="checkbox"
                              checked={t.completed}
                              onChange={() => onToggle(t)}
                              disabled={isUpdating}
                           />
                           <span className={t.completed ? "line-through text-gray-500" : ""}>
                              {t.title}
                           </span>
                        </label>

                        <button
                           onClick={() => onDelete(t.id)}
                           className="text-red-600 hover:text-red-700 disabled:opacity-50"
                           disabled={isDeleting}
                           title="Delete"
                        >
                           x
                        </button>
                     </li>
                  ))
               )}
            </ul>
         )}

         {/* logout  */}
         <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm rounded px-3 py-1 m-15"
            >Logout
         </button>
      </div>
   )
}

function FilterButton({
      current,
      set,
      value,
      children,
   }: {
      current: Filter;
      set: (v: Filter) => void;
      value: Filter;
      children: React.ReactNode;
   }) {
   const active = current === value;
   return (
      <button
         type="button"
         onClick={() => set(value)}
         className={
         active
            ? "bg-blue-600 text-white rounded px-3 py-1"
            : "bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
         }
      >
         {children}
      </button>
   );
}