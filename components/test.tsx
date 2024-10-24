import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export async function doSocialLogin(formData:any) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: "/home" });
}

export async function doCredentialLogin(formData:any) {
    console.log("formData", formData);
  
    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      return response;
    } catch (err) {
      throw err;
    }
  }


export const LoginForm = ()=>{
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);

            const response = await doCredentialLogin(formData);
            doCredentialLogin
            if (!!response.error) {
                console.error(response.error);
                setError(response.error.message);
            } else {
                router.push("/api/spin");
            }
        } catch (e) {
            console.error(e);
            setError("Check your Credentials");
        }
    }
    return (
        <div>
            <form>
                <label htmlFor="email">Email</label>
                <input className="border mx-2 border-gray-500" type="email" name="email" id= "email"></input>
                <label htmlFor="password">Password</label>
                <input className="border mx-2 border-gray-500" type="password" name="password" id= "password"></input>
                {/* <label htmlFor="email">Email</label>
                <input className="border mx-2 border-gray-500" type="email" name="email" id= "email"></input> */}
                <button type="submit" onClick={onSubmit}>Credentials login</button>
                
            </form>
            <div>
                <button >Login with Google</button>
                <button >Signout</button>
            
            </div>
        </div>
    )
}