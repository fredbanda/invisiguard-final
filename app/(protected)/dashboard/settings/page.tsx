import { auth, signOut } from "@/auth"

const SettingsPage = async() => {
  const session = await auth()
  return (
    <div className=" items-center justify-center text-white/80 text-[1.2rem]">
      {JSON.stringify(session)}
      <form action={async () => {
        "use server";

        await signOut();

      }}>
        <button type="submit" className="w-full bg-black text-white mt-8 rounded-md">
          Sign Out
        </button>
      </form>
    </div>
  )
}

export default SettingsPage