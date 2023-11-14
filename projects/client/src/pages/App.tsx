import { useHello } from "@/hooks/useHello";
import React from "react";

function App() {
  const { data, isLoading } = useHello();

  return (
    <main className="w-full min-h-screen flex items-center justify-center ">
      <div>
        {isLoading ? (
          <p>loading...</p>
        ) : (
          <>
            <h1 className="font-bold text-xl">Happy Coding :)</h1>
            <p>{data?.message}</p>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
