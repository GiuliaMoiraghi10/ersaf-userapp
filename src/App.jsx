import UserForm from "./components/UserForm"

function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-white">App Users</h1>
      </div>

      {/* Costanti e Utility Globali */}
      <div className="flex flex-col items-center justify-center p-20">
        <UserForm />
      </div>
    </>
  )
}

export default App
