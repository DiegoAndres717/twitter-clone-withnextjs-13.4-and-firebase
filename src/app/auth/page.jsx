'use client'
import Image from "next/image";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase";


export default function Signin() {
    const router = useRouter();
    const onGoogleClick = async () => {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        const user = auth.currentUser.providerData[0];
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            username: user.displayName.split(" ").join("").toLocaleLowerCase(),
            userImg: user.photoURL,
            uid: user.uid,
            timestamp: serverTimestamp(),
          });
        }
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <Image
      width={550}
      height={550}
        src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/en/twitter-tips/desktop-assets/ch-01/ch12findphone.png.twimg.1920.png"
        alt="twitter image inside a phone"
        className="hidden object-cover md:w-44 md:h-80 rotate-6  md:inline-flex"
      />
      <div className="">
        <div className="flex flex-col items-center">
          <Image
          width={250}
          height={250}
            className="w-36 object-cover"
            src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
            alt="twitter logo"
          />
          <p className="text-center text-sm italic my-10">
            Creado por Diego Andres Salas
          </p>
          <button
            onClick={onGoogleClick}
            className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}