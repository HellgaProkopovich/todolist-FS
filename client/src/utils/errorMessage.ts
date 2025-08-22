export function getApiErrorMessage(err: unknown): string {
   if (!err || typeof err !== "object") return "";
   // наши baseQuery возвращают { status?: number; data?: unknown }
   const maybe = err as { data?: unknown };

   if (typeof maybe.data === "string") return maybe.data;

   if (
      maybe.data &&
      typeof maybe.data === "object" &&
      "error" in maybe.data &&
      typeof (maybe.data as Record<string, unknown>).error === "string"
   ) {
      return (maybe.data as { error: string }).error;
   }

   try {
      return JSON.stringify(maybe.data ?? "");
   } catch {
      return "Request failed";
   }
}