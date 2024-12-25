import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

const ServerComponent = async () => {
    const user = await currentUser();
  return (

    <div className="mb-10">
        <UserInfo
         user={user}
         label="💻 Server component"
         />
         </div>
  )
}

export default ServerComponent