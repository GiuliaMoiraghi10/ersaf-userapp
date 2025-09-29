import UserForm from "./components/UserForm"
import UserList from "./components/UserList"

function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">App Users</h1>
      </div>

      {/* Componenti Side by Side */}
      <div className="flex flex-row gap-6 px-6 pb-6 max-w-6xl mx-auto">
        <div className="flex-1 w-1/2 max-w-lg">
          <UserForm />
        </div>
        <div className="flex-1 w-1/2 max-w-lg">
          <UserList />
        </div>
      </div>
    </>
  )
}

export default App
